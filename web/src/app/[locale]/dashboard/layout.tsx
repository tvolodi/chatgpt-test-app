import { DashboardHeader } from "../../components/dashboard/Header";
import { DashboardSidebar } from "../../components/dashboard/Sidebar";
import { DashboardFooter } from "../../components/dashboard/Footer";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col font-retro-sans">
            <DashboardHeader />
            <div className="flex flex-1">
                <DashboardSidebar />
                <main className="flex-1 p-6 bg-retro-cream min-h-[calc(100vh-64px-48px)] overflow-auto">
                    {children}
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
