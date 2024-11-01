import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/layout/nav";
import Content from "@/components/layout/content";
import { GoogleTagManager } from "@next/third-parties/google";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `TreatMeta | %s`,
      default: "TreatMeta",
    },
    description: "description",
    keywords: "keywords",
    authors: [{ name: "TreatMeta" }],
    applicationName: "TreatMeta",
    metadataBase: new URL("https://www.TreatMeta.com"),
    alternates: {
      canonical: "en",
      languages: {
        en: "/en",
        "en-US": "/en",
        "en-au": "/en",
        "en-bz": "/en",
        "en-ca": "/en",
        "en-ie": "/en",
        "en-jm": "/en",
        "en-nz": "/en",
        "en-za": "/en",
        "en-tt": "/en",
        "en-gb": "/en",
        "en-us": "/en",
      },
    },

    openGraph: {
      type: "website",
      title: "TreatMeta",
      url: "https://www.TreatMeta.net",
      siteName: "TreatMeta",
      images: [
        {
          url: "/public/favicon.ico",
          width: 800,
          height: 600,
          alt: "TreatMeta",
        },
      ],
    },
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
        <meta
          name="google-site-verification"
          content="mvgALnznelPo2kiRe937cvowChkDYhm_mejpxkhR2v4"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased ")}>
        <GoogleTagManager gtmId="GTM-P8MK6NS7" />
        <Nav />
        <div className="w-full h-[110px]"></div>

        <Content>{children}</Content>
      </body>
    </html>
  );
}
