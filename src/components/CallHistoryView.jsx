import React, { useState } from 'react';
import { 
  History, Search, Filter, Phone, Play, Square, 
  UserCheck, ShieldAlert, MessageSquare, ChevronRight, X, Bot, User 
} from 'lucide-react';

export default function CallHistoryView({ callHistory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCall, setSelectedCall] = useState(callHistory[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredCalls = callHistory.filter(call => {
    const matchesSearch = call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          call.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' ? true : call.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-400" />
            Call History, Transcripts & Audio Recordings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete archive of every AI call, human transfers, audio recordings, and extracted lead intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lead or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-indigo-500 w-44 sm:w-56"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="all">All Outcomes</option>
            <option value="transferred">Transferred to Human</option>
            <option value="disqualified">Disqualified (Junk)</option>
            <option value="followup_whatsapp">WhatsApp Follow-up</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Call List Table (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5 font-medium">Lead Details</th>
                  <th className="p-3.5 font-medium">Type & Duration</th>
                  <th className="p-3.5 font-medium">Score</th>
                  <th className="p-3.5 font-medium">Outcome Status</th>
                  <th className="p-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCalls.map((call) => {
                  const isSelected = selectedCall?.id === call.id;
                  return (
                    <tr 
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition ${
                        isSelected ? 'bg-indigo-600/10' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{call.leadName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{call.phone}</div>
                      </td>

                      <td className="p-3.5 text-slate-300">
                        <span className="capitalize">{call.type}</span>
                        <div className="text-[10px] text-slate-400">{call.duration}</div>
                      </td>

                      <td className="p-3.5">
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          call.qualityScore >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          call.qualityScore > 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {call.qualityScore}%
                        </span>
                      </td>

                      <td className="p-3.5">
                        {call.status === 'transferred' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md font-medium">
                            <UserCheck className="h-3 w-3" />
                            Transferred + WA
                          </span>
                        )}
                        {call.status === 'disqualified' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-md font-medium">
                            <ShieldAlert className="h-3 w-3" />
                            Disqualified
                          </span>
                        )}
                        {call.status === 'followup_whatsapp' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-md font-medium">
                            <MessageSquare className="h-3 w-3" />
                            WhatsApp Followup
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <ChevronRight className={`h-4 w-4 inline-block ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Detailed Call Intelligence & Audio Waveform (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedCall ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedCall.leadName}</h3>
                  <div className="text-xs text-slate-400 font-mono">{selectedCall.phone} · {selectedCall.timestamp}</div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  selectedCall.qualityScore >= 75 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}>
                  Score {selectedCall.qualityScore}%
                </span>
              </div>

              {/* Simulated Audio Player */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <Phone className="h-3.5 w-3.5 text-indigo-400" />
                    Recording ({selectedCall.duration})
                  </span>
                  <span className="text-[10px] font-mono">16kHz High Quality</span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow transition cursor-pointer"
                  >
                    {isPlayingAudio ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>

                  {/* Simulated Waveform Bars */}
                  <div className="flex-1 flex items-center gap-1 h-8">
                    {[30, 60, 45, 80, 95, 40, 70, 85, 50, 65, 90, 40, 75, 60, 85, 30, 50, 70].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-1 rounded-full transition-all ${
                          isPlayingAudio ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Extracted Intelligence Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Identified Budget</span>
                  <strong className="text-slate-100">{selectedCall.budget}</strong>
                </div>
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Purchase Timeline</span>
                  <strong className="text-slate-100">{selectedCall.timeline}</strong>
                </div>
              </div>

              {/* AI Summary */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">AI Call Summary:</span>
                <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  {selectedCall.summary}
                </p>
              </div>

              {/* Full Transcript */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Full Conversation Transcript:</span>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {selectedCall.transcript.map((line, idx) => (
                    <div key={idx} className="text-xs flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                      <span className={`font-bold shrink-0 text-[10px] px-1.5 py-0.2 rounded ${
                        line.speaker === 'AI' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {line.speaker}
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{line.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-500 text-xs">
              Select a call to view full details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
