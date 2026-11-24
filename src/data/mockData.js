export const defaultQualificationRules = {
  minBudget: 25000,
  maxTimelineDays: 15,
  requireDecisionMaker: true,
  minScoreThreshold: 75,
  disallowedKeywords: [
    'job', 'naukri', 'internship', 'student', 'donation', 'wrong number', 'scrap seller'
  ]
};

export const defaultHandoverConfig = {
  executiveName: 'Sri Sri Plywood Sales Head',
  executiveRole: 'Owner / Senior Sales',
  executivePhone: '',
  executiveWhatsApp: '',
  enableWhatsAppAlert: true,
  enableAudioWhisper: true,
  ringTimeoutSeconds: 20,
  whisperTemplate: `🚨 *SRI SRI PLYWOOD - LIVE LEAD TRANSFER*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* {lead_name}
📞 *Phone:* {phone}
🪵 *Item Required:* {requirement}
📍 *Site Location:* {site_location}
📦 *Quantity:* {quantity} Sheets
💰 *Estimated Order:* ₹{budget}
⏰ *Timeline:* {timeline}

📝 *AI Call Summary:*
{ai_summary}

⚡ *Call is ringing on your phone right now. Pick up and close the deal!*`
};

export const defaultVoiceConfig = {
  agentName: 'Pooja (Sri Sri Plywood)',
  companyName: 'Sri Sri Plywood',
  role: 'AI Relationship Executive',
  voicePreset: 'ElevenLabs Aditi (Human Natural Indian)',
  speakingRate: 0.95,
  language: 'Hinglish (Hindi + English)',
  greeting: 'Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja baat kar rahi hoon. Bataiye aapko commercial plywood, marine grade 710, ya blockboards me kya requirement hai?',
  productsKnowledge: [
    'Commercial MR Grade Plywood (IS 303) - 6mm, 9mm, 12mm, 16mm, 19mm',
    'Marine Grade Waterproof Plywood (IS 710) - Gurjan / Alternate Core with 25 yrs warranty',
    'Calibrated Plywood for Modular Kitchen & Wardrobes',
    'Flush Doors & Blockboards',
    'Decorative Laminates & Sunmica Sheets'
  ],
  objectionHandling: [
    {
      trigger: 'Rate bohot zyada hai / Discount chahiye',
      response: 'Sir hamara plywood direct factory pricing par 100% full gurjan core aur IS 710 certified hai. Agar aapka order wholesale quantity ka hai, toh hamare sales head direct best discount confirm karenge.'
    },
    {
      trigger: 'Delivery charges kitne honge?',
      response: 'Sir delivery charges aapki site location par depend karte hain. Bulk orders par hum direct truck transport arrange karwate hain.'
    }
  ]
};
