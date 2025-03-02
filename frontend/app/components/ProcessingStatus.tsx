import { useEffect, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import confetti from 'canvas-confetti';

interface ProcessingStatusProps {
  isProcessing: boolean;
  status: string;
  result: string;
  progress: number;
  onStop: () => void;
}

interface MarkdownProps {
  children?: ReactNode;
  [key: string]: any;
}

const MarkdownComponents: Partial<Components> = {
  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-white" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 text-white" {...props} />,
  h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 text-white" {...props} />,
  p: ({node, ...props}) => <p className="mb-4 text-white/90" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4" {...props} />,
  li: ({node, ...props}) => <li className="mb-2 text-white/90" {...props} />,
  a: ({node, href, ...props}) => (
    <a 
      className="text-[#FFE100] hover:text-[#FFE100]/80 hover:underline" 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({node, inline, className, children, ...props}) => {
    if (className?.includes('language-')) {
      return (
        <div className="relative group">
          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => navigator.clipboard.writeText(String(children))}
              className="px-2 py-1 text-xs bg-neutral-700 text-neutral-300 rounded hover:bg-neutral-600 transition-colors"
            >
              Copy
            </button>
          </div>
          <code className="block bg-[#1a1a1a] rounded-lg p-4 mb-4 overflow-x-auto text-white" {...props}>
            {children}
          </code>
        </div>
      );
    }
    return <code className="bg-[#1a1a1a] rounded px-1.5 py-0.5 text-[#FFE100]" {...props}>{children}</code>;
  },
  blockquote: ({node, ...props}) => (
    <blockquote 
      className="border-l-4 border-[#FFE100] pl-4 italic mb-4 text-white/70 bg-[#1a1a1a] p-4 rounded-r-lg"
      {...props}
    />
  ),
  hr: ({node, ...props}) => <hr className="border-neutral-800 my-8" {...props} />,
};

export const ProcessingStatus = ({ isProcessing, status, result, progress, onStop }: ProcessingStatusProps) => {
  useEffect(() => {
    if (!isProcessing && result) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const colors = ['#FFE100', '#FF1CF7', '#00FF00', '#00FFE0', '#FF0000', '#6100FF'];

      const frame = () => {
        const searchInput = document.querySelector('input[type="text"]');
        if (!searchInput) return;

        const rect = searchInput.getBoundingClientRect();
        const inputCenterX = (rect.left + rect.right) / 2 / window.innerWidth;
        const inputCenterY = rect.bottom / window.innerHeight;

        confetti({
          particleCount: 8,
          spread: 360,
          startVelocity: 30,
          origin: { x: inputCenterX, y: inputCenterY },
          colors: colors,
          ticks: 200
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isProcessing, result]);

  if (!isProcessing && !status && !result) return null;

  return (
    <div className="mt-6 p-6 bg-[#111] rounded-md border border-neutral-800 min-h-[100px]">
      {isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-spin h-5 w-5 border-2 border-[#FFE100] rounded-full border-t-transparent"></div>
              <p className="text-neutral-300">{status}</p>
            </div>
            <button
              onClick={onStop}
              className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
            >
              Detener proceso
            </button>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold inline-block text-[#FFE100]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-neutral-800">
              <div
                style={{ width: `${progress}%` }}
                className="flex flex-col justify-center rounded-full bg-[#FFE100] transition-all duration-500 ease-out"
              ></div>
            </div>
          </div>
        </div>
      )}
      {!isProcessing && result && (
        <div className="w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={MarkdownComponents}
          >
            {result}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}; 