import Logo from "./ui/logo";

export default function Footer() {
    return (
        <footer className="bg-gray-50">
            <hr className="border-gray-200" />
            
            <div className="max-w-8xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1 - Logo and CTA */}
                    <div className="flex flex-col items-center text-center">
                        <Logo />
                        <p className="text-sm text-center text-gray-500 mt-3">
                            AI calls and texts leads instantly to convert them.
                        </p>
                    </div>
                    
                    {/* Column 2 - Product */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>API</li>
                        </ul>
                    </div>
                    
                    {/* Column 3 - Company */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>About</li>
                            <li>Contact</li>
                            <li>Careers</li>
                        </ul>
                    </div>
                    
                    {/* Column 4 - Support */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>Help Center</li>
                            <li>Documentation</li>
                            <li>Status</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <hr className="border-gray-200" />
            
            {/* Copyright */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                <p className="text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Bella AI. All rights reserved.
                </p>
            </div>
        </footer>
    );
}