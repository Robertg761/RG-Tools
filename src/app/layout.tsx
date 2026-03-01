import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EarlyBuildBanner } from "@/components/EarlyBuildBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rgprojectdump.ca"),
  title: {
    default: "RG Project Dump",
    template: "%s | RG Project Dump",
  },
  description: "RG Project Dump: a hub for projects, releases, and source code.",
  applicationName: "RG Project Dump",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://rgprojectdump.ca",
    siteName: "RG Project Dump",
    title: "RG Project Dump",
    description: "A hub for projects, releases, and source code.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RG Project Dump",
    description: "A hub for projects, releases, and source code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-19E39VTB7E"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-19E39VTB7E');
`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-500 selection:text-white`}
      >
        <Navbar />
        <div className="pt-20">
          <EarlyBuildBanner />
        </div>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
