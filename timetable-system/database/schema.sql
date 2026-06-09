CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_dual_program BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS timetable (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  semester TEXT,
  section TEXT NOT NULL,
  subject TEXT,
  teacher TEXT,
  room TEXT
);

CREATE INDEX IF NOT EXISTS idx_timetable_teacher_slot
  ON timetable (teacher, day, time_slot);

CREATE INDEX IF NOT EXISTS idx_timetable_day_slot
  ON timetable (day, time_slot);
