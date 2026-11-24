import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Square, Save, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';

export default function VoiceStudioView({ 
  config, 
  setConfig, 
  onSave 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [testText, setTestText] = useState('Namaste! Sri Sri Plywood me aapka swagat hai. Main Pooja bol rahi hoon.');
  const [freeVoices, setFreeVoices] = useState([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState('');

  // Built-in curated 100% Free Voices (No API keys needed)
  const defaultFreeOptions = [
    { id: 'free-1', name: 'Pooja (Natural Hindi Female)', lang: 'hi-IN', desc: '100% Free · Soft & polite voice for Sri Sri Plywood calls' },
    { id: 'free-2', name: 'Kavita (Professional Expressive Female)', lang: 'hi-IN', desc: '100% Free · Clear Indian accent for retail & wholesale sales' },
    { id: 'free-3', name: 'Amit (Indian Business Male)', lang: 'hi-IN', desc: '100% Free · Calm & authoritative contractor tone' },
    { id: 'free-4', name: 'Rohan (Indian English & Hinglish)', lang: 'en-IN', desc: '100% Free · Fast corporate sales tone' }
  ];

  useEffect(() => {
    // Load free voices installed in browser
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const available = window.speechSynthesis.getVoices();
        const hindiOrIndian = available.filter(v => v.lang.includes('hi') || v.lang.includes('IN'));
        setFreeVoices(hindiOrIndian.length > 0 ? hindiOrIndian : available.slice(0, 5));
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handlePlayFreeVoice = (voiceId, sampleText) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sampleText || testText);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick selected free voice
    const available = window.speechSynthesis.getVoices();
    const match = available.find(v => v.voiceURI === voiceId || v.lang.includes('hi') || v.lang.includes('IN'));
    if (match) utterance.voice = match;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const selectFreeVoice = (opt) => {
    setConfig({
      ...config,
      voicePreset: opt.name,
      selectedFreeId: opt.id
    });
    setSelectedVoiceUri(opt.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>100% Free AI Voices</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Zero Cost · No API Key Needed
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Koi payment ya API key ki zaroorat nahi hai. Niche di gayi free voices me se select karein.
          </p>
        </div>

        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Voice</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Curated Free Voice Cards */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Available Free AI Voices for Sri Sri Plywood
            </h2>
            <span className="text-xs text-slate-400">Click to Select</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {defaultFreeOptions.map((opt) => {
              const isSelected = config.voicePreset?.includes(opt.name.split(' ')[0]) || selectedVoiceUri === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => selectFreeVoice(opt)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{opt.name}</span>
                      {isSelected && (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{opt.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayFreeVoice(opt.id, `Namaste! Sri Sri Plywood me aapka swagat hai. Main ${opt.name.split(' ')[0]} bol rahi hoon.`);
                    }}
                    className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 shrink-0 ml-3 cursor-pointer"
                    title="Play Sample"
                  >
                    {isPlaying ? <Square className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Short Greeting Preview */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Opening Greeting Line (Sri Sri Plywood)</h2>
            <button
              type="button"
              onClick={() => handlePlayFreeVoice(selectedVoiceUri, config.greeting)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Test Selected Voice</span>
            </button>
          </div>
          <textarea
            rows={2}
            value={config.greeting}
            onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-3 outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400">
            Call pick hone par AI sabse pehle ye line bolega, aur phir <strong>aapke bolne ka intezaar karega</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
