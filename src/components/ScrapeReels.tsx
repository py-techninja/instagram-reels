import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Loader2 } from 'lucide-react';
import { fetchReels } from '../services/instagram';
import ReelsTable from './ReelsTable';
import MetadataDisplay from './MetadataDisplay';
import { Reel, Metadata, FetchReelsResponse } from '../types';

function App() {
  const [input, setInput] = useState('');
  const [audioId, setAudioId] = useState('');
  const [reels, setReels] = useState<Reel[]>([]);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState('');
  const [interval, setInterval] = useState(2);
  const [showIntervalInput, setShowIntervalInput] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);

  const scrapingRef = useRef(false);
  const pausedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const url = new URL(window.location);
    const audioIdParam = url.pathname.split('/audio/')[1];
    const restartParam = url.searchParams.get('restart');

    if (audioIdParam) {
      setInput(audioIdParam);
      setAudioId(audioIdParam);
      startScraping(audioIdParam, undefined, restartParam === 'true');
    }
  }, []);

  const extractAudioId = (input: string): string => {
    const match = input.match(/\/audio\/(\d+)/);
    return match ? match[1] : input;
  };

  const updateURL = (id: string) => {
    window.history.replaceState(null, '', `/audio/${id}`);
  };

  const startScraping = async (id?: string, sessionId_?: string, restart?: boolean) => {
    const extractedId = id || extractAudioId(input);
    if (!extractedId) {
      setError('Please enter a valid Audio ID or URL');
      return;
    }

    setScraping(true);
    setLoading(true);
    scrapingRef.current = true;
    pausedRef.current = false;
    setPaused(false);
    setError('');

    if (!reels.length) {
      setReels([]);
      setMetadata(null);
    }

    setAudioId(extractedId);
    updateURL(extractedId);

    const performScrape = async (sid?: string) => {
      try {
        const data = await fetchReels(extractedId, sid, restart);
        setReels(prev => [...prev, ...data.reels]);
        setMetadata(data.metadata);
        setSessionId(data.sessionId);
        setHasMore(data.hasMore);

        if (scrapingRef.current && data.hasMore && !pausedRef.current) {
          setLoading(false);
          await new Promise(resolve => setTimeout(resolve, interval * 1000));

          if (scrapingRef.current && !pausedRef.current) {
            await performScrape(data.sessionId);
          }
        } else {
          setLoading(false);
          if (data.hasMore === false) {
            setScraping(false);
            scrapingRef.current = false;
          }
        }
      } catch (err) {
        setError('Failed to fetch reels. Please check your cookie or try again.');
        console.error(err);
        setLoading(false);
        setScraping(false);
        scrapingRef.current = false;
      }
    };

    await performScrape(sessionId_);
  };

  const handleStart = async () => {
    handleStop();
    await new Promise(resolve => setTimeout(resolve, 300));
    startScraping(audioId, undefined, false);
  };
  
  const handlePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current );
    if (pausedRef.current) {
      setLoading(false);
    }else{
      handleStart()
    }
    
  };

  const handleStop = () => {
    scrapingRef.current = false;
    pausedRef.current = false;
    setScraping(false);
    setPaused(false);
    setLoading(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  };

  const handleRestart = () => {
    setShowRestartDialog(true);
    handleStop()
  };

  const confirmRestart = async () => {
    setShowRestartDialog(false);
    handleStop();
    await new Promise(resolve => setTimeout(resolve, 300));
    startScraping(audioId, undefined, true);
  };
  
  const cancelRestart = () => {
    setShowRestartDialog(false);
    handleStart()
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Instagram Audio Reels Scraper</h1>
          <p className="text-slate-600">Enter an Audio ID or URL to scrape reels data indefinitely</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !scraping && startScraping()}
                placeholder="Audio ID or URL (e.g., 1031472805651370 or https://www.instagram.com/reels/audio/...)"
                disabled={scraping}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
              />
            </div>

            <div className="flex gap-2">
              {!scraping ? (
                <button
                  onClick={() => startScraping()}
                  disabled={loading || !input}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Start
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePause}
                    className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors text-white ${
                      paused ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-600 hover:bg-yellow-700'
                    }`}
                  >
                    {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {paused ? 'Resume' : 'Pause'}
                  </button>

                  <button
                    onClick={handleStop}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                  >
                    <Square className="w-5 h-5" />
                    Stop
                  </button>

                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
                  >
                    Restart
                  </button>
                </>
              )}
              {showRestartDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-[350px] shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">
                      Confirm Restart
                    </h2>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-6">
                      Are you sure you want to restart this scraping?
                    </p>
              
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={cancelRestart}
                        className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded-md"
                      >
                        Cancel
                      </button>
              
                      <button
                        onClick={confirmRestart}
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                      >
                        Restart
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
            

            <div className="relative">
              <button
                onClick={() => setShowIntervalInput(!showIntervalInput)}
                className="px-4 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
              >
                {interval}s
              </button>

              {showIntervalInput && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-slate-300 rounded-lg p-3 shadow-lg z-10">
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Interval (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={interval}
                    onChange={(e) => setInterval(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)))}
                    className="w-20 px-2 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scraping...</span>
              </div>
            )}
            {paused && (
              <div className="text-yellow-600 font-medium">Paused</div>
            )}
            {scraping && !loading && !paused && (
              <div className="text-green-600 font-medium">Ready for next request</div>
            )}
            {!scraping && metadata && (
              <div className="text-slate-600">Scraping completed</div>
            )}
          </div>

          {error && (
            <p className="mt-3 text-red-600 text-sm">{error}</p>
          )}
        </div>

        {metadata && (
          <>
            <MetadataDisplay metadata={metadata} />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ReelsTable reels={reels} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
