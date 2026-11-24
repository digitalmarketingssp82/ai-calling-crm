import React, { useState } from 'react';
import { Sparkles, Play, Square, Save, Mic, Upload, CheckCircle2, Music, Volume2 } from 'lucide-react';

export default function VoiceStudioView({ 
  config, 
  setConfig, 
  customVoiceAudio, 
  setCustomVoiceAudio,
  customVoiceFileName,
  setCustomVoiceFileName,
  onSave 
}) {
  const [isPlayingCustom, setIsPlayingCustom] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomVoiceFileName(file.name);
      try {
        localStorage.setItem('crm_custom_voice_filename', file.name);
      } catch (err) {}

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Audio = event.target.result;
        setCustomVoiceAudio(base64Audio);
        try {
          localStorage.setItem('crm_custom_voice_audio', base64Audio);
        } catch (err) {
          console.warn('Audio file is large, keeping in memory state');
        }

        setConfig({
          ...config,
          voicePreset: `My Cloned Voice (${file.name})`,
          customVoiceId: `custom_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const playCustomAudioSample = () => {
    if (!customVoiceAudio) return;

    if (isPlayingCustom && audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlayingCustom(false);
      return;
    }

    const audio = new Audio(customVoiceAudio);
    setAudioElement(audio);
    setIsPlayingCustom(true);

    audio.onended = () => setIsPlayingCustom(false);
    audio.onerror = () => setIsPlayingCustom(false);

    audio.play().catch(() => setIsPlayingCustom(false));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Voice Selection & Cloning</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Apni <strong>audio file ya voice recording</strong> upload karein taaki call me aapki aawaz bole.
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
        {/* Active Cloned Voice Status Banner */}
        {customVoiceAudio ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Aapki Cloned Voice Active Hai: <span className="text-emerald-300 font-mono">{customVoiceFileName || 'Custom Voice File'}</span>
                </span>
                <span className="text-[11px] text-emerald-300/80 block mt-0.5">
                  ✅ Ab "Test Call" me robotic aawaz band ho gayi hai, aapki hi audio file play hogi!
                </span>
              </div>
            </div>

            <button
              onClick={playCustomAudioSample}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow"
            >
              {isPlayingCustom ? <Square className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
              <span>{isPlayingCustom ? 'Stop Audio' : 'Play My Voice'}</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
            <span>⚠️ Abhi koi custom voice file uploaded nahi hai. Niche se apni voice file choose karein.</span>
          </div>
        )}

        {/* Upload Card */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mic className="h-4 w-4 text-emerald-400" />
            Upload Your Audio Recording (.mp3 / .wav)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500 transition bg-slate-950/60 flex flex-col items-center justify-center">
              <Upload className="h-8 w-8 text-emerald-400 mb-2" />
              <span className="text-xs font-semibold text-slate-200 block">
                Choose Your Voice File
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                MP3, WAV ya M4A audio file
              </span>

              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleAudioUpload}
                className="hidden" 
                id="voice-file-upload-main" 
              />
              <label 
                htmlFor="voice-file-upload-main"
                className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition shadow"
              >
                {customVoiceFileName ? 'Change Audio File' : 'Browse & Upload Audio File'}
              </label>

              {customVoiceFileName && (
                <span className="mt-2 text-[11px] text-emerald-400 font-mono">
                  Current: {customVoiceFileName}
                </span>
              )}
            </div>

            {/* Direct Voice ID Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-200 block mb-1">
                  Or Paste ElevenLabs Voice ID
                </span>
                <p className="text-[11px] text-slate-400">
                  ElevenLabs me bani hui Voice ID yahan daal kar connect karein:
                </p>
                <input
                  type="text"
                  placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                  value={config.customVoiceId || ''}
                  onChange={(e) => setConfig({ ...config, customVoiceId: e.target.value })}
                  className="w-full mt-2 bg-slate-900 border border-slate-700 text-white text-xs rounded-lg p-2.5 outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                💡 <strong>Tip:</strong> Upload karte hi "Test Call" me yehi audio automatically chalegi!
              </div>
            </div>
          </div>
        </div>

        {/* Opening Greeting */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <h2 className="text-sm font-semibold text-slate-200">Opening Greeting (Sri Sri Plywood)</h2>
          <textarea
            rows={2}
            value={config.greeting}
            onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-lg p-3 outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
