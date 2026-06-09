# Real-Time Timetable Management System

A production-ready full-stack timetable manager that replicates an Excel-like workflow with **AG Grid** and supports **real-time collaboration** using **Socket.IO**.

## Features

- Excel-like editable timetable grid (AG Grid)
- Live collaborative updates across multiple users
- Teacher clash detection (same teacher at same day/time slot)
- Active users presence panel
- Weekly report dashboard:
  - total classes per teacher
  - last-hour classes (2:55–3:45)
- PostgreSQL-backed persistence
- Deployable stack for Supabase + Render + Vercel

## Project Structure

```text
timetable-system/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── TimetableGrid.jsx
│   │   │   └── ReportDashboard.jsx
│   │   └── api.js
│   ├── index.html
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql
└── docker-compose.yml
```

## Local Setup

### 1) Database setup

Create PostgreSQL database and run:

```bash
psql < timetable-system/database/schema.sql
```

### 2) Backend

```bash
cd timetable-system/backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend

```bash
cd timetable-system/frontend
cp .env.example .env
npm install
npm run dev
```

## API Endpoints

- `GET /api/timetable`
- `POST /api/timetable`
- `GET /api/reports`

## WebSocket Events

- Client emits: `update-cell`, `user-joined`
- Server emits: `cell-updated`, `user-joined`, `active-users`

## Deployment

### Database (Supabase)
1. Create a Supabase Postgres project.
2. Run `database/schema.sql` in SQL editor.
3. Copy connection string into backend `DATABASE_URL`.

### Backend (Render)
1. Create a new Web Service from `timetable-system/backend`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars: `DATABASE_URL`, `PORT`, `CORS_ORIGIN`

### Frontend (Vercel)
1. Import repo in Vercel.
2. Set root directory to `timetable-system/frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env vars: `VITE_API_URL`, `VITE_SOCKET_URL`

## Docker (Optional)

```bash
cd timetable-system
docker compose up --build
```

## Screenshots

- `docs/screenshots/grid.png` (placeholder)
- `docs/screenshots/reports.png` (placeholder)
- `docs/screenshots/realtime.png` (placeholder)
