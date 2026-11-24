import React, { useState } from 'react';
import { ShieldCheck, Plus, X, Save, AlertCircle } from 'lucide-react';

export default function LeadFilterView({ rules, setRules, onSave }) {
  const [newKeyword, setNewKeyword] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Lead Quality Filters</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rules set karein taaki AI sirf verified aur serious leads ko hi aapke phone par transfer kare.
          </p>
        </div>

        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Filters</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* Card 1: Budget & Timeline */}
        <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Qualification Thresholds</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Minimum Budget */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Minimum Budget to Transfer</span>
                <span className="font-bold text-indigo-400 font-mono">
                  ₹{(rules.minBudget / 100000).toFixed(0)} Lakhs
                </span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="10000000" 
                step="500000"
                value={rules.minBudget}
                onChange={(e) => setRules({ ...rules, minBudget: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                Isse kam budget hone par AI aapka phone disturb nahi karega.
              </span>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">Required Buying Timeline</label>
              <select
                value={rules.maxTimelineDays}
                onChange={(e) => setRules({ ...rules, maxTimelineDays: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500"
              >
                <option value={15}>Within 15 days (Urgent only)</option>
                <option value={30}>Within 30 days (Standard)</option>
                <option value={60}>Within 60 days (Flexible)</option>
                <option value={90}>Any timeline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Junk & Negative Keywords */}
        <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-5 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Negative / Junk Keywords (Auto-Reject)</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Agar caller inme se koi word bolega (jaise job ya loan), AI transfer cancel kar dega.
            </p>
          </div>

          {/* Add input */}
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder="Add keyword (e.g. job, loan, vendor)..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              className="flex-1 bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddKeyword}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg transition cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Badges list */}
          <div className="flex flex-wrap gap-2 pt-1">
            {rules.disallowedKeywords.map((word) => (
              <span 
                key={word}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs"
              >
                <span>{word}</span>
                <button 
                  onClick={() => handleRemoveKeyword(word)}
                  className="hover:text-rose-100 transition cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
