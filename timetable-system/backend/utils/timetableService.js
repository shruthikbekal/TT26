const pool = require('../db');

const TIMETABLE_COLUMNS = `
  t.id,
  t.day,
  t.time_slot,
  t.semester,
  t.section,
  t.subject,
  t.teacher,
  t.room,
  EXISTS (
    SELECT 1
    FROM timetable t2
    WHERE t2.id <> t.id
      AND t2.teacher = t.teacher
      AND t2.day = t.day
      AND t2.time_slot = t.time_slot
      AND t2.teacher IS NOT NULL
      AND t2.teacher <> ''
  ) AS clash
`;

async function getTimetable() {
  const result = await pool.query(
    `SELECT ${TIMETABLE_COLUMNS}
     FROM timetable t
     ORDER BY t.day, t.time_slot, t.section, t.id`
  );

  return result.rows;
}

async function saveTimetableEntry(payload) {
  const { id, day, time_slot, semester, section, subject, teacher, room } = payload;

  if (!day || !time_slot || !section) {
    throw new Error('day, time_slot, and section are required');
  }

  let savedId = id;

  if (savedId) {
    const updated = await pool.query(
      `UPDATE timetable
       SET day = $1,
           time_slot = $2,
           semester = $3,
           section = $4,
           subject = $5,
           teacher = $6,
           room = $7
       WHERE id = $8
       RETURNING id`,
      [day, time_slot, semester || null, section, subject || null, teacher || null, room || null, savedId]
    );

    if (updated.rowCount === 0) {
      throw new Error(`Timetable row not found for id ${savedId}`);
    }
  } else {
    const inserted = await pool.query(
      `INSERT INTO timetable (day, time_slot, semester, section, subject, teacher, room)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [day, time_slot, semester || null, section, subject || null, teacher || null, room || null]
    );
    savedId = inserted.rows[0].id;
  }

  const entryResult = await pool.query(
    `SELECT ${TIMETABLE_COLUMNS}
     FROM timetable t
     WHERE t.id = $1`,
    [savedId]
  );

  return entryResult.rows[0];
}

async function getTeacherReports() {
  const result = await pool.query(
    `SELECT
       teacher,
       COUNT(*)::int AS total_classes,
       COUNT(*) FILTER (
         WHERE REGEXP_REPLACE(LOWER(time_slot), '\\s', '', 'g') IN ('2:55-3:45', '2:55–3:45')
       )::int AS last_hour_classes
     FROM timetable
     WHERE teacher IS NOT NULL AND teacher <> ''
     GROUP BY teacher
     ORDER BY teacher`
  );

  return result.rows;
}

module.exports = {
  getTimetable,
  saveTimetableEntry,
  getTeacherReports,
};
