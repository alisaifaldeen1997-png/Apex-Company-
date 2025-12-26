
import React from 'react';
import { JobCard, Machine, Owner } from '../types';

interface PrintJobCardProps {
  job: JobCard;
  machine?: Machine;
  owner?: Owner;
}

export const PrintJobCard: React.FC<PrintJobCardProps> = ({ job, machine, owner }) => {
  return (
    <div className="bg-white p-4 max-w-[210mm] mx-auto text-[10px] font-sans text-slate-900 border border-slate-300 print:border-none print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
           <div className="text-2xl font-black text-blue-900 flex flex-col leading-none">
             <span>APEX</span>
             <span className="text-[8px] tracking-[0.2em] font-medium text-slate-500">INTEGRATED SOLUTIONS</span>
           </div>
        </div>
      </div>

      <h1 className="text-lg font-black uppercase mb-2 border-b-2 border-slate-900">Job Card</h1>

      {/* Main Info Grid Table */}
      <table className="w-full border-collapse border border-slate-900 mb-0">
        <tbody>
          <tr>
            <td className="border border-slate-900 p-1 font-bold w-1/6 bg-slate-50">Model</td>
            <td className="border border-slate-900 p-1 w-1/6">{machine?.model || job.jobType}</td>
            <td className="border border-slate-900 p-1 font-bold w-1/6 bg-slate-50">Job Card No.</td>
            <td className="border border-slate-900 p-1 w-1/6 font-bold">{job.jobCardNo}</td>
            <td className="border border-slate-900 p-1 font-bold w-1/6 bg-slate-50">Call date</td>
            <td className="border border-slate-900 p-1 w-1/6">{job.callDate || job.date}</td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">M/C Serial</td>
            <td className="border border-slate-900 p-1">{machine?.serialNumber}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Promise date</td>
            <td className="border border-slate-900 p-1">{job.promiseDate}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Call time</td>
            <td className="border border-slate-900 p-1">{job.callTime}</td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">MC Hours</td>
            <td className="border border-slate-900 p-1">{machine?.currentHours}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Job Opened Date</td>
            <td className="border border-slate-900 p-1">{job.date}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Job Opened Time</td>
            <td className="border border-slate-900 p-1">{job.openedTime}</td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Site Location</td>
            <td className="border border-slate-900 p-1">{job.siteLocation}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Job Closed Date</td>
            <td className="border border-slate-900 p-1">{job.date}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Job Closed Time</td>
            <td className="border border-slate-900 p-1">{job.closedTime}</td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Customer Name</td>
            <td className="border border-slate-900 p-1">{owner?.name}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Traveling K M</td>
            <td className="border border-slate-900 p-1">{job.travelingKm}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Working Hours</td>
            <td className="border border-slate-900 p-1">{job.workingHoursOnArrival}</td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Customer Contact</td>
            <td className="border border-slate-900 p-1 text-red-600 font-bold">{owner?.contactNumber}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Tel 2</td>
            <td className="border border-slate-900 p-1">{job.tel2}</td>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Area Cod</td>
            <td className="border border-slate-900 p-1">{job.areaCode || '+249'}</td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1 font-bold bg-slate-50">Tel 1</td>
            <td className="border border-slate-900 p-1">{owner?.contactNumber}</td>
            <td colSpan={2} className="border border-slate-900 p-1 font-bold bg-slate-50 text-right">PSSR :</td>
            <td colSpan={2} className="border border-slate-900 p-1">{job.pssr}</td>
          </tr>
        </tbody>
      </table>

      {/* Narrative sections */}
      <div className="border-x border-b border-slate-900">
        <div className="flex border-b border-slate-900">
          <div className="w-1/2 p-1 border-r border-slate-900">
            <p className="font-bold underline mb-1">Customer Complaint:-</p>
            <p className="min-h-[40px] italic">{job.customerComplaint}</p>
          </div>
          <div className="w-1/2 p-1 flex items-start gap-4">
            <span className="font-bold">Job type:</span>
            <span className="font-bold text-slate-700">{job.jobType}</span>
          </div>
        </div>

        <div className="p-1 border-b border-slate-900">
          <p className="font-bold underline mb-1 italic">What Did You Find Wrong ?</p>
          <p className="min-h-[40px]">{job.findings}</p>
        </div>

        <div className="p-1 border-b border-slate-900">
          <div className="flex justify-between items-center mb-1">
             <p className="font-bold underline italic">work done:-</p>
             <p className="font-bold text-[8px] uppercase">(Must include full details of defect)</p>
          </div>
          <p className="min-h-[120px] whitespace-pre-wrap">{job.workDone}</p>
        </div>

        <div className="p-1">
          <p className="font-bold underline mb-1">Remarks and walk around inspection check :-</p>
          <p className="min-h-[50px]">{job.remarks}</p>
        </div>
      </div>

      <p className="mt-2 text-[8px] font-bold">Service Department Comment on the Job</p>
      
      {/* Bottom Signatures */}
      <div className="mt-4 flex justify-between gap-8">
        <div className="w-1/2 space-y-2">
          <p className="font-bold underline">Service Team</p>
          <div className="flex items-center gap-2">
            <span>1-</span> <div className="flex-1 border-b border-dotted border-slate-400 h-4">{job.serviceTeam[0]}</div>
          </div>
          <div className="flex items-center gap-2">
            <span>2-</span> <div className="flex-1 border-b border-dotted border-slate-400 h-4">{job.serviceTeam[1]}</div>
          </div>
          <div className="flex items-center gap-2">
            <span>3-</span> <div className="flex-1 border-b border-dotted border-slate-400 h-4">{job.serviceTeam[2]}</div>
          </div>
          <div className="pt-4 flex items-center gap-2">
            <span className="font-bold">Supervisor Eng Sign</span>
            <div className="flex-1 border-b border-slate-900 h-4"></div>
          </div>
        </div>

        <div className="w-1/2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-bold">Customer Name :</span>
            <div className="flex-1 border-b border-slate-400 h-4">{owner?.name}</div>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <span className="font-bold">Customer Sign :</span>
            <div className="flex-1 border-b border-slate-400 h-8"></div>
          </div>
        </div>
      </div>

      {/* Footer Brands */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center opacity-70">
        <span className="font-bold text-slate-400">HYUNDAI</span>
        <span className="font-bold text-slate-400">DOOSAN</span>
        <span className="font-bold text-slate-400 text-sm">JCB</span>
        <span className="font-bold text-slate-400">SHANTUI</span>
        <span className="font-bold text-slate-400">DAEWOO</span>
        <span className="font-bold text-slate-400 italic">Cummins</span>
      </div>
    </div>
  );
};
