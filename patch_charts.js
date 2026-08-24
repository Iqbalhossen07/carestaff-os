const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/DashboardCharts.tsx', 'utf8');

// Ensure PieChart, Pie, Cell, BarChart, Bar are imported
if (!code.includes('PieChart')) {
  code = code.replace(
    "} from 'recharts';",
    "  PieChart,\n  Pie,\n  Cell,\n  BarChart,\n  Bar\n} from 'recharts';"
  );
}

// Remove the duplicated "use client" and imports from the appended text
let analyticsCode = fs.readFileSync('src/components/dashboard/AnalyticsCharts.tsx', 'utf8');
analyticsCode = analyticsCode.replace(/"use client";/g, '');
analyticsCode = analyticsCode.replace(/import {.*} from 'recharts';/g, '');

// Clean the file and rewrite it
let originalCode = fs.readFileSync('src/app/dashboard/DashboardCharts.tsx', 'utf8').split('"use client";')[1]; // keep original
fs.writeFileSync('src/app/dashboard/DashboardCharts.tsx', '"use client";\n' + originalCode.split('export function FinanceBarChart')[0] + analyticsCode);
