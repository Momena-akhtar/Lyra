import GetStarted from "./ui/get-started";
import WatchDemo from "./ui/watch-demo";
import Image from "next/image";

export default function Hero() {
    return (
      <div className="flex min-h-screen">
      {/* Left Side - CTA Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-8 max-w-lg">
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="block text-primary">Lead Generation</span>
          </h1>
          
          <p className="text-xl text-foreground mb-8 leading-relaxed">
            AI calls and texts leads instantly to convert them.
          </p>
          
          <div className="space-y-4">
            <GetStarted />
            <WatchDemo />
          </div>
          <p className="text-sm text-foreground/60 mt-6">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>
      
      {/* Right Side - Full Size Image */}
      <div className="flex-1 relative">
        <Image
          src="/bg.png"
          alt="Hero Background"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
    )
}