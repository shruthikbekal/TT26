const express = require('express');
const { getTimetable, saveTimetableEntry } = require('../utils/timetableService');

function createTimetableRouter(io) {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    try {
      const rows = await getTimetable();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch timetable', error: error.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const saved = await saveTimetableEntry(req.body);

      // Keep REST and websocket clients in sync.
      io.emit('cell-updated', saved);

      res.status(201).json(saved);
    } catch (error) {
      const status = /required|not found/i.test(error.message) ? 400 : 500;
      res.status(status).json({ message: 'Failed to save timetable entry', error: error.message });
    }
  });

  return router;
}

module.exports = createTimetableRouter;
