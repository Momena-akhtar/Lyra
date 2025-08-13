import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <button className="group
        relative
        cursor-pointer
        inline-flex
        items-center
        gap-3
        px-8
        py-4
        bg-gradient-to-r
        from-primary
        to-accent
        text-foreground
        font-semibold 
        rounded-full 
        transition-all 
        duration-300
        transform 
        hover:scale-102">
            <span>Start Chatting</span>
            <ArrowRight className="w-5
            h-5
            transition-transform
            duration-300
            group-hover:translate-x-1" />
        </button>
    );
}
