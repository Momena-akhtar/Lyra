'use client';

import { useRouter } from 'next/navigation';

export default function Signup() {
    const router = useRouter();

    const handleSignupClick = () => {
        router.push('/signin');
    };

    return (
        <button 
            onClick={handleSignupClick}
            className="font-semibold
            cursor-pointer
            px-5
            py-2
            bg-gradient-to-r
            from-primary
            to-accent
            text-white
            rounded-full 
            transition-all
            duration-300
            text-base
            hover:scale-102"
        >
            Sign Up
        </button>
    );
}