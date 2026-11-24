// LocalStorage helper so real data persists across refreshes
const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const defaultQualificationRules = {
  minBudget: 2500000, // 25 Lakhs
  maxTimelineDays: 30, // 30 days
  requireDecisionMaker: true,
  minScoreThreshold: 75,
  disallowedKeywords: [
    'job', 'naukri', 'internship', 'student', 'fake', 'timepass', 'wrong number', 'loan inquiry'
  ]
};

export const defaultHandoverConfig = {
  executiveName: '',
  executiveRole: 'Sales Manager / Closer',
  executivePhone: '',
  executiveWhatsApp: '',
  enableWhatsAppAlert: true,
  enableAudioWhisper: true,
  ringTimeoutSeconds: 20,
  whisperTemplate: `🚨 *LIVE CALL TRANSFER ALERT*
━━━━━━━━━━━━━━━━━━━━
👤 *Lead:* {lead_name}
📞 *Phone:* {phone}
🎯 *Need:* {requirement}
💰 *Budget:* ₹{budget}
⏰ *Timeline:* {timeline}
⭐ *AI Quality Score:* {score}%

📝 *Call Summary:*
{ai_summary}

⚡ *Call is ringing your phone right now. Answer with context!*`
};

export const defaultVoiceConfig = {
  agentName: 'AI Sales Executive',
  role: 'AI Relationship Manager',
  gender: 'Female',
  voicePreset: 'Hinglish Corporate Female (Expressive)',
  speakingRate: 1.0,
  language: 'Hinglish (Hindi + English)',
  greeting: 'Namaste {lead_name} ji! Main {agent_name} baat kar rahi hoon aapke CRM se. Kya main aapka 1 minute le sakti hoon?',
  objectionHandling: [
    {
      trigger: 'Price zyada hai / Budget issue',
      response: 'Samajh sakti hoon sir. Hamare paas flexible payment options aur customized offers bhi hain jo aapke budget me fit ho sakte hain.'
    },
    {
      trigger: 'Main abhi busy hoon',
      response: 'Sure sir! Main aapke WhatsApp par brochure bhej deti hoon. Kya shaam ko call back karu?'
    },
    {
      trigger: 'Mujhe human agent se baat karni hai',
      response: 'Ji bilkul, main abhi hamare manager ko ye call transfer kar rahi hoon. Line par bane rahein.'
    }
  ]
};
