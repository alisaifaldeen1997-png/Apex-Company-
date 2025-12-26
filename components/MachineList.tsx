
import React, { useState } from 'react';
import { Machine, Owner } from '../types';
import { db } from '../services/db';

interface MachineListProps {
  machines: Machine[];
  owners: Owner[];
  onEdit: (m: Machine) => void;
  onRefresh: () => void;
}

export const MachineList: React.FC<MachineListProps> = ({ machines, owners, onEdit, onRefresh }) => {
  const [search, setSearch] = useState('');

  const filtered = machines.filter(m => 
    m.serialNumber.toLowerCase().includes(search.toLowerCase()) || 
    m.model.toLowerCase().includes(search.toLowerCase()) ||
    m.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this machinery? This action cannot be undone.')) {
      db.deleteMachine(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Machinery Registry</h2>
        <input 
          type="text" 
          placeholder="Search by Brand, SN or Model..." 
          className="p-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(machine => {
          const owner = owners.find(o => o.id === machine.ownerId);
          return (
            <div key={machine.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">
                  {machine.brand}
                </span>
                <span className="text-xs text-slate-400">SN: {machine.serialNumber}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{machine.model}</h3>
              <p className="text-sm text-slate-500 mb-4">{machine.type}</p>
              
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Owner</span>
                  <span className="font-medium text-slate-800">{owner?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Hours</span>
                  <span className="font-bold text-blue-600">{machine.currentHours}h</span>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => onEdit(machine)}
                  className="flex-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg font-bold transition"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(machine.id)}
                  className="flex-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg font-bold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium bg-white rounded-xl border border-dashed border-slate-300">
            No machines found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
