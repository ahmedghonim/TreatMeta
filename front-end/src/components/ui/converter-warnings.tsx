"use client";
import React from "react";
import Link from "next/link";

interface ConverterWarningsProps {
    showNormalDistributionWarning?: boolean;
}

const ConverterWarnings: React.FC<ConverterWarningsProps> = ({
    showNormalDistributionWarning = true,
}) => {
    return (
        <div className="w-full space-y-3 mb-6">
            {/* Guide Consultation Warning */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/30 border border-secondary/50">
                <span className="text-blue-400 text-lg shrink-0 mt-0.5">ℹ️</span>
                <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">Tip:</span> Consult the{" "}
                    <Link
                        href="/docs"
                        className="text-primary hover:underline font-medium"
                    >
                        conversion guide
                    </Link>{" "}
                    to avoid common errors and ensure accurate results.
                </p>
            </div>

            {/* Normal Distribution Assumption Warning */}
            {showNormalDistributionWarning && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-900/20 border border-amber-700/40">
                    <span className="text-amber-400 text-lg shrink-0 mt-0.5">⚠️</span>
                    <p className="text-sm text-gray-300">
                        <span className="font-semibold text-amber-300">
                            Normal Distribution Assumption:
                        </span>{" "}
                        All mean and SD conversions assume your raw data follows a normal
                        distribution. Since we have no access to raw data from primary studies, it is your
                        responsibility to verify this assumption before using the converted
                        values.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ConverterWarnings;
