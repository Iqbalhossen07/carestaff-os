const fs = require('fs');
let viewPage = fs.readFileSync('src/app/dashboard/emar/[id]/page.tsx', 'utf8');

// Replace standard header to include Route and Date
const searchString = `<span className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-lg text-sm font-bold shadow-sm">
                Dosage: {medication.dosage}
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm">
                Freq: {medication.frequency}
              </span>`;

const replaceString = `<span className="px-3 py-1 bg-white border border-gray-200 text-gray-800 rounded-lg text-sm font-bold shadow-sm">
                Dosage: {medication.dosage}
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm">
                Freq: {medication.frequency}
              </span>
              <span className="px-3 py-1 bg-white border border-gray-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm">
                Route: {medication.route}
              </span>
              {medication.status === "DISCONTINUED" && (
                <span className="px-3 py-1 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm font-bold shadow-sm">
                  DISCONTINUED
                </span>
              )}
            </div>
            
            <div className="flex gap-4 mt-3 text-sm text-gray-600 font-medium">
              <p>Start Date: <span className="text-gray-900">{new Date(medication.startDate).toLocaleDateString()}</span></p>
              {medication.endDate && <p>End Date: <span className="text-gray-900">{new Date(medication.endDate).toLocaleDateString()}</span></p>}
            </div>`;

if(viewPage.includes("Dosage: {medication.dosage}")) {
  viewPage = viewPage.replace(searchString, replaceString);
  fs.writeFileSync('src/app/dashboard/emar/[id]/page.tsx', viewPage);
  console.log("View page updated");
} else {
  console.log("View page NOT updated");
}
