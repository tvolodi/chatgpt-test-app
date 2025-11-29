export function DashboardFooter() {
    return (
        <footer className="bg-walnut-800 text-walnut-50 px-6 py-3 border-t-2 border-walnut-600 mt-auto">
            <div className="flex items-center justify-between flex-wrap gap-4 text-sm font-retro-sans">
                {/* Copyright */}
                <div className="font-normal">
                    © 2025 AI-Dala. All rights reserved.
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                    <a href="/about" className="text-walnut-100 no-underline font-medium hover:text-walnut-50 transition-colors">About</a>
                    <span className="text-walnut-400">•</span>
                    <a href="/privacy" className="text-walnut-100 no-underline font-medium hover:text-walnut-50 transition-colors">Privacy Policy</a>
                    <span className="text-walnut-400">•</span>
                    <a href="/terms" className="text-walnut-100 no-underline font-medium hover:text-walnut-50 transition-colors">Terms of Service</a>
                </div>

                {/* Tagline */}
                <div className="italic text-retro-mustard font-normal font-retro">
                    &quot;Where Ideas Meet the Steppe — and Grow with AI&quot;
                </div>
            </div>
        </footer>
    );
}
