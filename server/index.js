const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express' });
});


function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ userId: req.user.userId, role: req.user.role });
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword }
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});


app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.get('/api/services', async (req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true }
  });
  res.json(services);
});

app.post('/api/services', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, duration, price } = req.body;

  const service = await prisma.service.create({
    data: { name, description, duration, price }
  });

  res.status(201).json(service);
});

app.get('/api/schedule/working-hours', async (req, res) => {
  const hours = await prisma.workingHours.findMany({
    orderBy: { dayOfWeek: 'asc' }
  });
  res.json(hours);
});

app.put('/api/schedule/working-hours', requireAuth, requireAdmin, async (req, res) => {
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

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(mins) {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

app.get('/api/availability', async (req, res) => {
  const { date, serviceId } = req.query;
  const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const dayOfWeek = new Date(date).getDay();
  const workingHours = await prisma.workingHours.findUnique({ where: { dayOfWeek } });
  if (!workingHours || !workingHours.isOpen) {
    return res.json([]);
  }

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

    if (!hasConflict) {
      slots.push(minutesToTime(start));
    }
  }

  res.json(slots);
});

app.post('/api/bookings', requireAuth, async (req, res) => {
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

  if (hasConflict) {
    return res.status(409).json({ error: 'This time slot is no longer available' });
  }

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

