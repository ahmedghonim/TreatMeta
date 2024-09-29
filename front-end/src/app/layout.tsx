import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/layout/nav";
import Content from "@/components/layout/content";


const fontSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      url: "https://www.TreatMeta.com",
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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased ",
          fontSans.variable
        )}
      >
        <Nav />
        <Content children={children} />
      </body>
    </html>
  );
}
