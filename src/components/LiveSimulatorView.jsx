import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, PhoneCall, PhoneForwarded, PhoneOff, MessageSquare, 
  Volume2, VolumeX, Mic, Bot, User, CheckCircle2, MapPin, Sparkles 
} from 'lucide-react';

export default function LiveSimulatorView({ rules, handoverConfig, voiceConfig, onTriggerWhatsApp }) {
  const [customerName, setCustomerName] = useState('Rajesh Contractor');
  const [customerPhone, setCustomerPhone] = useState('+91 98XXXXXXXX');
  const [siteLocation, setSiteLocation] = useState('Sector 62, Noida (Near Metro Station)');
  const [quantitySheets, setQuantitySheets] = useState(35);
  const [orderValue, setOrderValue] = useState(48000);

  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, transferring, bridged, ended
  const [messages, setMessages] = useState([]);
  const [executiveAlertReceived, setExecutiveAlertReceived] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Pick the best natural human-like voice available in the browser
  const getBestNaturalVoice = () => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    
    // Priority: Natural Neural voices
    const naturalHindi = voices.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && (v.lang.includes('hi') || v.lang.includes('IN')));
    if (naturalHindi) return naturalHindi;

    const googleHindi = voices.find(v => v.name.includes('Google') && (v.lang.includes('hi') || v.lang.includes('IN')));
    if (googleHindi) return googleHindi;

    const anyIndian = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN') || v.lang.includes('en-IN'));
    if (anyIndian) return anyIndian;

    return voices[0] || null;
  };

  const speakText = (text, onEnd) => {
    if (isMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Human-like cadence: slightly softer pitch & relaxed tempo
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const bestVoice = getBestNaturalVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
      setSelectedVoiceName(bestVoice.name);
    }

    utterance.onend = () => { if (onEnd) onEnd(); };
    utterance.onerror = () => { if (onEnd) onEnd(); };

    window.speechSynthesis.speak(utterance);
  };

  // Start Voice Call
  const startVoiceCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ringing');
    setMessages([]);
    setExecutiveAlertReceived(false);

    setTimeout(() => {
      setCallState('connected');
      const opening = `Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja baat kar rahi hoon. Bataiye aapko commercial plywood, marine grade 710, ya blockboards me kya requirement hai?`;
      
      setMessages([{ speaker: 'ai', text: opening }]);
      speakText(opening, () => {
        // AI directly asks for site location and quantity in the conversation
        setTimeout(() => {
          runStepByStepFlow();
        }, 1200);
      });
    }, 1000);
  };

  // Step-by-Step realistic Sri Sri Plywood dialogue asking for Site Location
  const runStepByStepFlow = () => {
    // Customer asks for 19mm marine
    const cust1 = `Haan Pooja ji, mujhe 19mm waterproof marine grade 710 plywood chahiye modular kitchen ke liye. Rate kya padega?`;
    setMessages(prev => [...prev, { speaker: 'lead', text: cust1 }]);

    setTimeout(() => {
      // AI specifically asks for SITE LOCATION and SHEET COUNT
      const aiAskLocation = `Zaroor sir! Hamara IS 710 marine plywood 100% waterproof gurjan core me aata hai. Best rate aur delivery arrange karne ke liye, kya aap bata sakte hain ki aapko kitni sheets chahiye aur aapki site kahan par chal rahi hai?`;
      setMessages(prev => [...prev, { speaker: 'ai', text: aiAskLocation }]);

      speakText(aiAskLocation, () => {
        // Customer gives site location
        setTimeout(() => {
          const custLocationAns = `Mujhe lagbhag ${quantitySheets} sheets chahiye, aur hamari site ${siteLocation} me chal rahi hai. Delivery ho jayegi na wahan?`;
          setMessages(prev => [...prev, { speaker: 'lead', text: custLocationAns }]);

          setTimeout(() => {
            // AI acknowledges location and connects call to owner
            const aiTransfer = `Ji bilkul sir, ${siteLocation} par hamari direct transport delivery ho jayegi! Aapka order 30 sheets se upar hai, isliye special wholesale discount finalize karne ke liye main call seedha hamare sales head (${handoverConfig.executivePhone || 'aapke phone'}) ko connect kar rahi hoon. Aapki site details maine unhe WhatsApp par bhej di hain!`;
            
            setMessages(prev => [...prev, { speaker: 'ai', text: aiTransfer }]);
            speakText(aiTransfer, () => {
              setCallState('transferring');
              setExecutiveAlertReceived(true);
              if (onTriggerWhatsApp) onTriggerWhatsApp();

              setTimeout(() => {
                setCallState('bridged');
                speakText(`Sri Sri Plywood Transfer: Customer ${customerName}, site location ${siteLocation}, 35 sheets order.`);
              }, 2000);
            });
          }, 1500);
        }, 1500);
      });
    }, 1500);
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();
    setCallState('idle');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Sri Sri Plywood · AI Call Center</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Site Location Verification
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            AI customer se <strong>item, quantity aur site location</strong> pooch kar aapke phone aur WhatsApp par forward karega.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {callState !== 'idle' ? (
            <button
              onClick={endCall}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span>Cut Call</span>
            </button>
          ) : (
            <button
              onClick={startVoiceCall}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Start Call Demo (Site Location Check)</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Quality Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Voice Quality Update:</span>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Browser me Windows ka default robotic engine chalne ki wajah se aawaz mechanical aati hai. 
            Real phone call me hum **ElevenLabs "Aditi" (Human Natural Indian Girl Voice)** use karte hain jo 100% human lagti hai aur saans lene ka natural pause rehta hai!
          </p>
        </div>
      </div>

      {/* Site Location & Customer Configuration */}
      <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Customer / Contractor</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 flex items-center gap-1 text-emerald-400 font-medium">
              <MapPin className="h-3.5 w-3.5" />
              <span>Site / Project Location (AI poochega)</span>
            </label>
            <input
              type="text"
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
              placeholder="e.g. Sector 62 Noida / Civil Lines"
              className="w-full bg-slate-950 border border-emerald-500/60 text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Quantity Required</label>
            <select
              value={quantitySheets}
              onChange={(e) => {
                const qty = Number(e.target.value);
                setQuantitySheets(qty);
                setOrderValue(qty * 1400); // 1400 per sheet approx
              }}
              className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value={10}>10 Sheets (Retail Order - Send WhatsApp)</option>
              <option value={35}>35 Sheets (Wholesale - Transfer to Owner)</option>
              <option value={80}>80 Sheets (Contractor Project - High Priority)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Call Screen & WhatsApp Summary with Location */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Call Screen */}
        <div className="lg:col-span-7 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                callState === 'connected' ? 'bg-emerald-400 animate-ping' :
                callState === 'transferring' ? 'bg-amber-400 animate-bounce' :
                callState === 'bridged' ? 'bg-emerald-400' : 'bg-slate-600'
              }`} />
              <span className="font-semibold text-white">
                {callState === 'idle' && 'Click Start Call Demo above'}
                {callState === 'ringing' && 'Connecting to Sri Sri Plywood AI...'}
                {callState === 'connected' && 'Pooja (AI) Asking Requirement & Location...'}
                {callState === 'transferring' && 'BRIDGING CALL TO YOU WITH LOCATION...'}
                {callState === 'bridged' && 'CONNECTED TO YOUR PHONE'}
              </span>
            </div>
          </div>

          <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-950/70">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                <PhoneCall className="h-8 w-8 text-slate-600 animate-pulse" />
                <p>Upar <strong>"Start Call Demo"</strong> button dabayein!</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  msg.speaker === 'ai'
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-emerald-600 text-white font-medium'
                }`}>
                  <span className="block text-[10px] font-semibold opacity-60 mb-0.5">
                    {msg.speaker === 'ai' ? 'Pooja (Sri Sri Plywood AI)' : customerName}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right: WhatsApp Alert With Exact Location */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-300">
            Aapke WhatsApp par Site Location ke sath ye aayega:
          </div>

          <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] text-xs font-sans min-h-60">
            {executiveAlertReceived ? (
              <div className="bg-[#005c4b] text-[#e9edef] rounded-xl p-3 space-y-2 shadow animate-fadeIn">
                <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] border-b border-emerald-700/60 pb-1">
                  <span>🪵 SRI SRI PLYWOOD - LEAD ALERT</span>
                  <span className="text-[9px] text-emerald-200 font-normal">Now</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div>👤 <strong>Customer:</strong> {customerName}</div>
                  <div>📞 <strong>Phone:</strong> {customerPhone}</div>
                  <div>🪵 <strong>Requirement:</strong> 19mm Marine Grade IS 710</div>
                  <div className="text-amber-200 font-bold">📍 <strong>Site Location:</strong> {siteLocation}</div>
                  <div>📦 <strong>Quantity:</strong> {quantitySheets} Sheets</div>
                  <div>💰 <strong>Order Est:</strong> ₹{orderValue.toLocaleString('en-IN')} (Wholesale)</div>
                </div>

                <div className="bg-[#025142] p-2 rounded text-[10px] text-emerald-100 border border-emerald-600/40">
                  <strong>AI Call Summary:</strong> Customer ko {siteLocation} par {quantitySheets} sheets delivery chahiye. Call aapke number par bridge ho rahi hai!
                </div>

                <div className="text-[10px] text-amber-200 font-bold pt-0.5">
                  ⚡ Calling your phone right now. Pick up with location context!
                </div>
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-slate-600 text-center text-xs space-y-1">
                <MessageSquare className="h-6 w-6 text-slate-700" />
                <p className="max-w-[200px]">
                  Jaise hi customer site location aur quantity confirm karega, summary yahan trigger hogi!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
