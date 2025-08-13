import Lyra from './ui/lyra';
import Signup from './ui/signup';

export default function Navbar() {
    return (
        <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-7 py-4 lg:px-9 xl:px-12 bg-background/80 backdrop-blur-sm rounded-full border border-border/50 shadow-lg">
            <div className="text-lg lg:text-xl xl:text-2xl">
                <Lyra />
            </div>
            <Signup />
        </nav>
    );
}
