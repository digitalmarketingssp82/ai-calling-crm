import React, { useState } from 'react';
import { Sparkles, Play, Square, Save, Key, CheckCircle2, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function VoiceStudioView({ 
  config, 
  setConfig, 
  onSave 
}) {
  const [testText, setTestText] = useState('Namaste! Sri Sri Plywood me aapka swagat hai. Main aapki exact cloned aawaz me bol raha hoon!');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [fetchedVoices, setFetchedVoices] = useState([]);
  const [isFetchingVoices, setIsFetchingVoices] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // 1-Click Auto-Fetch all voices directly from the user's ElevenLabs account!
  const fetchMyElevenLabsVoices = async () => {
    if (!config.elevenLabsApiKey) {
      alert('Pehle apni ElevenLabs API Key enter karein.');
      return;
    }

    setIsFetchingVoices(true);
    setFetchError('');

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'xi-api-key': config.elevenLabsApiKey.trim()
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.detail?.message || `Invalid API Key (HTTP ${response.status})`);
      }

      const data = await response.json();
      const voicesList = data.voices || [];
      setFetchedVoices(voicesList);

      if (voicesList.length > 0) {
        // Auto select the first cloned voice or first available voice
        const cloned = voicesList.find(v => v.category === 'cloned') || voicesList[0];
        setConfig({
          ...config,
          customVoiceId: cloned.voice_id,
          voicePreset: cloned.name
        });
      }
      setIsFetchingVoices(false);
    } catch (err) {
      setIsFetchingVoices(false);
      setFetchError(err.message);
      alert('API Key check failed: ' + err.message);
    }
  };

  // Test ElevenLabs Dynamic Voice
  const testElevenLabsClonedVoice = async () => {
    if (!config.elevenLabsApiKey || !config.customVoiceId) {
      alert('Pehle ElevenLabs API Key aur Voice ID select karein.');
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
        const errBody = await response.json().catch(() => ({}));
        const errMsg = errBody?.detail?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      setIsGenerating(false);
      setIsPlayingTest(true);

      audio.onended = () => setIsPlayingTest(false);
      audio.onerror = () => setIsPlayingTest(false);

      audio.play();
    } catch (err) {
      setIsGenerating(false);
      alert(`Voice Test Failed: ${err.message}\n\nTip: "Fetch My Voices" button daba kar valid voice select karein.`);
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
              ElevenLabs Connected
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
        {/* ElevenLabs Connection Form */}
        <div className="rounded-xl bg-slate-900 border border-emerald-500/40 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              ElevenLabs Account Sync (1-Click Voice Selector)
            </h2>
            <a 
              href="https://elevenlabs.io" 
              target="_blank" 
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>ElevenLabs Dashboard</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-4">
            {/* Step 1: API Key Input with Fetch Button */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                ElevenLabs API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk_..."
                  value={config.elevenLabsApiKey || ''}
                  onChange={(e) => setConfig({ ...config, elevenLabsApiKey: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={fetchMyElevenLabsVoices}
                  disabled={isFetchingVoices || !config.elevenLabsApiKey}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isFetchingVoices ? 'animate-spin' : ''}`} />
                  <span>{isFetchingVoices ? 'Fetching...' : 'Fetch My Voices'}</span>
                </button>
              </div>
              <span className="text-[10px] text-slate-400 block">
                API Key daal kar <strong>"Fetch My Voices"</strong> dabayein, yeh aapke account ki saari real voices dhoondh lega.
              </span>
            </div>

            {/* Step 2: Auto-Fetched Voice Dropdown */}
            {fetchedVoices.length > 0 ? (
              <div className="space-y-1.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <label className="text-xs font-semibold text-emerald-300 block flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Select From Your ElevenLabs Voices ({fetchedVoices.length} Found)
                </label>
                <select
                  value={config.customVoiceId}
                  onChange={(e) => {
                    const selected = fetchedVoices.find(v => v.voice_id === e.target.value);
                    setConfig({
                      ...config,
                      customVoiceId: e.target.value,
                      voicePreset: selected ? selected.name : config.voicePreset
                    });
                  }}
                  className="w-full bg-slate-950 border border-emerald-500/60 text-white text-xs rounded-lg p-2.5 outline-none focus:border-emerald-400 font-medium"
                >
                  {fetchedVoices.map((v) => (
                    <option key={v.voice_id} value={v.voice_id}>
                      {v.name} {v.category === 'cloned' ? '⭐ (Your Cloned Voice)' : `(${v.category})`} — ID: {v.voice_id}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              /* Fallback Manual Voice ID input */
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
                <div className="flex gap-2 pt-1 text-[11px] text-slate-400">
                  <span>Common working voice:</span>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, customVoiceId: '21m00Tcm4TlvDq8ikWAM' })}
                    className="text-indigo-400 hover:underline font-mono"
                  >
                    21m00Tcm4TlvDq8ikWAM (Rachel)
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, customVoiceId: 'JBFqnCBsd6RMkjVDRZzb' })}
                    className="text-indigo-400 hover:underline font-mono"
                  >
                    JBFqnCBsd6RMkjVDRZzb (George)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Test Custom Sentence Box */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-xs font-medium text-slate-300 block">
              Test Sentence (AI ko is aawaz me bolte huye sunein):
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
                disabled={isGenerating || !config.customVoiceId}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {isGenerating ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isGenerating ? 'Generating Audio...' : 'Test In My Voice'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              ⚡ Ye button dabate hi ElevenLabs real-time me naye shabd generate karke bolega!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
