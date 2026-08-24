"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const weeklyData = [
  { name: 'Mon', incidents: 0, shifts: 5 },
  { name: 'Tue', incidents: 1, shifts: 6 },
  { name: 'Wed', incidents: 0, shifts: 5 },
  { name: 'Thu', incidents: 2, shifts: 7 },
  { name: 'Fri', incidents: 0, shifts: 5 },
  { name: 'Sat', incidents: 0, shifts: 4 },
  { name: 'Sun', incidents: 1, shifts: 4 },
];

export function ActivityChart({ data }: { data: any[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line type="monotone" name="Completed Shifts" dataKey="shifts" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          <Line type="monotone" name="Incidents / Alerts" dataKey="incidents" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
