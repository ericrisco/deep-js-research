import { Logo } from '@/components/ui/Logo';

export function Header() {
  return (
    <header className="text-center mb-16">
      <div className="flex items-center justify-center mb-8">
        <Logo width={80} height={80} className="mr-4" />
        <div className="text-left">
          <h2 className="text-2xl font-bold">Deep JS Research</h2>
          <div className="flex items-center">
            <span className="text-sm mr-2">2025</span>
          </div>
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
        Deep JS Research <span className="text-7xl md:text-8xl">2025</span>
      </h1>
      
      <div className="flex justify-center mb-8">
        <h2 className="text-2xl md:text-4xl">
          Una <span className="highlight">experiencia</span> de JavaScript
        </h2>
      </div>
      
      <p className="text-xl md:text-2xl mb-8">
        <span className="accent-yellow px-4 py-1 rounded-md">200$? No gracias OpenAI, lo hago gratis</span>
      </p>
    </header>
  );
} 