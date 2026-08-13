const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const optionalAuth = require('../middleware/optionalAuth');
const { timeToMinutes, minutesToTime } = require('../utils/time');
const generateOtp = require('../utils/otp');

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  const { serviceId, date, startTime, guestName, guestEmail, guestPhone } = req.body;

  if (!req.user && (!guestName || !guestEmail || !guestPhone)) {
    return res.status(400).json({ error: 'Please provide your name, email, and phone number' });
  }

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

  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }));
const todayStr = now.toISOString().slice(0, 10);
const currentMinutes = now.getHours() * 60 + now.getMinutes();

if (date === todayStr && startMinutes < currentMinutes) {
  return res.status(400).json({ error: 'This time has already passed' });
}

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existingBookings = await tx.booking.findMany({
        where: { date: new Date(date), status: { not: 'CANCELLED' } }
      });

      const hasConflict = existingBookings.some(booking => {
        const bStart = timeToMinutes(booking.startTime);
        const bEnd = timeToMinutes(booking.endTime);
        return bStart < endMinutes && startMinutes < bEnd;
      });

      if (hasConflict) {
        throw new Error('SLOT_TAKEN');
      }

      return tx.booking.create({
        data: {
          customerId: req.user ? req.user.userId : null,
          serviceId: service.id,
          date: new Date(date),
          startTime,
          endTime: minutesToTime(endMinutes),
          totalPrice: service.price,
          guestName: req.user ? null : guestName,
          guestEmail: req.user ? null : guestEmail,
          guestPhone: req.user ? null : guestPhone,
          otp: generateOtp()
        }
      });
    }, { isolationLevel: 'Serializable' });

    res.status(201).json(booking);
  } catch (err) {
    if (err.message === 'SLOT_TAKEN' || err.code === 'P2034') {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }
    throw err;
  }
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

  const isOwner = booking.customerId === req.user.userId;
  const isAdmin = req.user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'This is not your booking' });
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CANCELLED', cancelledBy: isAdmin ? 'admin' : 'customer' }
  });
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

router.put('/:id/no-show', requireAuth, requireAdmin, async (req, res) => {
  const updated = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: { status: 'NO_SHOW' }
  });
  res.json(updated);
});

module.exports = router;