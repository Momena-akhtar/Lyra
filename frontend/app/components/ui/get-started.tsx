import { ArrowRight } from "lucide-react";
export default function GetStarted() {
    return (
        <button className="w-[75%] bg-primary cursor-pointer text-foreground font-bold py-4 px-8 rounded-full text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02] inline-flex items-center justify-center gap-2 group">
                Get Started <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
    )
}