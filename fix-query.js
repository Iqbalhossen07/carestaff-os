const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/emar/page.tsx', 'utf8');
content = content.replace(
  'const residents = await prisma.user.findMany({',
  'const residents = await prisma.resident.findMany({'
);
content = content.replace(
  'where: { \n        role: { name: "Resident" },\n      },',
  ''
);
// In case the indentation is different, let's just do a regex replace for the whole block
content = content.replace(
  /const residents = await prisma\.user\.findMany\(\{\s+where: \{\s+role: \{ name: "Resident" \},\s+\},/g,
  'const residents = await prisma.resident.findMany({'
);
fs.writeFileSync('src/app/dashboard/emar/page.tsx', content);
