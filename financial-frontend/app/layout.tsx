import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getSettings } from "@/lib/api";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// ✅ SEO Metadata – सिर्फ आवश्यक
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "FinanceTips – Personal Finance & Govt Schemes India",
  description: "Expert financial tips, government schemes, banking guides, loan calculators, and stock market basics in Hindi.",
  keywords: "personal finance, government schemes, banking, loans, insurance, crypto, stock market, financial tips",
  authors: [{ name: "Financial Expert" }],
  openGraph: {
    title: "FinanceTips – Personal Finance & Govt Schemes India",
    description: "Expert financial tips, government schemes, banking guides, loan calculators, and stock market basics in Hindi.",
    type: "website",
    locale: "hi_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinanceTips – Personal Finance & Govt Schemes India",
    description: "Expert financial tips, government schemes, banking guides, loan calculators, and stock market basics in Hindi.",
  },
};

// ✅ Viewport – Mobile Friendly
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a8a", // Dark Blue
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Settings (AdSense) – Error Handling के साथ
  const settings = await getSettings().catch(() => ({}));
  const headerAd = settings?.ads_header || "";
  const footerAd = settings?.ads_footer || "";
  const adsenseVerification = settings?.adsense_verification || "";

  return (
    <html lang="hi" className={`${inter.variable} antialiased`}>
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        {/* ✅ AdSense – अगर Verification Code है तो */}
        {adsenseVerification && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseVerification}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Header Ad – Top */}
        {headerAd && (
          <div
            className="max-w-7xl mx-auto px-4 py-2 text-center text-sm text-gray-500"
            dangerouslySetInnerHTML={{ __html: headerAd }}
          />
        )}

        {/* Main Content – बच्चे components यहाँ आएँगे */}
        <main className="flex-grow">{children}</main>

        {/* Footer Ad – Bottom */}
        {footerAd && (
          <div
            className="max-w-7xl mx-auto px-4 py-2 text-center text-sm text-gray-500 border-t border-gray-100"
            dangerouslySetInnerHTML={{ __html: footerAd }}
          />
        )}
      </body>
    </html>
  );
}