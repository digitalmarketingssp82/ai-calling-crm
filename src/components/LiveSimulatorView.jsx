import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, PhoneCall, PhoneForwarded, PhoneOff, MessageSquare, 
  Volume2, VolumeX, Mic, MicOff, Bot, User, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';

export default function LiveSimulatorView({ rules, handoverConfig, voiceConfig, onTriggerWhatsApp }) {
  const [testMode, setTestMode] = useState('interactive'); // 'interactive' or 'real_telephony'
  const [customerName, setCustomerName] = useState('Ramesh Contractor');
  const [customerPhone, setCustomerPhone] = useState('+91 98XXXXXXXX');
  const [orderValue, setOrderValue] = useState(45000); // 45k order
  const [requirementItem, setRequirementItem] = useState('19mm Marine Grade IS 710 Plywood (30 Sheets)');

  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, transferring, bridged, ended
  const [messages, setMessages] = useState([]);
  const [executiveAlertReceived, setExecutiveAlertReceived] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [vapiApiKey, setVapiApiKey] = useState('');
  const [callingRealPhone, setCallingRealPhone] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const speakText = (text, onEnd) => {
    if (isMuted || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (match) utterance.voice = match;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start Real Interactive Voice Call in Browser
  const startVoiceCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ringing');
    setMessages([]);
    setExecutiveAlertReceived(false);

    setTimeout(() => {
      setCallState('connected');
      const opening = `Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja bol rahi hoon. Bataiye aapko commercial plywood, marine grade 710, ya blockboards me kya requirement hai?`;
      
      setMessages([{ speaker: 'ai', text: opening }]);
      speakText(opening, () => {
        // Start listening to user mic if supported
        startListeningToUser();
      });
    }, 1200);
  };

  const startListeningToUser = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback auto simulation if browser doesn't have mic speech recognition
      runAutoScenario();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const userSpoke = event.results[0][0].transcript;
        handleUserSpeech(userSpoke);
      };

      recognition.onerror = () => {
        setIsListening(false);
        runAutoScenario();
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      runAutoScenario();
    }
  };

  const handleUserSpeech = (userText) => {
    setMessages(prev => [...prev, { speaker: 'lead', text: userText }]);

    // AI Intelligence Response for Sri Sri Plywood
    setTimeout(() => {
      const isBulk = orderValue >= rules.minBudget || userText.toLowerCase().includes('sheet') || userText.toLowerCase().includes('bulk') || userText.toLowerCase().includes('rate');
      
      let aiReply = '';
      if (isBulk) {
        aiReply = `Bahut badhiya sir! Sri Sri Plywood me hamare paas 100% waterproof IS 710 calibrated sheets available hain. Bulk discount aur direct factory pricing ke liye main ye call hamare Senior Sales Head (${handoverConfig.executivePhone || 'aapke phone'}) ko transfer kar rahi hoon. Line par bane rahein!`;
      } else {
        aiReply = `Sir hamare paas 19mm aur 12mm me commercial aur marine dono mil jayenge. Main aapko Sri Sri Plywood ka complete rate card WhatsApp par share kar deti hoon.`;
      }

      setMessages(prev => [...prev, { speaker: 'ai', text: aiReply }]);
      speakText(aiReply, () => {
        if (isBulk) {
          setCallState('transferring');
          setExecutiveAlertReceived(true);
          if (onTriggerWhatsApp) onTriggerWhatsApp();

          setTimeout(() => {
            setCallState('bridged');
            speakText(`Sri Sri Plywood Alert: Connecting customer ${customerName}, order value ${orderValue} rupees to your phone.`);
          }, 2500);
        }
      });
    }, 1000);
  };

  const runAutoScenario = () => {
    // If user doesn't speak or mic fails, run realistic Sri Sri Plywood dialogue
    setTimeout(() => {
      const custMsg = `Haan mujhe 19mm marine grade 710 plywood chahiye modular kitchen ke liye around 35 sheets. Rate kya padega?`;
      setMessages(prev => [...prev, { speaker: 'lead', text: custMsg }]);

      setTimeout(() => {
        const aiReply = `Zaroor sir! Hamara IS 710 marine plywood 25 saal ki guarantee ke sath aata hai. Aapka order wholesale category me aata hai, isliye best discounted rate ke liye main call seedha hamare Sales Head (${handoverConfig.executivePhone || 'aapke number'}) ko transfer kar rahi hoon. WhatsApp par bhi summary bhej di hai!`;
        
        setMessages(prev => [...prev, { speaker: 'ai', text: aiReply }]);
        speakText(aiReply, () => {
          setCallState('transferring');
          setExecutiveAlertReceived(true);
          if (onTriggerWhatsApp) onTriggerWhatsApp();

          setTimeout(() => {
            setCallState('bridged');
          }, 2000);
        });
      }, 1500);
    }, 1500);
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();
    setCallState('idle');
    setIsListening(false);
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
              Live Voice Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Customer call karega toh AI 'Sri Sri Plywood' ka rate batayega aur wholesale enquiry aate hi aapko transfer karega.
          </p>
        </div>

        {/* Action Buttons */}
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
              <span>Test Voice Call Now (Speak with AI)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs: Browser Live Audio Test vs Real Cellular Phone Ring */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setTestMode('interactive')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
            testMode === 'interactive' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🎙️ Live Voice Call (Mic se bolkar test karein)
        </button>
        <button
          onClick={() => setTestMode('real_telephony')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
            testMode === 'real_telephony' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📱 Real Mobile Phone Ring (Telecom Setup)
        </button>
      </div>

      {testMode === 'interactive' && (
        <div className="space-y-5">
          {/* Business Preset Header */}
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Company / Store Name</label>
                <div className="bg-slate-950 border border-slate-800 text-emerald-400 font-bold px-3 py-2 rounded-lg">
                  Sri Sri Plywood
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Customer / Contractor Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estimated Order Value</label>
                <select
                  value={orderValue}
                  onChange={(e) => setOrderValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700/80 text-white rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                >
                  <option value={15000}>₹15,000 (Small Retail Order - Send WhatsApp)</option>
                  <option value={45000}>₹45,000 (Wholesale Order - Transfer to Owner)</option>
                  <option value={120000}>₹1,20,000 (Contractor Project - Priority Transfer)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Call Screen & WhatsApp Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Live Call Voice Screen */}
            <div className="lg:col-span-7 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden">
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    callState === 'connected' ? 'bg-emerald-400 animate-ping' :
                    callState === 'transferring' ? 'bg-amber-400 animate-bounce' :
                    callState === 'bridged' ? 'bg-emerald-400' : 'bg-slate-600'
                  }`} />
                  <span className="font-semibold text-white">
                    {callState === 'idle' && 'Call Disconnected'}
                    {callState === 'ringing' && 'Connecting to Sri Sri Plywood AI...'}
                    {callState === 'connected' && 'Live Call Active (AI Speaking)'}
                    {callState === 'transferring' && 'BRIDGING CALL TO YOU...'}
                    {callState === 'bridged' && 'CONNECTED TO YOUR PHONE'}
                  </span>
                </div>

                {isListening && (
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    <span>Listening to your Mic...</span>
                  </span>
                )}
              </div>

              {/* Conversation Feed */}
              <div className="p-4 h-72 overflow-y-auto space-y-3 bg-slate-950/70">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                    <PhoneCall className="h-8 w-8 text-slate-600 animate-pulse" />
                    <p>Upar <strong>"Test Voice Call Now"</strong> dabayein aur speaker par aawaz sunein!</p>
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

            {/* Right: Instant WhatsApp Alert to Owner */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-semibold text-slate-300">
                Aapke Phone par Alert ({handoverConfig.executiveWhatsApp || 'Setup number'})
              </div>

              <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] text-xs font-sans min-h-60">
                {executiveAlertReceived ? (
                  <div className="bg-[#005c4b] text-[#e9edef] rounded-xl p-3 space-y-2 shadow animate-fadeIn">
                    <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] border-b border-emerald-700/60 pb-1">
                      <span>🪵 SRI SRI PLYWOOD - LEAD ALERT</span>
                      <span className="text-[9px] text-emerald-200 font-normal">Now</span>
                    </div>

                    <div className="space-y-0.5 text-[11px]">
                      <div>👤 <strong>Customer:</strong> {customerName}</div>
                      <div>📞 <strong>Phone:</strong> {customerPhone}</div>
                      <div>🪵 <strong>Item:</strong> 19mm Marine Grade IS 710 Plywood</div>
                      <div>💰 <strong>Order Est:</strong> ₹{orderValue.toLocaleString('en-IN')} (Wholesale)</div>
                    </div>

                    <div className="bg-[#025142] p-1.5 rounded text-[10px] text-emerald-100 border border-emerald-600/40">
                      <strong>AI Summary:</strong> Customer wants bulk quotation for modular kitchen work. Call is being transferred to your mobile <strong>{handoverConfig.executivePhone || 'now'}</strong>!
                    </div>

                    <div className="text-[10px] text-amber-200 font-bold pt-0.5">
                      ⚡ Calling your phone right now. Pick up and close the order!
                    </div>
                  </div>
                ) : (
                  <div className="h-52 flex flex-col items-center justify-center text-slate-600 text-center text-xs space-y-1">
                    <MessageSquare className="h-6 w-6 text-slate-700" />
                    <p className="max-w-[200px]">
                      Jaise hi customer Sri Sri Plywood me bulk order ki baat karega, aapke WhatsApp par ye summary yahan trigger hogi!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Cellular Phone Connection Guide */}
      {testMode === 'real_telephony' && (
        <div className="rounded-xl bg-slate-900 border border-indigo-500/30 p-6 space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-indigo-400" />
              Real Physical Mobile Phone Ring Kaise Hogi?
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Browser simulator aapke laptop/mic par chalta hai. <strong>Aapke physical SIM card wale mobile par asli phone call</strong> aane ke liye telecom service chahiye hoti hai:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-indigo-400 text-sm">Step 1</span>
              <h3 className="font-semibold text-white">Vapi.ai Free Account</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <a href="https://vapi.ai" target="_blank" rel="noreferrer" className="text-indigo-400 underline">vapi.ai</a> par sign up karein. <strong>$10 free credits (approx 100 minutes)</strong> bina kisi payment ke turant milte hain!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 text-sm">Step 2</span>
              <h3 className="font-semibold text-white">Phone Number Attach</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Vapi dashboard me 1-click me Indian ya Twilio number mil jata hai jisse aapke customers call karenge ya AI unhe call lagayega.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm">Step 3</span>
              <h3 className="font-semibold text-white">Direct Real Ring</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Vapi ka API key enter karte hi AI aapke real Airtel/Jio phone number par cellular call lagayega aur Pooja Sri Sri Plywood ban kar aapse baat karegi!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
