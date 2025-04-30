import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Release Notes Generator",
    description: "Create and publish release notes to Discord",
    robots: { index: false, follow: false },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn("dark", geistSans.variable, geistMono.variable)}
            suppressHydrationWarning
        >
            <body className="min-h-svh antialiased">
                <main className="flex-1">{children}</main>
                <Toaster richColors />
            </body>
        </html>
    );
}
