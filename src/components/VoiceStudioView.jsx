import React, { useState } from 'react';
import { Sparkles, Play, Square, Volume2, Save } from 'lucide-react';

export default function VoiceStudioView({ config, setConfig, onSave }) {
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Voice & Persona Setup</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose voice style and opening greeting for your AI assistant.
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
        {/* Basic Settings */}
        <div className="rounded-xl bg-slate-900 border border-slate-800/80 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">AI Personality</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">AI Agent Name</label>
              <input
                type="text"
                value={config.agentName}
                onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Language</label>
              <select
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500"
              >
                <option value="Hinglish (Hindi + English)">Hinglish (Hindi + English - Most Natural)</option>
                <option value="Pure Hindi">Pure Hindi</option>
                <option value="Indian English">Indian English</option>
              </select>
            </div>
          </div>

          {/* Voice Presets */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-slate-300 block">Select Voice</label>
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
        </div>

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
              <span>Preview Voice</span>
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
