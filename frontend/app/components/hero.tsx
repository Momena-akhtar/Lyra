'use client';

import CTA from './ui/cta';
import Lyra from './ui/lyra';

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 lg:px-16 xl:px-24 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="flex items-center justify-center gap-3">
          <div className="font-bold text-5xl lg:text-6xl xl:text-7xl">
            <Lyra />
          </div>
        </div>
        <p className="text-lg lg:text-xl text-muted leading-relaxed">
          Your intelligent AI companion for daily tasks
        </p>
        <CTA />
      </div>
    </div>
  );
} 
