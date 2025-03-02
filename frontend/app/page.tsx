'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { SearchInput } from './components/SearchInput';
import { ProcessingStatus } from './components/ProcessingStatus';
import { WebSocketService } from './services/websocket.service';

const STEP_PROGRESS = {
  'search_planner': 10,
  'search': 25,
  'summarize': 40,
  'analyze_gaps': 60,
  'generate_structure': 75,
  'generate_content': 90,
  'complete': 100,
  'error': 0
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [wsService] = useState(() => new WebSocketService());

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await wsService.connect();
        wsService.onMessage((message) => {
          setStatus(message.details);
          setProgress(STEP_PROGRESS[message.step] || 0);

          if (message.step === 'complete') {
            setResult(message.completion || '');
            setIsProcessing(false);
          } else if (message.step === 'error') {
            setResult(`Error: ${message.details}`);
            setIsProcessing(false);
          }
        });
      } catch (error) {
        setStatus('Error connecting to research service');
        console.error('WebSocket connection error:', error);
      }
    };

    connectWebSocket();

    return () => {
      wsService.disconnect();
    };
  }, [wsService]);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!query.trim() || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setStatus('Initializing research...');
      setResult('');
      setProgress(0);
      wsService.startResearch(query);
    } catch (error) {
      setStatus('Error starting research');
      setIsProcessing(false);
      console.error('Error starting research:', error);
    }
  };

  const handleStop = () => {
    wsService.disconnect();
    setIsProcessing(false);
    setStatus('Research stopped by user');
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-[#111] bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:24px_24px]">
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold text-neutral-300 mb-8">
            Deep JS Research
          </h1>
          <h2 className="text-3xl text-neutral-400 mb-4">
            Una experiencia <span className="bg-[#FFE100] text-black px-2">exclusiva</span> de
          </h2>
          <h3 className="text-4xl text-neutral-300 mb-6">
            JavaScript
          </h3>
          <p className="text-xl text-neutral-400">
            ¿200$ por una IA? Esta es <span className="text-[#FFE100]">Open Source</span> y totalmente gratuita
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <SearchInput
            value={query}
            onChange={handleQueryChange}
            onSearch={handleSearch}
            isProcessing={isProcessing}
          />
          <ProcessingStatus
            isProcessing={isProcessing}
            status={status}
            result={result}
            progress={progress}
            onStop={handleStop}
          />
        </div>
      </main>
    </div>
  );
}
