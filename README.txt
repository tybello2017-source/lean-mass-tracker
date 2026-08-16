LEAN MASS TRACKER — PWA V1.1

WHAT'S NEW
- Existing V1 data is preserved: V1.1 intentionally keeps the same localStorage key.
- Apple-style refreshed interface and cleaner Today screen.
- Proper Monday–Sunday weekly calendar with previous/next week controls.
- Weekly averages for calories/protein and workout count.
- Meal photos: take/select a photo when logging a meal. Photos are compressed and stored locally in IndexedDB.
- Meal photo gallery in Progress.
- Recent foods and Favourite foods.
- Portion multipliers: 1/2, 3/4, 1, 1.25, 1.5, 2 portions.
- Serious Mass quick-add (631 kcal / 25 g protein).
- Workout demonstration cards for the home exercises, with form cues.
- Body measurements: waist, chest, upper arm and thigh, with trend chart.
- Weight trend and body measurement charts.
- Reminders for breakfast, lunch, Serious Mass, dinner, workout and weekly weigh-in.
- Improved backup/restore: V1.1 backup also includes meal photos.
- Improved service-worker updating and offline caching.

IMPORTANT REMINDER LIMITATION
This app is hosted on GitHub Pages and has no notification server. V1.1 can show notifications while the app is active/recently opened and checks overdue reminders when it opens. Reliable scheduled push notifications while the app is fully closed would require a later server-backed push service (for example a small push backend/Cloudflare Worker).

HOW TO UPDATE YOUR EXISTING GITHUB REPOSITORY
1. Keep the existing repository: lean-mass-tracker. Do NOT create a new repository.
2. Open the repository > Code.
3. Upload the contents of this V1.1 folder to the repository root.
4. Replace the existing files when GitHub prompts/conflicts:
   - index.html
   - app.js
   - styles.css
   - sw.js
   - manifest.webmanifest
   - seed-data.json
   - README.txt
   - icons folder
5. Also upload the new demos folder.
6. Commit with a message such as: Upgrade Lean Mass Tracker to V1.1
7. GitHub Pages will redeploy automatically from main / root.

IPHONE AFTER DEPLOYMENT
- Keep your existing Home Screen app installed; this preserves the same local app origin/data.
- Open LeanMassTracker and give it a few seconds online.
- If it still shows the old version, fully close it and reopen it. The V1.1 service worker uses a new cache and checks for updates.
- You should see “V1.1” in the top eyebrow/header.
- If prompted that a new version is ready, tap Refresh now.
- Do NOT delete the Home Screen app or clear Safari website data before exporting a backup.

BACKUP
More > Backup & restore > Export backup.
The exported JSON contains app state and, in V1.1, compressed meal photos.
