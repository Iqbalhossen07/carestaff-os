const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const meds = await prisma.medication.findMany({
    where: { resident: { firstName: 'Damon' } }
  });
  console.log("MEDS FOR DAMON:", meds.length);
  if (meds.length > 0) {
    console.log(meds[0]);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
