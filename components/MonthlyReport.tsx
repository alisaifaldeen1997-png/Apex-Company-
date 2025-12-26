
import React from 'react';
import { JobCard } from '../types';

interface MonthlyReportProps {
  jobCards: JobCard[];
  engineerName: string;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
  onEditJob: (job: JobCard) => void;
  onDeleteJob: (id: string) => void;
  onUpdateJobCost: (job: JobCard, newSpareCost: number) => void;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ 
  jobCards, 
  engineerName, 
  startDate, 
  endDate, 
  onDateChange,
  onEditJob,
  onDeleteJob,
  onUpdateJobCost
}) => {
  const getPartsCost = (job: JobCard) => {
    return job.sparePartsCostOverride !== undefined 
      ? job.sparePartsCostOverride 
      : job.spareParts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
  };

  const totalNetCost = jobCards.reduce((acc, j) => {
    const partsTotal = getPartsCost(j);
    const net = j.totalBilled - (j.laborCost + j.travelCost + partsTotal);
    return acc + net;
  }, 0);

  const totalPartsCost = jobCards.reduce((acc, j) => {
    return acc + getPartsCost(j);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1">REPORT START DATE</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
              value={startDate} 
              onChange={(e) => onDateChange(e.target.value, endDate)} 
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 mb-1">REPORT END DATE</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
              value={endDate} 
              onChange={(e) => onDateChange(startDate, e.target.value)} 
            />
          </div>
          <button 
            onClick={() => window.print()}
            className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-700 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Print Report
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 font-medium">* Showing {jobCards.length} records in this date range.</p>
      </div>

      <div className="bg-white p-8 rounded shadow-sm border overflow-x-auto min-w-[800px] font-sans text-xs print:shadow-none print:border-none print:p-0 print:m-0">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Apex Integrated Solutions Company</h1>
            <p className="text-slate-600">Monthly maintenance report</p>
          </div>
          <div className="text-right">
             <p className="font-bold">ENG: <span className="font-normal border-b px-2">{engineerName}</span></p>
             <p className="font-bold">Period: <span className="font-normal border-b px-2">{startDate} to {endDate}</span></p>
          </div>
        </div>

        <table className="w-full border-collapse border border-slate-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-slate-300 p-2 text-left">JOB ID</th>
              <th className="border border-slate-300 p-2 text-left">Invoice</th>
              <th className="border border-slate-300 p-2 text-left">Parts Cost</th>
              <th className="border border-slate-300 p-2 text-left">Expenses</th>
              <th className="border border-slate-300 p-2 text-left">Revenue</th>
              <th className="border border-slate-300 p-2 text-left">Net</th>
              <th className="border border-slate-300 p-2 text-left">Comments</th>
              <th className="border border-slate-300 p-2 text-center print:hidden">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobCards.map((job) => {
              const partsCost = getPartsCost(job);
              const jobExpenses = job.laborCost + job.travelCost;
              const netCost = job.totalBilled - (partsCost + jobExpenses);
              return (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="border border-slate-300 p-2 font-medium">{job.jobCardNo}</td>
                  <td className="border border-slate-300 p-2">
                    {job.sparePartsInvoiceNo}
                    {job.sparePartsInvoiceImage && (
                      <span className="ml-2 inline-block w-2 h-2 rounded-full bg-emerald-500" title="Attached"></span>
                    )}
                  </td>
                  <td className="border border-slate-300 p-2 text-right">
                    <input 
                      type="number"
                      className="w-20 p-1 border rounded text-right bg-transparent focus:bg-white print:border-none print:bg-transparent"
                      value={partsCost}
                      onChange={(e) => onUpdateJobCost(job, Number(e.target.value))}
                    />
                  </td>
                  <td className="border border-slate-300 p-2 text-right">{jobExpenses.toLocaleString()}</td>
                  <td className="border border-slate-300 p-2 text-right font-bold">{job.totalBilled.toLocaleString()}</td>
                  <td className="border border-slate-300 p-2 text-right font-bold text-blue-600">{netCost.toLocaleString()}</td>
                  <td className="border border-slate-300 p-2 text-slate-500 italic max-w-[200px] truncate">{job.comments}</td>
                  <td className="border border-slate-300 p-2 text-center print:hidden">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => onEditJob(job)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => onDeleteJob(job.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {jobCards.length === 0 && (
              <tr>
                <td colSpan={8} className="border border-slate-300 p-8 text-center text-slate-400 italic">No records found for the selected dates.</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td colSpan={5} className="border border-slate-300 p-2 font-bold text-right">Total Net Revenue</td>
              <td className="border border-slate-300 p-2 font-bold text-blue-600 text-right">{totalNetCost.toLocaleString()}</td>
              <td className="border border-slate-300 p-2" colSpan={2}></td>
            </tr>
            <tr>
              <td colSpan={5} className="border border-slate-300 p-2 font-bold text-right">Total Spare Parts Investment</td>
              <td className="border border-slate-300 p-2 font-bold text-red-600 text-right">{totalPartsCost.toLocaleString()}</td>
              <td className="border border-slate-300 p-2" colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
