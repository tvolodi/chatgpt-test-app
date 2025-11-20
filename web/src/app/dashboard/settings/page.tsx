export default function DashboardSettingsPage() {
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#2B2B2B", marginBottom: 16 }}>
                Settings
            </h1>
            <p style={{ fontSize: "16px", color: "#6B7280", marginBottom: 24 }}>
                Manage your account settings and preferences.
            </p>
            <div style={{
                background: "#FFFFFF",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)"
            }}>
                <p style={{ margin: 0, color: "#6B7280" }}>
                    This page will be implemented in REQ-006 (User Profile & Settings).
                </p>
            </div>
        </div>
    );
}
