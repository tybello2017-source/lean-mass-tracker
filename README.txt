LEAN MASS TRACKER — PWA V1.2

V1.2 focuses on four upgrades:
1. More accurate start/finish workout illustrations for the home exercise programme.
2. Better exercise logging: every prescribed set can record load, reps, RIR (reps in reserve) and completion, with copy-previous and progression prompts.
3. Genuine weekly statistics and calendar status: averages use only days with meals actually logged; calendar dots distinguish meals, workouts and check-ins.
4. Better meal-photo integration: photos appear as tappable meal thumbnails and in a dated gallery with full-screen details.

Existing V1/V1.1 local data is preserved because the app continues to use the same local storage identity. Workout logs from older versions are migrated into the new per-set structure when possible.

UPDATE ON GITHUB PAGES
- Upload the contents of this folder to the existing lean-mass-tracker repository root.
- Replace index.html, app.js, styles.css, sw.js, manifest.webmanifest, README.txt and demos/.
- Commit, then wait for the Pages deployment to show a green check.
- Open the installed PWA online once; close/reopen if the service worker still shows the old version.

DATA
- Logs remain local to the browser/PWA.
- Meal photos are stored in IndexedDB.
- Use More > Export backup periodically.
