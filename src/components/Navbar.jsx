import React from 'react';
import { 
  Bot, PhoneCall, Filter, UserCheck, MessageSquare, 
  Settings, PlayCircle, History, Sparkles, ChevronDown, CheckCircle2 
} from 'lucide-react';

export default function Navbar({ activeSubTab, setActiveSubTab, stats }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      {/* Top Main CRM Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  Lovable CRM
                </span>
                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Engine
                </span>
              </div>
            </div>

            {/* Standard CRM Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400">
              <button className="px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition">
                Dashboard
              </button>
              <button className="px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition">
                Leads
              </button>
              <button className="px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition">
                Deals
              </button>
              <button className="px-3 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800/60 transition flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                Meta WhatsApp
              </button>

              {/* Active Highlighted Tab: AI Calling Department */}
              <div className="relative">
                <button className="px-3.5 py-1.5 rounded-lg text-white bg-indigo-600/30 border border-indigo-500/40 shadow-sm flex items-center gap-2 font-semibold">
                  <PhoneCall className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <span>AI Calling Department</span>
                  <ChevronDown className="h-3.5 w-3.5 text-indigo-300" />
                </button>
              </div>
            </nav>
          </div>

          {/* Quick System Status Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-medium">Meta WhatsApp Ready</span>
              <span className="text-slate-600">|</span>
              <span className="text-indigo-400 font-medium">Voice AI Vapi Active</span>
            </div>
            <button 
              onClick={() => setActiveSubTab('simulator')}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Test Live Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation inside AI Calling Department */}
      <div className="border-t border-slate-800/80 bg-slate-900/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          <SubTabButton 
            id="overview" 
            label="Overview & Flow" 
            icon={Bot} 
            active={activeSubTab === 'overview'} 
            onClick={setActiveSubTab} 
          />
          <SubTabButton 
            id="filter" 
            label="Lead Quality Filters" 
            icon={Filter} 
            badge="AI Guard"
            active={activeSubTab === 'filter'} 
            onClick={setActiveSubTab} 
          />
          <SubTabButton 
            id="handover" 
            label="Human Handover & WhatsApp" 
            icon={UserCheck} 
            badge="Whisper"
            active={activeSubTab === 'handover'} 
            onClick={setActiveSubTab} 
          />
          <SubTabButton 
            id="voice" 
            label="Voice & Persona Studio" 
            icon={Sparkles} 
            active={activeSubTab === 'voice'} 
            onClick={setActiveSubTab} 
          />
          <SubTabButton 
            id="simulator" 
            label="Interactive Call Sandbox" 
            icon={PlayCircle} 
            badge="Demo"
            active={activeSubTab === 'simulator'} 
            onClick={setActiveSubTab} 
          />
          <SubTabButton 
            id="history" 
            label="Call Logs & Recordings" 
            icon={History} 
            active={activeSubTab === 'history'} 
            onClick={setActiveSubTab} 
          />
        </div>
      </div>
    </header>
  );
}

function SubTabButton({ id, label, icon: Icon, badge, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
        active 
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
      <span>{label}</span>
      {badge && (
        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
          active ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-300 border border-slate-700'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
