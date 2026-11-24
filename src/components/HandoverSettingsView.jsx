import React, { useState } from 'react';
import { 
  UserCheck, Phone, MessageSquare, ShieldCheck, 
  Bell, Volume2, Save, Send, Sparkles, CheckCircle2, AlertTriangle 
} from 'lucide-react';

export default function HandoverSettingsView({ config, setConfig, onSave, onTestWhatsApp }) {
  const [testSent, setTestSent] = useState(false);

  const handleTestClick = () => {
    if (!config.executiveWhatsApp || !config.executivePhone) {
      alert('Pehle apna real Mobile Number aur WhatsApp Number enter karein!');
      return;
    }
    setTestSent(true);
    if (onTestWhatsApp) onTestWhatsApp();
    setTimeout(() => setTestSent(false), 4500);
  };

  const isConfigured = Boolean(config.executivePhone && config.executiveWhatsApp);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-400" />
            Human Handover & WhatsApp Alert Setup
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Apna <strong>real phone number aur WhatsApp number</strong> yahan enter karein jahan call transfer hogi aur alert summary aayegi.
          </p>
        </div>
        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>Save My Real Numbers</span>
        </button>
      </div>

      {/* Number Configuration Status Banner */}
      {!isConfigured ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Apna Real Testing Number Configure Karein:</strong>
            <p className="text-amber-200/80 mt-0.5">
              Testing ke liye apna asli mobile number aur WhatsApp number niche daalein. Random/dummy data use nahi hoga.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Target Executive Active: <strong>{config.executiveName || 'You'}</strong> · Phone: <strong>{config.executivePhone}</strong> · WhatsApp: <strong>{config.executiveWhatsApp}</strong></span>
          </div>
          <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">
            SAVED & ACTIVE
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Real Numbers Input (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400" />
              Aapka Real Contact Details (Call & WhatsApp Receiving)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Aapka Naam (Executive Name)</label>
                <input
                  type="text"
                  value={config.executiveName}
                  onChange={(e) => setConfig({ ...config, executiveName: e.target.value })}
                  placeholder="e.g. Aapka Asli Naam"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Aapka Designation / Role</label>
                <input
                  type="text"
                  value={config.executiveRole}
                  onChange={(e) => setConfig({ ...config, executiveRole: e.target.value })}
                  placeholder="e.g. Sales Head / Closer"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Call Transfer Mobile Number</span>
                </label>
                <input
                  type="text"
                  value={config.executivePhone}
                  onChange={(e) => setConfig({ ...config, executivePhone: e.target.value })}
                  placeholder="+91 9XXXXXXXXX (Apna Real Number)"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500 font-mono font-bold tracking-wide"
                />
                <span className="text-[10px] text-slate-400">Is number par live call ring hogi.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>WhatsApp Alert Mobile Number</span>
                </label>
                <input
                  type="text"
                  value={config.executiveWhatsApp}
                  onChange={(e) => setConfig({ ...config, executiveWhatsApp: e.target.value })}
                  placeholder="+91 9XXXXXXXXX (Apna Real WhatsApp)"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 outline-none focus:border-emerald-500 font-mono font-bold tracking-wide"
                />
                <span className="text-[10px] text-slate-400">Is WhatsApp par lead ki poori summary aayegi.</span>
              </div>
            </div>
          </div>

          {/* Transfer Mode Options */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-400" />
              Transfer Modes & Real-time Options
            </h3>

            {/* Toggle 1: WhatsApp Alert */}
            <div 
              onClick={() => setConfig({ ...config, enableWhatsAppAlert: !config.enableWhatsAppAlert })}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:border-slate-600 transition"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  Instant WhatsApp Whisper to You (Recommended)
                </span>
                <p className="text-[11px] text-slate-400">
                  Call aane se pehle aapke WhatsApp number ({config.executiveWhatsApp || 'Not set'}) par bullet points aayenge.
                </p>
              </div>
              <div className={`h-5 w-9 rounded-full p-0.5 transition ${config.enableWhatsAppAlert ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition transform ${config.enableWhatsAppAlert ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Toggle 2: Audio Whisper in Ear */}
            <div 
              onClick={() => setConfig({ ...config, enableAudioWhisper: !config.enableAudioWhisper })}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer hover:border-slate-600 transition"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                  In-Call Audio Whisper (Call uthate hi briefing)
                </span>
                <p className="text-[11px] text-slate-400">
                  Call receive hote hi AI kaan me lead ka naam aur budget bolega, phir customer connect hoga.
                </p>
              </div>
              <div className={`h-5 w-9 rounded-full p-0.5 transition ${config.enableAudioWhisper ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition transform ${config.enableAudioWhisper ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>

            {/* Editable Template */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-slate-300 font-medium">WhatsApp Alert Format Template</label>
              <textarea
                rows={6}
                value={config.whisperTemplate}
                onChange={(e) => setConfig({ ...config, whisperTemplate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Preview: Live WhatsApp Screen on YOUR Real Phone (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Aapke Real WhatsApp par ye aayega</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {config.executiveWhatsApp || 'Please enter your WhatsApp number'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleTestClick}
                disabled={testSent || !config.executiveWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>{testSent ? 'Alert Dispatched!' : 'Simulate on My Number'}</span>
              </button>
            </div>

            {/* WhatsApp Chat Bubble Mockup with Real Configured Number */}
            <div className="bg-[#0b141a] rounded-xl p-4 border border-[#202c33] font-sans text-xs space-y-2">
              <div className="text-[10px] text-slate-500 text-center py-1">
                DELIVERED TO: {config.executiveWhatsApp || '+91-YOUR-NUMBER'}
              </div>
              
              <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tl-none p-3.5 space-y-2 max-w-[95%] shadow">
                <div className="flex items-center justify-between border-b border-emerald-700/60 pb-1.5">
                  <span className="font-extrabold text-amber-300 flex items-center gap-1 text-[11px]">
                    🚨 LIVE CALL TRANSFER ALERT
                  </span>
                  <span className="text-[9px] text-emerald-200">Just Now</span>
                </div>

                <div className="space-y-1 text-[11px] leading-relaxed">
                  <div>👤 <strong>Lead:</strong> [Customer ka Real Name]</div>
                  <div>📞 <strong>Phone:</strong> [Customer ka Number]</div>
                  <div>🎯 <strong>Requirement:</strong> [Verified Requirement]</div>
                  <div>💰 <strong>Budget:</strong> [Customer ka Budget]</div>
                  <div>⏰ <strong>Timeline:</strong> [Customer ki Timeline]</div>
                  <div>⭐ <strong>Quality Score:</strong> 90%+ (AI Verified)</div>
                </div>

                <div className="bg-[#025142] p-2 rounded-lg text-[10px] text-emerald-100 border border-emerald-600/40 mt-1">
                  <strong>📝 AI Call Summary:</strong>
                  <p className="mt-0.5">
                    "Customer ne pricing confirm ki hai aur aapke sath final discount aur payment plan par baat karna chahta hai."
                  </p>
                </div>

                <div className="text-[10px] font-bold text-amber-200 pt-1 flex items-center gap-1">
                  <span>⚡ Call is ringing on {config.executivePhone || 'your phone'} right now. Pick up with full context!</span>
                </div>

                <div className="text-[9px] text-emerald-300/80 text-right">
                  Now ✓✓
                </div>
              </div>

              {testSent && (
                <div className="p-2.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp alert successfully simulated for your number ({config.executiveWhatsApp})!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
