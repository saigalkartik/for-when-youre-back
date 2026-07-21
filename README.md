# For when you're finally back ♡

A private, GitHub Pages-ready scrapbook for curated TikToks, Instagram posts, X posts, Marketplace finds, and music.

## Run locally
Open `index.html` in a browser.

## Publish on GitHub Pages
1. Create a new GitHub repository, e.g. `for-when-youre-back`.
2. Upload `index.html`, `style.css`, `app.js`, and `links.js` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`.
6. Click **Save**.
7. Wait a minute or two, then open the GitHub Pages URL shown there.

## Editing links
All links live in `links.js`.
- `tiktoks`: TikTok/Instagram/X links
- `whenMissed`: links plus personal notes
- `moodBoard`: image/mood links
- `marketplace`: Facebook Marketplace links
- `music`: Spotify links plus notes
- `sendLater`: the item marked for later

## Important note about previews
This version uses beautiful platform-aware preview cards and links directly to the original content. TikTok/Instagram/Facebook share URLs do not reliably expose their thumbnails to a static GitHub Pages site, so the site does not scrape or fake their actual post images.

If you want actual thumbnails, you can add an `image` property to an item in `links.js` and update the card renderer in `app.js` to use it.
