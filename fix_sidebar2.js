const fs = require('fs');
let code = fs.readFileSync('src/components/family/FamilySidebar.tsx', 'utf8');

code = code.replace("  FileText,\n  Settings,\n  Heart,\n  FileText,\n  MessageSquare", "  Settings,\n  Heart,\n  FileText,\n  MessageSquare");

fs.writeFileSync('src/components/family/FamilySidebar.tsx', code);
