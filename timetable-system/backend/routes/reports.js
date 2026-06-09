const express = require('express');
const { getTeacherReports } = require('../utils/timetableService');

function createReportsRouter() {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    try {
      const reports = await getTeacherReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
    }
  });

  return router;
}

module.exports = createReportsRouter;
