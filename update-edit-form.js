const fs = require('fs');
const file = 'src/app/dashboard/emar/[id]/edit/EditMedicationFormClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'route: formData.get("route") as string,',
  'route: formData.get("route") as string,\n      mealInstruction: formData.get("mealInstruction") as string,'
);

const insertBlock = `
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Instruction</label>
          <select name="mealInstruction" defaultValue={medication.mealInstruction || ""} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">-- Select --</option>
            <option value="Before Meal">Before Meal</option>
            <option value="After Meal">After Meal</option>
            <option value="With Meal">With Meal</option>
            <option value="Anytime">Anytime</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency (Time) *</label>`;

content = content.replace(/<div>\s*<label className="block text-sm font-medium text-gray-700 mb-1">Frequency \(Time\) \*/, insertBlock);
fs.writeFileSync(file, content);
