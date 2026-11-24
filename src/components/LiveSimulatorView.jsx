import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, PhoneCall, PhoneForwarded, MessageSquare, 
  Volume2, VolumeX, RotateCcw, Bot, User, CheckCircle2 
} from 'lucide-react';

export default function LiveSimulatorView({ rules, handoverConfig, voiceConfig, onTriggerWhatsApp }) {
  const [customLeadName, setCustomLeadName] = useState('Rahul Test');
  const [customLeadPhone, setCustomLeadPhone] = useState('+91 98765 00000');
  const [customBudget, setCustomBudget] = useState(3500000);

  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, evaluating, transferring, bridged, ended
  const [messages, setMessages] = useState([]);
  const [executiveAlertReceived, setExecutiveAlertReceived] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef(null);

  const speakText = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceConfig?.speakingRate || 1.0;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (match) utterance.voice = match;
    window.speechSynthesis.speak(utterance);
  };

  const startCustomCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ringing');
    setMessages([]);
    setExecutiveAlertReceived(false);

    const isQualified = customBudget >= rules.minBudget;

    const flow = [
      { speaker: 'ai', text: `Namaste ${customLeadName} ji! Main ${voiceConfig.agentName} baat kar rahi hoon aapke CRM se. Aapne inquiry ki thi.` },
      { speaker: 'lead', text: `Haan ji, mujhe property options dekhne the. Detailed information chahiye.` },
      { speaker: 'ai', text: `Zaroor sir! Iske liye aapka approximate budget kya rahega?` },
      { speaker: 'lead', text: `Mera budget around ₹${(customBudget / 100000).toFixed(0)} Lakhs hai, ready to buy hoon.` },
      { 
        speaker: 'ai', 
        text: isQualified 
          ? `Perfect! Requirement match ho gayi hai. Main abhi aapko hamare manager ${handoverConfig.executiveName || ''} (${handoverConfig.executivePhone || 'your phone'}) se live connect kar rahi hoon!`
          : `Samajh sakti hoon sir. Hamara minimum budget ₹${(rules.minBudget / 100000).toFixed(0)}L hai. Main aapke WhatsApp par brochure bhej deti hoon.`
      }
    ];

    setTimeout(() => {
      setCallState('connected');
      playTurnByTurn(flow, 0, isQualified);
    }, 1000);
  };

  const playTurnByTurn = (flow, index, isQualified) => {
    if (index >= flow.length) {
      if (isQualified) {
        setCallState('transferring');
        setExecutiveAlertReceived(true);
        if (onTriggerWhatsApp) onTriggerWhatsApp();

        setTimeout(() => {
          setCallState('bridged');
          speakText(`Connecting ${customLeadName} to your phone now.`);
        }, 2000);
      } else {
        setCallState('ended');
      }
      return;
    }

    const currentMsg = flow[index];
    setMessages((prev) => [...prev, currentMsg]);

    if (currentMsg.speaker === 'ai') {
      speakText(currentMsg.text);
    }

    setTimeout(() => {
      playTurnByTurn(flow, index + 1, isQualified);
    }, 2500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Test Call Simulator</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test karein ki AI aapse kaise baat karega aur qualify hone par aapka phone kaise ring hoga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>
          <button
            onClick={startCustomCall}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Start Test Call</span>
          </button>
        </div>
      </div>

      {/* Quick Test Inputs */}
      <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Customer Name</label>
            <input
              type="text"
              value={customLeadName}
              onChange={(e) => setCustomLeadName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Customer Phone</label>
            <input
              type="text"
              value={customLeadPhone}
              onChange={(e) => setCustomLeadPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Customer Budget</label>
            <select
              value={customBudget}
              onChange={(e) => setCustomBudget(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
            >
              <option value={1500000}>₹15 Lakhs (Below Min - Reject)</option>
              <option value={3500000}>₹35 Lakhs (Qualifies - Transfer)</option>
              <option value={8000000}>₹80 Lakhs (High Priority)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Call Screen & WhatsApp Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chat Transcript Feed (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden">
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                callState === 'connected' ? 'bg-emerald-400' :
                callState === 'transferring' ? 'bg-amber-400 animate-ping' :
                callState === 'bridged' ? 'bg-emerald-400' : 'bg-slate-600'
              }`} />
              Status: <span className="uppercase text-slate-400">{callState}</span>
            </span>

            {callState === 'bridged' && (
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Connected to {handoverConfig.executivePhone || 'You'}
              </span>
            )}
          </div>

          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-950/60">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-1">
                <PhoneCall className="h-6 w-6 text-slate-600 animate-pulse" />
                <span>Click "Start Test Call" button above</span>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                  msg.speaker === 'ai'
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-indigo-600 text-white'
                }`}>
                  <span className="block text-[10px] font-semibold opacity-60 mb-0.5">
                    {msg.speaker === 'ai' ? (voiceConfig?.agentName || 'AI') : customLeadName}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right: WhatsApp Alert on your Phone (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300">
            Aapke WhatsApp par ye aayega ({handoverConfig.executiveWhatsApp || 'Setup required'})
          </div>

          <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] text-xs font-sans min-h-60">
            {executiveAlertReceived ? (
              <div className="bg-[#005c4b] text-[#e9edef] rounded-xl p-3 space-y-2 shadow animate-fadeIn">
                <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] border-b border-emerald-700/60 pb-1">
                  <span>🚨 LIVE LEAD TRANSFER ALERT</span>
                  <span className="text-[9px] text-emerald-200 font-normal">Now</span>
                </div>

                <div className="space-y-0.5 text-[11px]">
                  <div>👤 <strong>Lead:</strong> {customLeadName}</div>
                  <div>📞 <strong>Phone:</strong> {customLeadPhone}</div>
                  <div>💰 <strong>Budget:</strong> ₹{(customBudget / 100000).toFixed(0)} Lakhs</div>
                  <div>⭐ <strong>Status:</strong> Qualified & Ready</div>
                </div>

                <div className="bg-[#025142] p-1.5 rounded text-[10px] text-emerald-100 border border-emerald-600/40">
                  Calling your phone <strong>{handoverConfig.executivePhone || 'configured'}</strong> right now!
                </div>
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-slate-600 text-center text-xs space-y-1">
                <MessageSquare className="h-6 w-6 text-slate-700" />
                <p className="max-w-[180px]">
                  Lead qualify hone par aapke WhatsApp par instant summary yahan aayegi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
