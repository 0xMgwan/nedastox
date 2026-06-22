import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AssetConnect — Investment Management Solution",
  description: "Full-stack investment management platform for Tanzania — DSE market data, mutual/pension/provident/private equity fund management, and broker back office.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full`} data-theme="dark" suppressHydrationWarning>
      <body className="min-h-full font-mono antialiased" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
