import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/shared/Toast";
import { ClientCursor } from "@/components/shared/ClientCursor";
import { siteConfig } from "@/content/site";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.brand} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  keywords: [
    "web developer",
    "freelancer",
    "full stack developer",
    "debugger",
    "React developer",
    "Node.js developer",
    "bug fixing",
    "deployment",
    "Fiverr developer",
  ],
  authors: [{ name: siteConfig.name, url: SITE_URL }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: siteConfig.brand,
    title: `${siteConfig.brand} — ${siteConfig.title}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.brand,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} — ${siteConfig.title}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.name,
              url: SITE_URL,
              jobTitle: "Full Stack Web Developer",
              description: siteConfig.description,
              sameAs: [
                siteConfig.socials.github,
                siteConfig.socials.linkedin,
                siteConfig.socials.fiverr,
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased noise-overlay">
        <ThemeProvider>
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="pt-16">
            {children}
          </main>
          <Footer />
          <ToastContainer />
          <ClientCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
