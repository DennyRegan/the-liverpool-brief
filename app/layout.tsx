import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://theliverpoolbrief.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Liverpool Brief",
  description: "Independent Liverpool opinion and history by Denny Regan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="site-footer"><div className="site-width"><p>The Liverpool Brief<span>Independent writing by Denny Regan.</span></p><a href="mailto:theliverpoolbrief@gmail.com">Get in touch ↗</a></div></footer>
        <Analytics />
      </body>
    </html>
  );
}