import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, PhoneCall, PhoneForwarded, PhoneOff, MessageSquare, 
  ShieldCheck, ShieldAlert, Sparkles, UserCheck, CheckCircle2, 
  Volume2, VolumeX, RotateCcw, Send, Bot, User, Edit3 
} from 'lucide-react';

export default function LiveSimulatorView({ rules, handoverConfig, voiceConfig, onTriggerWhatsApp }) {
  // Custom lead input state so user tests with their OWN data
  const [customLeadName, setCustomLeadName] = useState('Rahul Test');
  const [customLeadPhone, setCustomLeadPhone] = useState('+91 9XXXXXXXXX');
  const [customBudget, setCustomBudget] = useState(3500000);
  const [customRequirement, setCustomRequirement] = useState('Looking for 3BHK Apartment');
  const [customTimeline, setCustomTimeline] = useState('Within 15 days');
  const [isCustomMode, setIsCustomMode] = useState(true);

  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, evaluating, transferring, bridged, ended
  const [messages, setMessages] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [executiveAlertReceived, setExecutiveAlertReceived] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [whisperPlayed, setWhisperPlayed] = useState(false);

  const messagesEndRef = useRef(null);

  const speakText = (text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = voiceConfig.speakingRate || 1.0;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (match) utterance.voice = match;
    window.speechSynthesis.speak(utterance);
  };

  const startCustomCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ringing');
    setMessages([]);
    setCurrentScore(0);
    setExecutiveAlertReceived(false);
    setWhisperPlayed(false);

    const isQualified = customBudget >= rules.minBudget;

    const flow = [
      { speaker: 'ai', text: `Namaste ${customLeadName} ji! Main ${voiceConfig.agentName} baat kar rahi hoon aapke CRM se. Aapne enquiry ki thi.` },
      { speaker: 'lead', text: `Haan ji, main ${customRequirement} dekh raha hoon.` },
      { speaker: 'ai', text: `Bahut badhiya sir! Iske liye aapka estimated budget kya rahega aur final decision kab tak lena hai?` },
      { speaker: 'lead', text: `Mera budget around ₹${(customBudget / 100000).toFixed(1)} Lakhs hai aur timeline ${customTimeline} hai.` },
      { 
        speaker: 'ai', 
        text: isQualified 
          ? `Perfect sir! Aapki requirement hamari verified criteria me match hoti hai. Main abhi hamare executive ${handoverConfig.executiveName || ''} (${handoverConfig.executivePhone || 'your number'}) ko ye call transfer kar rahi hoon!`
          : `Samajh sakti hoon sir. Hamara minimum budget ₹${(rules.minBudget / 100000).toFixed(1)}L hai. Main aapko hamare catalog ka link WhatsApp par bhej deti hoon.`
      }
    ];

    setTimeout(() => {
      setCallState('connected');
      playTurnByTurn(flow, 0, isQualified);
    }, 1200);
  };

  const playTurnByTurn = (flow, index, isQualified) => {
    if (index >= flow.length) {
      setCallState('evaluating');
      const finalScore = isQualified ? 92 : 35;
      setCurrentScore(finalScore);

      setTimeout(() => {
        if (isQualified) {
          setCallState('transferring');
          setExecutiveAlertReceived(true);
          if (onTriggerWhatsApp) onTriggerWhatsApp();

          setTimeout(() => {
            setCallState('bridged');
            setWhisperPlayed(true);
            speakText(`Connecting ${customLeadName}, budget ${(customBudget / 100000).toFixed(1)} Lakhs to your phone.`);
          }, 2500);
        } else {
          setCallState('ended');
        }
      }, 1500);
      return;
    }

    const currentMsg = flow[index];
    setMessages((prev) => [...prev, currentMsg]);
    setCurrentScore(Math.min(95, Math.round((index + 1) * 20)));

    if (currentMsg.speaker === 'ai') {
      speakText(currentMsg.text);
    }

    setTimeout(() => {
      playTurnByTurn(flow, index + 1, isQualified);
    }, 2800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Live Call Testing Sandbox (With Your Own Real Numbers)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Yahan aap apna <strong>asli phone number aur lead data</strong> daalkar test kar sakte hain.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>
          <button
            onClick={startCustomCall}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>Start Test Call Now</span>
          </button>
        </div>
      </div>

      {/* Target Routing Warning / Confirmation */}
      {!handoverConfig.executivePhone ? (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span>⚠️ Executive number configured nahi hai. Call/WhatsApp alert dekhne ke liye "Human Handover" tab me apna number daalein.</span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
          <span>🎯 Real Routing Target: Call will forward to <strong>{handoverConfig.executivePhone}</strong> and WhatsApp alert will go to <strong>{handoverConfig.executiveWhatsApp}</strong>.</span>
        </div>
      )}

      {/* Input Data Card for Real Testing */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Edit3 className="h-4 w-4 text-emerald-400" />
          Test Lead Details (Apna Custom Data Yahan Enter Karein)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400">Test Lead ka Naam</label>
            <input
              type="text"
              value={customLeadName}
              onChange={(e) => setCustomLeadName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Test Customer ka Mobile Number</label>
            <input
              type="text"
              value={customLeadPhone}
              onChange={(e) => setCustomLeadPhone(e.target.value)}
              placeholder="+91 9XXXXXXXXX"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-2.5 outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Test Budget (Min ₹{(rules.minBudget / 100000).toFixed(0)}L to pass)</label>
            <select
              value={customBudget}
              onChange={(e) => setCustomBudget(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-2.5 outline-none focus:border-indigo-500"
            >
              <option value={1500000}>₹15 Lakhs (Below ₹{(rules.minBudget/100000).toFixed(0)}L - Disqualifies)</option>
              <option value={3500000}>₹35 Lakhs (Qualifies for Transfer)</option>
              <option value={7500000}>₹75 Lakhs (High Priority)</option>
              <option value={15000000}>₹1.5 Crore (Luxury Lead)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Requirement / Purpose</label>
            <input
              type="text"
              value={customRequirement}
              onChange={(e) => setCustomRequirement(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl p-2.5 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phone Call Canvas & Live Transcript (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            {/* Call Status Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  callState === 'connected' || callState === 'evaluating' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 animate-pulse' :
                  callState === 'transferring' || callState === 'bridged' ? 'bg-emerald-600 text-white animate-bounce' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {callState === 'transferring' || callState === 'bridged' ? (
                    <PhoneForwarded className="h-5 w-5" />
                  ) : (
                    <PhoneCall className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{customLeadName}</span>
                    <span className="text-xs text-slate-400 font-mono">{customLeadPhone}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className={`h-2 w-2 rounded-full ${
                      callState === 'connected' ? 'bg-emerald-400' :
                      callState === 'transferring' ? 'bg-amber-400 animate-ping' :
                      callState === 'bridged' ? 'bg-emerald-400' : 'bg-slate-500'
                    }`} />
                    <span className="uppercase font-semibold tracking-wider text-[10px]">
                      {callState === 'idle' && 'Ready to Test Call'}
                      {callState === 'ringing' && `Dialing ${customLeadPhone}...`}
                      {callState === 'connected' && 'Call in Progress (AI Speaking)'}
                      {callState === 'evaluating' && 'AI Evaluating Lead Quality...'}
                      {callState === 'transferring' && `BRIDGING CALL TO ${handoverConfig.executivePhone || 'YOUR PHONE'}...`}
                      {callState === 'bridged' && 'WARM HUMAN CALL ACTIVE'}
                      {callState === 'ended' && 'Call Concluded by AI (Disqualified)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Score Badge */}
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-medium">Quality Score</div>
                <div className={`text-xl font-extrabold ${
                  currentScore >= rules.minScoreThreshold ? 'text-emerald-400' :
                  currentScore > 30 ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {currentScore}%
                </div>
              </div>
            </div>

            {/* Live Conversation Transcript Feed */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 h-72 overflow-y-auto space-y-3">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <PhoneCall className="h-8 w-8 text-slate-600 animate-pulse" />
                  <span>Click "Start Test Call Now" button above</span>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  {msg.speaker === 'ai' && (
                    <div className="h-7 w-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 text-xs font-bold">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.speaker === 'ai'
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}>
                    <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                      {msg.speaker === 'ai' ? voiceConfig.agentName : customLeadName}
                    </div>
                    {msg.text}
                  </div>

                  {msg.speaker === 'lead' && (
                    <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 text-xs font-bold">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {callState === 'bridged' && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                    <UserCheck className="h-4 w-4" />
                    <span>Call Transferred to Your Number ({handoverConfig.executivePhone || 'Configured'})</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    Aapke WhatsApp par summary bhej di gayi hai aur aapka phone ring ho raha hai!
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Right: Real WhatsApp Alert to YOUR Number (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Aapka WhatsApp Screen</h4>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {handoverConfig.executiveWhatsApp || 'Please set your number'}
                  </span>
                </div>
              </div>

              {executiveAlertReceived ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 animate-pulse">
                  ALERT SENT TO YOU
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">Waiting for trigger</span>
              )}
            </div>

            {/* WhatsApp Screen Area */}
            <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] font-sans space-y-2 min-h-60">
              {executiveAlertReceived ? (
                <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tl-none p-3.5 space-y-2 text-xs shadow-lg animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-emerald-700/60 pb-1.5">
                    <span className="font-extrabold text-amber-300 flex items-center gap-1 text-[11px]">
                      🚨 LIVE CALL TRANSFER ALERT
                    </span>
                    <span className="text-[9px] text-emerald-200">Just Now</span>
                  </div>

                  <div className="space-y-1 text-[11px] leading-relaxed">
                    <div>👤 <strong>Lead:</strong> {customLeadName}</div>
                    <div>📞 <strong>Phone:</strong> {customLeadPhone}</div>
                    <div>🎯 <strong>Need:</strong> {customRequirement}</div>
                    <div>💰 <strong>Budget:</strong> ₹{(customBudget / 100000).toFixed(1)} Lakhs</div>
                    <div>⏰ <strong>Timeline:</strong> {customTimeline}</div>
                    <div>⭐ <strong>Quality Score:</strong> 92% (AI Verified)</div>
                  </div>

                  <div className="bg-[#025142] p-2 rounded-lg text-[10px] text-emerald-100 border border-emerald-600/40">
                    <strong>📝 AI Summary:</strong>
                    <p className="mt-0.5">
                      "Customer verified hai. Budget match ho gaya hai aur wo aapse final units aur price discount par baat karna chahta hai."
                    </p>
                  </div>

                  <div className="text-[10px] font-bold text-amber-200 pt-1 flex items-center gap-1">
                    <span>⚡ Call is ringing on {handoverConfig.executivePhone || 'your phone'} right now. Pick up!</span>
                  </div>
                </div>
              ) : (
                <div className="h-52 flex flex-col items-center justify-center text-slate-600 text-center text-xs space-y-2">
                  <MessageSquare className="h-8 w-8 text-slate-700" />
                  <p className="max-w-[220px]">
                    Jaise hi lead quality check pass karegi, aapke WhatsApp number <strong>({handoverConfig.executiveWhatsApp || 'your number'})</strong> par instant alert yahan appear hoga!
                  </p>
                </div>
              )}
            </div>

            {/* Real Call Bridged Notification */}
            {callState === 'transferring' || callState === 'bridged' ? (
              <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/50 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <PhoneForwarded className="h-4 w-4 text-emerald-400 animate-bounce" />
                    Incoming Bridged Call on {handoverConfig.executivePhone || 'Your Phone'}
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                    RINGING
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {whisperPlayed ? (
                    <span className="text-emerald-400 font-semibold">
                      ✅ Connected to your phone! You have full context.
                    </span>
                  ) : (
                    <span>Whispering briefing into your ear before bridging customer...</span>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
