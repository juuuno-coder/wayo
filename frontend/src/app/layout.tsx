import type { Metadata } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
});

import { headers } from "next/headers";

import { AuthProvider } from "@/contexts/AuthContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host") || "";
  const isWayoHost = host.includes("wayo") && !host.includes("gabojago");

  return (
    <html lang="ko">
      <head>
        {/* Portone (I'mport) SDK */}
        <Script src="https://cdn.iamport.kr/v1/iamport.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} antialiased`}>
        <AuthProvider>
          <LayoutClient initialState={{ isWayoHost }}>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
