const fs = require('fs');
const file = 'src/app/dashboard/emar/resident/[residentId]/manage/ManageMedicationsClient.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update initial state map
content = content.replace(
  'route: m.route || "Oral",',
  'route: m.route || "Oral", mealInstruction: m.mealInstruction || "",'
);

// Update new row map
content = content.replace(
  /route: "Oral", frequency: "Morning"/g,
  'route: "Oral", mealInstruction: "", frequency: "Morning"'
);

const insertBlock = `
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Meal Instruction</label>
              <select value={med.mealInstruction} onChange={(e) => handleChange(index, 'mealInstruction', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm">
                <option value="">-- Select --</option>
                <option value="Before Meal">Before Meal</option>
                <option value="After Meal">After Meal</option>
                <option value="With Meal">With Meal</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Frequency (Time) *</label>`;

content = content.replace(/<div>\s*<label className="block text-xs font-bold text-gray-700 mb-1">Frequency \(Time\) \*/, insertBlock);
fs.writeFileSync(file, content);
