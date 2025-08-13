import {SmoothScrollProvider} from '@/components/SmoothScrollProvider'
import "./globals.css";
import React from "react";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
        <body>
        <SmoothScrollProvider>
            {children}
        </SmoothScrollProvider>
        </body>
        </html>
    )
}