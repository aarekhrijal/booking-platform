const express = require('express');
const prisma = require('../prisma-client/client');

const router = express.Router();

router.put('/cancel', async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ error: 'Please provide both your booking code and email' });
  }

  const booking = await prisma.booking.findFirst({
    where: {
      otp,
      OR: [
        { guestEmail: email },
        { customer: { email } }
      ]
    }
  });

  if (!booking) {
    return res.status(404).json({ error: 'No booking found with that code and email' });
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CANCELLED', cancelledBy: booking.customerId ? 'customer' : 'guest' }
  });

  res.json(updated);
});

router.post('/', async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ error: 'Please provide both your booking code and email' });
  }

  const booking = await prisma.booking.findFirst({
    where: {
      otp,
      OR: [
        { guestEmail: email },
        { customer: { email } }
      ]
    },
    include: { service: true }
  });

  if (!booking) {
    return res.status(404).json({ error: 'No booking found with that code and email' });
  }

  res.json(booking);
});

module.exports = router;