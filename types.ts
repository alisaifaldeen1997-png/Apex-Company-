
export interface SparePart {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface JobCard {
  id: string;
  jobCardNo: string;
  machineId: string;
  ownerId: string;
  date: string;
  openedTime: string;
  closedTime: string;
  siteLocation: string;
  travelingKm: number;
  workingHoursOnArrival: number;
  jobType: 'Preventive' | 'Corrective' | 'Emergency' | 'Electricity' | 'Mechanical';
  customerComplaint: string;
  findings: string;
  workDone: string;
  serviceTeam: string[];
  spareParts: SparePart[];
  sparePartsInvoiceNo: string;
  sparePartsInvoiceImage?: string; // Base64 string of the uploaded invoice
  sparePartsCostOverride?: number; // Manual override for spare parts cost
  laborCost: number;
  travelCost: number;
  totalBilled: number;
  status: 'Synced' | 'Pending';
  comments: string;
  // New fields from the PDF image
  callDate?: string;
  callTime?: string;
  promiseDate?: string;
  tel2?: string;
  areaCode?: string;
  pssr?: string;
  remarks?: string;
  supervisorSign?: string;
}

export interface Machine {
  id: string;
  serialNumber: string;
  model: string;
  type: string;
  brand: 'JCB' | 'HYUNDAI' | 'DOOSAN' | 'SHANTUI' | 'DAEWOO' | 'CUMMINS' | 'Other';
  currentHours: number;
  ownerId: string;
  lastMaintenanceDate?: string;
}

export interface Owner {
  id: string;
  name: string;
  contactNumber: string;
  areaCode?: string;
}

export interface AppData {
  machines: Machine[];
  owners: Owner[];
  jobCards: JobCard[];
}
