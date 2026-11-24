# AI Calling Department · CRM Autonomous Voice & WhatsApp Suite

Ye project aapke CRM ke liye complete **AI Calling Department** ka working prototype hai jise aap **Vercel** par test kar sakte hain aur **Lovable CRM** me integrate kar sakte hain.

---

## 🌟 Key Features Included

1. **Lead Quality Filtering Engine (AI Guard):**
   - Minimum Budget threshold (₹25L default)
   - Purchase timeline requirements (15, 30, 60 days)
   - Decision Maker requirement
   - **Disallowed / Junk Keywords filter:** Detects words like `job`, `naukri`, `internship`, `student`, `fake` and automatically blocks transfer!
   - Minimum Score Threshold for human escalation.

2. **Human Handover & WhatsApp Whisper Alert (Sabse Zaroori Feature):**
   - **Pre-Call WhatsApp Whisper Alert:** Call ring hone se 2 second pehle Executive ke WhatsApp par bullet-point summary aati hai (`{lead_name}`, `{phone}`, `{requirement}`, `{budget}`, `{timeline}`, `{ai_summary}`).
   - **Audio Whisper:** Executive phone uthate hi 2 second ka audio brief sunta hai kaan me.
   - **100% Dynamic:** Executive ka Name, Mobile Number, aur WhatsApp Number dashboard se kabhi bhi change ho sakta hai.

3. **Voice & Persona Studio:**
   - Agent Name & Persona selector
   - Realistic Web Speech API Voice Preview (Browser bolkar sunata hai)
   - Opening Greeting Script editor
   - Objection Handling Matrix (e.g. *Price zyada hai* -> AI counter response)

4. **Interactive Call Sandbox & Live Simulator:**
   - **Scenario 1:** High-Quality Lead (Rahul Sharma · ₹1.75 Cr) $\rightarrow$ Qualifies, WhatsApp fires to executive, bridges call!
   - **Scenario 2:** Job Seeker (Aman Verma) $\rightarrow$ AI detects "job" keyword, scores 18%, blocks transfer, saves human executive's time!
   - **Scenario 3:** Low Budget (Suresh Kumar) $\rightarrow$ AI handles via WhatsApp catalog link.

5. **Call History & Intelligence:**
   - Audio waveform player
   - Full Hinglish conversation transcripts
   - Extracted budget & timeline tags

---

## 🚀 How to Run Locally

```bash
# Navigate to directory
cd C:\Users\Admin\.gemini\antigravity\scratch\ai-calling-crm

# Start local server
npm run dev
```

App will run instantly on `http://localhost:5173`.

---

## ☁️ How to Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npx vercel
```

### Option B: Push to GitHub & Import in Vercel
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: AI Calling Department with WhatsApp handover"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Vercel dashboard par jayein $\rightarrow$ **Add New Project** $\rightarrow$ GitHub repo select karein $\rightarrow$ **Deploy** click karein!

Vite framework automatically detect ho jayega aur 1 minute me live ho jayega!
