Kirby CMS – Get pages by dates
==============================

## pagesByDate function

Function which returns an array of [Kirby page objects](http://getkirby.com/docs/variables/page), or nested arrays when grouping by year or month.

The feature set for this function is:

- *Only* returns pages with a valid `date` or `Date` metadata field.
- Set limit dates, and by default do not return pages with a future date.
- … Which allows you to set pages to be [published in the future](#future-publishing).
- Return all pages with a date in your site, or limit to a specific folder.
- Option to group by year or year then month, for instance if you want to ouput titles with years or months before the relevant posts.
- Use `limit` and `offset` options to limit the number of results and perhaps do some semi-manual pagination (sorry, no Kirby pagination object).

### Usage

The `pagesByDate` function may take two arguments:

1. Source (required): A kirby Pages object which represents the set of pages to work with. Use `$pages` for all pages in the site. Or use any Kirby Pages object, such as the ones returned by `$page->children()` and `$page->siblings()`.

2. Options (optional): An array of options. [See below for available options](#option-documentation).

If you want to work on all child and descendant pages of a given folder, you could use:

```php
$posts = pagesByDate($pages->find('myfolder')->children());
```

Note that we need to use `->children()`, since `$pages->find()` will return a unique page, and we need a set of pages instead.

To set some custom options:

```php
$posts = pagesByDate($pages, array('order'=>'asc', 'recursive'=>false));
```

See the option documentation below for available options.

### How to use in templates

Here's a basic example:

```php
<?php include('bydate/bydate.php'); ?>
<?php foreach (pagesByDate($pages) as $p): ?>
<p>
  <a href="<?php echo $p->url() ?>"><?php echo $p->title() ?></a>
  - <?php echo $p->date('j F Y') ?>
</p>
<?php endforeach; ?>
```

See complete examples:

- [Simple example](example-basic.php)
- [Example with custom options](example-options.php)
- [Example with results grouped by year](example-years.php)
- [Example with results grouped by month](example-months.php)

## Highlights

### Future publishing

If you write a post with a date in the future:

    Title: Is HTML5 Ready Yet?
    ----
    Date: 2020-04-01
    ----
    Text: …

With default options, `pagesByDate` will not return this page until the current server date is beyond the page’s date (even if only by a few seconds). One gotcha: if you only specify a date and not the exact publishing time, this defaults to 00:00 in the morning. If you want your post to go live at 8:00 in the morning, you could use `2020-04-01 8:00`.

Warning: the function currently doesn’t manage time zones in any way!

Let’s be clear about posts “going live”: we only mean that any place you used `pagesByDate` with the default `max` setting will not show a page with a date in the future. So the lists of posts, archives, and RSS/Atom feeds in your site all use `pagesByDate`, that makes your content almost invisible. Almost, because you can still see it if you go to the post’s own URL (unless you write some date-based logic of your own in the template that handles showing your posts).

### Group results by year

```php
pagesByDate($pages, array('group'=>'year'));
```

will return an array of pages that may look like (pseudocode):

    [
        "2013" => [somepost, anotherpost, anotherone],
        "2012" => [somethingelse, yetanotherpost],
        …
    ]

where each item in the child arrays is a [Kirby page object](http://getkirby.com/docs/variables/page).

See [Example with results grouped by year](example-years.php) for relevant templating code.

### Group results by month

```php
pagesByDate($pages, array('group'=>'month'));
```

will return an array of pages that may look like (pseudocode):

    [
        "2013" => [
            "03" => [somepost, anotherpost],
            "05" => [anotherone]
        ],
        "2012" => [
            "01" => [somethingelse],
            "11" => [yetanotherpost]
        ],
        …
    ]

where each item in the deepest arrays is a [Kirby page object](http://getkirby.com/docs/variables/page).

See [Example with results grouped by month](example-months.php) for relevant templating code.

## Option documentation

    order:      Sort order: 'asc' (oldest first) or 'desc' (newest first).
                Defaults to 'desc'.
    
    recursive:  Boolean.
                Should we get all descendant pages when working from a list
                pages such as $pages->find('somefolder')->children()?
                Defaults to true.
                When set to false, using $pages as the source object will only
                list pages at the root of your content directory.
    
    limit:      Integer. Max number of posts to return.
                Defaults to 100.
    
    offset:     Integer. Number of posts to skip. Use this and limit for
                manual pagination.
                Defaults to 0.
    
    max:        Integer (timestamp) or string (date).
                Posts from after this date won't be included.
                Defaults to the current timestamp (time()).
    
    min:        Integer (timestamp) or string (date).
                Posts from before this date won't be included.
                Defaults to UNIX epoch time (0 or roughly '1970-01-01').
    
    group:      Should the posts be grouped by year or month?
                When grouped by year, we will return an array of arrays,
                each child array containing the posts for a given year, with
                the year as the child array's key (e.g. '2011').
                When grouped by month, we will group by year first, then
                by month, so that means child and grandchild arrays.
                Month arrays have keys looking like '01', '02', …, '12'.
