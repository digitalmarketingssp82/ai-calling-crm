import React, { useState } from 'react';
import { 
  Sparkles, Play, Square, Volume2, Save, 
  Plus, Trash2, MessageSquare, CheckCircle2 
} from 'lucide-react';

export default function VoiceStudioView({ config, setConfig, onSave }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [newObjection, setNewObjection] = useState('');
  const [newResponse, setNewResponse] = useState('');

  const voices = [
    { id: 'v1', name: 'Priya (Hinglish Corporate Female)', lang: 'hi-IN', desc: 'Natural, expressive sales voice with soft Indian accent' },
    { id: 'v2', name: 'Neha (Energetic Marketing Specialist)', lang: 'hi-IN', desc: 'Upbeat, high energy for fast outreach & event calls' },
    { id: 'v3', name: 'Vikram (Authoritative Executive Male)', lang: 'en-IN', desc: 'Deep, calm, professional tone for B2B & high-ticket real estate' },
    { id: 'v4', name: 'Aditi (Polite Support & Follow-up)', lang: 'hi-IN', desc: 'Warm, patient voice suitable for customer assistance' }
  ];

  const handlePlayVoice = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser does not support speech synthesis.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      text || config.greeting.replace('{lead_name}', 'Rahul')
    );
    utterance.rate = config.speakingRate || 1.0;
    
    // Pick available voice if possible
    const availableVoices = window.speechSynthesis.getVoices();
    const hindiVoice = availableVoices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (hindiVoice) utterance.voice = hindiVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAddObjection = () => {
    if (newObjection.trim() && newResponse.trim()) {
      setConfig({
        ...config,
        objectionHandling: [
          ...config.objectionHandling,
          { trigger: newObjection.trim(), response: newResponse.trim() }
        ]
      });
      setNewObjection('');
      setNewResponse('');
    }
  };

  const handleRemoveObjection = (index) => {
    setConfig({
      ...config,
      objectionHandling: config.objectionHandling.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Voice & Persona Studio (Awaaz & Script Controls)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose voice characteristics, greeting lines, and customize how the AI responds to customer objections.
          </p>
        </div>
        <button
          onClick={onSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>Save Voice Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Voice Presets & Persona */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-indigo-400" />
              AI Persona & Voice Selection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Agent Name</label>
                <input
                  type="text"
                  value={config.agentName}
                  onChange={(e) => setConfig({ ...config, agentName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Bhasha / Language</label>
                <select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
                >
                  <option value="Hinglish (Hindi + English)">Hinglish (Hindi + English - Most Natural)</option>
                  <option value="Pure Hindi">Pure Hindi (Formal)</option>
                  <option value="Indian English">Indian English (Corporate)</option>
                </select>
              </div>
            </div>

            {/* Voice Cards */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs text-slate-400 font-medium block">Select Speech Model Voice</label>
              <div className="grid grid-cols-1 gap-2.5">
                {voices.map((v) => {
                  const isSelected = config.voicePreset === v.name;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setConfig({ ...config, voicePreset: v.name })}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-indigo-600/15 border-indigo-500/60 shadow-sm' 
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{v.name}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-indigo-500 text-white font-bold px-1.5 py-0.2 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{v.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayVoice(`Namaste! Main ${v.name.split(' ')[0]} baat kar rahi hoon aapke CRM se.`);
                        }}
                        className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 ml-3 shrink-0"
                        title="Listen Voice Sample"
                      >
                        {isPlaying ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Speed Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Speaking Pace / Speed</span>
                <span className="font-mono text-indigo-400">{config.speakingRate || 1.0}x Speed</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={config.speakingRate || 1.0}
                onChange={(e) => setConfig({ ...config, speakingRate: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Greeting & Objection Handling Matrix */}
        <div className="space-y-6">
          {/* Greeting Box */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Opening Greeting Script</h3>
              <button
                type="button"
                onClick={() => handlePlayVoice(config.greeting.replace('{lead_name}', 'Rahul'))}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>Play Audio Preview</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={config.greeting}
              onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 outline-none focus:border-indigo-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400">
              Ye line AI call pick hote hi sabse pehle bolega. Use tag <code className="text-indigo-300">{`{lead_name}`}</code> for dynamic greeting.
            </p>
          </div>

          {/* Objection Matrix */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Objection Handling Rules (Smart Counter-Pitches)
            </h3>

            {/* Existing List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {config.objectionHandling.map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 relative group">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-amber-300">
                      When lead says: "{item.trigger}"
                    </span>
                    <button
                      onClick={() => handleRemoveObjection(index)}
                      className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    👉 AI Response: "{item.response}"
                  </p>
                </div>
              ))}
            </div>

            {/* Add New Objection Form */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-medium text-slate-400">Add New Objection Rule</span>
              <input
                type="text"
                placeholder="Customer objection (e.g. Mere paas time nahi hai)..."
                value={newObjection}
                onChange={(e) => setNewObjection(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
              />
              <textarea
                rows={2}
                placeholder="AI ka counter response..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleAddObjection}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Save New Objection Rule</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
