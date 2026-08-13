const express = require('express');
const prisma = require('../prisma-client/client');
const { lookupLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/', lookupLimiter, async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ error: 'Please provide your booking code' });
  }

  const booking = await prisma.booking.findFirst({
    where: { otp },
    include: { service: true }
  });

  if (!booking) {
    return res.status(404).json({ error: 'No booking found with that code' });
  }

  res.json(booking);
});

router.put('/cancel', lookupLimiter, async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ error: 'Please provide your booking code' });
  }

  const booking = await prisma.booking.findFirst({ where: { otp } });

  if (!booking) {
    return res.status(404).json({ error: 'No booking found with that code' });
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CANCELLED', cancelledBy: booking.customerId ? 'customer' : 'guest' }
  });

  res.json(updated);
});

module.exports = router;