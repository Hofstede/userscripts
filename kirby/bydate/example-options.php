<?php
/*
  Example: Using pagesByDate with some custom options
*/
  include_once('bydate.php');

  // Let's build a list of events planned in 2014
  $myOptions = array(
    'max' => '2014-12-31',
    'min' => '2014-01-01',
    'order' => 'asc',
  );

  // If we wanted all pages with dates in the site, we could do:
  $events = pagesByDate($pages, $myOptions);

  // If instead we want to limit ourselves to content in a "content/events" folder…
  // (We can't just use $pages->find('events') because it doesn't return a set of pages)
  $events = pagesByDate(
    $pages->find('events')->children(),
    $myOptions
  );
?>

<?php if (!$events): ?>

<p>Sorry, no event planned yet.</p>

<?php else: ?>

<ul>
<?php foreach($events as $event): ?>
  <li>
    <a href="<?php echo $event->url(); ?>"><?php echo $event->title(); ?></a><br>
    <?php echo $event->date('j F Y'); ?> - <?php echo $event->location(); ?>
  </li>
<?php endforeach; ?>
</ul>

<?php endif; ?>
