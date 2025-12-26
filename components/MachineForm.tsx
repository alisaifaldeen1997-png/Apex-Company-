
import React, { useState } from 'react';
import { Machine, Owner } from '../types';
import { db } from '../services/db';

interface MachineFormProps {
  initialData?: Machine;
  owners: Owner[];
  onComplete: () => void;
  onCancel: () => void;
}

export const MachineForm: React.FC<MachineFormProps> = ({ initialData, owners, onComplete, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Machine>>(initialData || {
    brand: 'JCB',
    currentHours: 0,
    type: 'Excavator'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model || !formData.serialNumber || !formData.ownerId) return;
    
    if (initialData) {
      db.updateMachine({
        ...initialData,
        ...formData as Machine,
      });
    } else {
      const newMachine: Machine = {
        ...formData as Machine,
        id: 'm' + Date.now()
      };
      db.addMachine(newMachine);
    }
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold border-b pb-2">{initialData ? 'Edit Machinery' : 'Add New Machinery'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <select 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            value={formData.brand}
            onChange={e => setFormData(p => ({...p, brand: e.target.value as any}))}
          >
            <option>JCB</option>
            <option>HYUNDAI</option>
            <option>DOOSAN</option>
            <option>SHANTUI</option>
            <option>CUMMINS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input 
            required 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            value={formData.model || ''}
            onChange={e => setFormData(p => ({...p, model: e.target.value}))} 
            placeholder="e.g. 3CX" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Serial Number</label>
        <input 
          required 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.serialNumber || ''}
          onChange={e => setFormData(p => ({...p, serialNumber: e.target.value}))} 
          placeholder="SN-XXXXX" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Current Working Hours</label>
        <input 
          type="number" 
          required 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.currentHours || 0}
          onChange={e => setFormData(p => ({...p, currentHours: Number(e.target.value)}))} 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Assigned Owner</label>
        <select 
          required 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={formData.ownerId || ''}
          onChange={e => setFormData(p => ({...p, ownerId: e.target.value}))}
        >
          <option value="">-- Select Owner --</option>
          {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold shadow-md hover:bg-blue-700 transition">
          {initialData ? 'Update Machine' : 'Register Machine'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 bg-slate-100 py-2 rounded font-bold hover:bg-slate-200 transition">Cancel</button>
      </div>
    </form>
  );
};
