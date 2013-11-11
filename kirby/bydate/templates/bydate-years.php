<?php
/*
  Example: Using pagesByDate with results grouped by year
*/
  $posts = pagesByDate($pages, array('group'=>'year'));
?>

<?php if (!$posts): ?>

<p>Sorry, nothing to show.</p>

<?php else: ?>

<?php foreach($posts as $year => $yearPosts): ?>

<h2><?php echo $year ?></h2>
<ul>
<?php foreach($yearPosts as $post): ?>
  <li><a href="<?php echo $post->url() ?>"><?php echo $post->title() ?></a></li>
<?php endforeach; ?>
</ul>

<?php endforeach; ?>

<?php endif; ?>
