const express = require('express');
const prisma = require('../prisma-client/client');
const { timeToMinutes, minutesToTime } = require('../utils/time');

const router = express.Router();

router.get('/', async (req, res) => {
  const { date, serviceId } = req.query;
  const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const dayOfWeek = new Date(date).getDay();
  const workingHours = await prisma.workingHours.findUnique({ where: { dayOfWeek } });
  if (!workingHours || !workingHours.isOpen) return res.json([]);

  const openMinutes = timeToMinutes(workingHours.startTime);
  const closeMinutes = timeToMinutes(workingHours.endTime);
  const duration = service.duration;

  const existingBookings = await prisma.booking.findMany({
    where: { date: new Date(date), status: { not: 'CANCELLED' } }
  });

  const slots = [];
  for (let start = openMinutes; start + duration <= closeMinutes; start += 30) {
    const end = start + duration;
    const hasConflict = existingBookings.some(booking => {
      const bStart = timeToMinutes(booking.startTime);
      const bEnd = timeToMinutes(booking.endTime);
      return bStart < end && start < bEnd;
    });
    if (!hasConflict) slots.push(minutesToTime(start));
  }

  res.json(slots);
});

module.exports = router;