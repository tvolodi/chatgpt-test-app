"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { CSSProperties } from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div style={loadingStyle}>
                <div style={spinnerStyle}>Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div style={containerStyle}>
            {/* Welcome Section */}
            <div style={welcomeCardStyle}>
                <div style={brandBadgeStyle}>AI-DALA</div>
                <h1 style={headingStyle}>
                    Welcome back, {session.user?.name || "User"}!
                </h1>
                <p style={subtitleStyle}>
                    Your journey on the Steppe continues. Explore AI-powered content, manage your learning, and grow with AI-Dala.
                </p>
            </div>

            {/* Quick Stats */}
            <div style={statsGridStyle}>
                <div style={statCardStyle}>
                    <div style={statIconStyle}>📰</div>
                    <div style={statValueStyle}>12</div>
                    <div style={statLabelStyle}>News Articles</div>
                </div>
                <div style={statCardStyle}>
                    <div style={statIconStyle}>📝</div>
                    <div style={statValueStyle}>8</div>
                    <div style={statLabelStyle}>Saved Articles</div>
                </div>
                <div style={statCardStyle}>
                    <div style={statIconStyle}>🎓</div>
                    <div style={statValueStyle}>3</div>
                    <div style={statLabelStyle}>Courses</div>
                </div>
                <div style={statCardStyle}>
                    <div style={statIconStyle}>⭐</div>
                    <div style={statValueStyle}>24</div>
                    <div style={statLabelStyle}>Achievements</div>
                </div>
            </div>

            {/* Info Message */}
            <div style={infoBoxStyle}>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6 }}>
                    <strong>Note:</strong> This is the initial dashboard layout. Specific features and widgets will be added in future requirements (REQ-007).
                </p>
            </div>
        </div>
    );
}

const containerStyle: CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto"
};

const loadingStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px"
};

const spinnerStyle: CSSProperties = {
    fontSize: "18px",
    color: "#3A9BDC",
    fontWeight: 600
};

const welcomeCardStyle: CSSProperties = {
    background: "#FFFFFF",
    borderRadius: 16,
    padding: "48px 40px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
    marginBottom: 32,
    textAlign: "center"
};

const brandBadgeStyle: CSSProperties = {
    display: "inline-block",
    padding: "6px 16px",
    background: "linear-gradient(135deg, #3A9BDC 0%, #2B7FB8 100%)",
    color: "#FFFFFF",
    borderRadius: 20,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    marginBottom: 16
};

const headingStyle: CSSProperties = {
    fontSize: "36px",
    fontWeight: 700,
    color: "#2B2B2B",
    margin: "0 0 16px",
    lineHeight: 1.2
};

const subtitleStyle: CSSProperties = {
    fontSize: "16px",
    color: "#6B7280",
    margin: 0,
    lineHeight: 1.6,
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto"
};

const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 32
};

const statCardStyle: CSSProperties = {
    background: "#FFFFFF",
    borderRadius: 12,
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease"
};

const statIconStyle: CSSProperties = {
    fontSize: 32,
    marginBottom: 12
};

const statValueStyle: CSSProperties = {
    fontSize: "32px",
    fontWeight: 700,
    color: "#3A9BDC",
    margin: "0 0 8px"
};

const statLabelStyle: CSSProperties = {
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: 600
};

const infoBoxStyle: CSSProperties = {
    background: "#E8F4F8",
    border: "1px solid #3A9BDC",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#2B2B2B"
};
