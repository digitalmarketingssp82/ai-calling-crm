import React, { useState } from 'react';
import { 
  Filter, ShieldAlert, CheckCircle2, XCircle, Plus, 
  Trash2, HelpCircle, Save, Sparkles, AlertCircle 
} from 'lucide-react';

export default function LeadFilterView({ rules, setRules, onSave }) {
  const [newKeyword, setNewKeyword] = useState('');
  const [testBudget, setTestBudget] = useState(3000000);
  const [testTimeline, setTestTimeline] = useState(30);
  const [testDecisionMaker, setTestDecisionMaker] = useState(true);
  const [testRemarks, setTestRemarks] = useState('Looking for 3BHK to buy in next month');

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !rules.disallowedKeywords.includes(newKeyword.trim().toLowerCase())) {
      setRules({
        ...rules,
        disallowedKeywords: [...rules.disallowedKeywords, newKeyword.trim().toLowerCase()]
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setRules({
      ...rules,
      disallowedKeywords: rules.disallowedKeywords.filter(k => k !== keyword)
    });
  };

  // Live test evaluation
  const isBudgetPass = testBudget >= rules.minBudget;
  const isTimelinePass = testTimeline <= rules.maxTimelineDays;
  const isDecisionPass = !rules.requireDecisionMaker || testDecisionMaker;
  const matchedJunkWord = rules.disallowedKeywords.find(k => 
    testRemarks.toLowerCase().includes(k)
  );

  let calculatedScore = 100;
  if (!isBudgetPass) calculatedScore -= 40;
  if (!isTimelinePass) calculatedScore -= 20;
  if (!isDecisionPass) calculatedScore -= 20;
  if (matchedJunkWord) calculatedScore = 10;

  const isQualified = calculatedScore >= rules.minScoreThreshold && !matchedJunkWord;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-400" />
            Lead Quality Filtering Engine (AI Guard)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Set criteria for which leads qualify for live Human Transfer. AI will automatically filter out fake or low-intent calls.
          </p>
        </div>
        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>Save Filter Rules</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Filter Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Budget & Score Threshold */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Financial & Intent Thresholds
            </h3>

            {/* Minimum Budget */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300 font-medium">Minimum Budget Required</label>
                <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  ₹{(rules.minBudget / 100000).toFixed(1)} Lakhs ({rules.minBudget.toLocaleString('en-IN')})
                </span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="10000000" 
                step="500000"
                value={rules.minBudget}
                onChange={(e) => setRules({ ...rules, minBudget: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Is amount se kam budget wali leads ko AI seedha human ko transfer nahi karega, balki WhatsApp follow-up me daal dega.
              </p>
            </div>

            {/* Score Threshold */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300 font-medium">Minimum AI Quality Score for Transfer</label>
                <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {rules.minScoreThreshold}% Score
                </span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="95" 
                step="5"
                value={rules.minScoreThreshold}
                onChange={(e) => setRules({ ...rules, minScoreThreshold: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                AI overall conversation, budget clarity, aur urgency ko analyze karke 0-100 score banata hai.
              </p>
            </div>

            {/* Timeline & Decision Maker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Purchase / Action Timeline</label>
                <select
                  value={rules.maxTimelineDays}
                  onChange={(e) => setRules({ ...rules, maxTimelineDays: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-indigo-500 outline-none"
                >
                  <option value={15}>Within 15 days (Urgent buyers only)</option>
                  <option value={30}>Within 30 days (High intent)</option>
                  <option value={60}>Within 60 days (Standard pipeline)</option>
                  <option value={90}>Within 90 days (Long term)</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-xs text-slate-300 font-medium">Decision Maker Verification</label>
                <div 
                  onClick={() => setRules({ ...rules, requireDecisionMaker: !rules.requireDecisionMaker })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition ${
                    rules.requireDecisionMaker 
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-slate-100' 
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-xs">Must be Self / Key Decision Maker</span>
                  <div className={`h-4 w-7 rounded-full p-0.5 transition ${rules.requireDecisionMaker ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    <div className={`h-3 w-3 rounded-full bg-white transition transform ${rules.requireDecisionMaker ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Disallowed / Junk Keywords */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  Disqualification & Junk Words (Instant Rejection)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Agar customer inme se koi bhi word bolega, toh AI kabhi bhi human agent ko transfer nahi karega.
                </p>
              </div>
            </div>

            {/* Keyword Input */}
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Type negative keyword (e.g. loan, donation, vendor)..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-rose-500"
              />
              <button
                onClick={handleAddKeyword}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Word</span>
              </button>
            </div>

            {/* Badges list */}
            <div className="flex flex-wrap gap-2 pt-2">
              {rules.disallowedKeywords.map((word) => (
                <span 
                  key={word}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs"
                >
                  <span>{word}</span>
                  <button 
                    onClick={() => handleRemoveKeyword(word)}
                    className="hover:text-rose-100 transition cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Filter Rule Tester */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-indigo-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Test Filter Engine Live
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                Sandbox
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Neeche sample lead data badal kar dekhein ki aapke current rules use pass karte hain ya reject karte hain:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Lead ka Budget</label>
                <select
                  value={testBudget}
                  onChange={(e) => setTestBudget(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value={1500000}>₹15 Lakhs (Low Budget)</option>
                  <option value={3000000}>₹30 Lakhs (Moderate Budget)</option>
                  <option value={8000000}>₹80 Lakhs (High Budget)</option>
                  <option value={15000000}>₹1.5 Crore (Luxury)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Timeline</label>
                <select
                  value={testTimeline}
                  onChange={(e) => setTestTimeline(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value={15}>Within 15 days</option>
                  <option value={30}>Within 30 days</option>
                  <option value={90}>Within 90+ days</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Caller Remarks / Words Spoken</label>
                <input
                  type="text"
                  value={testRemarks}
                  onChange={(e) => setTestRemarks(e.target.value)}
                  placeholder="e.g. Need 3BHK flat"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>

            {/* Test Result Verdict Box */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isQualified 
                ? 'bg-emerald-950/40 border-emerald-500/40' 
                : 'bg-rose-950/40 border-rose-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">AI Evaluation Verdict:</span>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                  isQualified ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                }`}>
                  {isQualified ? 'QUALIFIED FOR HUMAN ✅' : 'DISQUALIFIED / JUNK ❌'}
                </span>
              </div>

              <div className="text-[11px] space-y-1 text-slate-300 pt-1">
                <div className="flex justify-between">
                  <span>Calculated AI Score:</span>
                  <strong className={isQualified ? 'text-emerald-400' : 'text-rose-400'}>
                    {calculatedScore}%
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Budget Verification:</span>
                  <span>{isBudgetPass ? '✅ Passed' : '❌ Below Threshold'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Junk Word Detected:</span>
                  <span>{matchedJunkWord ? `❌ Found ("${matchedJunkWord}")` : '✅ None'}</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                {isQualified 
                  ? '⚡ Transfer will trigger instant WhatsApp alert to executive and bridge call.'
                  : '🛑 AI will politely decline and NOT ring the human executive.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
