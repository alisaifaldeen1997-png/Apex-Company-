
import React, { useMemo } from 'react';
import { AppData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  data: AppData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalJobCards = data.jobCards.length;
    const totalCosts = data.jobCards.reduce((acc, card) => {
      const partsCost = card.spareParts.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0);
      return acc + partsCost + card.laborCost + card.travelCost;
    }, 0);
    const totalHours = data.machines.reduce((acc, m) => acc + m.currentHours, 0);

    return { totalJobCards, totalCosts, totalHours };
  }, [data]);

  const costByMachine = useMemo(() => {
    const map: Record<string, number> = {};
    data.jobCards.forEach(card => {
      const partsCost = card.spareParts.reduce((pAcc, p) => pAcc + (p.quantity * p.unitPrice), 0);
      const total = partsCost + card.laborCost + card.travelCost;
      const machine = data.machines.find(m => m.id === card.machineId);
      const label = machine ? `${machine.brand} ${machine.model}` : 'Unknown';
      map[label] = (map[label] || 0) + total;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data]);

  const jobTypeDist = useMemo(() => {
    const map: Record<string, number> = {};
    data.jobCards.forEach(card => {
      map[card.jobType] = (map[card.jobType] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Job Cards</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{stats.totalJobCards}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Maintenance Cost</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">${stats.totalCosts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Running Hours</p>
          <p className="text-3xl font-bold mt-1 text-amber-600">{stats.totalHours.toLocaleString()}h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Cost Distribution by Machine</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByMachine}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                <YAxis fontSize={12} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Job Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobTypeDist}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobTypeDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs font-medium text-slate-600">
              {jobTypeDist.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
