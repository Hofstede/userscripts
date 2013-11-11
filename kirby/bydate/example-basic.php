<?php
/*
  Example: Using pagesByDate with default settings
*/
  include_once('bydate.php');
  $posts = pagesByDate($pages);
?>

<?php if (!$posts): ?>

<p>Sorry, nothing to show.</p>

<?php else: ?>

<ul>
<?php foreach($posts as $post): ?>
  <li>
    <a href="<?php echo $post->url(); ?>">
    <?php echo $post->title(); ?>
    </a> - <?php echo $post->date('j F Y'); ?>
  </li>
<?php endforeach; ?>
</ul>

<?php endif; ?>