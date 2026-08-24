const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a Care Home
  const home = await prisma.careHome.create({
    data: {
      name: 'Sunrise Care Home',
      branchCode: 'SUN-01',
      address: '123 Sunshine Avenue, London',
    }
  });

  // Create a Super Admin Role
  const superAdminRole = await prisma.role.create({
    data: {
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

  // Create Super Admin User
  await prisma.user.create({
    data: {
      name: 'Admin Manager',
      email: 'admin@sunrisecare.com',
      password: hashedPassword,
      userType: 'SUPER_ADMIN',
      careHomeId: home.id,
      roleId: superAdminRole.id,
    }
  });

  // Create a Care Worker User
  await prisma.user.create({
    data: {
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
