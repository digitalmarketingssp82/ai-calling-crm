export const defaultQualificationRules = {
  minBudget: 25000,
  maxTimelineDays: 15,
  serviceArea: 'Mohali / Tricity (Chandigarh, Mohali, Panchkula, Zirakpur, Kharar)',
  disallowedKeywords: [
    'job', 'naukri', 'internship', 'student', 'donation', 'wrong number'
  ]
};

export const defaultHandoverConfig = {
  executiveName: 'Sri Sri Plywood Owner',
  executiveRole: 'Owner / Senior Sales',
  executivePhone: '',
  executiveWhatsApp: '',
  enableWhatsAppAlert: true,
  whisperTemplate: `🚨 *SRI SRI PLYWOOD - TRICITY LEAD*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Customer:* {lead_name}
📞 *Phone:* {phone}
🪵 *Item:* {requirement}
📍 *Site:* {site_location} (Tricity Verified)
📦 *Quantity:* {quantity} Sheets
💰 *Order Est:* ₹{budget}

⚡ *Connecting to your phone right now. Close the deal!*`
};

export const defaultVoiceConfig = {
  agentName: 'Pooja (Sri Sri Plywood)',
  companyName: 'Sri Sri Plywood',
  deliveryArea: 'Mohali, Chandigarh, Panchkula, Zirakpur, Kharar only',
  voicePreset: 'Custom Cloned Voice',
  customVoiceId: '',
  speakingRate: 1.0,
  language: 'Hinglish',
  greeting: 'Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja bol rahi hoon, bataiye kis item ki inquiry thi?',
  productsRates: {
    '19mm Marine IS 710': '₹85 se ₹95 per sq ft (Full Waterproof Gurjan Core)',
    '12mm Marine IS 710': '₹65 se ₹75 per sq ft',
    '19mm Commercial MR': '₹55 se ₹65 per sq ft',
    'Flush Doors': '₹1,800 se ₹3,200 per piece'
  }
};
