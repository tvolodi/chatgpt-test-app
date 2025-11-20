"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #F7F9FC 0%, #E8F4F8 100%)",
                fontFamily: "Inter, system-ui, sans-serif",
                padding: "24px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    padding: "48px 40px",
                    boxShadow: "0 20px 60px rgba(58, 155, 220, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)",
                    textAlign: "center"
                }}
            >
                {/* Logo */}
                <div style={{ marginBottom: "32px" }}>
                    <Image
                        src="/AI-Dala-logo.png"
                        alt="AI-Dala Logo"
                        width={120}
                        height={120}
                        style={{ margin: "0 auto" }}
                        priority
                    />
                </div>

                {/* Brand Name */}
                <div style={{ marginBottom: "8px" }}>
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "#3A9BDC",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase"
                        }}
                    >
                        AI-Dala
                    </span>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "#2B2B2B",
                        margin: "0 0 12px",
                        lineHeight: 1.2
                    }}
                >
                    Welcome Back
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: "16px",
                        color: "#6B7280",
                        margin: "0 0 40px",
                        lineHeight: 1.5
                    }}
                >
                    Sign in to access your dashboard and continue your journey on the Steppe
                </p>

                {/* Sign In Button */}
                <button
                    onClick={() => signIn("keycloak", { callbackUrl: "/dashboard" })}
                    style={{
                        width: "100%",
                        padding: "16px 24px",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        background: "linear-gradient(135deg, #3A9BDC 0%, #2B7FB8 100%)",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(58, 155, 220, 0.3)",
                        marginBottom: "24px"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(58, 155, 220, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(58, 155, 220, 0.3)";
                    }}
                >
                    Sign In with Keycloak
                </button>

                {/* Divider */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "32px 0",
                        gap: "16px"
                    }}
                >
                    <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                    <span style={{ fontSize: "14px", color: "#9CA3AF", fontWeight: 500 }}>
                        New to AI-Dala?
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                </div>

                {/* Info Text */}
                <p
                    style={{
                        fontSize: "14px",
                        color: "#6B7280",
                        lineHeight: 1.6,
                        margin: 0
                    }}
                >
                    Click the button above to sign in. If you don't have an account, you can create one on the Keycloak registration page.
                </p>

                {/* Footer Accent */}
                <div
                    style={{
                        marginTop: "40px",
                        paddingTop: "24px",
                        borderTop: "1px solid #E5E7EB"
                    }}
                >
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#9CA3AF",
                            margin: 0,
                            fontStyle: "italic"
                        }}
                    >
                        "Where Ideas Meet the Steppe — and Grow with AI"
                    </p>
                </div>
            </div>
        </div>
    );
}
