const express = require('express');
const prisma = require('../prisma-client/client');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: 'asc' }
  });
  res.json(images);
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { imageUrl, category, caption } = req.body;

  const highest = await prisma.galleryImage.findFirst({ orderBy: { order: 'desc' } });
  const nextOrder = highest ? highest.order + 1 : 0;

  const image = await prisma.galleryImage.create({
    data: { imageUrl, category, caption, order: nextOrder }
  });
  res.status(201).json(image);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { imageUrl, category, caption, order } = req.body;
  const image = await prisma.galleryImage.update({
    where: { id: Number(req.params.id) },
    data: { imageUrl, category, caption, order }
  });
  res.json(image);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await prisma.galleryImage.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Image deleted' });
});

module.exports = router;