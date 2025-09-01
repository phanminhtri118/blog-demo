import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/shared/components/layout/header";
import { QueryProvider } from "@/shared/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog App",
  description: "A Next.js blog application with Clerk authentication",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <QueryProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              {children}
            </div>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
