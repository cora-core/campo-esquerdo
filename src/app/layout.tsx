import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; 
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ContentHubProvider } from "@/contexts/ContentHubContext";
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
    images: ['https://campoesquerdo.eco.br/campes-thumbnail.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://campoesquerdo.eco.br/campes-thumbnail.png'],
  },
};

export default function RootLayout({
  children,
  blogModal,
}: Readonly<{
  children: React.ReactNode;
  blogModal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><ThemeProvider>
        <ContentHubProvider>
          {children}
          {blogModal}
        </ContentHubProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



