const fs = require('fs');

const filesToFix = [
  'src/app/dashboard/emar/page.tsx',
  'src/app/dashboard/emar/resident/[residentId]/manage/page.tsx'
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('from "next/auth"')) {
    content = content.replace('from "next/auth"', 'from "next-auth"');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
