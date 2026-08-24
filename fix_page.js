const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Fix 1: ShiftStatus
code = code.replace(
  "const pendingShifts = allShifts.filter(s => s.status === 'PUBLISHED' || s.status === 'DRAFT').length;",
  "const pendingShifts = allShifts.filter(s => s.status === 'SCHEDULED').length;"
);

// Fix 2: Invoice finance map
const oldFinanceMapLogic = `  // Group invoices by month (simplified for demo)
  const financeMap = new Map();
  invoices.forEach(inv => {
    const m = new Date(inv.dueDate).toLocaleString('default', { month: 'short' });
    if (!financeMap.has(m)) financeMap.set(m, { name: m, income: 0, expenses: 0 });
    const current = financeMap.get(m);
    if (inv.type === "INCOME") current.income += inv.amount;
    else current.expenses += inv.amount;
  });`;
  
const newFinanceMapLogic = `  // Group invoices by month (simplified for demo)
  const financeMap = new Map();
  invoices.forEach(inv => {
    const m = new Date(inv.dueDate).toLocaleString('default', { month: 'short' });
    if (!financeMap.has(m)) financeMap.set(m, { name: m, income: 0, expenses: 0 });
    const current = financeMap.get(m);
    
    // In our model, all invoices are charges to residents (Income)
    // We mock expenses as 70% of income for the demo chart
    current.income += inv.amount;
    current.expenses += (inv.amount * 0.7);
  });`;

code = code.replace(oldFinanceMapLogic, newFinanceMapLogic);

fs.writeFileSync('src/app/dashboard/page.tsx', code);
