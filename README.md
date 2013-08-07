# Nearby Segments Chrome Plugin

A plugin for Chrome that adds some extra navigation features for the Strava web app.

Currently this includes:
* Preventing the explore tab from jumping you back to your home area
* Adding a list of nearby segments to the right side navigation on segment pages

## Installing Locally (not from the chrome store)

1. Clone the code locally `git clone `
2. Open chrome and navigate to `chrome://extensions/`
3. Make sure `Developer mode` is checked
4. Click `Load unpacked extention...`
5. Select the directory you cloned into

That's it. Now every time you visit a Strava segment page it will show you a list of other segments that are nearby in the sidebar on the right.

## Known issues

1. It's hard-coded to only search for bike ride segments. The segment type is fairly hard to tease out of the HTML on that page, but a future version might include matching segment types too.

