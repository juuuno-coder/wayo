"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config";

interface User {
    id: string;
    email: string;
    nickname?: string;
    avatarUrl?: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    showWelcome: boolean;
    clearWelcome: () => void;
    updateNickname: (nickname: string) => Promise<void>;
    syncGuestData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();

    // Load state from localStorage on init
    useEffect(() => {
        const initializeAuth = async () => {
            const savedToken = localStorage.getItem("authToken");
            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            // Optimistic load
            const savedUser = localStorage.getItem("userData");
            if (savedUser) {
                try {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                    setIsLoggedIn(true);
                } catch (e) {
                    console.error("Failed to parse saved user", e);
                }
            }

            try {
                // Verify with backend
                const apiUrl = API_BASE_URL;
                const response = await fetch(`${apiUrl}/users/me`, {
                    headers: {
                        'Authorization': savedToken.startsWith('Bearer ') ? savedToken : `Bearer ${savedToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    const normalizedUser = {
                        id: String(userData.id),
                        email: userData.email,
                        nickname: userData.nickname,
                        avatarUrl: userData.avatar_url
                    };

                    setUser(normalizedUser);
                    setIsLoggedIn(true);
                    setToken(savedToken);
                    localStorage.setItem("userData", JSON.stringify(normalizedUser));

                    // Cleanup legacy
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userId");
                } else if (response.status === 401) {
                    console.warn("Session expired, logging out");
                    logout();
                }
            } catch (error) {
                console.error("Auth verification failed", error);
                // If verification fails (network error etc), we might want to keep the local token or invalidate it.
                // For safety, let's assume if network fails we keep optimistic state but maybe show a warning.
                // For now, doing nothing is safest vs logging out on offline.
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Handle URL token capture
    useEffect(() => {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        const urlEmail = params.get("email");
        const urlId = params.get("id");
        const urlAvatar = params.get("avatar_url");

        if (urlToken && urlEmail && urlId) {
            const newUser = { id: urlId, email: urlEmail, avatarUrl: urlAvatar || undefined };
            login(urlToken, newUser);
            setShowWelcome(true);

            // Clean URL: remove auth params without full page reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);

            // Sync guest data after login
            syncGuestData(urlToken);
        }
    }, []);

    const syncGuestData = async (accessToken?: string) => {
        const tokenToUse = accessToken || token || localStorage.getItem("authToken");
        if (!tokenToUse) return;

        // Find all guest IDs in localStorage
        const keys = Object.keys(localStorage);
        const guestKeys = keys.filter(key => key.startsWith('wayo_guest_'));

        if (guestKeys.length === 0) return;

        const apiUrl = API_BASE_URL;

        for (const key of guestKeys) {
            const guestId = localStorage.getItem(key);
            if (!guestId) continue;

            try {
                // We assume there's an endpoint to claim a guest record
                // POST /users/me/claim_guest { guest_id: ... } OR PATCH /guests/:id { user_id: ... }
                // Let's use PATCH /guests/:id for now as it's simpler if the backend allows it
                // Note: Security-wise, the backend should verify the guest record is unowned or owned by session content
                // For this MVP, we will try to update it.
                await fetch(`${apiUrl}/guests/${guestId}/claim`, {
                    method: 'POST',
                    headers: {
                        'Authorization': tokenToUse.startsWith('Bearer ') ? tokenToUse : `Bearer ${tokenToUse}`,
                        'Content-Type': 'application/json'
                    }
                });

                // If successful, we can remove the local key or keep it? 
                // Let's keep it for now as a cache, or remove it to clean up.
                // localStorage.removeItem(key); 
            } catch (e) {
                console.error(`Failed to sync guest ${guestId}`, e);
            }
        }
    };

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("userData", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsLoggedIn(true);
        setIsLoading(false); // Ensure loading state is cleared after manual or URL login
        // Sync guest data
        syncGuestData(newToken);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userEmail"); // Legacy cleanup
        localStorage.removeItem("userId");    // Legacy cleanup
        setToken(null);
        setUser(null);
        setIsLoggedIn(false);
        setShowWelcome(false);
        router.push("/");
    };

    const clearWelcome = () => {
        setShowWelcome(false);
    };

    const updateNickname = async (newNickname: string) => {
        if (!token) return;

        try {
            const apiUrl = API_BASE_URL;
            const response = await fetch(`${apiUrl}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: { nickname: newNickname } })
            });

            if (response.ok) {
                const refreshedUserData = await response.json();
                const updatedUser = {
                    ...user!,
                    nickname: refreshedUserData.nickname,
                    avatarUrl: refreshedUserData.avatar_url
                };
                setUser(updatedUser);
                localStorage.setItem("userData", JSON.stringify(updatedUser));
            } else {
                throw new Error("Failed to update nickname");
            }
        } catch (error) {
            console.error("Nickname update failed", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, user, token, login, logout, showWelcome, clearWelcome, updateNickname, syncGuestData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
