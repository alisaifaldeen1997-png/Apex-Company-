
import { AppData, Machine, Owner, JobCard } from '../types';

const STORAGE_KEY = 'heavy_machinery_db_v2';

const DEFAULT_DATA: AppData = {
  machines: [
    { id: 'm1', serialNumber: 'SN-00234', model: '3CX', type: 'Backhoe Loader', brand: 'JCB', currentHours: 1250, ownerId: 'o1' },
    { id: 'm2', serialNumber: 'SN-00567', model: 'R210LC', type: 'Excavator', brand: 'HYUNDAI', currentHours: 4500, ownerId: 'o2' }
  ],
  owners: [
    { id: 'o1', name: 'Suleiman Mohammed', contactNumber: '0963366668', areaCode: '+249' },
    { id: 'o2', name: 'Ahmed Khalid', contactNumber: '0123456789', areaCode: '+249' }
  ],
  jobCards: [
    {
      id: 'j1',
      jobCardNo: 'apex001',
      machineId: 'm1',
      ownerId: 'o1',
      date: '2025-11-19',
      openedTime: '08:30',
      closedTime: '11:30',
      siteLocation: 'Al-Ansari / Market',
      travelingKm: 1,
      workingHoursOnArrival: 3,
      jobType: 'Electricity',
      customerComplaint: 'Complete review of electrical circuits.',
      findings: 'Faulty wiring.',
      workDone: 'Rewired.',
      serviceTeam: ['Ali Saif'],
      spareParts: [],
      sparePartsInvoiceNo: '0',
      laborCost: 100000,
      travelCost: 0,
      totalBilled: 500000,
      status: 'Synced',
      comments: 'Repaired successfully'
    }
  ]
};

export const db = {
  get: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_DATA;
  },
  save: (data: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  addJobCard: (card: JobCard) => {
    const data = db.get();
    data.jobCards.unshift(card);
    const machine = data.machines.find(m => m.id === card.machineId);
    if (machine && card.workingHoursOnArrival > machine.currentHours) {
        machine.currentHours = card.workingHoursOnArrival;
    }
    db.save(data);
  },
  updateJobCard: (card: JobCard) => {
    const data = db.get();
    data.jobCards = data.jobCards.map(c => c.id === card.id ? card : c);
    const machine = data.machines.find(m => m.id === card.machineId);
    if (machine && card.workingHoursOnArrival > machine.currentHours) {
        machine.currentHours = card.workingHoursOnArrival;
    }
    db.save(data);
  },
  deleteJobCard: (id: string) => {
    const data = db.get();
    data.jobCards = data.jobCards.filter(c => c.id !== id);
    db.save(data);
  },
  addOwner: (owner: Owner) => {
    const data = db.get();
    data.owners.push(owner);
    db.save(data);
  },
  updateOwner: (owner: Owner) => {
    const data = db.get();
    data.owners = data.owners.map(o => o.id === owner.id ? owner : o);
    db.save(data);
  },
  deleteOwner: (id: string) => {
    const data = db.get();
    data.owners = data.owners.filter(o => o.id !== id);
    data.machines = data.machines.filter(m => m.ownerId !== id);
    db.save(data);
  },
  addMachine: (machine: Machine) => {
    const data = db.get();
    data.machines.push(machine);
    db.save(data);
  },
  updateMachine: (machine: Machine) => {
    const data = db.get();
    data.machines = data.machines.map(m => m.id === machine.id ? machine : m);
    db.save(data);
  },
  deleteMachine: (id: string) => {
    const data = db.get();
    data.machines = data.machines.filter(m => m.id !== id);
    db.save(data);
  }
};
