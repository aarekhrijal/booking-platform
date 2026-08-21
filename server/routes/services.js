const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  const services = await prisma.service.findMany({ where: { isActive: true } });
  res.json(services);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, category, duration, price, imageUrl } = req.body;
  const service = await prisma.service.create({ data: { name, description, category, duration, price, imageUrl } });
  res.status(201).json(service);
});


router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
  res.json(services);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, category, duration, price, isActive, imageUrl } = req.body;
  const service = await prisma.service.update({
    where: { id: Number(req.params.id) },
    data: { name, description, category, duration, price, isActive, imageUrl }
  });
  res.json(service);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const bookingCount = await prisma.booking.count({ where: { serviceId: id } });
  if (bookingCount > 0) {
    return res.status(400).json({ error: 'This service has existing bookings and cannot be deleted. Deactivate it instead.' });
  }

  await prisma.service.delete({ where: { id } });
  res.json({ message: 'Service deleted' });
});

module.exports = router;