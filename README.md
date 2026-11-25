# Mood Campus · GitHub Pages edition

Mood Campus is a static classroom prototype for GTSU2037. Open `index.html` to try the app locally, or publish the files through GitHub Pages. All data generated in the prototype stays in the current browser. Use fictional data for check-ins, notes, referrals and imported events.

## Deploy to GitHub Pages

1. Download and extract the ZIP.
2. Open the repository you want to publish from. To update the original demo, open [gooogle7d9/hahahayeahyeah](https://github.com/gooogle7d9/hahahayeahyeah).
3. On the **Code** tab, select the publishing branch and open the folder GitHub Pages serves. For a new root deployment, select **main** and stay in the repository root.
4. Select **Add file → Upload files**. Drag in the extracted files themselves so that `index.html`, `style.css`, `app.js` and both visual assets sit together. Commit the upload. The empty `.nojekyll` file is optional if your file picker hides it.
5. In **Settings → Pages**, under **Build and deployment**, choose **Deploy from a branch**. For the root deployment select **main** and **/ (root)**, then **Save**. If your site already publishes from another folder, upload there and keep its current source settings.
6. Check the **Actions** tab for the Pages deployment. When it completes, open **Settings → Pages → Visit site**.

Use the [GitHub Pages publishing source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) if your repository uses a different branch or deployment workflow.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | App shell and entry point |
| `style.css` | Responsive layouts and visual styling |
| `app.js` | Check-ins, calendar import, reset games, garden, consent and staff previews |
| `garden.webp` | App banner illustration |
| `mood-campus-figma-flow.svg` | Eight-screen storyboard available under Demo controls |
| `.nojekyll` | Optional marker that skips Jekyll processing |
| `README.md` | This setup and demonstration guide |

## Demonstrate the app

- Tap a mood emoji on **Today**. Add a homework deadline due tomorrow and show the suggested reset change from **Clear the fog** to **Make room to focus**.
- Start the focus reset. Set aside the three distraction chips and choose one next step. Complete the reset to add one anonymous drop to the class garden.
- In **Teacher view**, move the essay two days and check the updated student calendar.
- In **Demo controls**, load **7 low days**, then **14 low days**. Try the referral consent flow and open **Social worker** to see the fictional follow-up. Use **Results day** to demonstrate the paper shredder.
- Download the storyboard from **Demo controls** and import the SVG into Figma. Use the app to show the working interactions.

The calendar accepts all-day CSV files with columns `date,title,type`. Dates use `YYYY-MM-DD`, and type is `exam`, `work` or `grades`. The class garden, staff views and follow-ups are simulations. The app has no eClass login or live school connection.
