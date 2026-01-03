import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Guide",
    description: "Comprehensive guide for all TreatMeta conversion tools. Learn how to convert mean and SD, estimate effect sizes, combine groups, and perform lab unit conversions.",
    openGraph: {
        title: "Conversion Guide | TreatMeta",
        description: "Comprehensive guide for all TreatMeta meta-analysis data conversion tools.",
    },
};

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
