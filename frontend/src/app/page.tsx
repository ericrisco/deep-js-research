'use client';

import { Header } from '@/components/layout/Header';
import { SearchInput } from '@/components/search/SearchInput';
import { ResultDisplay } from '@/components/search/ResultDisplay';
import { Logo } from '@/components/ui/Logo';
import { useWebSocket } from '@/hooks/useWebSocket';
import { config } from '@/lib/config';

export default function Home() {
  const { 
    isProcessing, 
    processingStatus, 
    researchStatuses,
    finalResult,
    currentProgress,
    connectionError,
    startResearch 
  } = useWebSocket(config.websocketUrl);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        
        <div className="flex flex-col items-center w-full">
          <SearchInput 
            onSearch={startResearch} 
            isProcessing={isProcessing} 
          />
          
          <ResultDisplay 
            isProcessing={isProcessing}
            processingStatus={processingStatus}
            researchStatuses={researchStatuses}
            currentProgress={currentProgress}
            finalResult={finalResult}
            connectionError={connectionError}
          />
        </div>
        
        <footer className="mt-20 text-center text-sm text-gray-500">
          <div className="mb-4">
            <span className="bg-[#ffe600] text-black px-2 py-1 rounded font-bold">
              🔥 POWERED BY JAVASCRIPT
            </span>
          </div>
          
          <p className="mb-2">
            Powered by <a href="https://instagram.com/erisco.dev" target="_blank" rel="noopener noreferrer" className="text-[#ffe600] hover:underline">erisco.dev</a>
          </p>
          
          <p>© 2025 Deep JS Research. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
