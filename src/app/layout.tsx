import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SITE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Central India Tech",
    "Central India startups",
    "centralindiatech.com",
    "Nagpur startups",
    "Indore startups",
    "Bhopal startups",
    "Nagpur startup map",
    "Indore startup map",
    "Bhopal startup map",
    "startups in Nagpur",
    "startups in Indore",
    "startups in Bhopal",
    "tech jobs Nagpur",
    "tech jobs Indore",
    "tech jobs Bhopal",
    "walk in jobs Central India",
    "walk in interviews Nagpur",
    "walk in interviews Indore",
    "walk in interviews Bhopal",
    "software jobs Central India",
    "IT companies in Nagpur",
    "IT companies in Indore",
    "IT companies in Bhopal",
    "Nagpur founders",
    "Indore founders",
    "Bhopal founders",
    "tech events Central India",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
        <MobileNav />

        {/* JSON-LD for WebSite & Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE.name,
                url: SITE.url,
                description: SITE.description,
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${SITE.url}/startups?search={search_term_string}`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: SITE.name,
                url: SITE.url,
                logo: `${SITE.url}/favicon.svg`,
                description: "Central India Tech is the premier directory and ecosystem platform for startups, tech employers, jobs, walk-ins, and founders across Nagpur, Indore, and Bhopal.",
                areaServed: [
                  { "@type": "City", name: "Nagpur" },
                  { "@type": "City", name: "Indore" },
                  { "@type": "City", name: "Bhopal" },
                ],
              },
            ]).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
