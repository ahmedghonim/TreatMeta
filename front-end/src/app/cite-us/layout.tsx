import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cite Us",
    description: "Cite TreatMeta in your research. Download references in RIS format for easy import into Zotero, Mendeley, EndNote, and other reference managers.",
    openGraph: {
        title: "Cite Us | TreatMeta",
        description: "Cite TreatMeta in your research. Download references in RIS format.",
    },
};

export default function CiteUsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
