
import React, { useState } from 'react';
import { Owner, Machine } from '../types';
import { db } from '../services/db';

interface OwnerListProps {
  owners: Owner[];
  machines: Machine[];
  onEdit: (o: Owner) => void;
  onRefresh: () => void;
}

export const OwnerList: React.FC<OwnerListProps> = ({ owners, machines, onEdit, onRefresh }) => {
  const [search, setSearch] = useState('');

  const filtered = owners.filter(o => 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.contactNumber.includes(search)
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer? All their associated machines will also be deleted. This cannot be undone.')) {
      db.deleteOwner(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Customer Directory</h2>
        <input 
          type="text" 
          placeholder="Search by Name or Phone..." 
          className="p-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(owner => {
          const ownerMachines = machines.filter(m => m.ownerId === owner.id);
          return (
            <div key={owner.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{owner.name}</h3>
                  <p className="text-xs text-slate-400">{owner.contactNumber}</p>
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Owned Fleet</span>
                  <span className="font-bold text-indigo-600">{ownerMachines.length} Units</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(owner)}
                  className="flex-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-lg font-bold transition"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(owner.id)}
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
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
};
