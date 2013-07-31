/*

  VERY HACKISH SCRIPT TO DELETE MOST OF YOUR ACTIVITY ON FACEBOOK

  2013-07-30

  This scripts tries to delete any post you've posted to FB,
  including text posts, links and pictures. It also tries to
  unlike anything you've liked.

  Probably very unstable: if Facebook makes a single change to their
  front-end code for the relevant pages, this stops working.

  Don’t use this if you know nothing about JavaScript.
  Or if you care about your Facebook account.
  Or if <any other sensible reason>.

  BUT this won't fry your computer. That’s a start.

  LOCALIZATION:

  Change the LANG variable below to the language you’re using
  Facebook in. Use 2 letter ISO_639-1 codes.
  https://en.wikipedia.org/wiki/ISO_639-1

  We have to work with Facebook’s text labels for buttons.
  If you want this script to work, you may have update the values
  for OPTION_TEXT with whatever button labels Facebook uses in your
  language.

  INSTRUCTIONS:

  1. In a modern web browser (I tested this with Firefox), log in
     to your Facebook account.

  2. Go to https://www.facebook.com/[USERNAME]/allactivity?privacy_source=activity_log&log_filter=cluster_11
     for a list of your own posts and comments on your own posts,
     or to https://www.facebook.com/[USERNAME]/allactivity
     for a list of all kinds of activity.
     Note that this script doesn’t work on some activity types, and
     may not work for deleting your posts and comments from some
     groups, especially groups you have left, or other places on FB.

  3. It might be useful to scroll the page a little bit and let FB
     lazy-load some more list items.

  4. Open your browser's Web Console or JavaScript Console or
     whatever it’s called.

  5. Paste this script in the Console and execute/evalute (it doesn't
     do anything on its own).

  6. Launch with:
     > startDeleting()

  TWEAKING:

  -  By default we're running up to 3 passes, with up to 300 items.
     At 2 seconds an item, that's a maximum execution time of 30
     minutes (perhaps a bit more if the page/browser is busy).
     Of course it's unlikely all passes will work on the maximum
     number of items.

  -  Default values for wait times amount to 2 seconds per post.
     If you want to try it quicker, you could divide all values by 2.
     But…

  -  If you get too many 'SKIPPING - no option found', try to increase
     POPOVER_WAIT so that the pop-over menu has enough time to appear
     (it seems it's sometimes lazy-loaded or calculated when called).

  -  If you get too many 'SKIPPING - no confirm button found', try to
     increase DIALOG_WAIT so that the confirm dialog has time to appear.

*/

// You can customize those values

var LANG = 'fr',
  MAX_PASSES = 3,
  MAX_ITEMS = 500,
  POPOVER_WAIT = 1000, // in milliseconds;
  DIALOG_WAIT = 800, // in milliseconds;
  DIALOG_AFTER = 200; // in milliseconds

// Add or correct your language if needed

var OPTION_TEXT = {
    'de': { 'delete': 'Löschen|Foto löschen', 'unlike': 'Gefällt mir nicht mehr', 'hide': 'In Chronik ausgeblendet' },
    'en': { 'delete': 'Delete|Delete Photo', 'unlike': 'Unlike', 'hide': 'Hidden from Timeline' },
    'es': { 'delete': 'Eliminar|Eliminar foto', 'unlike': 'Ya no me gusta', 'hide': 'No se muestra en la biografía' },
    'fr': { 'delete': 'Supprimer|Supprimer la photo', 'unlike': 'Je n’aime plus', 'hide': 'N’apparaît pas dans le journal' }
  };


// =====================================================================
// Don’t touch anything from there on, unless you know what you’re doing
// =====================================================================

var passIndex = 1,
  postButtons, maxPostButtons,
  currentPosition, currentPostButton;

function clickNextPostButton() {
  currentPosition++;
  if ( currentPosition < maxPostButtons ) {
    currentPostButton = postButtons[ currentPosition ];
    currentPostButton.click();
    setTimeout( clickDeleteOption, POPOVER_WAIT );
  }
  else {
    console.log( 'DONE. Tentatively deleted ' + currentPosition + ' of ' + maxPostButtons + ' posts.' );
    if ( passIndex < MAX_PASSES ) {
      passIndex++;
      console.log(
        '-------------\n' +
        'The page may have loaded some more items that could be deleted.\n' +
        'Trying to restart in 5 seconds.\n' +
        '-------------'
      );
      setTimeout( startDeleting, 5000 );
    }
    else {
      console.log('-------------\nEnd of last pass.\n-------------');
    }
  }
}

function clickDeleteOption() {
  // Get all menu options
  var options = currentPostButton.parentNode
    .querySelector( '.uiContextualLayer' )
    .querySelectorAll( '._54nc' );

  // Detect the kind of options we have for this post
  var deleteOption = null,
    unlikeOption = null,
    hideOption = null;
  for ( i = 0, l = options.length; i < l; i++ ) {
    var text = options[i].textContent.trim();
    if ( OPTION_TEXT[LANG]['delete'].indexOf( text ) !== -1 ) {
      deleteOption = options[i];
    }
    else if ( OPTION_TEXT[LANG]['unlike'].indexOf( text ) !== -1 ) {
      unlikeOption = options[i];
    }
    else if ( OPTION_TEXT[LANG]['hide'].indexOf( text ) !== -1 ) {
      // Only consider this as a valid "hide" option if post not already hidden
      // We're checking the parent (LI)'s class for one indicating current state
      if ( options[i].parentNode.classList.contains('_54nd') ) {
        hideOption = 'selected';
      }
      else {
        hideOption = options[i];
      }
    }
  }

  // Priorities: Skip or hide only if we can't delete or unlike
  if ( deleteOption === null && unlikeOption === null && hideOption === null ) {
    console.log( '' + currentPosition + '  SKIPPING - no option found' );
    clickNextPostButton();
  }
  else if ( deleteOption === null && unlikeOption === null && hideOption !== null ) {
    if ( hideOption === 'selected' ) {
      console.log( '' + currentPosition + '  HIDE post - already hidden' );
      clickNextPostButton();
    }
    else {
      console.log( '' + currentPosition + '  HIDE post' );
      hideOption.click();
      setTimeout( clickNextPostButton, DIALOG_AFTER );
    }
  }
  else if ( deleteOption !== null ) {
    console.log( '' + currentPosition + '  DELETE post' );
    deleteOption.click();
    setTimeout( confirmDialog, DIALOG_WAIT );
  }
  else if ( unlikeOption !== null ) {
    console.log( '' + currentPosition + '  UNLIKE post' );
    unlikeOption.click();
    setTimeout( confirmDialog, DIALOG_WAIT );
  }
}

function confirmDialog() {
  // Confirm deletion
  var confirmBtn = document.querySelector( '.confirm_dialog input[name="ok"]' );
  if ( confirmBtn === null ) {
    console.log( '' + currentPosition + '  SKIPPING - no confirm button found' );
  }
  else {
    console.log( '' + currentPosition + '  ok' );
    confirmBtn.click();
  }
  // Moving to next post
  setTimeout( clickNextPostButton, DIALOG_AFTER );
}

function startDeleting() {
  // Get buttons that trigger a pop-up for modifying posts
  postButtons = document.querySelectorAll( 'a._2fmm' );
  maxPostButtons = postButtons.length > MAX_ITEMS ? MAX_ITEMS : postButtons.length;

  console.log(
    'GO! This is pass ' + passIndex + '. ' +
    'Let’s try to delete ' + maxPostButtons + ' posts.'
  );

  // And now let's try to delete the first one.
  currentPosition = -1;
  clickNextPostButton();
}
