import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const COLLECTIONS = [
  {
    nombre: 'Aura',
    slug: 'aura',
    esencia: 'Energía, confianza y luz.',
    orden: 1,
  },
  {
    nombre: 'Afrodita',
    slug: 'afrodita',
    esencia: 'Sensualidad, amor propio y belleza.',
    orden: 2,
  },
  {
    nombre: 'Atenea',
    slug: 'atenea',
    esencia: 'Fuerza, inteligencia y determinación.',
    orden: 3,
  },
  {
    nombre: 'Isis',
    slug: 'isis',
    esencia: 'Transformación, sabiduría y renacimiento.',
    orden: 4,
  },
];

const CATEGORIES = [
  { nombre: 'Sets', slug: 'sets', orden: 1 },
  { nombre: 'Corsés', slug: 'corses', orden: 2 },
  { nombre: 'Bodys', slug: 'bodys', orden: 3 },
  { nombre: 'Babydolls', slug: 'babydolls', orden: 4 },
  { nombre: 'Panties', slug: 'panties', orden: 5 },
  { nombre: 'Pijamas', slug: 'pijamas', orden: 6 },
  { nombre: 'Accesorios', slug: 'accesorios', orden: 7 },
];

async function main() {
  const seller = await prisma.seller.upsert({
    where: { slug: 'corazel' },
    update: {},
    create: { nombre: 'Corazél', slug: 'corazel' },
  });
  console.log(`Seller de sistema listo: ${seller.nombre}`);

  for (const collection of COLLECTIONS) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: collection,
    });
  }
  console.log(`${COLLECTIONS.length} colecciones sembradas`);

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`${CATEGORIES.length} categorías sembradas`);

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@corazel.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'CambiarEsta123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, nombre: 'Admin Corazél' },
  });
  console.log(
    `Admin listo: ${adminEmail} (cambiar password tras el primer login)`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
