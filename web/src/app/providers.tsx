"use client";

import { SessionProvider } from "next-auth/react";
import { NavigationGuardProvider } from "./context/NavigationGuardContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NavigationGuardProvider>
                {children}
            </NavigationGuardProvider>
        </SessionProvider>
    );
}
