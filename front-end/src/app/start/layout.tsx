import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Conversion",
    robots: {
        index: false,
        follow: false,
    },
};

export default function StartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
