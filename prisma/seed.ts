const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a Care Home (Upsert using a dummy unique branchCode)
  const home = await prisma.careHome.upsert({
    where: { id: 'default-home-id' }, // We'll just rely on a fixed ID for seeding
    update: {},
    create: {
      id: 'default-home-id',
      name: 'Sunrise Care Home',
      branchCode: 'SUN-01',
      address: '123 Sunshine Avenue, London',
    }
  });

  // Create a Super Admin Role
  const superAdminRole = await prisma.role.upsert({
    where: { name_careHomeId: { name: 'Super Admin', careHomeId: home.id } },
    update: {},
    create: {
      name: 'Super Admin',
      careHomeId: home.id,
      canViewEmar: true,
      canEditRota: true,
      canViewFinance: true,
      canManageKitchen: true,
      isSuperAdmin: true,
    }
  });

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Upsert Super Admin User
  await prisma.user.upsert({
    where: { email: 'admin@sunrisecare.com' },
    update: {},
    create: {
      name: 'Admin Manager',
      email: 'admin@sunrisecare.com',
      password: hashedPassword,
      userType: 'SUPER_ADMIN',
      careHomeId: home.id,
      roleId: superAdminRole.id,
    }
  });

  // Upsert Care Worker User
  await prisma.user.upsert({
    where: { email: 'jane@sunrisecare.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'jane@sunrisecare.com',
      password: hashedPassword,
      userType: 'WORKER',
      careHomeId: home.id,
    }
  });

  console.log('Database seeded successfully!');
  console.log('Admin Login -> Email: admin@sunrisecare.com | Password: password123');
  console.log('Worker Login -> Email: jane@sunrisecare.com | Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
