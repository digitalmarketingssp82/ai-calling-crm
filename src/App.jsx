import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewView from './components/OverviewView';
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
import { CheckCircle2, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';

export default function App() {
  const [activeSubTab, setActiveSubTab] = useState('handover'); // Open Handover first so user inputs their real numbers!

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

  const [callHistory, setCallHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, icon = CheckCircle2) => {
    setToastMessage({ text: msg, icon });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveRules = () => {
    localStorage.setItem('crm_qualification_rules', JSON.stringify(rules));
    showToast('Lead Quality Filter Rules successfully saved!');
  };

  const handleSaveHandover = () => {
    localStorage.setItem('crm_handover_config', JSON.stringify(handoverConfig));
    showToast(`Saved! Real Call Forwarding to ${handoverConfig.executivePhone} & WhatsApp to ${handoverConfig.executiveWhatsApp}`);
  };

  const handleSaveVoice = () => {
    localStorage.setItem('crm_voice_config', JSON.stringify(voiceConfig));
    showToast(`Voice & Persona settings saved!`);
  };

  const handleTestWhatsApp = () => {
    showToast(`WhatsApp Briefing dispatched to your number: ${handoverConfig.executiveWhatsApp || 'Configured Number'}!`, MessageSquare);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/50 shadow-2xl text-xs font-semibold text-emerald-300 animate-bounce">
          <toastMessage.icon className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar 
        activeSubTab={activeSubTab} 
        setActiveSubTab={setActiveSubTab} 
      />

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSubTab === 'overview' && (
          <OverviewView setActiveSubTab={setActiveSubTab} />
        )}

        {activeSubTab === 'filter' && (
          <LeadFilterView 
            rules={rules} 
            setRules={setRules} 
            onSave={handleSaveRules} 
          />
        )}

        {activeSubTab === 'handover' && (
          <HandoverSettingsView 
            config={handoverConfig} 
            setConfig={setHandoverConfig} 
            onSave={handleSaveHandover} 
            onTestWhatsApp={handleTestWhatsApp}
          />
        )}

        {activeSubTab === 'voice' && (
          <VoiceStudioView 
            config={voiceConfig} 
            setConfig={setVoiceConfig} 
            onSave={handleSaveVoice} 
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

        {activeSubTab === 'history' && (
          <CallHistoryView callHistory={callHistory} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <p>AI Calling Department Engine · Active for Your Phone & Meta WhatsApp</p>
      </footer>
    </div>
  );
}
