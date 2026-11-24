import React, { useState } from 'react';
import { 
  Phone, MessageSquare, Save, CheckCircle2, 
  Send, Sparkles, Bell 
} from 'lucide-react';

export default function HandoverSettingsView({ config, setConfig, onSave, onTestWhatsApp }) {
  const [testSent, setTestSent] = useState(false);

  const handleTestClick = () => {
    if (!config.executiveWhatsApp || !config.executivePhone) {
      alert('Pehle apna Mobile Number aur WhatsApp Number enter karein.');
      return;
    }
    setTestSent(true);
    if (onTestWhatsApp) onTestWhatsApp();
    setTimeout(() => setTestSent(false), 4000);
  };

  const isConfigured = Boolean(config.executivePhone && config.executiveWhatsApp);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Setup Numbers & WhatsApp Alert</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Apna real phone number enter karein jahan call transfer hogi aur WhatsApp summary aayegi.
          </p>
        </div>

        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Numbers</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Simple 2-field form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-indigo-400" />
                  Your Mobile Number (Call Forwarding)
                </label>
                <input
                  type="text"
                  value={config.executivePhone}
                  onChange={(e) => setConfig({ ...config, executivePhone: e.target.value })}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700/80 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-indigo-500 font-mono tracking-wide"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Lead qualify hone par AI is number par call connect karega.
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  Your WhatsApp Number (Instant Alerts)
                </label>
                <input
                  type="text"
                  value={config.executiveWhatsApp}
                  onChange={(e) => setConfig({ ...config, executiveWhatsApp: e.target.value })}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700/80 text-white text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-emerald-500 font-mono tracking-wide"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Call aane se pehle is WhatsApp par lead ka Name, Budget aur Summary aayegi.
                </span>
              </div>
            </div>

            {/* Simple Clean Toggle */}
            <div 
              onClick={() => setConfig({ ...config, enableWhatsAppAlert: !config.enableWhatsAppAlert })}
              className="pt-3 border-t border-slate-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="text-xs font-medium text-slate-200 block">
                  Pre-Call WhatsApp Summary Alert
                </span>
                <span className="text-[11px] text-slate-400">
                  Call ring hone se 2 sec pehle WhatsApp bhejo taaki context rahe.
                </span>
              </div>
              <div className={`h-5 w-9 rounded-full p-0.5 transition ${config.enableWhatsAppAlert ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition transform ${config.enableWhatsAppAlert ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Clean WhatsApp Notification Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              WhatsApp Message Preview
            </span>
            <button
              onClick={handleTestClick}
              disabled={testSent || !config.executiveWhatsApp}
              className="text-emerald-400 hover:text-emerald-300 disabled:opacity-40 text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <Send className="h-3 w-3" />
              <span>{testSent ? 'Sent to preview!' : 'Send Test Alert'}</span>
            </button>
          </div>

          <div className="bg-[#0b141a] rounded-xl p-3.5 border border-[#202c33] text-xs font-sans space-y-2">
            <div className="text-[10px] text-slate-500 text-center py-0.5">
              TO: {config.executiveWhatsApp || '+91 9XXXXXXXXX'}
            </div>

            <div className="bg-[#005c4b] text-[#e9edef] rounded-xl p-3 space-y-2 shadow">
              <div className="flex items-center justify-between text-amber-300 font-bold text-[11px] border-b border-emerald-700/60 pb-1">
                <span>🚨 LIVE LEAD TRANSFER ALERT</span>
                <span className="text-[9px] text-emerald-200 font-normal">Now</span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-100">
                <div>👤 <strong>Lead:</strong> Customer Name</div>
                <div>📞 <strong>Phone:</strong> Customer Number</div>
                <div>🎯 <strong>Requirement:</strong> 3BHK Flat / Service Inquiry</div>
                <div>💰 <strong>Budget:</strong> ₹35 Lakhs+ (Verified)</div>
                <div>⏰ <strong>Timeline:</strong> Within 15 days</div>
              </div>

              <div className="bg-[#025142] p-2 rounded text-[10px] text-emerald-100 border border-emerald-600/40">
                <strong>📝 AI Summary:</strong> Lead verified and ready to discuss discount and next steps with you.
              </div>

              <div className="text-[10px] text-amber-200 font-medium pt-0.5">
                ⚡ Calling your phone right now. Pick up with full context!
              </div>
            </div>

            {testSent && (
              <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Test summary simulated for your WhatsApp!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
