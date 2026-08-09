# FaceTrackAI — Production-Ready MVP Plan

## Goal

Turn FaceTrackAI from a partially-wired prototype into a production-ready MVP: fix all known bugs, wire the static pages (Dashboard, Reports, Analytics, Settings) to real backend data, complete employee management (edit with face re-registration, delete), refactor the backend into clean layers, and add tests, CI, and docs. Keep the existing feature set. Camera Management page and check-in/check-out attendance are explicitly deferred.

## Current State (from audit)

**Works:** Auth (JWT login/signup), employee registration via face-capture pipeline (MediaPipe 15-image guided capture → insightface embedding → MongoDB), employee list/update, live attendance recognition (`Attendance.tsx`, `Kiosk.tsx` → `POST /api/recognition/recognize`), theme + layout.

**Broken/missing:**
- `AddEmployeeModal` never resets `step`/`employee`/`capturedImages` on reopen (the noted bug in `face track ai notes.txt`) and swallows register errors.
- `CaptureProgress` receives props it doesn't declare → renders `NaN%`.
- `FaceStatus` receives props it doesn't declare.
- `FaceCapture` `onComplete` is an inline arrow recreated every render → duplicate timers.
- `ai/face_embedding.py:save_embedding` writes to relative `"embeddings"` instead of `Config.EMBEDDING_FOLDER`.
- `routes/attendance.py` `recognize` passes a folder where a file path is expected; endpoint is unused by the client (duplicate of `/api/recognition/recognize`).
- No duplicate `employee_id` check at registration (folder collisions).
- Users table delete button is a no-op; Edit modal has no face re-registration.
- Dashboard, Reports, Analytics, Settings are 100% hardcoded mock data; no settings persistence.
- ~15 orphaned/stub components; dead `useFaceDetector` hook; mock `data/employees.ts`.
- No tests, no CI, no server lint, no README; `server/uploads/`, `server/embeddings/*.npy`, `__pycache__`, `venv/` tracked in git.
- `@tanstack/react-query`, `zod`, `react-hook-form` installed but unused. Frontend types are `any` everywhere.

## Decisions

1. **Goal:** Production-ready MVP (not enterprise, not feature-expansion).
2. **Camera Management page:** out of scope (decide later).
3. **Backend:** clean layered refactor — thin routes, `services/` business logic, centralized error handling, validation.
4. **Recognition endpoints:** `/api/recognition/recognize` stays canonical (client uses it); delete `/api/attendance/recognize`.
5. **Settings:** real backend `settings` collection, behavior-affecting (recognition threshold → matching; duplicate-window → already-marked guard; organization name → UI). Work hours stored but not consumed until the check-in/check-out model lands (deferred). Theme stays in localStorage.
6. **Employees:** full edit (text + optional face re-registration) + delete (DB record + image folder + `.npy`).
7. **Attendance model:** keep single "Present" mark per day (check-in/check-out decided later). Reports/Analytics use present/absent counts, department and time trends.
8. **Testing/CI:** pytest (mongomock) + vitest/RTL + GitHub Actions (ruff, eslint, tsc, tests, build).
9. **Deployment:** keep dev docker-compose; add README deployment notes.
10. **Data fetching:** use the already-installed `@tanstack/react-query` (add `QueryClientProvider`) for list/aggregate queries; replace hand-rolled `useState`+`useEffect` fetching in Users/Dashboard/Reports/Analytics.
11. **Config:** API base URL via `VITE_API_URL` (default `http://127.0.0.1:5000`).

## Phase 0 — Repo hygiene

- [ ] Add `server/.gitignore` entries: `__pycache__/`, `venv/`, `uploads/`, `embeddings/`, `temp/`, `.env`. Add root `.gitignore` for `node_modules/` if missing.
- [ ] `git rm --cached` tracked secrets/binaries (keep files on disk): `server/.env`, `server/uploads/**`, `server/embeddings/*.npy`, `server/__pycache__/**`, `server/routes/__pycache__/**` (confirmed tracked via `git ls-files`).
- [ ] Add `server/.env.example` (MONGO_URI, DATABASE_NAME, SECRET_KEY) and `client/.env.example` (VITE_API_URL).

## Phase 1 — Backend layered refactor

