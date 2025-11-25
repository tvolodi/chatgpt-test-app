'use client';

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react';

interface NavigationGuardContextType {
    isDirty: boolean;
    setIsDirty: (dirty: boolean) => void;
    confirmNavigation: (onConfirm: () => void) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | undefined>(undefined);

export function NavigationGuardProvider({ children }: { children: React.ReactNode }) {
    const [isDirty, setIsDirty] = useState(false);

    // Handle browser refresh/close
    useLayoutEffect(() => {
        console.log('Context: isDirty changed:', isDirty);
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            console.log('Context: handleBeforeUnload called. isDirty:', isDirty);
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const confirmNavigation = useCallback((onConfirm: () => void) => {
        if (isDirty) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                setIsDirty(false); // Reset dirty state on confirmation
                onConfirm();
            }
        } else {
            onConfirm();
        }
    }, [isDirty]);

    return (
        <NavigationGuardContext.Provider value={{ isDirty, setIsDirty, confirmNavigation }}>
            {children}
        </NavigationGuardContext.Provider>
    );
}

export function useNavigationGuard() {
    const context = useContext(NavigationGuardContext);
    if (context === undefined) {
        throw new Error('useNavigationGuard must be used within a NavigationGuardProvider');
    }
    return context;
}
