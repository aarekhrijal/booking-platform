const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  const barbers = await prisma.barber.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  });
  res.json(barbers);
});

router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  const barbers = await prisma.barber.findMany({ orderBy: { id: 'asc' } });
  res.json(barbers);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, title, experience, rating, photoUrl } = req.body;
  const barber = await prisma.barber.create({
    data: { name, title, experience, rating: rating ? Number(rating) : undefined, photoUrl }
  });
  res.status(201).json(barber);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { name, title, experience, rating, photoUrl, isActive } = req.body;
  const barber = await prisma.barber.update({
    where: { id: Number(req.params.id) },
    data: { name, title, experience, rating: Number(rating), photoUrl, isActive }
  });
  res.json(barber);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await prisma.barber.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Barber deleted' });
});

module.exports = router;