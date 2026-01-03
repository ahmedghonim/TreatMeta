import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/layout/nav";
import Content from "@/components/layout/content";
import { GoogleTagManager } from "@next/third-parties/google";
import { DefaultJsonLd } from "@/components/seo/JsonLd";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | TreatMeta`,
      default: "TreatMeta - Meta-Analysis Data Conversion Tool",
    },
    description: "TreatMeta is a free online tool for meta-analysis data conversion. Convert effect sizes, combine study groups, estimate statistics, and prepare data for systematic reviews.",
    keywords: [
      "meta-analysis",
      "systematic review",
      "effect size conversion",
      "data conversion",
      "evidence synthesis",
      "mean and SD conversion",
      "effect size estimation",
      "combine study groups",
      "TreatMeta",
      "MetaTransformR",
    ],
    authors: [{ name: "TreatMeta Team" }],
    creator: "TreatMeta",
    publisher: "TreatMeta",
    applicationName: "TreatMeta",
    metadataBase: new URL("https://www.treatmeta.com"),

    // Canonical and alternates
    alternates: {
      canonical: "/",
      languages: {
        "en": "/",
        "en-US": "/",
        "en-GB": "/",
      },
    },

    // Open Graph
    openGraph: {
      type: "website",
      title: "TreatMeta - Meta-Analysis Data Conversion Tool",
      description: "Free online tool for meta-analysis data conversion. Convert effect sizes, combine study groups, and prepare data for systematic reviews.",
      url: "https://www.treatmeta.com",
      siteName: "TreatMeta",
      locale: "en_US",
      images: [
        {
          url: "/favicon.ico",
          width: 512,
          height: 512,
          alt: "TreatMeta Logo",
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: "TreatMeta - Meta-Analysis Data Conversion Tool",
      description: "Free online tool for meta-analysis data conversion. Convert effect sizes, combine study groups, and prepare data for systematic reviews.",
      images: ["/favicon.ico"],
      creator: "@treatmeta",
    },

    // Robots
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

    // Verification
    verification: {
      google: "mvgALnznelPo2kiRe937cvowChkDYhm_mejpxkhR2v4",
    },

    // Category
    category: "Science & Technology",
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data */}
        <DefaultJsonLd />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased ")}>
        <GoogleTagManager gtmId="GTM-P8MK6NS7" />
        <Nav />
        <div className="w-full h-[110px]"></div>

        <main role="main" id="main-content">
          <Content>{children}</Content>
        </main>
      </body>
    </html>
  );
}

