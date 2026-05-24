# AVR-190 Frontend Lead Assignment (Frontend lane separation + i18n parity control)

Date: 2026-05-11
Owner: Frontend Lead
Assigned specialist: React Engineer
Issue: AVR-190 - Frontend lane separation and i18n parity control

## Objective
Separate frontend delivery into clear lanes that reduce merge contention and add a lightweight parity control so English and Italian dictionaries cannot drift when UI copy changes.

## Specialist Assignment
Assignee: React Engineer (Next.js 16 / React 19)

Lane ownership for this issue:
1. Lane A - UI surface changes only
- Any page/component copy updates live in feature files under `frontend/app/(protected)/*` and `frontend/components/*`.
- No API contract changes in this lane.

2. Lane B - Localization source of truth
- All new/changed copy keys must be added in both dictionaries:
  - `frontend/lib/i18n/en.ts`
  - `frontend/lib/i18n/it.ts`
- Keep key structure identical; only translated values may differ.

3. Lane C - Parity control
- Add a parity check script that fails when key paths differ between EN and IT.
- Wire parity check into frontend lint workflow so drift is caught early.

Suggested file ownership:
- `frontend/lib/i18n/en.ts`
- `frontend/lib/i18n/it.ts`
- `frontend/package.json`
- `frontend/scripts/check-i18n-parity.mjs` (new)
- Optional note update: `frontend/README.md`

## Cross-Platform Integration Guidance
1. Frontend/backend boundary:
- Keep this issue frontend-only; backend DTOs/endpoints are contract inputs, not part of lane scope.
- If a missing backend field blocks UI copy behavior, log it as dependency work instead of patching backend in this issue.

2. Runtime env behavior:
- Continue using `env('NEXT_PUBLIC_*')` runtime access (via `next-runtime-env`) for UI toggles and API URL.
- Do not introduce `process.env` reads in client components.

3. Role/permission UX consistency:
- Maintain existing JWT-role behavior (`admin`, `manager`, `viewer`) and current guarded route structure.
- Copy changes for role-specific messages must remain mirrored in both dictionaries.

## Acceptance Criteria
1. A deterministic script validates key-path parity between EN and IT dictionaries.
2. `npm run lint` in `frontend/` fails on i18n key mismatch.
3. At least one intentionally added mismatch reproduces a failing check, then passes after correction.
4. Lane boundaries are documented in delivery notes for future frontend tasks.

## Verification Minimum
Run in `frontend/`:
- `npm run lint`
- `node scripts/check-i18n-parity.mjs`

Manual validation:
1. Add temporary key to only one dictionary and confirm script exits non-zero.
2. Add matching key to the other dictionary and confirm clean pass.

## Delivery Notes
- Parity check should compare object keys recursively and ignore value text differences.
- Functions used for dynamic labels (if any) must be treated as leaf values; only key presence matters.
- Keep script output actionable by printing missing keys per language.

## Next Action
React Engineer implements Lane C first (parity guard), then applies Lane A/B changes under that guard and posts lint/parity outputs as closure evidence.
