
import React, { useState, useEffect } from 'react';
import { Owner } from '../types';
import { db } from '../services/db';

interface OwnerFormProps {
  initialData?: Owner;
  onComplete: () => void;
  onCancel: () => void;
}

export const OwnerForm: React.FC<OwnerFormProps> = ({ initialData, onComplete, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [contact, setContact] = useState(initialData?.contactNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    
    if (initialData) {
      db.updateOwner({
        ...initialData,
        name,
        contactNumber: contact,
      });
    } else {
      const newOwner: Owner = {
        id: 'o' + Date.now(),
        name,
        contactNumber: contact,
        areaCode: '+249'
      };
      db.addOwner(newOwner);
    }
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold border-b pb-2">{initialData ? 'Edit Customer' : 'Add New Customer'}</h2>
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name</label>
        <input 
          required 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. Ali Saif"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contact Number</label>
        <input 
          required 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          value={contact} 
          onChange={e => setContact(e.target.value)} 
          placeholder="0912345678"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-bold shadow-md hover:bg-blue-700 transition">
          {initialData ? 'Update Customer' : 'Save Customer'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 bg-slate-100 py-2 rounded font-bold hover:bg-slate-200 transition">Cancel</button>
      </div>
    </form>
  );
};
