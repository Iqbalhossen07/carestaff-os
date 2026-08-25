const fs = require('fs');
let viewPage = fs.readFileSync('src/app/dashboard/emar/[id]/page.tsx', 'utf8');

viewPage = viewPage.replace(
  `              {medication.endDate && <p>End Date: <span className="text-gray-900">{new Date(medication.endDate).toLocaleDateString()}</span></p>}
            </div>
            </div>
          </div>`,
  `              {medication.endDate && <p>End Date: <span className="text-gray-900">{new Date(medication.endDate).toLocaleDateString()}</span></p>}
            </div>
          </div>`
);

fs.writeFileSync('src/app/dashboard/emar/[id]/page.tsx', viewPage);
