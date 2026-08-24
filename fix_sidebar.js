const fs = require('fs');
let code = fs.readFileSync('src/components/family/FamilySidebar.tsx', 'utf8');

// Fix imports
code = code.replace(
  "  Heart,\n  FileText,\n  MessageSquare\n} from \"lucide-react\";",
  "  Heart,\n  FileText,\n  MessageSquare\n} from \"lucide-react\";" // actually just clean it up
);
code = code.replace("  FileText,\n  Settings,\n  Heart,\n  FileText,\n  MessageSquare", "  FileText,\n  Settings,\n  Heart,\n  MessageSquare");

// Fix line 27
code = code.replace(
  "<Heart,\n  FileText,\n  MessageSquare className=\"w-6 h-6 text-white\" />",
  "<Heart className=\"w-6 h-6 text-white\" />"
);

fs.writeFileSync('src/components/family/FamilySidebar.tsx', code);
