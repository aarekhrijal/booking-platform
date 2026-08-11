const prisma = require('./prisma-client/client');

const services = [
  { name: 'Haircut (Male)', description: 'Classic haircut and styling.', duration: 30, price: 300 },
  { name: 'Haircut (Female)', description: 'Haircut and styling for all hair lengths.', duration: 60, price: 600 },
  { name: 'Hair Coloring', description: 'Full hair coloring service.', duration: 120, price: 2500 },
  { name: 'Hair Treatment', description: 'Nourishing hair treatment.', duration: 90, price: 1500 },
  { name: 'Facial', description: 'Deep-cleansing facial treatment.', duration: 60, price: 1200 },
  { name: 'Cleanup', description: 'Quick refresh facial cleanup.', duration: 45, price: 800 },
  { name: 'Threading (Eyebrows)', description: 'Precise eyebrow threading.', duration: 15, price: 150 },
  { name: 'Manicure', description: 'Hand and nail care.', duration: 45, price: 600 },
  { name: 'Pedicure', description: 'Foot and nail care.', duration: 60, price: 800 },
  { name: 'Massage (Head)', description: 'Relaxing head massage.', duration: 30, price: 500 },
];

async function main() {
  for (const service of services) {
    const created = await prisma.service.create({ data: service });
    console.log(`Created: ${created.name}`);
  }
  console.log('Done seeding services.');
}

main()
  .catch((err) => console.error(err))
  .finally(() => process.exit());