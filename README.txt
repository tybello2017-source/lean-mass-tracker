LEAN MASS TRACKER — PWA V1.3

Photo-Rich UI upgrade:
- Generated built-in imagery for the preloaded food library
- Consistent colourful image treatment instead of text-only meal rows
- User photo uploads limited to custom meals the user creates
- Photo-based workout visual cards replacing schematic stick-figure demos
- Retains V1.2 per-set load/reps/RIR logging, weekly statistics, calendar status, body metrics, offline storage and backup/restore
- Same localStorage identity as earlier versions to preserve existing data

Deployment:
Upload the contents of this folder to the existing GitHub Pages repository root and commit.
The Pages workflow redeploys automatically.


V1.3 corrected photo build
- Removed keyword-based meal-photo guessing that could show the wrong food.
- Every food card now has Add / Replace Photo using camera or photo library.
- User meal-photo replacements are stored locally in IndexedDB and included in backup.
- Workout photography is shown only for verified matching exercises.
- Unverified workout photos are replaced by the correct exercise-specific form guide, preventing misleading exercise imagery.


V1.4 — Colour + iPhone Photo Library update
- Fixed iPhone photo selection: meal photos now use a source sheet with TWO explicit choices:
  1) Take Photo (camera)
  2) Choose from Photos (gallery; no capture attribute)
- The same chooser works for preloaded meal photo replacements and new custom meals.
- Added category-specific colourful thumbnail placeholders instead of plain/text-only cards.
- Added more exact built-in food images only where the asset reliably matches the meal.
- Refreshed cards, quick meal actions, navigation, KPI panels, workout areas and accents with a more colourful Apple-style visual system.
- Preserves V1.3 local data/storage identity and user photo overrides.


V1.5: integrated 89 supplied meal photos, resized/cropped to 720x480 WebP; fixed fallback thumbnail text cropping; removed floating camera overlay; retained camera/gallery replacement.


GITHUB-FRIENDLY V1.5 PACKAGE
- The 89 meal thumbnail images are bundled inside assets/meal-photo-map-v15.json.
- This removes the need to upload 89 separate meal-photo files.
- Upload everything inside this folder to the repository in one browser upload.
- No change to the visible meal images or V1.5 app behaviour.


V1.6 — Expanded Workout Library + Progressive Overload
- Added 33 home-friendly exercises across Biceps, Triceps, Shoulders, Chest, Back, Legs and Abs/Core.
- Pull-ups and dips are intentionally excluded because the current home setup has no pull-up/dip bars.
- Added an in-app Exercise Library with category filters and “Add to Workout A/B/C”.
- User-added exercises can be removed again without changing the core programme.
- Added original Lean Mass Tracker exercise illustrations; no proprietary images were copied from the other bodybuilding app.
- Retains per-set Load kg, Reps, RIR, Done, Copy Previous, progression hints and 3-day flexible scheduling.
- Preserves V1.5 meal photos, meal logs, check-ins, backups and local/offline storage.
