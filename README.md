# Nearby Segments Chrome Plugin

## Installing Locally (not from the chrome store)

1. Clone the code locally `git clone `
2. Open chrome and navigate to `chrome://extensions/`
3. Make sure `Developer mode` is checked
4. Click `Load unpacked extention...`
5. Select the directory you cloned into

That's it. Now every time you visit a strava segment page it will show you a list of other segments that are nearby in the righthand sidebar.

## Known issues

1. It's hard-coded to only search for bike ride segments. The segment type is fairly hard to tease out of the HTML on that page.


## Developing

I've found its easiest to leave the extensions manager open in a tab and just refresh every time I make changes to the code locally.