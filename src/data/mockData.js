export const defaultQualificationRules = {
  minBudget: 25000, // ₹25,000 minimum order size for wholesale/direct transfer
  maxTimelineDays: 15, // Urgent / within 15 days
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
💰 *Estimated Order:* ₹{budget}
⏰ *Requirement Time:* {timeline}
⭐ *AI Score:* {score}% (High Intent Buyer)

📝 *AI Call Summary:*
{ai_summary}

⚡ *Call is ringing on your phone right now. Pick up and close the deal!*`
};

export const defaultVoiceConfig = {
  agentName: 'Pooja (Sri Sri Plywood)',
  companyName: 'Sri Sri Plywood',
  role: 'AI Relationship Executive',
  voicePreset: 'Hinglish Female (Natural)',
  speakingRate: 1.0,
  language: 'Hinglish (Hindi + English)',
  greeting: 'Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja baat kar rahi hoon. Bataiye aapko commercial plywood, marine grade 710, ya flush doors me kya requirement hai?',
  productsKnowledge: [
    'Commercial MR Grade Plywood (IS 303) - 6mm, 9mm, 12mm, 16mm, 19mm',
    'Marine Grade Waterproof Plywood (IS 710) - Gurjan / Alternate Core with 25 yrs warranty',
    'Calibrated Plywood for Modular Kitchen & Wardrobes',
    'Flush Doors & Blockboards',
    'Decorative Laminates & Sunmica Sheets (1mm & 0.8mm)'
  ],
  objectionHandling: [
    {
      trigger: 'Rate bohot zyada hai / Discount chahiye',
      response: 'Sir hamara plywood direct factory pricing par 100% full gurjan core aur IS 710 certified hai. Agar aapka order 20 sheets ya wholesale quantity ka hai, toh hamare sales head aapko best bulk discount offer de sakte hain.'
    },
    {
      trigger: 'Delivery charges kitne honge?',
      response: 'Sir aapki location par depend karta hai. Bulk orders par hum direct site delivery arrange karwate hain. Aapki site kahan par hai?'
    },
    {
      trigger: 'Bhaiya mujhe owner se baat karni hai',
      response: 'Ji bilkul sir! Main abhi hamare Senior Sales Manager ko ye call connect kar rahi hoon. Kripya 5 second line par bane rahein.'
    }
  ]
};
