# Open Up · Phone app for GitHub Pages

Open Up is an installable classroom prototype for GTSU2037. It uses fictional school data. Check-ins, settings and simulated referrals stay in the current browser.

## Publish on GitHub Pages

1. Extract the ZIP and open [gooogle7d9/hahahayeahyeah](https://github.com/gooogle7d9/hahahayeahyeah) or your own repository.
2. In **Code**, open the branch and folder that GitHub Pages serves. For the existing root layout, use `main` and stay in the repository root.
3. Select **Add file → Upload files**. Drag in the files inside the extracted folder so that `index.html`, `manifest.webmanifest`, `sw.js` and the other files sit together. Select **Commit changes**. The empty `.nojekyll` file is optional if your picker hides it.
4. In **Settings → Pages**, select **Deploy from a branch**, then `main` and **/ (root)**. If Pages already serves another publishing folder, keep that setting and upload the files there.
5. Check **Actions** for the completed Pages deployment. Open the published HTTPS link from **Settings → Pages**.

See the [GitHub Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Install on a phone

- **iPhone** · In Safari, open the HTTPS app link. Tap Share, then **Add to Home Screen**. If Safari shows an **Open as Web App** toggle, leave it on.
- **Android** · In Chrome, open the HTTPS app link. Use **More → Install app** within Open Up or choose **Install app** in Chrome’s menu.
- Once the app has loaded and cached successfully, the main screens can reopen offline. The online support link and downloads still need a connection.

For a classroom demonstration on a desktop browser, open the app and use the centered phone frame. Scroll inside the screen. On phones and in standalone mode, the app fits the display. Installation and offline caching require an HTTPS deployment.

## Present the user flow

Open `flow.html` on the published site, or choose **More → User flow demonstration** in Open Up. Click a flow-map node or top tab to open that step in the live phone preview. The preview uses temporary fictional data. Stay in the same tab to show a completed game add a garden drop or a consent choice create a follow-up.

## Demonstrate the home-screen widget

Select **Home Screen Widget** in the flow demo, or **More → Home screen widget** in the app. Tap one of the five moods. The widget confirms the check-in without leaving the preview. Select **See your reset** to open Today and continue. Both screens use the same diary in the current browser. The home-screen widget is a web prototype of the phone experience. Installing the web app creates an app icon.

## Demonstrate the phone app

1. Pick **Low** or **Very low** on Today. A daily random pick appears from **Bubble Reset**, **Notice Three Things**, **Make Room to Focus**, **Lantern Pairs**, or **Grow a Bloom**.
2. Open **Calendar**. Each homework or quiz, including manually added and imported events, has **Clear the Fog**. Tap to use timed press-and-release or hands-free breathing.
3. Open **More → Demo controls → Results day**. Today suggests **Emotional Shredder**, with a random game as another option. You can enter an optional thought and tap to shred it. The thought is never written to browser storage.
4. Complete a mini-game to add an anonymous drop to the simulated class garden. Find the updated Figma storyboard under **More → Demo controls**.

Use **Preview Teacher View** on Today to compare the roles and see your personal consecutive low-mood days. The **Review** tab shows an average, daily trend and private diary for the selected month. **Support & resets** includes guided meditation and external online counselling.

Both **Low** and **Very low** count toward a streak. A missed day breaks the streak. At seven consecutive days, the app shows private support options. At fourteen, a student who opted in gets a simulated automatic referral. The social worker sees the name and streak and, if separately opted in, the recent emoji chart. The teacher sees a class-level alert. The prototype evaluates rules while open and stores the simulation in the current browser.

Calendar CSV columns are `date,title,type`. Use `YYYY-MM-DD` and event types `exam`, `work` or `grades`. The app supports imported and manually entered results dates. An event dated today or within the previous two days can trigger Emotional Shredder after a low check-in. eClass authentication, live class sharing and actual referrals are outside this classroom prototype.

## Files

- `index.html`, `style.css`, `app.js` · Main app
- `flow.html`, `flow.css`, `flow.js` · Clickable flow map and phone preview
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` · Installation and offline shell
- `open-up-hero.webp`, `garden.webp`, `moods.webp` · Greeting artwork, class garden artwork and illustrated mood icons
- `mood-campus-figma-flow.svg` · Importable storyboard
- `README.md`, `.nojekyll` · Deployment guide and optional Pages marker
