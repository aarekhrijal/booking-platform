const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const { timeToMinutes, minutesToTime } = require('../utils/time');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { serviceId, date, startTime } = req.body;

  const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const dayOfWeek = new Date(date).getDay();
  const workingHours = await prisma.workingHours.findUnique({ where: { dayOfWeek } });
  if (!workingHours || !workingHours.isOpen) {
    return res.status(400).json({ error: 'Business is closed on this day' });
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + service.duration;
  const openMinutes = timeToMinutes(workingHours.startTime);
  const closeMinutes = timeToMinutes(workingHours.endTime);

  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
    return res.status(400).json({ error: 'Selected time is outside working hours' });
  }

  const existingBookings = await prisma.booking.findMany({
    where: { date: new Date(date), status: { not: 'CANCELLED' } }
  });

  const hasConflict = existingBookings.some(booking => {
    const bStart = timeToMinutes(booking.startTime);
    const bEnd = timeToMinutes(booking.endTime);
    return bStart < endMinutes && startMinutes < bEnd;
  });

  if (hasConflict) return res.status(409).json({ error: 'This time slot is no longer available' });

  const booking = await prisma.booking.create({
    data: {
      customerId: req.user.userId,
      serviceId: service.id,
      date: new Date(date),
      startTime,
      endTime: minutesToTime(endMinutes),
      totalPrice: service.price
    }
  });

  res.status(201).json(booking);
});

router.get('/my', requireAuth, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId: req.user.userId },
    include: { service: true },
    orderBy: { date: 'asc' }
  });
  res.json(bookings);
});

router.put('/:id/cancel', requireAuth, async (req, res) => {
  const booking = await prisma.booking.findUnique({ where: { id: Number(req.params.id) } });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.customerId !== req.user.userId) return res.status(403).json({ error: 'This is not your booking' });

  const updated = await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } });
  res.json(updated);
});

router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: { service: true, customer: true },
    orderBy: { date: 'asc' }
  });
  res.json(bookings);
});

router.put('/:id/complete', requireAuth, requireAdmin, async (req, res) => {
  const updated = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: { status: 'COMPLETED' }
  });
  res.json(updated);
});

module.exports = router;