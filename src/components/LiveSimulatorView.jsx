import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, PhoneCall, PhoneForwarded, PhoneOff, MessageSquare, 
  MapPin, CheckCircle2, AlertCircle, Bot, User, Mic, Volume2, Music, Upload 
} from 'lucide-react';

export default function LiveSimulatorView({ 
  rules, 
  handoverConfig, 
  voiceConfig, 
  customVoiceAudio,
  customVoiceFileName,
  onTriggerWhatsApp,
  onNavigateToVoice
}) {
  const [customerName, setCustomerName] = useState('Rajesh Contractor');
  const [customerPhone, setCustomerPhone] = useState('+91 98XXXXXXXX');
  const [siteLocation, setSiteLocation] = useState('Sector 82, Mohali');
  const [isOutsideTricity, setIsOutsideTricity] = useState(false);
  const [quantitySheets, setQuantitySheets] = useState(35);

  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, transferring, bridged, ended
  const [messages, setMessages] = useState([]);
  const [executiveAlertReceived, setExecutiveAlertReceived] = useState(false);
  const [isPlayingMyAudio, setIsPlayingMyAudio] = useState(false);

  const messagesEndRef = useRef(null);
  const activeAudioRef = useRef(null);

  // Play audio turn: PRIORITIZE USER'S UPLOADED AUDIO FILE!
  const playAiVoiceTurn = (text, onEnd) => {
    // 1. If user uploaded a custom voice file, ALWAYS play their uploaded voice file!
    if (customVoiceAudio) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      }

      try {
        const audio = new Audio(customVoiceAudio);
        activeAudioRef.current = audio;
        setIsPlayingMyAudio(true);

        audio.onended = () => {
          setIsPlayingMyAudio(false);
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          setIsPlayingMyAudio(false);
          fallbackBrowserSpeech(text, onEnd);
        };

        audio.play().catch(() => {
          setIsPlayingMyAudio(false);
          fallbackBrowserSpeech(text, onEnd);
        });
        return;
      } catch (err) {
        fallbackBrowserSpeech(text, onEnd);
        return;
      }
    }

    // 2. Fallback to browser speech only if no file is uploaded
    fallbackBrowserSpeech(text, onEnd);
  };

  const fallbackBrowserSpeech = (text, onEnd) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google')) && (v.lang.includes('hi') || v.lang.includes('IN')));
    if (match) utterance.voice = match;

    utterance.onend = () => { if (onEnd) onEnd(); };
    utterance.onerror = () => { if (onEnd) onEnd(); };

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceCall = () => {
    window.speechSynthesis?.cancel();
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }

    setCallState('ringing');
    setMessages([]);
    setExecutiveAlertReceived(false);

    setTimeout(() => {
      setCallState('connected');
      const opening = `Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja baat kar rahi hoon, bataiye kis item ki inquiry thi?`;
      
      setMessages([{ speaker: 'ai', text: opening }]);
      playAiVoiceTurn(opening, () => {
        setTimeout(runShortConversationalFlow, 1000);
      });
    }, 800);
  };

  const runShortConversationalFlow = () => {
    // 1. Customer asks rate
    const cust1 = `19mm marine grade 710 plywood ka kya rate chal raha hai?`;
    setMessages(prev => [...prev, { speaker: 'lead', text: cust1 }]);

    setTimeout(() => {
      // 2. AI answers rate + location
      const aiReply1 = `Sir 19mm marine IS 710 approx ₹88 se ₹95 per square foot padega. Aapki site Tricity me kahan par chal rahi hai?`;
      setMessages(prev => [...prev, { speaker: 'ai', text: aiReply1 }]);

      playAiVoiceTurn(aiReply1, () => {
        setTimeout(() => {
          if (isOutsideTricity) {
            const custLocOut = `Hamari site Ludhiana me chal rahi hai.`;
            setMessages(prev => [...prev, { speaker: 'lead', text: custLocOut }]);

            setTimeout(() => {
              const aiOutside = `Sir hum delivery sirf Mohali Tricity area me hi karte hain. Agar aap transport khud arrange kar sakein, toh hum dispatch karwa denge.`;
              setMessages(prev => [...prev, { speaker: 'ai', text: aiOutside }]);
              playAiVoiceTurn(aiOutside, () => setCallState('ended'));
            }, 1200);
            return;
          }

          const custLocIn = `Hamari site ${siteLocation} me hai.`;
          setMessages(prev => [...prev, { speaker: 'lead', text: custLocIn }]);

          setTimeout(() => {
            const aiReply2 = `Sahi hai sir, Mohali me toh direct delivery ho jayegi. Lagbhag kitni sheets ki requirement hai aapko?`;
            setMessages(prev => [...prev, { speaker: 'ai', text: aiReply2 }]);

            playAiVoiceTurn(aiReply2, () => {
              setTimeout(() => {
                const custQty = `Lagbhag ${quantitySheets} sheets chahiye.`;
                setMessages(prev => [...prev, { speaker: 'lead', text: custQty }]);

                setTimeout(() => {
                  const aiTransfer = `Done sir! ${quantitySheets} sheets par wholesale rate mil jayega. Main aapki call abhi hamare owner se connect kar rahi hoon.`;
                  setMessages(prev => [...prev, { speaker: 'ai', text: aiTransfer }]);

                  playAiVoiceTurn(aiTransfer, () => {
                    setCallState('transferring');
                    setExecutiveAlertReceived(true);
                    if (onTriggerWhatsApp) onTriggerWhatsApp();

                    setTimeout(() => {
                      setCallState('bridged');
                    }, 1800);
                  });
                }, 1000);
              }, 1200);
            });
          }, 1200);
        }, 1200);
      });
    }, 1200);
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }
    setCallState('idle');
    setIsPlayingMyAudio(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Sri Sri Plywood · Live Call Test</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test karein ki AI aapse call par kaise baat karega.
          </p>
        </div>

        {callState !== 'idle' ? (
          <button
            onClick={endCall}
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>End Call</span>
          </button>
        ) : (
          <button
            onClick={startVoiceCall}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Start Test Call</span>
          </button>
        )}
      </div>

      {/* Voice Status Indicator Banner */}
      {customVoiceAudio ? (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Voice Source: <strong>Aapki Uploaded Audio File Active Hai ({customVoiceFileName || 'Custom Voice'})</strong>
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-bold">
            NO ROBOTIC VOICE
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              Aapne abhi custom audio upload nahi ki hai, isliye browser default aawaz bol raha hai.
            </span>
          </div>
          <button
            onClick={onNavigateToVoice}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded transition cursor-pointer"
          >
            Upload My Audio File Now
          </button>
        </div>
      )}

      {/* Tricity Settings Bar */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 flex items-center gap-1 text-emerald-400 font-medium">
              <MapPin className="h-3.5 w-3.5" />
              <span>Site Location (Mohali Tricity Only)</span>
            </label>
            <select
              value={isOutsideTricity ? 'outside' : siteLocation}
              onChange={(e) => {
                if (e.target.value === 'outside') {
                  setIsOutsideTricity(true);
                } else {
                  setIsOutsideTricity(false);
                  setSiteLocation(e.target.value);
                }
              }}
              className="w-full bg-slate-950 border border-emerald-500/50 text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
            >
              <option value="Sector 82, Mohali (JLPL)">Sector 82, Mohali (Tricity Delivery ✅)</option>
              <option value="Sector 70, Mohali">Sector 70, Mohali (Tricity Delivery ✅)</option>
              <option value="Zirakpur (VIP Road)">Zirakpur VIP Road (Tricity Delivery ✅)</option>
              <option value="Panchkula Sector 20">Panchkula Sector 20 (Tricity Delivery ✅)</option>
              <option value="Kharar (Landran Road)">Kharar (Tricity Delivery ✅)</option>
              <option value="outside">Ludhiana / Outside (Test Rejection ❌)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Sheets Needed</label>
            <select
              value={quantitySheets}
              onChange={(e) => setQuantitySheets(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value={10}>10 Sheets (Retail)</option>
              <option value={35}>35 Sheets (Wholesale Order)</option>
              <option value={75}>75 Sheets (Contractor Bulk)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Call Screen & WhatsApp Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Chat Transcript Feed */}
        <div className="lg:col-span-7 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${callState === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
              <span>Voice: {customVoiceFileName ? `Playing "${customVoiceFileName}"` : 'Default Voice'}</span>
            </span>
            {isPlayingMyAudio && (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                <Music className="h-3 w-3" />
                <span>Playing Your Custom Audio...</span>
              </span>
            )}
          </div>

          <div className="p-4 h-64 overflow-y-auto space-y-2.5 bg-slate-950/70">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <span>Click "Start Test Call" above to test the call</span>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.speaker === 'ai'
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-emerald-600 text-white font-medium'
                }`}>
                  <span className="block text-[10px] font-semibold opacity-60 mb-0.5">
                    {msg.speaker === 'ai' ? (customVoiceFileName ? 'AI (Your Cloned Voice)' : 'Pooja (AI)') : customerName}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right: Instant WhatsApp Alert */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            Aapke WhatsApp par Tricity Lead Alert:
          </div>

          <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] text-xs font-sans min-h-56">
            {executiveAlertReceived ? (
              <div className="bg-[#005c4b] text-[#e9edef] rounded-xl p-3 space-y-2 shadow animate-fadeIn">
                <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] border-b border-emerald-700/60 pb-1">
                  <span>🪵 SRI SRI PLYWOOD - TRICITY LEAD</span>
                  <span className="text-[9px] text-emerald-200">Just Now</span>
                </div>

                <div className="space-y-0.5 text-[11px]">
                  <div>👤 <strong>Customer:</strong> {customerName}</div>
                  <div>📞 <strong>Phone:</strong> {customerPhone}</div>
                  <div>🪵 <strong>Item:</strong> 19mm Marine IS 710</div>
                  <div className="text-amber-200 font-bold">📍 <strong>Site:</strong> {siteLocation} (Tricity Verified)</div>
                  <div>📦 <strong>Quantity:</strong> {quantitySheets} Sheets</div>
                </div>

                <div className="text-[10px] text-amber-200 font-bold pt-0.5">
                  ⚡ Call connecting to your mobile now. Pick up!
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-slate-600 text-center text-xs space-y-1">
                <MessageSquare className="h-6 w-6 text-slate-700" />
                <p className="max-w-[190px]">
                  Tricity customer verify hote hi summary yahan pop up hogi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
