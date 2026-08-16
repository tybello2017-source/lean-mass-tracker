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
