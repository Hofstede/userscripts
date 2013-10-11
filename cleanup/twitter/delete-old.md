# delete-old.js

SOMEWHAT HACKISH SCRIPT TO DELETE SOME OF YOUR ACTIVITY ON TWITTER  
(OR MOST OF IT IF YOU’RE PATIENT ENOUGH)

Use at your very own risk.  
May delete a lot of your tweets and RT (that's the point).

No warranty, yada yada.  
Also: only tested in Firefox 24 and Chrome 28.

## Known limitations and issues

### 3200 tweets limit

You will not be able to delete more than the last 3200 tweets.  
This is a Twitter platform limitation. See [Issue #2](https://github.com/fvsch/userscripts/issues/2) for details.

### Phantom retweets

I’ve ended up with a bunch of half-retweeted tweets in my timeline, for a minority of the cancelled retweets. No idea why. See [Issue #3](https://github.com/fvsch/userscripts/issues/3) for details.

## Usage

### Bookmarklet (with default settings)

1. In a modern desktop browser, add this bookmarklet to the browser’s bookmark or navigation toolbar:  
   <a href="javascript:(function()%7Bfunction%20callback()%7BTWD.start()%7Dvar%20s%3Ddocument.createElement(%22script%22)%3Bs.src%3D%22https%3A%2F%2Fraw.github.com%2Ffvsch%2Fuserscripts%2Fmaster%2Fcleanup%2Ftwitter%2Fdelete-old.js%22%3Bif(s.addEventListener)%7Bs.addEventListener(%22load%22%2Ccallback%2Cfalse)%7Delse%20if(s.readyState)%7Bs.onreadystatechange%3Dcallback%7Ddocument.body.appendChild(s)%3B%7D)()" style="border:solid 1px;padding: 2px 5px;">Delete old tweets</a>  
   (Note that the bookmarklet calls for [delete-old.js](https://raw.github.com/fvsch/userscripts/master/cleanup/twitter/delete-old.js) directly from raw.github.com, so it won’t work anymore if Github is down or if I break or move this script. :D)
2. Login to your Twitter account.
3. Go to your profile page at `twitter.com/username`, or your favorites at `twitter.com/favorites`.
4. Scroll down a few times so that Twitter loads older tweets (the 100 latest ones and/or those from the past 2 days are kept intact). Loading a few hundreds works well. Loading a thousand tweets or more (yeah I tried) will slow down your browser considerably.
5. Click the bookmarklet in your browser’s toolbar. A black log pane should appear on the left side of the page. Processing your tweets mimicks manual interaction and can take roughly 2 seconds for every tweet. You may need to let the script run in a browser tab for a few minutes.

To delete hundreds or thousands of tweets, you will need to repeat steps 3-5 several times. I suggest refreshing the page between rounds.

### Manual

1. Copy [delete-old.js](delete-old.js) and change the default values if you want to (see below: Tweaking).
2. Do steps 2-4 above.
3. Use the browser's Web Console or JavaScript Console and paste all of your (possibly modified) script in it. (And run the code obviously.)
4. In the Console, launch the script with: `TWD.start()`

## Tweaking

- The first batch of options should have sensible values, but you may want to change them for different behavior. The `KEEP_LATEST` and `KEEP_RECENT` options will be combined. If a tweet meets any of the two criteria, it will be kept.

- You may want to tweak the waiting times. Generally speaking, higher times mean less skipped tweets.

- The one time setting I found was critical is `WAIT_AFTER_CONFIRM`. After you ask for a tweet's deletion, the twitter.com UI is busy with showing a confirmation message (and possibly getting the information for that message with a HTTP request), and if you process the next tweet too soon you won’t be able to confirm deletion for it.
