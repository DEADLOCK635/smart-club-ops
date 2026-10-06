import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Background } from "@/components/layout/Background";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { NoticeTicker } from "@/components/layout/NoticeTicker";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SCPSC CYBER HUB — Tech Fests & QR Passes",
    template: "%s · SCPSC CYBER HUB",
  },
  description:
    "Official campus tech festival platform for SCPSC. Explore competitive arenas, register for events, and manage digital passes.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <StoreProvider>
          <Background />
          <div className="fixed inset-x-0 top-0 z-50">
            <NoticeTicker />
            <Navbar />
          </div>
          <main className="flex-1 pt-32">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