- [ ] `config.py`: all paths via `Config` (fix relative `"embeddings"` usage); env-driven `RECOGNITION_THRESHOLD`, `WORK_START_HOUR`, `WORK_END_HOUR`, `ORG_NAME` defaults.
- [ ] `database.py`: expose collections (`admins`, `employees`, `attendance`, `settings`); create unique index on `employees.employee_id` and `admins.email`; index `attendance.employee_id + attendance.date`.
- [ ] Performance fix: `FaceRecognition` is currently instantiated at module import (loads insightface model + all embeddings on startup) and calls `load_embeddings()` (reads every `.npy` from disk) on EVERY recognize request — the kiosk/attendance pages poll every 2–3s. Replace with a lazy singleton that caches embeddings in memory and is invalidated via a version counter bumped by employee register/delete/face-re-register (same process only; document that multi-worker needs a real cache or restart). Recognition threshold read from the settings service per request (settings cached in memory, invalidated on `PUT /api/settings`).
- [ ] `services/` modules, business logic moved out of routes:
  - `auth_service.py` (signup/login, password hashing, token)
  - `employee_service.py` (register incl. duplicate check + image save + embedding; update; delete with file cleanup; re-register face)
  - `recognition_service.py` (temp image handling, recognize, mark attendance with duplicate-window guard, threshold from settings)
  - `attendance_service.py` (queries + aggregations for reports/analytics)
  - `settings_service.py` (get defaults, get all, update; cached threshold used by recognition)
- [ ] `app.py`: `create_app()` factory, JSON 404/400/500 error handlers, register blueprints (`auth`, `employees`, `recognition`, `attendance`, `settings`, `stats`).
- [ ] Input validation on all write endpoints (missing fields → 400 with message; invalid types rejected).
- [ ] Rewrite `routes/attendance.py` (blueprint stays): remove the dead `/api/attendance/recognize` POST (grep confirms no client or postman references); this file becomes the thin layer for the new query endpoints (Phase 2). Keep canonical `POST /api/recognition/recognize`, which stays public (no JWT) because the unauthenticated kiosk depends on it.

## Phase 2 — Backend new APIs

- [ ] `PUT /api/employees/<employee_id>` — text fields only (existing).
- [ ] `PUT /api/employees/<employee_id>/face` — accepts `images[]`, saves to employee folder (replacing old images), regenerates embedding, updates `image_folder`/`images`/`embedding_path`.
- [ ] `DELETE /api/employees/<employee_id>` — deletes MongoDB doc + upload folder + `.npy`; returns 404 if missing.
- [ ] `POST /api/employees/register` — reject duplicate `employee_id` with 409.
- [ ] `GET /api/attendance/today?date=YYYY-MM-DD` — records for the day (list page).
- [ ] `GET /api/attendance/summary?from=&to=&department=` — aggregation: present count per day, per department, per hour, employee totals (powers Reports + Analytics).
- [ ] `GET /api/stats/dashboard` — KPI data (total/registered employees, present today, present rate, pending) + chart series (weekly trend, department distribution, recent attendance) from real data.
- [ ] `GET /api/settings`, `PUT /api/settings` (admin only) — persisted key-value; recognized keys validated against whitelist (recognition_threshold, duplicate_window_seconds, organization_name, work_start_hour, work_end_hour); `PUT` bumps the settings cache so recognition picks up the new threshold.
- [ ] Dev/demo utility `server/seed.py` (not exposed as a route): creates sample employees with synthetic embeddings + synthetic attendance records across the last 14 days so Dashboard/Reports/Analytics are demoable without manually completing a 15-image face capture. Clearly marked dev-only in docs.

## Phase 3 — Frontend bug fixes

- [ ] `AddEmployeeModal.tsx`: reset `step`, `employee`, `capturedImages` when `open` flips to true (useEffect or remount via key); show error toast/alert on register failure (use existing `react-hot-toast`); keep disabled until 15 images.
- [ ] `CaptureProgress.tsx`: declare the props actually passed (`current`, `total`, `progress`).
- [ ] `FaceStatus.tsx`: declare/type `instruction`, `headPose`, `blinked` props.
- [ ] `FaceCapture.tsx`: make `onComplete` handling stable (useRef for callback or memoize in parent); clear image state on unmount; guard auto-capture against re-entry.
- [ ] `api.ts`: baseURL from `import.meta.env.VITE_API_URL`.

## Phase 4 — Frontend feature wiring

- [ ] Add `QueryClientProvider` in `main.tsx`; add `src/types/` (`Employee`, `AttendanceRecord`, `AttendanceSummary`, `Settings`, `DashboardStats`); remove `any` in touched files.
- [ ] `services/`: add `deleteEmployee`, `reRegisterFace` to `employeeService`; `settingsService` (get/update); `statsService` (dashboard); `attendanceService` (today, summary). Wire all to `api.ts`.
- [ ] `Users.tsx`: wire delete button (confirm dialog → `deleteEmployee` → invalidate employee query); wire edit button to the existing `EditEmployeeModal` (its `open`/`employee`/`onClose`/`onSuccess` props already fit — no rewrite needed, but restyle to match `AddEmployeeModal` and replace `alert()` with toasts); add a "Face" step/tab inside edit that runs `FaceCapture` → `reRegisterFace`; wire the toolbar "Export CSV" button to a real client-side CSV download of the filtered list.
- [ ] Replace manual `loadEmployees()`/`useState` fetching in `Users.tsx`, `Dashboard.tsx`, `Reports.tsx`, `Analytics.tsx` with `useQuery`; after employee/settings mutations call `invalidateQueries` (no manual reload).
- [ ] `Dashboard.tsx` + widgets: replace hardcoded values with `useQuery` on `/api/stats/dashboard` (HeroSection, DashboardStats, AttendanceChart, DepartmentChart, RecentAttendance, SystemHealth, NotificationPanel); keep presentational components, pass real data.
- [ ] `Reports.tsx`: real data from `/api/attendance/summary` with date-range + department filters; real CSV export (build client-side from fetched data); keep report cards driven by generated reports.
- [ ] `Analytics.tsx`: replace hardcoded chart arrays with summary aggregation data (weekly trend, hourly distribution, department breakdown).
- [ ] `Settings.tsx`: real CRUD against `/api/settings`; sections: Organization (name), Recognition (threshold slider + duplicate-window), Work hours (stored, marked "coming with check-in/check-out"); replace fabricated system info with real health-check (`/health`).
- [ ] `Attendance.tsx`/`Kiosk.tsx`: keep as-is except use `VITE_API_URL`; fix "already marked" handling if response shape changes.

