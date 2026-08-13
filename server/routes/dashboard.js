const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  const totalBookings = await prisma.booking.count();
  const pendingBookings = await prisma.booking.count({ where: { status: 'PENDING' } });
  const cancelledBookings = await prisma.booking.count({ where: { status: 'CANCELLED' } });

  const completedBookings = await prisma.booking.findMany({
    where: { status: 'COMPLETED' },
    include: { service: true }
  });
  const revenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  res.json({ totalBookings, pendingBookings, cancelledBookings, revenue });
});


router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: { bookings: { include: { service: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});


module.exports = router;