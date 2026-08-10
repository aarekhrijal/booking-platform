const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/working-hours', async (req, res) => {
  const hours = await prisma.workingHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
  res.json(hours);
});

router.put('/working-hours', requireAuth, requireAdmin, async (req, res) => {
  const { hours } = req.body;
  const updated = [];
  for (const day of hours) {
    const result = await prisma.workingHours.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      update: { startTime: day.startTime, endTime: day.endTime, isOpen: day.isOpen },
      create: { dayOfWeek: day.dayOfWeek, startTime: day.startTime, endTime: day.endTime, isOpen: day.isOpen }
    });
    updated.push(result);
  }
  res.json(updated);
});

module.exports = router;