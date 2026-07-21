import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { FavoritesProvider } from "@/lib/favorites-context";
import BottomNav from "@/components/BottomNav";
import GlobalSodami from "@/components/GlobalSodami";
import WelcomeOnboarding from "@/components/WelcomeOnboarding";

/** 링크 공유 시 미리보기(카카오톡·메시지 등)에 쓰이는 절대 주소 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://sijeolsodam.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "시절소담 — 제철 식재료로 짓는 한 끼",
  description: "절기를 따라 가장 맛있는 때의 식재료로 차리는 집밥 레시피, 시절소담입니다.",
  openGraph: {
    type: "website",
    siteName: "시절소담",
    title: "시절소담 — 제철 식재료로 짓는 한 끼",
    description: "절기를 따라 가장 맛있는 때의 식재료로 차리는 집밥 레시피.",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
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
            <WelcomeOnboarding />
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
