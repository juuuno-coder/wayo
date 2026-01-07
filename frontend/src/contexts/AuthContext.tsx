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
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    showWelcome: boolean;
    clearWelcome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const router = useRouter();

    // Load state from localStorage on init
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("userData");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
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

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout, showWelcome, clearWelcome }}>
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
