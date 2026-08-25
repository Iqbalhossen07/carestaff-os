const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

if (!schema.includes('startDate')) {
  schema = schema.replace(
    'instructions String?',
    'instructions String?\n  startDate   DateTime @default(now())\n  endDate     DateTime?\n  route       String   @default("Oral")\n  status      String   @default("ACTIVE")'
  );
  fs.writeFileSync('prisma/schema.prisma', schema);
  console.log('Schema updated');
} else {
  console.log('Schema already has the fields');
}
