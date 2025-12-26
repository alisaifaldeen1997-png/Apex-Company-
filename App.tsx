
import React, { useState, useEffect, useCallback } from 'react';
import { AppData, JobCard, Machine, Owner } from './types';
import { db } from './services/db';
import { Dashboard } from './components/Dashboard';
import { JobCardForm } from './components/JobCardForm';
import { MachineList } from './components/MachineList';
import { OwnerList } from './components/OwnerList';
import { OwnerForm } from './components/OwnerForm';
import { MachineForm } from './components/MachineForm';
import { MonthlyReport } from './components/MonthlyReport';
import { PrintJobCard } from './components/PrintJobCard';
import { analyzeMaintenance } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<AppData>(db.get());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'machines' | 'owners' | 'jobs' | 'reports'>('dashboard');
  const [overlayForm, setOverlayForm] = useState<'job' | 'owner' | 'machine' | 'print' | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [editingJob, setEditingJob] = useState<JobCard | undefined>(undefined);
  const [editingMachine, setEditingMachine] = useState<Machine | undefined>(undefined);
  const [editingOwner, setEditingOwner] = useState<Owner | undefined>(undefined);
  
  // Date Filtering State for Reports
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // First day of current month
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const refreshData = useCallback(() => {
    setData(db.get());
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const currentData = db.get();
      const updatedJobCards = currentData.jobCards.map(c => ({ ...c, status: 'Synced' as const }));
      db.save({ ...currentData, jobCards: updatedJobCards });
      refreshData();
      setIsSyncing(false);
    }, 1000);
  };

  const generateAIInsight = async () => {
    setLoadingAnalysis(true);
    const insight = await analyzeMaintenance(data.jobCards, data.machines);
    setGeminiAnalysis(insight);
    setLoadingAnalysis(false);
  };

  const handlePrint = (job: JobCard) => {
    setSelectedJob(job);
    setOverlayForm('print');
    setTimeout(() => {
       window.print();
    }, 300);
  };

  const triggerEditMachine = (m: Machine) => {
    setEditingMachine(m);
    setOverlayForm('machine');
  };

  const triggerEditOwner = (o: Owner) => {
    setEditingOwner(o);
    setOverlayForm('owner');
  };

  const triggerEditJob = (j: JobCard) => {
    setEditingJob(j);
    setOverlayForm('job');
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Delete this maintenance record permanently?')) {
      db.deleteJobCard(id);
      refreshData();
    }
  };

  const handleUpdateJobCost = (job: JobCard, newSpareCost: number) => {
    const updatedJob = { ...job, sparePartsCostOverride: newSpareCost };
    db.updateJobCard(updatedJob);
    refreshData();
  };

  const closeOverlay = () => {
    setOverlayForm(null);
    setEditingMachine(undefined);
    setEditingOwner(undefined);
    setEditingJob(undefined);
    setSelectedJob(null);
  };

  // Filtered Job Cards based on selected date range
  const filteredJobCards = data.jobCards.filter(job => {
    const jobDate = new Date(job.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Setting time to zero to compare dates only
    jobDate.setHours(0,0,0,0);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);
    return jobDate >= start && jobDate <= end;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 font-sans print:bg-white print:p-0">
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-3 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-black">A</div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-slate-800 leading-tight">APEX SOLUTIONS</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Maintenance System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOverlayForm('owner')} className="text-xs bg-slate-100 px-3 py-1.5 rounded font-bold hover:bg-slate-200 transition">+ Client</button>
            <button onClick={() => setOverlayForm('machine')} className="text-xs bg-slate-100 px-3 py-1.5 rounded font-bold hover:bg-slate-200 transition">+ Machine</button>
            <button onClick={() => setOverlayForm('job')} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded font-bold shadow-md hover:bg-blue-700 transition">+ Job Card</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 print:p-0">
        {overlayForm === 'job' && <JobCardForm initialData={editingJob} machines={data.machines} owners={data.owners} onCancel={closeOverlay} onComplete={() => {closeOverlay(); refreshData();}} />}
        {overlayForm === 'owner' && <OwnerForm initialData={editingOwner} onCancel={closeOverlay} onComplete={() => {closeOverlay(); refreshData();}} />}
        {overlayForm === 'machine' && <MachineForm initialData={editingMachine} owners={data.owners} onCancel={closeOverlay} onComplete={() => {closeOverlay(); refreshData();}} />}
        
        {overlayForm === 'print' && selectedJob && (
          <div className="space-y-4">
             <div className="flex justify-between items-center print:hidden bg-blue-50 p-4 rounded-xl border border-blue-200">
                <span className="text-sm font-bold text-blue-700">Printing Preview: {selectedJob.jobCardNo}</span>
                <button onClick={closeOverlay} className="px-4 py-1.5 bg-white border rounded text-xs font-bold shadow-sm hover:bg-slate-50 transition">Close Preview</button>
             </div>
             <PrintJobCard 
               job={selectedJob} 
               machine={data.machines.find(m => m.id === selectedJob.machineId)} 
               owner={data.owners.find(o => o.id === selectedJob.ownerId)} 
             />
          </div>
        )}

        {!overlayForm && (
          <>
            <nav className="flex gap-2 mb-6 border-b overflow-x-auto whitespace-nowrap scrollbar-hide">
              {[
                { label: 'Dashboard', id: 'dashboard' },
                { label: 'Fleet', id: 'machines' },
                { label: 'Clients', id: 'owners' },
                { label: 'Logs', id: 'jobs' },
                { label: 'Reports', id: 'reports' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t" />}
                </button>
              ))}
            </nav>

            {activeTab === 'dashboard' && <Dashboard data={data} />}
            {activeTab === 'machines' && <MachineList machines={data.machines} owners={data.owners} onEdit={triggerEditMachine} onRefresh={refreshData} />}
            {activeTab === 'owners' && <OwnerList owners={data.owners} machines={data.machines} onEdit={triggerEditOwner} onRefresh={refreshData} />}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-lg font-bold text-slate-800">All Service Activity</h2>
                  <p className="text-xs text-slate-400 font-medium">{data.jobCards.length} total records</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {data.jobCards.map(card => {
                    const machine = data.machines.find(m => m.id === card.machineId);
                    return (
                      <div key={card.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm hover:border-blue-200 transition-all">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{card.jobCardNo} - {machine?.model}</h4>
                          <p className="text-xs text-slate-500">{card.date} • {card.jobType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-2 hidden sm:block">
                            <p className="font-bold text-blue-600">${card.totalBilled.toLocaleString()}</p>
                            <p className="text-[10px] uppercase font-bold text-slate-400">{card.status}</p>
                          </div>
                          <button onClick={() => triggerEditJob(card)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => handlePrint(card)} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg border transition-colors" title="Print PDF">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                          </button>
                          <button onClick={() => handleDeleteJob(card.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Financial Performance Report</h2>
                    <p className="text-sm text-slate-500">Analyze your maintenance revenue and costs over time.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={generateAIInsight}
                      className="bg-indigo-600 text-white px-4 py-2 rounded font-bold text-xs shadow hover:bg-indigo-700 disabled:opacity-50 transition-all"
                      disabled={loadingAnalysis}
                    >
                      {loadingAnalysis ? 'AI Analyzing...' : '✨ AI Insight'}
                    </button>
                    <button onClick={handleSync} className="bg-emerald-600 text-white px-4 py-2 rounded font-bold text-xs shadow hover:bg-emerald-700 transition-all">Cloud Sync</button>
                  </div>
                </div>

                {geminiAnalysis && (
                  <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl print:hidden animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                       <span className="text-lg">🤖</span> AI Fleet Analysis
                    </h3>
                    <div className="text-sm text-indigo-800 leading-relaxed whitespace-pre-wrap">{geminiAnalysis}</div>
                  </div>
                )}

                <MonthlyReport 
                  jobCards={filteredJobCards} 
                  engineerName="Ali Saif" 
                  startDate={startDate}
                  endDate={endDate}
                  onDateChange={(s, e) => { setStartDate(s); setEndDate(e); }}
                  onEditJob={triggerEditJob}
                  onDeleteJob={handleDeleteJob}
                  onUpdateJobCost={handleUpdateJobCost}
                />
              </div>
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden flex justify-around items-center h-16 z-50 shadow-2xl print:hidden">
        {[
          { label: 'Dash', id: 'dashboard' },
          { label: 'Fleet', id: 'machines' },
          { label: 'Clients', id: 'owners' },
          { label: 'Report', id: 'reports' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => {setActiveTab(item.id as any); setOverlayForm(null);}} 
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
