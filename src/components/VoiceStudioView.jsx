import React, { useState } from 'react';
import { Sparkles, Play, Square, Save, Mic, Key, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function VoiceStudioView({ 
  config, 
  setConfig, 
  onSave 
}) {
  const [testText, setTestText] = useState('Namaste! Sri Sri Plywood me aapka swagat hai. Main aapki exact cloned aawaz me bol raha hoon!');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [testAudio, setTestAudio] = useState(null);

  // Test Real ElevenLabs Dynamic Cloned Voice
  const testElevenLabsClonedVoice = async () => {
    if (!config.elevenLabsApiKey || !config.customVoiceId) {
      alert('Pehle ElevenLabs API Key aur Voice ID enter karein.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.customVoiceId.trim()}`, {
        method: 'POST',
        headers: {
          'xi-api-key': config.elevenLabsApiKey.trim(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: testText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} (Check your API Key or Voice ID)`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setTestAudio(audio);

      setIsGenerating(false);
      setIsPlayingTest(true);

      audio.onended = () => setIsPlayingTest(false);
      audio.onerror = () => setIsPlayingTest(false);

      audio.play();
    } catch (err) {
      setIsGenerating(false);
      alert('Voice Clone test failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Real AI Voice Cloning Engine</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Dynamic Neural Voice
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aapki aawaz clone hokar AI ke <strong>har naye dialogue ko real-time me generate</strong> karegi.
          </p>
        </div>

        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Voice Settings</span>
        </button>
      </div>

      <div className="space-y-5">
        {/* Concept Clarification Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white flex items-center gap-2">
            <Mic className="h-4 w-4 text-emerald-400" />
            <span>Asli Voice Cloning Kaise Kaam Karti Hai?</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Sirf ek audio file chala dena AI nahi hota. Asli AI Voice Cloning me <strong>aawaz aapki hoti hai, lekin shabd AI ke naye hote hain</strong> (jaise Sri Sri Plywood ke rates, Tricity delivery, discount). 
            Iske liye ElevenLabs ka neural model aapki aawaz ko naye shabdon me convert karta hai.
          </p>
        </div>

        {/* ElevenLabs Connection Form */}
        <div className="rounded-xl bg-slate-900 border border-emerald-500/40 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              Connect Your ElevenLabs Voice Clone
            </h2>
            <a 
              href="https://elevenlabs.io" 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Get Free API Key on elevenlabs.io</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* API Key */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                ElevenLabs API Key
              </label>
              <input
                type="password"
                placeholder="sk_..."
                value={config.elevenLabsApiKey || ''}
                onChange={(e) => setConfig({ ...config, elevenLabsApiKey: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-2.5 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 block">
                ElevenLabs profile icon $\rightarrow$ "API Keys" me mil jati hai.
              </span>
            </div>

            {/* Voice ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Aapki Cloned Voice ID
              </label>
              <input
                type="text"
                placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                value={config.customVoiceId || ''}
                onChange={(e) => setConfig({ ...config, customVoiceId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-2.5 outline-none focus:border-emerald-500 font-mono"
              />
              <span className="text-[10px] text-slate-500 block">
                Voice lab me apni aawaz clone karne ke baad Voice ID copy karein.
              </span>
            </div>
          </div>

          {/* Test Custom Sentence Box */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-300 block">
              Test Sentence (AI ko apni cloned voice me naye shabd bolte huye sunein):
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={testElevenLabsClonedVoice}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                {isGenerating ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isGenerating ? 'Generating Your Voice...' : 'Test In My Voice'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              ⚡ Ye button dabate hi AI real-time me aapke dale hue shabdon ko aapki hi aawaz me generate karke bolega!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
