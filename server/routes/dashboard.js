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

router.get('/overview', requireAuth, requireAdmin, async (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const bookingsThisWeek = await prisma.booking.count({ where: { createdAt: { gte: sevenDaysAgo } } });
  const bookingsLastWeek = await prisma.booking.count({ where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } });
  const totalBookings = await prisma.booking.count();

  const clientsThisWeek = await prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: sevenDaysAgo } } });
  const clientsLastWeek = await prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } });
  const totalClients = await prisma.user.count({ where: { role: 'CUSTOMER' } });

  const pctChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const allBarbers = await prisma.barber.findMany();
  const activeBarbers = allBarbers.filter(b => b.isActive);
  const avgRating = activeBarbers.length
    ? (activeBarbers.reduce((sum, b) => sum + b.rating, 0) / activeBarbers.length).toFixed(1)
    : 0;

  const dailyBookings = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const count = await prisma.booking.count({
      where: { createdAt: { gte: dayStart, lte: dayEnd } }
    });

    dailyBookings.push({
      label: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    });
  }

  const upcomingBookings = await prisma.booking.findMany({
    where: { status: 'CONFIRMED', date: { gte: new Date(now.toISOString().slice(0, 10)) } },
    include: { service: true, customer: true, barber: true },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    take: 3
  });

  const recentBookings = await prisma.booking.findMany({
    include: { service: true, customer: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const allServiceBookings = await prisma.booking.findMany({ include: { service: true } });
  const serviceCounts = {};
  allServiceBookings.forEach(b => {
    const name = b.service.name;
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });
  const popularServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / allServiceBookings.length) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recentBookingActivity = await prisma.booking.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  const recentRegistrations = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  const activity = [
    ...recentBookingActivity.map(b => ({
      type: 'booking',
      text: `New booking by ${b.customer ? b.customer.name : b.guestName}`,
      time: b.createdAt
    })),
    ...recentRegistrations.map(u => ({
      type: 'registration',
      text: `Client ${u.name} registered`,
      time: u.createdAt
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  res.json({
    totalBookings,
    bookingsChangePct: pctChange(bookingsThisWeek, bookingsLastWeek),
    totalClients,
    clientsChangePct: pctChange(clientsThisWeek, clientsLastWeek),
    activeBarbers: activeBarbers.length,
    totalBarbers: allBarbers.length,
    avgRating,
    dailyBookings,
    upcomingBookings,
    recentBookings,
    popularServices,
    activity
  });
});

module.exports = router;