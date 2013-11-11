<?php

function pagesByDate( $source, $userOptions=NULL ) {
  /*
   * Returns an array of Kirby "$page objects",
   * or nested arrays (when grouping by year or month).
   */

  // Make sure we have a valid source
  if (!method_exists($source, 'slice')) {
    throw new Exception("pagesByDate requires $pages or a similar Kirby Pages object as first argument");
  }

  // Merge options
  $defaults = array(
    'recursive' => true,
    'order' => 'desc',
    'limit' => 100,
    'offset' => 0,
    'max' => time(),
    'min' => 0,
    'group' => 'none'
  );
  $options = is_array($userOptions) ? array_merge($defaults, $userOptions) : $defaults;

  // Normalize some options
  if (!is_int($options['limit'])) $options['limit'] = $defaults['limit'];
  if (!is_int($options['offset'])) $options['offset'] = $defaults['offset'];
  if (is_string($options['max'])) $options['max'] = strtotime($options['max']);
  if (is_string($options['min'])) $options['min'] = strtotime($options['min']);

  if ($options['recursive']) {
    // The index method of Kirby pages objects gives us access to all descendants
    $source = new Pages($source->index());
  }

  // Order source content
  $source = $source->sortBy('date', $options['order']);

  // We'll return this in the end
  $results = array();

  // Validate each page based on integer dates
  foreach ($source as $page) {
    $d = $page->date(); // false when no date, integer timestamp otherwise
    if ($d !== false && $d >= $options['min'] && $d <= $options['max']) {
      array_push($results, $page);
    }
  }

  // Apply offset/limit on the validated pages
  $results = array_slice($results, $options['offset'], $options['limit']);

  // Grouping by year, or by year then by month
  if ($options['group'] == 'year' || $options['group'] == 'month') {
    $grouped = array();

    foreach ($results as $page) {
      $year = $page->date('Y');
      $month = $page->date('m');

      // Populating the years/months arrays
      if (!array_key_exists($year, $grouped)) {
        $grouped[$year] = array();
      }
      if ($options['group'] == 'year') {
        array_push($grouped[$year], $page);
      }
      if ($options['group'] == 'month') {
        if (!array_key_exists($month, $grouped[$year])) {
          $grouped[$year][$month] = array();
        }
        array_push($grouped[$year][$month], $page);
      }
    }

    // Swap the linear results for the grouped results
    $results = $grouped;
  }

  return $results;
}

?>