## Phase 5 — Frontend cleanup

- [ ] Delete orphans/stubs: `components/dashboard/LiveRecognition.tsx`, `components/layout/Footer.tsx`, `components/common/Modal.tsx`/`Loader.tsx`/`Card.tsx`/`Button.tsx`, `components/users/EmployeeTable.tsx`, `UsersToolbar.tsx`, `FaceRegistration.tsx`, `WebcamPreview.tsx`, `FaceGuide.tsx`, `components/users/FaceStatus.tsx`, `data/employees.ts`, `hooks/useFaceDetector.ts`, `features/camera/utils/autoCapture.ts`, `features/camera/utils/facePose.ts`, `components/components/attendance/CameraOverlay.tsx` (and the nested `components/components/` dir if empty after).
- [ ] Keep: `components/users/AddEmployeeModal.tsx`, `components/users/EditEmployeeModal.tsx`, all `features/camera/*` (live pipeline).
- [ ] Ensure no imports break (grep after deletion).

## Phase 6 — Tests

- [ ] Backend: `pytest` + `pytest-cov` + `mongomock`. Fixtures: test app with in-memory mongo and temp upload/embedding dirs. Cover: auth signup/login/duplicate; employee register (valid, duplicate id 409, no-face 400), update, delete (file cleanup), face re-register; recognition recognize (recognized/unknown/already-marked); settings get/update/validation; stats/summary aggregation.
- [ ] Frontend: `vitest` + `@testing-library/react` + `@testing-library/jest-dom` (jsdom). Cover: `AddEmployeeModal` state reset on reopen + register error path; `FaceCapture` completion flow (mock landmarker + webcam); `CaptureProgress`/`FaceStatus` render with real props; services with mocked axios.
- [ ] Add scripts: server `pytest`/`ruff`; client `test` (vitest run), `typecheck` (tsc --noEmit).

## Phase 7 — CI + docs

- [ ] `.github/workflows/ci.yml`: jobs for backend (python setup, pip install, ruff, pytest) and frontend (node setup, npm ci, eslint, tsc, vitest, vite build).
- [ ] Root `README.md`: overview, architecture diagram (client/server/mongo), setup (docker compose for mongo, venv + pip install for server, npm install for client), env vars, API endpoint list, test commands, production notes (waitress vs dev server, CORS, model downloads: `buffalo_l` + MediaPipe WASM CDN need internet on first run).

## Validation

1. Backend: `ruff check .` clean; `pytest` green.
2. Frontend: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all pass.
3. Manual E2E: signup → login → add employee (full face capture) → appears in Users list → kiosk/attendance page recognizes employee and marks present (second scan says already marked) → dashboard KPIs/charts reflect real data → edit employee text → re-register face → delete employee (files gone from uploads/embeddings) → settings change threshold and it affects recognition.
4. Seed demo: run `python server/seed.py`, then verify Dashboard/Reports/Analytics render real aggregated numbers for the seeded range (not mock constants), and Reports CSV export downloads a non-empty file.
5. Confirm git status shows no `uploads/`, `embeddings/*.npy`, `.env`, or `__pycache__` tracked.

## Risks / Notes

- First-run model downloads: insightface `buffalo_l` (network) and MediaPipe WASM from CDN (runtime) — document; offline environments need pre-download.
- MongoDB must be running locally or via `docker compose up mongodb` for manual validation.
- Existing registered employee documents remain valid after refactor (schema unchanged; only new indexes added).
- Delete `/api/attendance/recognize` only after confirming nothing references it (grep client + postman collections).

## Out of Scope (deferred)

- Camera Management page (decide later).
- Check-in/check-out attendance model and Late/Absent statuses.
- Multi-role auth, leave management, notifications, exports beyond CSV.
- Live RTSP/IP camera streaming.
- Cloud platform deployment config.
