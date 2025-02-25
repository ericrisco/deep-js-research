'use client';

import { useEffect, useRef } from 'react';
import { ResearchStep } from '@/services/websocket';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface ResearchStatus {
  step: ResearchStep;
  progress: number;
  details: string;
  timestamp: string;
}

interface ResultDisplayProps {
  isProcessing: boolean;
  processingStatus: string[];
  researchStatuses: ResearchStatus[];
  currentProgress: number;
  finalResult: string | null;
  connectionError?: string | null;
}

export function ResultDisplay({ 
  isProcessing, 
  processingStatus,
  researchStatuses,
  currentProgress,
  finalResult,
  connectionError
}: ResultDisplayProps) {
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultRef.current && processingStatus.length > 0) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [processingStatus]);

  if (!isProcessing && !finalResult && !connectionError) return null;

  const getStepName = (step: ResearchStep): string => {
    const stepNames: Record<ResearchStep, string> = {
      'search_planner': 'Planning Search',
      'search': 'Searching',
      'summarize': 'Summarizing',
      'analyze_gaps': 'Analyzing Gaps',
      'generate_structure': 'Generating Structure',
      'generate_content': 'Generating Content',
      'complete': 'Complete',
      'error': 'Error'
    };
    return stepNames[step] || step;
  };

  return (
    <div 
      ref={resultRef}
      className="w-full max-w-3xl mt-8 p-6 rounded-md border-2 border-gray-700 bg-black shadow-lg overflow-y-auto max-h-[60vh] transition-all duration-300"
    >
      {connectionError && (
        <div className="mb-4 p-4 border border-red-500 rounded-md bg-red-900 bg-opacity-20">
          <h3 className="text-lg font-medium text-red-400 mb-2">Connection Error</h3>
          <p className="text-red-300">{connectionError}</p>
          <p className="text-sm text-red-400 mt-2">Please try again or check if the research service is running.</p>
        </div>
      )}
      
      {isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="animate-pulse h-3 w-3 rounded-full bg-[#ffe600]"></div>
            <h3 className="text-lg font-medium text-white">
              <span className="bg-[#ffe600] text-black px-2 py-1 rounded">Processing</span> your query...
            </h3>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div 
              className="bg-[#ffe600] h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
          
          {/* Current step */}
          {researchStatuses.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Current step: {getStepName(researchStatuses[researchStatuses.length - 1].step)}</span>
                <span>{currentProgress}% complete</span>
              </div>
            </div>
          )}
          
          <div className="border border-gray-700 rounded-md p-4 bg-black">
            {processingStatus.map((status, index) => (
              <div key={index} className="text-sm text-gray-300 font-mono">
                <span className="text-[#ffe600]">$</span> {status}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isProcessing && finalResult && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            <span className="bg-[#ffe600] text-black px-2 py-1 rounded">Research</span> Results
          </h3>
          <div className="border border-gray-700 rounded-md p-4 bg-black text-gray-300 markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-white border-b border-gray-700 pb-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-white" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-white" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-base font-bold mt-3 mb-2 text-white" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-gray-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 text-gray-300" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                a: ({node, ...props}) => <a className="text-[#ffe600] hover:underline" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#ffe600] pl-4 italic my-4 text-gray-400" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-gray-800 px-1 py-0.5 rounded text-[#ffe600]" {...props} />
                    : <code className="block bg-gray-800 p-3 rounded-md my-4 overflow-x-auto text-gray-300 font-mono text-sm" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-transparent" {...props} />,
                hr: ({node, ...props}) => <hr className="my-6 border-gray-700" {...props} />,
                table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-gray-700" {...props} /></div>,
                thead: ({node, ...props}) => <thead className="bg-gray-800" {...props} />,
                tbody: ({node, ...props}) => <tbody className="divide-y divide-gray-700" {...props} />,
                tr: ({node, ...props}) => <tr className="hover:bg-gray-800" {...props} />,
                th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-3 text-sm" {...props} />,
                img: ({node, ...props}) => <img className="max-w-full h-auto my-4 rounded" {...props} />
              }}
            >
              {finalResult}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
} 