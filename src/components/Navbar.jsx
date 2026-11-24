import React from 'react';
import { 
  PhoneCall, ShieldCheck, UserCheck, Sparkles, 
  PlayCircle, History, MessageSquare, CheckCircle2 
} from 'lucide-react';

export default function Navbar({ activeSubTab, setActiveSubTab, handoverConfig }) {
  const isConfigured = Boolean(handoverConfig?.executivePhone && handoverConfig?.executiveWhatsApp);

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/95 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <PhoneCall className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">AI Calling</span>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/60">
                  CRM Suite
                </span>
              </div>
            </div>
          </div>

          {/* Clean Main Tabs */}
          <nav className="flex items-center gap-1">
            <TabItem 
              id="handover" 
              label="Setup Numbers" 
              icon={UserCheck} 
              active={activeSubTab === 'handover'} 
              onClick={setActiveSubTab} 
              highlight={!isConfigured}
            />
            <TabItem 
              id="simulator" 
              label="Test Call" 
              icon={PlayCircle} 
              active={activeSubTab === 'simulator'} 
              onClick={setActiveSubTab} 
            />
            <TabItem 
              id="filter" 
              label="Quality Filters" 
              icon={ShieldCheck} 
              active={activeSubTab === 'filter'} 
              onClick={setActiveSubTab} 
            />
            <TabItem 
              id="voice" 
              label="Voice & Script" 
              icon={Sparkles} 
              active={activeSubTab === 'voice'} 
              onClick={setActiveSubTab} 
            />
            <TabItem 
              id="history" 
              label="Call History" 
              icon={History} 
              active={activeSubTab === 'history'} 
              onClick={setActiveSubTab} 
            />
          </nav>

          {/* Right Status */}
          <div className="hidden md:flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              isConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {isConfigured ? 'Numbers Active' : 'Setup Required'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function TabItem({ id, label, icon: Icon, active, onClick, highlight }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
        active 
          ? 'bg-indigo-600 text-white shadow-sm' 
          : highlight
          ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20'
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
