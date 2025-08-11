"use client";

import { useState, useEffect } from "react";
import Logo from "./ui/logo";
import SigninButton from "./ui/signin-button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-8 left-10 border border-primary/50 right-10 z-50 transition-all duration-300 rounded-full ${
        isScrolled
          ? "bg-background/50 backdrop-blur-2xl shadow-2xl"
          : "bg-background/10 backdrop-blur-2xl"
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo - positioned to the very left */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Right side - all navigation and button grouped together */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#entreprise"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Entreprise
              </a>
              <a
                href="#pricing"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Pricing
              </a>
              <a
                href="#login"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                Login
              </a>
            </div>

            {/* Sign Up Button */}
            <div className="hidden md:block">
              <SigninButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              <a
                href="#entreprise"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entreprise
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#login"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </a>
              <div className="px-3 py-2">
                <SigninButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
