import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, PhoneCall, PhoneForwarded, PhoneOff, MessageSquare, 
  MapPin, CheckCircle2, AlertCircle, Bot, User, Send, Mic, Volume2 
} from 'lucide-react';

export default function LiveSimulatorView({ 
  rules, 
  handoverConfig, 
  voiceConfig, 
  onTriggerWhatsApp 
}) {
  const [customerName, setCustomerName] = useState('Rajesh Contractor');
  const [customerPhone, setCustomerPhone] = useState('+91 98XXXXXXXX');
  const [siteLocation, setSiteLocation] = useState('Sector 82, Mohali');
  const [quantitySheets, setQuantitySheets] = useState(35);

  const [callState, setCallState] = useState('idle'); // idle, ringing, connected, waiting_for_customer, ai_speaking, transferred, ended
  const [messages, setMessages] = useState([]);
  const [executiveAlertReceived, setExecutiveAlertReceived] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: inquiry, 1: location, 2: quantity
  const [customInputText, setCustomInputText] = useState('');

  const messagesEndRef = useRef(null);

  const speakText = (text, onEnd) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')) && (v.lang.includes('hi') || v.lang.includes('IN')));
    if (match) utterance.voice = match;

    utterance.onend = () => { if (onEnd) onEnd(); };
    utterance.onerror = () => { if (onEnd) onEnd(); };

    window.speechSynthesis.speak(utterance);
  };

  // Step 1: Start Call -> AI says GREETING -> THEN STOPS AND WAITS!
  const startCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('ringing');
    setMessages([]);
    setExecutiveAlertReceived(false);
    setCurrentStep(0);

    setTimeout(() => {
      setCallState('connected');
      const opening = `Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja bol rahi hoon, bataiye kis item ki inquiry thi?`;
      
      setMessages([{ speaker: 'ai', text: opening }]);
      speakText(opening, () => {
        // AI STOPS! It waits for the customer to speak!
        setCallState('waiting_for_customer');
      });
    }, 800);
  };

  // Customer Speaks / Responds
  const handleCustomerResponse = (responseText) => {
    if (!responseText.trim()) return;

    // Add customer's message to conversation
    setMessages(prev => [...prev, { speaker: 'lead', text: responseText }]);
    setCustomInputText('');
    setCallState('ai_speaking');

    // AI responds turn-by-turn based on the step
    setTimeout(() => {
      if (currentStep === 0) {
        // Customer asked about item/rate -> AI answers rate FIRST, then asks location, THEN STOPS AND WAITS!
        const aiAnswer1 = `Sir 19mm marine IS 710 approx ₹88 se ₹95 per square foot padega. Aapki site Tricity me kahan par chal rahi hai?`;
        setMessages(prev => [...prev, { speaker: 'ai', text: aiAnswer1 }]);
        
        speakText(aiAnswer1, () => {
          setCurrentStep(1); // Next step is location
          setCallState('waiting_for_customer'); // AI STOPS AND WAITS!
        });
      } else if (currentStep === 1) {
        // Customer gave site location -> check if inside or outside Tricity
        const isOutside = responseText.toLowerCase().includes('ludhiana') || responseText.toLowerCase().includes('delhi') || responseText.toLowerCase().includes('outside');
        
        if (isOutside) {
          const aiOutside = `Sir hum delivery sirf Mohali Tricity area me hi karte hain. Agar aap transport khud arrange kar sakein, toh hum dispatch karwa denge.`;
          setMessages(prev => [...prev, { speaker: 'ai', text: aiOutside }]);
          speakText(aiOutside, () => {
            setCallState('ended');
          });
        } else {
          // Inside Tricity -> AI confirms delivery, asks sheets count, THEN STOPS AND WAITS!
          setSiteLocation(responseText.replace('Hamari site ', ''));
          const aiAnswer2 = `Sahi hai sir, Mohali me toh direct daily dispatch hota hai. Lagbhag kitni sheets ki zaroorat padegi?`;
          setMessages(prev => [...prev, { speaker: 'ai', text: aiAnswer2 }]);
          
          speakText(aiAnswer2, () => {
            setCurrentStep(2); // Next step is quantity
            setCallState('waiting_for_customer'); // AI STOPS AND WAITS!
          });
        }
      } else if (currentStep === 2) {
        // Customer gave sheets count -> AI confirms wholesale discount and bridges call!
        const aiClosing = `Done sir! ${quantitySheets} sheets par wholesale discount mil jayega. Main aapki call abhi hamare owner se connect kar rahi hoon.`;
        setMessages(prev => [...prev, { speaker: 'ai', text: aiClosing }]);
        
        speakText(aiClosing, () => {
          setCallState('transferred');
          setExecutiveAlertReceived(true);
          if (onTriggerWhatsApp) onTriggerWhatsApp();
        });
      }
    }, 700);
  };

  const endCall = () => {
    window.speechSynthesis?.cancel();
    setCallState('idle');
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
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20">
              Interactive (AI Waits For You)
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AI khud se nahi bolega — <strong>jab aap bolenge tabhi AI aage jawab dega</strong>.
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
            onClick={startCall}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Start Test Call</span>
          </button>
        )}
      </div>

      {/* Main Call Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Interactive Phone Screen */}
        <div className="lg:col-span-7 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col h-[420px]">
          {/* Top Status */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs bg-slate-950/60">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                callState === 'waiting_for_customer' ? 'bg-amber-400 animate-pulse' :
                callState === 'ai_speaking' ? 'bg-emerald-400' :
                callState === 'transferred' ? 'bg-indigo-400' : 'bg-slate-600'
              }`} />
              <span className="font-semibold text-white">
                {callState === 'idle' && 'Call Inactive'}
                {callState === 'ringing' && 'Dialing Sri Sri Plywood...'}
                {callState === 'ai_speaking' && 'Pooja (AI Speaking)...'}
                {callState === 'waiting_for_customer' && 'AI WAITING FOR YOU TO ANSWER'}
                {callState === 'transferred' && 'CALL BRIDGED TO OWNER'}
                {callState === 'ended' && 'Call Completed'}
              </span>
            </div>

            {callState === 'waiting_for_customer' && (
              <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded font-semibold border border-amber-500/20">
                Aapka Bolne ka Turn Hai
              </span>
            )}
          </div>

          {/* Conversation Transcript Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2.5 bg-slate-950/80">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-1">
                <PhoneCall className="h-6 w-6 text-slate-600" />
                <span>Upar "Start Test Call" dabayein</span>
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
                    {msg.speaker === 'ai' ? 'Pooja (Sri Sri Plywood)' : customerName}
                  </span>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Customer Reply Panel (Bottom of Phone) */}
          {callState === 'waiting_for_customer' && (
            <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2 animate-fadeIn">
              <span className="text-[11px] text-slate-400 block font-medium">
                Customer ka jawab chunein ya type karein:
              </span>

              {/* Quick Reply Pills based on Current Step */}
              <div className="flex flex-wrap gap-1.5">
                {currentStep === 0 && (
                  <>
                    <button
                      onClick={() => handleCustomerResponse('19mm marine grade 710 plywood ka kya rate hai?')}
                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      "19mm Marine IS 710 ka rate kya hai?"
                    </button>
                    <button
                      onClick={() => handleCustomerResponse('12mm commercial plywood chahiye')}
                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      "12mm commercial plywood chahiye"
                    </button>
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <button
                      onClick={() => handleCustomerResponse('Hamari site Sector 82 Mohali me hai')}
                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      📍 "Sector 82 Mohali me site hai"
                    </button>
                    <button
                      onClick={() => handleCustomerResponse('Hamari site Zirakpur VIP Road par hai')}
                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      📍 "Zirakpur VIP Road par hai"
                    </button>
                    <button
                      onClick={() => handleCustomerResponse('Hamari site Ludhiana me hai')}
                      className="text-xs bg-rose-950/60 hover:bg-rose-600 text-rose-200 px-3 py-1.5 rounded-lg border border-rose-800 transition cursor-pointer"
                    >
                      ❌ "Ludhiana me hai (Outside Tricity)"
                    </button>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <button
                      onClick={() => handleCustomerResponse('Around 35 sheets chahiye')}
                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      "Around 35 sheets chahiye"
                    </button>
                    <button
                      onClick={() => handleCustomerResponse('Lagbhag 50 sheets ka order hai')}
                      className="text-xs bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      "Lagbhag 50 sheets ka order hai"
                    </button>
                  </>
                )}
              </div>

              {/* Or Type Your Own Customer Words */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Ya yahan apna jawab type karein..."
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomerResponse(customInputText)}
                  className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleCustomerResponse(customInputText)}
                  disabled={!customInputText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Instant WhatsApp Alert to Owner */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            Aapke WhatsApp par Tricity Lead Alert:
          </div>

          <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] text-xs font-sans min-h-60">
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
                  <div className="text-amber-200 font-bold">📍 <strong>Site:</strong> {siteLocation} (Tricity)</div>
                  <div>📦 <strong>Quantity:</strong> {quantitySheets} Sheets</div>
                </div>

                <div className="text-[10px] text-amber-200 font-bold pt-0.5">
                  ⚡ Call connecting to your mobile ({handoverConfig.executivePhone || 'your phone'}) now!
                </div>
              </div>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-slate-600 text-center text-xs space-y-1">
                <MessageSquare className="h-6 w-6 text-slate-700" />
                <p className="max-w-[190px]">
                  Jab aap customer ban kar teeno sawaal ka jawab denge, toh summary yahan aayegi!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
