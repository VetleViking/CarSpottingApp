import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

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
            <body className="">
                {children}
                <ServiceWorker />
            </body>
        </html>
    );
}
