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

Only use this script if you’re “technical” enough to understand this.

0. Check and if necessary change the values for the first batch of constants, especially DELETE and KEEP_LATEST.

1. In a modern browser, login to your Twitter account.

2. Go to your profile page (twitter.com/username) and scroll to the bottom a few times to make it load a few hundred tweets. (If you want to undo favorites, go to twitter.com/favorites.)

3. Use the browser's Web Console or JavaScript Console and paste all of this script in it. (And run the code obviously.)

4. In the Console, run:  
   `> TWD.start()`

## Tweaking

- The first batch of options should have sensible values, but you may want to change them for different behavior. The `KEEP_LATEST` and `KEEP_RECENT` options will be combined. If a tweet meets any of the two criteria, it will be kept.

- You may want to tweak the waiting times. Generally speaking, higher times mean less skipped tweets.

- The one time setting I found was critical is `WAIT_AFTER_CONFIRM`. After you ask for a tweet's deletion, the twitter.com UI is busy with showing a confirmation message (and possibly getting the information for that message with a HTTP request), and if you process the next tweet too soon you won’t be able to confirm deletion for it.
