import React from 'react';
import { 
  PhoneCall, ShieldCheck, UserCheck, MessageSquare, 
  ArrowRight, Sparkles, CheckCircle2, XCircle, Zap, Clock 
} from 'lucide-react';

export default function OverviewView({ setActiveSubTab }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous Voice Sales & Qualification System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Calling Department · Direct CRM Command Center
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Yeh module aapke CRM ka full-time AI Sales Executive hai. Inbound & Outbound calls handle karta hai, 
            <strong className="text-emerald-400 font-semibold"> real-time quality filters</strong> se junk leads alag karta hai, aur transfer se pehle 
            <strong className="text-emerald-400 font-semibold"> aapke WhatsApp par bullet-point summary</strong> bhej kar call human agent ko connect karta hai!
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveSubTab('simulator')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <span>Test Live Transfer & WhatsApp Flow</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setActiveSubTab('filter')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              Configure Qualification Rules
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={PhoneCall}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          title="Total Calls Processed"
          value="148"
          sub="Inbound: 62 · Outbound: 86"
          trend="+28% vs yesterday"
        />
        <MetricCard 
          icon={ShieldCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          title="Quality Leads Qualified"
          value="42"
          sub="Score >= 75% passed"
          trend="28.3% Qualification Rate"
        />
        <MetricCard 
          icon={UserCheck}
          iconColor="text-violet-400"
          iconBg="bg-violet-500/10 border-violet-500/20"
          title="Human Warm Transfers"
          value="19"
          sub="With instant WhatsApp brief"
          trend="Avg 4 sec connection"
        />
        <MetricCard 
          icon={Clock}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
          title="Junk / Job Inquiries Filtered"
          value="68"
          sub="Saved 6.2 hours executive time"
          trend="Zero human fatigue"
        />
      </div>

      {/* Visual End-to-End Workflow Diagram */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-400" />
            Complete Autonomous Execution Flow (How It Works)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Har call par AI kaise decision leta hai aur human transfer ke waqt kya hota hai:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                STEP 1
              </span>
              <PhoneCall className="h-4 w-4 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">Call Initiated / Received</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              New lead CRM me aate hi instant outbound call, ya customer ka direct inbound call attend karta hai.
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              ⚡ Response: <strong>&lt; 600ms latency</strong>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                STEP 2
              </span>
              <ShieldCheck className="h-4 w-4 text-amber-400" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">AI Lead Filtering Guard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI natural baatcheet me Budget, Requirement, Timeline & Decision Maker verify karta hai.
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              🛡️ Junk words filter: <strong>Job / Spam blocked</strong>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl bg-slate-800/60 border border-emerald-500/30 p-4 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-full" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                STEP 3 (KEY!)
              </span>
              <MessageSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white text-sm">WhatsApp Whisper to Human</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Call connect hone se <strong>2 sec pehle</strong> Executive ke WhatsApp par Lead ka Name, Budget & Summary drop hota hai!
            </p>
            <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
              📲 <strong>Zero blind transfers</strong>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl bg-slate-800/60 border border-violet-500/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-violet-500/20 text-violet-300">
                STEP 4
              </span>
              <UserCheck className="h-4 w-4 text-violet-400" />
            </div>
            <h3 className="font-semibold text-white text-sm">Warm Call Connected</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executive call uthate hi bolta hai: <em>"Namaste Rahul ji, aapko 3BHK flat Gurgaon me dekhna tha..."</em> — 100% conversion!
            </p>
            <div className="text-[11px] text-violet-300 bg-violet-950/40 p-2 rounded-lg border border-violet-500/30">
              🎯 <strong>High Close Rate</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, iconColor, iconBg, title, value, sub, trend }) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`h-8 w-8 rounded-lg ${iconBg} border flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-extrabold text-white">{value}</div>
        <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
      </div>
      <div className="pt-1 text-[11px] font-medium text-emerald-400 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        <span>{trend}</span>
      </div>
    </div>
  );
}
