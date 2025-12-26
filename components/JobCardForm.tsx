
import React, { useState, useEffect } from 'react';
import { Machine, Owner, JobCard, SparePart } from '../types';
import { db } from '../services/db';

interface JobCardFormProps {
  initialData?: JobCard;
  machines: Machine[];
  owners: Owner[];
  onComplete: () => void;
  onCancel: () => void;
}

export const JobCardForm: React.FC<JobCardFormProps> = ({ initialData, machines, owners, onComplete, onCancel }) => {
  const [formData, setFormData] = useState<Partial<JobCard>>({
    jobCardNo: `apex${Math.floor(Math.random() * 900) + 100}`,
    date: new Date().toISOString().split('T')[0],
    openedTime: '08:00',
    closedTime: '10:00',
    jobType: 'Mechanical',
    sparePartsInvoiceNo: '0',
    laborCost: 0,
    travelCost: 0,
    totalBilled: 0,
    status: 'Pending',
    spareParts: [],
    serviceTeam: [''],
    comments: '',
    customerComplaint: '',
    findings: '',
    workDone: '',
    siteLocation: '',
    travelingKm: 0,
    workingHoursOnArrival: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const [currentPart, setCurrentPart] = useState<Partial<SparePart>>({ name: '', quantity: 1, unitPrice: 0 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, sparePartsInvoiceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPart = () => {
    if (currentPart.name && currentPart.quantity && currentPart.unitPrice) {
      setFormData(prev => ({
        ...prev,
        spareParts: [...(prev.spareParts || []), { ...currentPart, id: Date.now().toString() } as SparePart]
      }));
      setCurrentPart({ name: '', quantity: 1, unitPrice: 0 });
    }
  };

  const removePart = (id: string) => {
    setFormData(prev => ({
      ...prev,
      spareParts: (prev.spareParts || []).filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.machineId || !formData.ownerId) return alert('Please select a machine and owner.');
    
    if (initialData) {
      db.updateJobCard({
        ...initialData,
        ...formData as JobCard,
      });
    } else {
      const newCard: JobCard = {
        ...(formData as JobCard),
        id: Date.now().toString(),
      };
      db.addJobCard(newCard);
    }
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6 max-w-3xl mx-auto border border-slate-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">{initialData ? 'Edit Record' : 'New Maintenance Record'}</h2>
        <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
          {formData.jobCardNo}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Machine</label>
          <select required className="w-full p-2 border rounded" value={formData.machineId} onChange={e => setFormData(p => ({ ...p, machineId: e.target.value }))}>
            <option value="">-- Choose Machine --</option>
            {machines.map(m => <option key={m.id} value={m.id}>{m.brand} {m.model} ({m.serialNumber})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Owner</label>
          <select required className="w-full p-2 border rounded" value={formData.ownerId} onChange={e => setFormData(p => ({ ...p, ownerId: e.target.value }))}>
            <option value="">-- Choose Owner --</option>
            {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full p-2 border rounded" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice No</label>
          <input className="w-full p-2 border rounded" value={formData.sparePartsInvoiceNo} onChange={e => setFormData(p => ({ ...p, sparePartsInvoiceNo: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Service Type</label>
          <select className="w-full p-2 border rounded" value={formData.jobType} onChange={e => setFormData(p => ({ ...p, jobType: e.target.value as any }))}>
            <option>Mechanical</option>
            <option>Electricity</option>
            <option>Preventive</option>
            <option>Corrective</option>
            <option>Emergency</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-sm font-bold text-blue-700 mb-3 uppercase">Financial Data (USD)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">LABOR COST</label>
            <input type="number" className="w-full p-2 border rounded font-bold" value={formData.laborCost} onChange={e => setFormData(p => ({ ...p, laborCost: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">TOTAL REVENUE</label>
            <input type="number" className="w-full p-2 border rounded font-bold text-blue-700" value={formData.totalBilled} onChange={e => setFormData(p => ({ ...p, totalBilled: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">TRAVEL/OTHERS</label>
            <input type="number" className="w-full p-2 border rounded" value={formData.travelCost} onChange={e => setFormData(p => ({ ...p, travelCost: Number(e.target.value) }))} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Complaint</label>
              <textarea className="w-full p-2 border rounded" value={formData.customerComplaint} onChange={e => setFormData(p => ({ ...p, customerComplaint: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">What did you find wrong?</label>
              <textarea className="w-full p-2 border rounded" value={formData.findings} onChange={e => setFormData(p => ({ ...p, findings: e.target.value }))} />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Work Done</label>
          <textarea className="w-full p-2 border rounded h-24" value={formData.workDone} onChange={e => setFormData(p => ({ ...p, workDone: e.target.value }))} />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Attach Invoice Image/File</label>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {formData.sparePartsInvoiceImage && (
            <div className="mt-3 relative w-32 h-32 border rounded overflow-hidden group">
              <img src={formData.sparePartsInvoiceImage} alt="Invoice Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, sparePartsInvoiceImage: undefined }))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comments (Internal)</label>
          <textarea className="w-full p-2 border rounded" value={formData.comments} onChange={e => setFormData(p => ({ ...p, comments: e.target.value }))} placeholder="Brief summary for report..." />
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border">
        <h3 className="text-sm font-bold mb-3">Spare Parts</h3>
        <div className="flex gap-2 mb-2">
          <input className="flex-1 p-2 border rounded text-sm" placeholder="Part Name" value={currentPart.name} onChange={e => setCurrentPart(p => ({ ...p, name: e.target.value }))} />
          <input type="number" className="w-16 p-2 border rounded text-sm" placeholder="Qty" value={currentPart.quantity} onChange={e => setCurrentPart(p => ({ ...p, quantity: Number(e.target.value) }))} />
          <input type="number" className="w-20 p-2 border rounded text-sm" placeholder="Price" value={currentPart.unitPrice} onChange={e => setCurrentPart(p => ({ ...p, unitPrice: Number(e.target.value) }))} />
          <button type="button" onClick={handleAddPart} className="bg-slate-800 text-white px-3 py-2 rounded text-sm font-bold">Add</button>
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1">
            {formData.spareParts && formData.spareParts.map((p) => (
              <div key={p.id} className="flex justify-between items-center text-xs py-1 px-2 bg-white border rounded">
                <span>{p.name} (x{p.quantity}) - ${(p.quantity * p.unitPrice).toFixed(0)}</span>
                <button type="button" onClick={() => removePart(p.id)} className="text-red-500 font-bold hover:bg-red-50 px-1 rounded">X</button>
              </div>
            ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg">{initialData ? 'Update Record' : 'Save Record'}</button>
        <button type="button" onClick={onCancel} className="px-6 bg-slate-100 font-bold py-3 rounded-xl hover:bg-slate-200">Cancel</button>
      </div>
    </form>
  );
};
