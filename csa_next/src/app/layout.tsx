import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Car Spotting App",
    description: "A car spotting website for car enthusiasts",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="bg-black">
            <body className="">{children}</body>
        </html>
    );
}
