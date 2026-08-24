#!/bin/bash

# Fix emar/actions.ts
sed -i '' 's/route: string/instructions: string/' src/app/dashboard/emar/actions.ts
sed -i '' 's/const route = formData.get("route")/const instructions = formData.get("instructions")/' src/app/dashboard/emar/actions.ts
sed -i '' 's/route,/instructions,/' src/app/dashboard/emar/actions.ts
sed -i '' 's/status: string/status: "ADMINISTERED" | "REFUSED" | "MISSED"/' src/app/dashboard/emar/actions.ts
sed -i '' 's/notes?: string/refusalReason?: string/' src/app/dashboard/emar/actions.ts
sed -i '' 's/notes,/refusalReason,/' src/app/dashboard/emar/actions.ts

# Fix emar/EmarClientComponents.tsx
sed -i '' 's/name="route"/name="instructions"/' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' 's/Route</Instructions</' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' '/<option value="Oral">Oral<\/option>/d' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' '/<option value="Injection">Injection<\/option>/d' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' '/<option value="Topical">Topical<\/option>/d' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' '/<option value="Inhalation">Inhalation<\/option>/d' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' 's/<select name="instructions" required/<input type="text" name="instructions" placeholder="Take with food" /' src/app/dashboard/emar/EmarClientComponents.tsx
sed -i '' 's/<\/select>//' src/app/dashboard/emar/EmarClientComponents.tsx

# Fix emar/page.tsx
sed -i '' 's/emarLogs:/logs:/g' src/app/dashboard/emar/page.tsx
sed -i '' 's/orderBy: { createdAt: '\''desc'\'' }/orderBy: { timestamp: '\''desc'\'' }/' src/app/dashboard/emar/page.tsx
sed -i '' 's/med.emarLogs/med.logs/g' src/app/dashboard/emar/page.tsx
sed -i '' 's/lastLog.createdAt/lastLog.timestamp/g' src/app/dashboard/emar/page.tsx
sed -i '' 's/med.route/med.instructions/g' src/app/dashboard/emar/page.tsx

# Fix reports/page.tsx
sed -i '' 's/orderBy: { createdAt: '\''desc'\'' }/orderBy: { timestamp: '\''desc'\'' }/' src/app/dashboard/reports/page.tsx
sed -i '' 's/log.createdAt/log.timestamp/g' src/app/dashboard/reports/page.tsx

# Fix rota/actions.ts
sed -i '' 's/roleRequired/title/g' src/app/dashboard/rota/actions.ts
sed -i '' 's/userId/assignedToId/g' src/app/dashboard/rota/actions.ts
sed -i '' 's/status: assignedToId ? "ASSIGNED" : "OPEN"/status: assignedToId ? "SCHEDULED" : "SCHEDULED", isOpen: assignedToId ? false : true/g' src/app/dashboard/rota/actions.ts
sed -i '' 's/status: "ASSIGNED"/status: "SCHEDULED", isOpen: false/g' src/app/dashboard/rota/actions.ts

# Fix rota/RotaClientComponents.tsx
sed -i '' 's/name="roleRequired"/name="title"/g' src/app/dashboard/rota/RotaClientComponents.tsx
sed -i '' 's/name="userId"/name="assignedToId"/g' src/app/dashboard/rota/RotaClientComponents.tsx

# Fix rota/page.tsx
sed -i '' 's/include: { user: true }/include: { assignedTo: true }/g' src/app/dashboard/rota/page.tsx
sed -i '' 's/shift.user/shift.assignedTo/g' src/app/dashboard/rota/page.tsx
sed -i '' 's/shift.roleRequired/shift.title/g' src/app/dashboard/rota/page.tsx

