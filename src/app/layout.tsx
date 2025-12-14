import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import StickyWrapper from "@/components/StickyWrapper"; 


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Campo Esquerdo",
  description: "núcleo focado em música eletrônica leftfield, ambiente, e performances nas interseções entre corpo, som e outras tecnologias",
  openGraph: {
    title: "Campo Esquerdo",
    description: "núcleo focado em música eletrônica leftfield, ambiente, e performances nas interseções entre corpo, som e outras tecnologias",
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProvider>
        
        {children} 
        
        </ThemeProvider>
      </body>
    </html>
  );
}



