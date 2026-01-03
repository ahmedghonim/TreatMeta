"use client";

import Script from "next/script";

interface OrganizationSchemaProps {
    name?: string;
    url?: string;
    logo?: string;
    description?: string;
}

interface WebSiteSchemaProps {
    name?: string;
    url?: string;
    description?: string;
}

interface SoftwareApplicationSchemaProps {
    name?: string;
    description?: string;
    url?: string;
    applicationCategory?: string;
    operatingSystem?: string;
    offers?: {
        price: string;
        priceCurrency: string;
    };
}

interface FAQItem {
    question: string;
    answer: string;
}

// Organization Schema
export function OrganizationJsonLd({
    name = "TreatMeta",
    url = "https://www.treatmeta.com",
    logo = "https://www.treatmeta.com/favicon.ico",
    description = "Free online tool for meta-analysis data conversion and systematic review preparation.",
}: OrganizationSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url,
        logo,
        description,
        sameAs: [
            // Add social media links when available
        ],
    };

    return (
        <Script
            id="organization-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// WebSite Schema with SearchAction
export function WebSiteJsonLd({
    name = "TreatMeta",
    url = "https://www.treatmeta.com",
    description = "Meta-analysis data conversion tool for systematic reviews.",
}: WebSiteSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        url,
        description,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${url}/docs?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <Script
            id="website-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// SoftwareApplication Schema
export function SoftwareApplicationJsonLd({
    name = "TreatMeta",
    description = "Free online tool for meta-analysis data conversion. Convert effect sizes, combine study groups, estimate statistics, and prepare data for systematic reviews.",
    url = "https://www.treatmeta.com",
    applicationCategory = "HealthApplication",
    operatingSystem = "Web Browser",
    offers = { price: "0", priceCurrency: "USD" },
}: SoftwareApplicationSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        url,
        applicationCategory,
        operatingSystem,
        offers: {
            "@type": "Offer",
            ...offers,
        },
        featureList: [
            "Mean and SD conversions",
            "Effect size estimation",
            "Multiple groups combination",
            "Lab unit conversions",
            "Individual patient data summary",
        ],
    };

    return (
        <Script
            id="software-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// FAQ Schema
export function FAQJsonLd({ items }: { items: FAQItem[] }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };

    return (
        <Script
            id="faq-jsonld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Combined default schemas for the site
export function DefaultJsonLd() {
    return (
        <>
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <SoftwareApplicationJsonLd />
        </>
    );
}
