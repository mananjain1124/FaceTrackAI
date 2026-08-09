# FaceTrackAI

AI-powered face recognition attendance system with real-time camera feed, guided face capture, and automatic attendance marking.

## Features

- **Face capture & registration** — 15-image guided capture with MediaPipe pose/blink detection, insightface embeddings stored as `.npy`
- **Live recognition** — kiosk-style scanning with cosine-similarity matching and in-memory embedding cache (invalidated on employee mutations)
- **Auto attendance marking** — duplicate-window guard (per-day default, configurable via Settings)
- **Dashboard** — real KPIs (total employees, present today, present rate, not marked) with weekly trend + department distribution charts
- **Reports & Analytics** — date-range aggregation (per-day, per-department, per-hour, per-employee) with CSV export
- **Settings** — recognition threshold, duplicate window, work hours, organization name (persisted in MongoDB, hot-reloaded)
- **Dark mode** — full theme support across all pages

## Architecture

```
client/          React 19 + Vite + TypeScript + Tailwind 4
  src/
    features/    auth, users, attendance, camera, dashboard, reports, analytics, settings
    services/    axios API clients (employee, attendance, settings, stats, auth)
    components/  shared UI (dashboard widgets, user modals, layout)
    types/       shared TypeScript interfaces
    test/        vitest setup + jest-dom matchers
  vite.config.ts jsdom test environment + @ alias

server/          Flask + PyMongo + InsightFace
  app.py         create_app() factory, error handlers, blueprint registration
  config.py      env-driven configuration (paths, thresholds, work hours)
  database.py    lazy MongoDB init + index creation
  routes/        thin route handlers (auth, employee, attendance, recognition, settings, stats)
  services/      business logic (auth, employee, recognition, attendance, settings, stats)
  ai/            face_embedding.py, face_recognition.py (insightface buffalo_l + cosine similarity)
  seed.py        dev-only demo data generator (sample employees + attendance)
  tests/         pytest + mongomock test suite

.github/workflows/ci.yml    Backend (pytest) + Frontend (tsc + vitest + build)
docker-compose.yml          MongoDB 7 + backend + frontend (dev mode)
```

## Prerequisites

- **Python 3.12+** with a venv
- **Node.js 20+**
- **MongoDB 7+** (local or via Docker)
- **Internet on first run** — InsightFace `buffalo_l` model downloads automatically to `~/.insightface/models/`; MediaPipe WASM loads from CDN at runtime

## Quick Start

### 1. Start MongoDB

```bash
docker compose up -d mongodb
```

### 2. Backend

```bash
cd server
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py              # http://127.0.0.1:5000
```

### 3. Frontend

```bash
cd client
npm install
cp .env.example .env       # defaults to VITE_API_URL=http://127.0.0.1:5000
npm run dev                # http://localhost:5173
```

### 4. Seed demo data (optional, dev-only)

```bash
cd server
python seed.py
```

Creates 8 sample employees with synthetic embeddings and ~100 attendance records across 14 days. Only touches the `EMP1001`–`EMP1008` sample IDs — will not pollute real employee data.

## Environment Variables

### Server (`server/.env`)

| Variable | Default | Description |
|---|---|---|
| `MONGO_URI` | `mongodb://localhost:27017/` | MongoDB connection string |
| `DATABASE_NAME` | `facetrackai` | Database name |
| `SECRET_KEY` | `facetrackai_secret` | JWT signing key (**change in production**) |
| `RECOGNITION_THRESHOLD` | `0.75` | Cosine similarity threshold for face matching |
| `ORG_NAME` | `FaceTrackAI` | Organization name (displayed in UI) |
| `WORK_START_HOUR` | `9` | Work start hour (0–23) |
| `WORK_END_HOUR` | `18` | Work end hour (0–23) |

> The `duplicate_window_seconds` setting is **not** read from env — it defaults to `0` (once per day) and is configurable via the Settings page at runtime.

### Client (`client/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:5000` | Backend API base URL |

## Application Routes

