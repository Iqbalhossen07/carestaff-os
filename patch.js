const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// 1. Update imports
code = code.replace(
  'import { ActivityChart } from "./DashboardCharts";',
  'import { ActivityChart, FinanceBarChart, ShiftsPieChart } from "./DashboardCharts";\nimport { Wallet } from "lucide-react";'
);

// 2. Add shiftStatusData and financeData before `const stats = [`
const newDataLogic = `
  // Calculate Shift Status for Pie Chart
  const completedShifts = allShifts.filter(s => s.status === 'COMPLETED').length;
  const pendingShifts = allShifts.filter(s => s.status === 'PUBLISHED' || s.status === 'DRAFT').length;
  const inProgressShifts = activeShifts.length;
  const shiftStatusData = [
    { name: 'Completed', value: completedShifts || 1 },
    { name: 'In Progress', value: inProgressShifts || 1 },
    { name: 'Upcoming/Pending', value: pendingShifts || 1 }
  ];

  // Fetch Finance Data (Invoices)
  const invoices = await prisma.invoice.findMany({
    where: { careHomeId: session?.user?.careHomeId }
  });
  
  // Group invoices by month (simplified for demo)
  const financeMap = new Map();
  invoices.forEach(inv => {
    const m = new Date(inv.dueDate).toLocaleString('default', { month: 'short' });
    if (!financeMap.has(m)) financeMap.set(m, { name: m, income: 0, expenses: 0 });
    const current = financeMap.get(m);
    if (inv.type === "INCOME") current.income += inv.amount;
    else current.expenses += inv.amount;
  });
  
  // If no finance data, provide demo data for chart visual
  let financeData = Array.from(financeMap.values());
  if (financeData.length === 0) {
    financeData = [
      { name: 'Jan', income: 45000, expenses: 32000 },
      { name: 'Feb', income: 47000, expenses: 31000 },
      { name: 'Mar', income: 52000, expenses: 34000 },
      { name: 'Apr', income: 49000, expenses: 35000 },
    ];
  }

  const stats = [
`;
code = code.replace('  const stats = [', newDataLogic);

// 3. Add charts before `      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">`
const newChartsHtml = `
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Finance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Financial Overview
            </h2>
          </div>
          <FinanceBarChart data={financeData} />
        </div>

        {/* Shift Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Shift Attendance Status
            </h2>
          </div>
          <ShiftsPieChart data={shiftStatusData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
`;
code = code.replace('      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">', newChartsHtml);

fs.writeFileSync('src/app/dashboard/page.tsx', code);
