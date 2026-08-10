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

module.exports = router;