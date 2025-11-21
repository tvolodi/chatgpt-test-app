import { DashboardHeader } from "../../components/dashboard/Header";
import { DashboardSidebar } from "../../components/dashboard/Sidebar";
import { DashboardFooter } from "../../components/dashboard/Footer";
import type { ReactNode } from "react";
import type { CSSProperties } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div style={layoutStyle}>
            <DashboardHeader />
            <div style={bodyStyle}>
                <DashboardSidebar />
                <main style={mainStyle}>
                    {children}
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}

const layoutStyle: CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Inter, system-ui, sans-serif"
};

const bodyStyle: CSSProperties = {
    display: "flex",
    flex: 1
};

const mainStyle: CSSProperties = {
    flex: 1,
    padding: "24px",
    background: "linear-gradient(135deg, #F7F9FC 0%, #E8F4F8 100%)",
    minHeight: "calc(100vh - 64px - 48px)",
    overflow: "auto"
};
