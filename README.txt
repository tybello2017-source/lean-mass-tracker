LEAN MASS TRACKER V2.1 — CONCEPT UI EDITION
Build: concept-ui-2026-10-03

This build implements the approved V2.1 design concept as the real app interface.

KEY V2.1 CHANGES
- Rebuilt visual interface to match the approved blue/white concept design.
- Compact Today dashboard with weekly calendar and four linked metrics:
  calories, protein, workouts and water.
- Water tracking added (quick +250 ml / +500 ml, manual total, adjustable target).
- Compact Today's Check-in card; full check-in opens as a sheet.
- Sleep continues to use separate hours + minutes fields.
- Meals screen is now log-first and photo-rich with Today / Favourites / Custom / Recent tabs.
- Workout screen is exercise-focused with large animated GIF, cues, sets/reps/rest, exercise navigation and set logging.
- Workout editor now includes rest time alongside sets, reps and notes.
- Exercise library has search, muscle filters and supplied GIF demonstrations.
- Progress has 1W / 1M / 3M / 6M / 1Y views, weight and measurement charts,
  linked recovery/nutrition metrics, hydration context, training balance and volume.
- New professional app icon retained from the approved design concept.

DATA SAFETY / MIGRATION
- Storage key remains: leanMassTrackerV1
- IndexedDB meal-photo database remains: LeanMassPhotos
- Existing meals, meal photos, custom meals, favourites, weight logs, body measurements,
  sleep, workout history, exercise set logs and settings are preserved in place.
- Migration only adds new fields such as waterMl, waterTarget and workout rest seconds when missing.
- Historical workout log entries keep their saved exercise names/categories.
- Export backup still includes state + meal photos.

GITHUB
Upload the CONTENTS of this folder to the ROOT of the SAME GitHub Pages repository currently hosting V2.0.
Do not create a new repository, delete the Home Screen app, or clear Safari website data before confirming V2.1 works.

PACKAGE FILE COUNT
89 files — intentionally below 100 files.


GIF DISPLAY FIX 1:
- Newly supplied workout GIFs are embedded directly in app.js, preventing GitHub Pages path/upload failures.
- User data storage remains unchanged: leanMassTrackerV1 + LeanMassPhotos.
- Service worker cache bumped so iOS fetches this corrected build.
