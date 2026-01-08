"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

            if (!savedToken) return;

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
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://wayo.fly.dev";
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
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("userData", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        setIsLoggedIn(true);
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
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://wayo.fly.dev";
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
        <AuthContext.Provider value={{ isLoggedIn, isLoading, user, token, login, logout, showWelcome, clearWelcome, updateNickname }}>
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
