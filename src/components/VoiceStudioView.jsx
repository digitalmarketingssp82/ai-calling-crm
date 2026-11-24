import React, { useState } from 'react';
import { Sparkles, Play, Square, Volume2, Save, Mic, Upload, CheckCircle2 } from 'lucide-react';

export default function VoiceStudioView({ config, setConfig, onSave }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceType, setVoiceType] = useState('preset'); // 'preset' or 'clone'
  const [clonedFile, setClonedFile] = useState(null);
  const [isCloning, setIsCloning] = useState(false);

  const voices = [
    { id: 'v1', name: 'Priya (Hinglish Female)', desc: 'Natural, expressive sales voice with Indian accent' },
    { id: 'v2', name: 'Vikram (Indian Male)', desc: 'Professional, calm tone for B2B & high-ticket sales' },
    { id: 'v3', name: 'Neha (Energetic Female)', desc: 'Upbeat voice for fast outreach & events' }
  ];

  const handlePlayVoice = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      text || config.greeting.replace('{lead_name}', 'Rahul').replace('{agent_name}', config.agentName)
    );
    utterance.rate = config.speakingRate || 1.0;
    
    const availableVoices = window.speechSynthesis.getVoices();
    const match = availableVoices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (match) utterance.voice = match;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCloning(true);
      setTimeout(() => {
        setClonedFile(file.name);
        setIsCloning(false);
        setConfig({
          ...config,
          voicePreset: 'My Cloned Voice (' + file.name.split('.')[0] + ')',
          customVoiceId: 'cloned_' + Math.random().toString(36).substring(7)
        });
      }, 1500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Voice & Persona Setup</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Default AI voice chunein ya <strong>apni khud ki awaaz clone karein</strong>.
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

      <div className="space-y-5">
        {/* Voice Mode Selector: Preset vs Clone My Voice */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setVoiceType('preset')}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
              voiceType === 'preset'
                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-white">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Standard Ready-made Voices</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Indian Hinglish Male & Female expressive AI voices.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setVoiceType('clone')}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
              voiceType === 'clone'
                ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2 font-semibold text-xs text-white">
              <Mic className="h-4 w-4 text-emerald-400" />
              <span>Clone My Own Voice (Apni Awaaz)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Apna 1-minute audio sample dekar AI ko apni awaaz me bolna sikhayein.
            </p>
          </button>
        </div>

        {/* SECTION 1: Clone My Own Voice */}
        {voiceType === 'clone' && (
          <div className="rounded-xl bg-slate-900 border border-emerald-500/30 p-5 space-y-4 animate-fadeIn">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Mic className="h-4 w-4 text-emerald-400" />
                Instant Voice Cloning (ElevenLabs / Custom Model)
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                AI aapki exact voice pitch, tone aur accent copy kar lega. Client ko lagega aap hi baat kar rahe hain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Option A: Upload Audio File */}
              <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500/60 transition bg-slate-950/60">
                <Upload className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-200 block">
                  Upload Voice Sample (1-2 Min)
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  MP3, M4A ya WAV file (clean audio bina shor ke)
                </span>

                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="voice-upload" 
                />
                <label 
                  htmlFor="voice-upload"
                  className="mt-3 inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-1.5 rounded-lg cursor-pointer transition"
                >
                  {isCloning ? 'Cloning in Progress...' : 'Choose Audio File'}
                </label>

                {clonedFile && (
                  <div className="mt-2 text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Cloned: {clonedFile}</span>
                  </div>
                )}
              </div>

              {/* Option B: Direct Voice ID (ElevenLabs) */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-semibold text-slate-200 block">
                  Or Paste ElevenLabs Voice ID
                </span>
                <p className="text-[11px] text-slate-400">
                  Agar aapne pehle se ElevenLabs me voice clone ki hui hai, toh Voice ID yahan paste karein:
                </p>
                <input
                  type="text"
                  placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                  value={config.customVoiceId || ''}
                  onChange={(e) => setConfig({ ...config, customVoiceId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2 outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 block">
                  Ye ID Vapi/Retell me direct sync ho jati hai.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: Standard AI Voices */}
        {voiceType === 'preset' && (
          <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-5 space-y-3 animate-fadeIn">
            <h2 className="text-sm font-semibold text-slate-200">Select Ready-made Voice</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {voices.map((v) => {
                const isSelected = config.voicePreset?.includes(v.name.split(' ')[0]);
                return (
                  <div
                    key={v.id}
                    onClick={() => setConfig({ ...config, voicePreset: v.name })}
                    className={`p-3 rounded-lg border cursor-pointer transition flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-indigo-600/15 border-indigo-500 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-white">{v.name}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{v.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVoice(`Namaste! Main ${v.name.split(' ')[0]} bol rahi hoon.`);
                      }}
                      className="mt-3 text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      {isPlaying ? <Square className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                      <span>{isPlaying ? 'Stop' : 'Listen Sample'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Greeting Script */}
        <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Opening Greeting Line</h2>
            <button
              type="button"
              onClick={() => handlePlayVoice(config.greeting.replace('{lead_name}', 'Rahul').replace('{agent_name}', config.agentName))}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Test Greeting Audio</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={config.greeting}
            onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg p-3 outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
