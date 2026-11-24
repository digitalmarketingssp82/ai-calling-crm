import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LeadFilterView from './components/LeadFilterView';
import HandoverSettingsView from './components/HandoverSettingsView';
import VoiceStudioView from './components/VoiceStudioView';
import LiveSimulatorView from './components/LiveSimulatorView';
import CallHistoryView from './components/CallHistoryView';
import { 
  defaultQualificationRules, 
  defaultHandoverConfig, 
  defaultVoiceConfig 
} from './data/mockData';
import { CheckCircle2, MessageSquare } from 'lucide-react';

export default function App() {
  const [activeSubTab, setActiveSubTab] = useState('handover');

  // Load persisted real data from localStorage
  const [rules, setRules] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_qualification_rules');
      return saved ? JSON.parse(saved) : defaultQualificationRules;
    } catch {
      return defaultQualificationRules;
    }
  });

  const [handoverConfig, setHandoverConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_handover_config');
      return saved ? JSON.parse(saved) : defaultHandoverConfig;
    } catch {
      return defaultHandoverConfig;
    }
  });

  const [voiceConfig, setVoiceConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('crm_voice_config');
      return saved ? JSON.parse(saved) : defaultVoiceConfig;
    } catch {
      return defaultVoiceConfig;
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, icon = CheckCircle2) => {
    setToastMessage({ text: msg, icon });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveRules = () => {
    localStorage.setItem('crm_qualification_rules', JSON.stringify(rules));
    showToast('Filter Rules saved!');
  };

  const handleSaveHandover = () => {
    localStorage.setItem('crm_handover_config', JSON.stringify(handoverConfig));
    showToast(`Saved! Call will forward to ${handoverConfig.executivePhone || 'your phone'}`);
  };

  const handleSaveVoice = () => {
    localStorage.setItem('crm_voice_config', JSON.stringify(voiceConfig));
    showToast(`Voice settings saved!`);
  };

  const handleTestWhatsApp = () => {
    showToast(`WhatsApp Alert sent to ${handoverConfig.executiveWhatsApp || 'your number'}!`, MessageSquare);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-emerald-500/40 shadow-xl text-xs font-medium text-emerald-300">
          <toastMessage.icon className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Clean Minimal Navbar */}
      <Navbar 
        activeSubTab={activeSubTab} 
        setActiveSubTab={setActiveSubTab} 
        handoverConfig={handoverConfig}
      />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 py-6 md:py-8">
        {activeSubTab === 'handover' && (
          <HandoverSettingsView 
            config={handoverConfig} 
            setConfig={setHandoverConfig} 
            onSave={handleSaveHandover} 
            onTestWhatsApp={handleTestWhatsApp}
          />
        )}

        {activeSubTab === 'simulator' && (
          <LiveSimulatorView 
            rules={rules}
            handoverConfig={handoverConfig}
            voiceConfig={voiceConfig}
            onTriggerWhatsApp={handleTestWhatsApp}
          />
        )}

        {activeSubTab === 'filter' && (
          <LeadFilterView 
            rules={rules} 
            setRules={setRules} 
            onSave={handleSaveRules} 
          />
        )}

        {activeSubTab === 'voice' && (
          <VoiceStudioView 
            config={voiceConfig} 
            setConfig={setVoiceConfig} 
            onSave={handleSaveVoice} 
          />
        )}

        {activeSubTab === 'history' && (
          <div className="max-w-4xl mx-auto rounded-xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400 text-xs">
            No previous live calls logged yet. Complete a test call in the "Test Call" tab to see logs here.
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 py-3 text-center text-[11px] text-slate-500">
        AI Calling Department · Clean Minimal CRM
      </footer>
    </div>
  );
}