| Path | Auth | Description |
|---|---|---|
| `/login` | Public | Admin login |
| `/kiosk` | Public | Attendance kiosk with live camera + auto-mark |
| `/attendance` | JWT | Admin live-recognition dashboard |
| `/dashboard` | JWT | KPI dashboard with real data |
| `/users` | JWT | Employee management (add / edit / delete / CSV export) |
| `/camera` | JWT | Camera management (placeholder, see roadmap) |
| `/reports` | JWT | Attendance reports with CSV export |
| `/analytics` | JWT | Attendance analytics with real charts |
| `/settings` | JWT | System configuration (recognition threshold, duplicate window, org name) |

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Register admin account
- `POST /api/auth/login` — Login, returns JWT

### Employees (all JWT required)
- `POST /api/employees/register` — Register employee with face images
- `GET /api/employees` — List all employees
- `PUT /api/employees/<id>` — Update employee text fields
- `PUT /api/employees/<id>/face` — Re-register employee face (replaces images + embedding)
- `DELETE /api/employees/<id>` — Delete employee + image folder + `.npy` embedding

### Recognition
- `POST /api/recognition/recognize` — Recognize face from image (public — kiosk)
- `GET /api/recognition/` — Health check (public)

### Attendance (JWT required)
- `GET /api/attendance/today?date=YYYY-MM-DD` — Records for a given day (default: today)
- `GET /api/attendance/summary?from=&to=&department=` — Aggregation: per_day, per_department, per_hour, per_employee

### Stats (JWT required)
- `GET /api/stats/dashboard` — KPIs + charts for Dashboard page

### Settings (JWT required)
- `GET /api/settings` — Get all settings (merged with defaults)
- `PUT /api/settings` — Update settings (validates keys + values; hot-reloads recognition cache)

## Tests

### Backend

```bash
cd server
python -m pytest tests/ -v
```

26 tests covering:
- Auth: signup, login, duplicate email, wrong password, missing fields
- Employees: register (success, duplicate 409, missing fields, no images), list, update, delete, file cleanup
- Attendance: today (empty, with date, invalid date), summary (empty, missing dates, invalid range)
- Settings: defaults, update threshold, unknown key 400, out-of-range 400

### Frontend

```bash
cd client
npm run test          # vitest (jsdom + RTL)
npm run typecheck     # tsc --noEmit
npm run build         # production build
```

21 tests covering:
- `CaptureProgress` — progress rendering, completion state
- `FaceStatus` — step-based title, instruction, head pose, blink detection
- `AddEmployeeModal` — open/close, state reset on reopen, form fields, register flow
- `settingsService` — GET / PUT settings
- `employeeService` — list, delete, face re-registration

## Recognition Pipeline

1. **Capture**: `react-webcam` produces `image/jpeg` data URL from the user's webcam
2. **Submit**: Client POSTs the data URL to `/api/recognition/recognize` (no JWT — public for kiosk)
3. **Decode**: Server splits `data:image/jpeg;base64,...` and writes to a temp file
4. **Embed**: InsightFace `buffalo_l` model produces a 512-D face embedding from the temp image
5. **Compare**: Cosine similarity against all stored employee embeddings (cached in memory; invalidated on register/delete/re-register)
6. **Threshold**: Best match must exceed `recognition_threshold` setting (default `0.75`)
7. **Duplicate guard**: If `duplicate_window_seconds > 0`, skip marks within that window; otherwise once per day
8. **Insert**: `attendance` collection gets `{employee_id, name, department, position, date, time, status: "Present"}`

## Deployment Notes

- Run `waitress` (Windows) or `gunicorn` (Linux) instead of Flask dev server in production
- Change `SECRET_KEY` to a strong random string (≥ 32 bytes)
- Enable MongoDB authentication and restrict network access
- CORS: configure allowed origins in `app.py` (currently wide-open for dev)
- The `uploads/`, `embeddings/`, and `temp/` directories should be on persistent storage; `temp/` should be writable
- First run requires internet for the InsightFace model download (~300MB)
- The recognition embedding cache is per-process — for multi-worker deployments, consider a shared cache or warm-up on startup

## Project Status

**Implemented (MVP):** auth, employee CRUD with face re-registration, live recognition, attendance marking with duplicate guard, Dashboard / Reports / Analytics / Settings wired to real data, dark mode, full test suite, CI.

**Deferred (roadmap):** Camera Management page with live RTSP streaming, check-in/check-out attendance model with Late / Absent statuses, multi-role admin auth, cloud-platform deployment config.