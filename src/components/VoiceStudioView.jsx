import React, { useState } from 'react';
import { Sparkles, Play, Square, Save, Mic, Upload, CheckCircle2, Music } from 'lucide-react';

export default function VoiceStudioView({ config, setConfig, onSave }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceType, setVoiceType] = useState('clone'); // default to clone since user wants to use their own voice
  const [audioUrl, setAudioUrl] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setConfig({
        ...config,
        voicePreset: `My Custom Voice (${file.name})`,
        customVoiceId: `custom_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Voice Selection & Cloning</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Apni <strong>khud ki voice (audio file ya Voice ID)</strong> connect karein taaki AI bilkul aapki aawaz me bole.
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
        {/* Main Card: Use Existing Cloned Voice */}
        <div className="rounded-xl bg-slate-900 border border-emerald-500/40 p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mic className="h-4 w-4 text-emerald-400" />
              Use Your Existing Voice (Apni Voice File / Voice ID)
            </h2>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Zero Robotic Sound
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Agar aapke paas pehle se koi recording (.mp3/.wav) hai, ya ElevenLabs ki Voice ID hai, toh use direct yahan attach karein:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* 1. Upload existing audio file */}
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-5 text-center hover:border-emerald-500 transition bg-slate-950/60 flex flex-col items-center justify-center">
              <Upload className="h-7 w-7 text-emerald-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200 block">
                Upload Your Voice File (.mp3, .wav, .m4a)
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Jo voice aapke paas already hai, use yahan chunein
              </span>

              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleAudioUpload}
                className="hidden" 
                id="voice-file-upload" 
              />
              <label 
                htmlFor="voice-file-upload"
                className="mt-3 inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition shadow"
              >
                Choose Voice File
              </label>

              {fileName && (
                <div className="mt-3 text-xs text-emerald-300 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Selected: {fileName}</span>
                </div>
              )}
            </div>

            {/* 2. Or Paste Voice ID */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block mb-1">
                  Or Paste Your Existing Voice ID
                </span>
                <p className="text-[11px] text-slate-400">
                  ElevenLabs, PlayHT ya Cartesia me bani hui Voice ID yahan daal dein:
                </p>
                <input
                  type="text"
                  placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                  value={config.customVoiceId || ''}
                  onChange={(e) => setConfig({ ...config, customVoiceId: e.target.value })}
                  className="w-full mt-2 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="text-[11px] text-slate-500">
                ✅ Voice ID save karte hi AI telephony engine usi exact awaaz me call lagayega.
              </div>
            </div>
          </div>

          {/* Audio Player if file uploaded */}
          {audioUrl && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-200 font-medium">Listen Your Audio Sample:</span>
              </div>
              <audio controls src={audioUrl} className="h-8" />
            </div>
          )}
        </div>

        {/* Short Greeting Preview */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <h2 className="text-sm font-semibold text-slate-200">Opening Greeting (Sri Sri Plywood)</h2>
          <textarea
            rows={2}
            value={config.greeting}
            onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-3 outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-400">
            Ekdum short aur crisp opening line — koi extra lambe sawaal nahi.
          </p>
        </div>
      </div>
    </div>
  );
}
