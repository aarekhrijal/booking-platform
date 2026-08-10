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
  const { name, description, duration, price } = req.body;
  const service = await prisma.service.create({ data: { name, description, duration, price } });
  res.status(201).json(service);
});


router.get('/all', requireAuth, requireAdmin, async (req, res) => {
  const services = await prisma.service.findMany({ orderBy: { id: 'asc' } });
  res.json(services);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { name, description, duration, price, isActive } = req.body;
  const service = await prisma.service.update({
    where: { id: Number(req.params.id) },
    data: { name, description, duration, price, isActive }
  });
  res.json(service);
});



module.exports = router;