import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$LUIS on Bonk",
  description: "Losers Until It Sends 💸\n$LUIS is inevitable 🚀\nWe cry, we buy, we moon 🌕\n#LUISarmy",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: "$LUIS on Bonk",
    description: "Losers Until It Sends 💸 - $LUIS is inevitable 🚀 - We cry, we buy, we moon 🌕 - #LUISarmy",
    images: ['/luisbanner.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "$LUIS on Bonk",
    description: "Losers Until It Sends 💸 - $LUIS is inevitable 🚀 - We cry, we buy, we moon 🌕 - #LUISarmy",
    images: ['/luisbanner.png'],
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
      >
        {children}
      </body>
    </html>
  );
}
