import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import BottomNav from "@/components/BottomNav";
import GlobalSodami from "@/components/GlobalSodami";

export const metadata: Metadata = {
  title: "시절소담 — 제철 식재료로 짓는 한 끼",
  description: "절기를 따라 가장 맛있는 때의 식재료로 차리는 집밥 레시피, 시절소담입니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Hahmlet:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-pretendard: 'Pretendard', sans-serif;
            --font-logo: 'Nanum Pen Script', cursive;
            --font-hahmlet: 'Hahmlet', serif;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <AuthProvider>
          <FavoritesProvider>
            <div className="flex-1 pb-20">{children}</div>
            <GlobalSodami />
            <BottomNav />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
