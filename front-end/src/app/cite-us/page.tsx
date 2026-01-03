"use client"
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CircleLoader } from "react-spinners"

import { citationsJSON, txtCitations } from "./citations";

import { Cite } from "@citation-js/core"
import "@citation-js/plugin-doi"
import "@citation-js/plugin-csl"
import "@citation-js/plugin-ris"

import cloneDeep from 'lodash/cloneDeep';
import { downloadBlob } from "@/lib/utils";
import { Store } from 'react-notifications-component';

import { useState } from "react";

const citations = [
    { title: "Our Website", doi: '10.7717/peerj-cs.214', category: "Core" },
    { title: "Cochrane Handbook", doi: '10.1002/9781119536604', category: "Core" },
    { title: "Meta R Package", doi: '10.1007/978-3-319-21416-0', category: "Core" },
    { title: "Mean & SD Change", doi: '10.1002/sim.2423', category: "Methods" },
    { title: "Median & IQR", doi: '10.1186/1471-2288-14-135', category: "Methods" },
    { title: "Median & Range", doi: '10.1186/1471-2288-5-13', category: "Methods" },
    { title: "Between Groups P-Value", doi: '10.2307/2347681', category: "Methods" },
    { title: "Meta-analysis of Prevalence", doi: '10.1136/jech-2013-203104', category: "Methods" },
    { title: "Mean Calculation", doi: '10.1098/rspl.1893.0079', category: "Methods" },
    { title: "Unit Conversions", doi: '10.1056/NEJMcpc049016', category: "Utilities" }
];

async function grabCitations() {
    const data = Cite(JSON.parse(citationsJSON));
    return { dt: data, csl: txtCitations };
}

function CitationCard({
    id, title, content, doi, category, isSelected, onToggle
}: {
    id: number;
    title: string;
    content: string;
    doi: string;
    category: string;
    isSelected: boolean;
    onToggle: () => void;
}) {
    const categoryColors: Record<string, string> = {
        "Core": "bg-primary/20 text-primary border-primary/30",
        "Methods": "bg-blue-500/20 text-blue-400 border-blue-500/30",
        "Statistical": "bg-purple-500/20 text-purple-400 border-purple-500/30",
        "Utilities": "bg-green-500/20 text-green-400 border-green-500/30",
    };

    return (
        <div
            onClick={onToggle}
            className={`
        relative p-5 rounded-xl cursor-pointer transition-all duration-300
        border-2 
        ${isSelected
                    ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                    : 'bg-[#1e304052] border-transparent hover:border-white/20 hover:bg-[#1e3040]/80'
                }
      `}
        >
            {/* Selection indicator */}
            <div className={`
        absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center
        transition-all duration-200
        ${isSelected ? 'bg-primary border-primary' : 'border-white/40'}
      `}>
                {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>

            {/* Category badge */}
            <span className={`
        inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 border
        ${categoryColors[category] || 'bg-gray-500/20 text-gray-400'}
      `}>
                {category}
            </span>

            {/* Title */}
            <h3 className="text-white font-bold text-lg mb-2 pr-8">
                {id}. {title}
            </h3>

            {/* Citation text */}
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
                {content}
            </p>

            {/* DOI link */}
            <a
                href={`https://doi.org/${doi}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-primary text-xs hover:underline inline-flex items-center gap-1"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                DOI: {doi}
            </a>
        </div>
    );
}

function Bibliography() {
    const [refs, setRefs] = useState<any>();
    const [csl, setCsl] = useState<any>();
    const [active, setActive] = useState<boolean[]>(citations.map(() => false));

    useEffect(() => {
        async function init() {
            const dt = await grabCitations();
            setCsl(dt.csl);
            setRefs(dt.dt);
        }
        init();
    }, []);

    const selectedCount = active.filter(Boolean).length;

    const handleSelectAll = () => {
        setActive(citations.map(() => true));
    };

    const handleClearAll = () => {
        setActive(citations.map(() => false));
    };

    const handleDownload = () => {
        if (selectedCount > 0) {
            const temp = cloneDeep(refs);
            temp.data = temp.data.filter((_: any, i: number) => active[i]);
            downloadBlob(new Blob([temp.format("ris")]), "References.ris");
        } else {
            Store.addNotification({
                title: "No references selected",
                message: "Please select at least one reference to download",
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: { duration: 4000, onScreen: true },
            });
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Header */}
            <div className="relative py-16 mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10" />
                <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Cite <span className="text-primary">TreatMeta</span>
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Select the references relevant to your work and download them in RIS format
                        for easy import into your reference manager.
                    </p>
                </div>
            </div>

            {/* Loading State */}
            {!csl && (
                <div className="flex flex-col items-center justify-center py-20">
                    <CircleLoader color="#f05445" size={80} />
                    <p className="text-gray-400 mt-4">Loading citations...</p>
                </div>
            )}

            {/* Citations Grid */}
            {csl && (
                <div className="max-w-6xl mx-auto px-4">
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-[#1e3040]/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-white font-medium">
                                {selectedCount} of {citations.length} selected
                            </span>
                            <div className="h-4 w-px bg-white/20" />
                            <button
                                onClick={handleSelectAll}
                                className="text-primary text-sm hover:underline"
                            >
                                Select All
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="text-gray-400 text-sm hover:text-white"
                            >
                                Clear
                            </button>
                        </div>

                        <Button
                            onClick={handleDownload}
                            className="flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download RIS ({selectedCount})
                        </Button>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {citations.map((el, i) => (
                            <CitationCard
                                key={i}
                                id={i + 1}
                                title={el.title}
                                content={csl[i]}
                                doi={el.doi}
                                category={el.category}
                                isSelected={active[i]}
                                onToggle={() => {
                                    const temp = [...active];
                                    temp[i] = !temp[i];
                                    setActive(temp);
                                }}
                            />
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-4">
                            Downloaded citations can be imported into Zotero, Mendeley, EndNote, and other reference managers.
                        </p>
                        <Button
                            onClick={handleDownload}
                            className="px-8 py-3"
                            disabled={selectedCount === 0}
                        >
                            Download {selectedCount} Reference{selectedCount !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function CitePage() {
    return <Bibliography />;
}

export default CitePage;