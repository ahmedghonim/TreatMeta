/**
 * Statistical definitions and explanations for table column abbreviations,
 * specifically addressing reviewer comments on effect size preset abbreviations:
 * TE, SE(TE), log TE, and SE-logTE.
 */

export const COLUMN_TOOLTIPS: Record<string, string> = {
  te: "Treatment Effect (TE): The estimated effect size (e.g., raw proportion for single-arm binary outcomes, mean for continuous outcomes).",
  sete: "Standard Error of Treatment Effect [SE(TE)]: Standard error of the estimate.",
  logte: "Logarithm of Treatment Effect (log TE): Natural log- or logit-transformed treatment effect (e.g., logit proportion or log mean) used for generic inverse-variance meta-analysis.",
  selogte: "Standard Error of Log Treatment Effect (SE-logTE): Standard error of the logarithm or logit of the treatment effect estimate, required for inverse-variance weighting.",
  logsete: "Standard Error of Log Treatment Effect (SE-logTE): Standard error of the logarithm or logit of the treatment effect estimate, required for inverse-variance weighting.",
  studyid: "Study Identifier: Label or citation identifying the study.",
  nevents: "Number of Events: Count of participants who experienced the outcome of interest.",
  n: "Sample Size (N): Total number of participants in the study group.",
  mean: "Mean: Average value of continuous outcome.",
  sd: "Standard Deviation (SD): Measure of dispersion around the mean.",
  se: "Standard Error (SE): Standard error of the sample estimate.",
  median: "Median: Middle value of the data distribution.",
  q1: "First Quartile (Q1): 25th percentile of the data distribution.",
  q3: "Third Quartile (Q3): 75th percentile of the data distribution.",
  min: "Minimum Value: Lowest observed value.",
  max: "Maximum Value: Highest observed value.",
  llci: "Lower Limit of Confidence Interval (95% CI).",
  ulci: "Upper Limit of Confidence Interval (95% CI).",
  pval: "P-value: Statistical significance test result.",
};

/**
 * Returns a clear, descriptive tooltip for a given column header text.
 */
export function getColumnTooltip(headerText: string): string | undefined {
  if (!headerText || typeof headerText !== "string") return undefined;

  const stripped = headerText.replace(/<[^>]*>/g, "").trim();
  const normalized = stripped.toLowerCase().replace(/[\s_\-()]/g, "");

  if (COLUMN_TOOLTIPS[normalized]) {
    return COLUMN_TOOLTIPS[normalized];
  }

  // Handle common variations
  if (
    normalized.includes("selogte") ||
    (normalized.includes("se") && normalized.includes("logte")) ||
    normalized.includes("logsete")
  ) {
    return COLUMN_TOOLTIPS.selogte;
  }
  if (normalized.includes("logte") || normalized === "lnte") {
    return COLUMN_TOOLTIPS.logte;
  }
  if (
    normalized === "sete" ||
    normalized === "seofte" ||
    normalized === "se(te)" ||
    normalized === "se-te"
  ) {
    return COLUMN_TOOLTIPS.sete;
  }
  if (normalized === "te") {
    return COLUMN_TOOLTIPS.te;
  }

  return undefined;
}

/**
 * Handsontable afterGetColHeader hook helper.
 * Dynamically binds tooltip text and styles the column header <th> and its inner label.
 */
export function attachHeaderTooltip(
  col: number,
  TH: HTMLTableCellElement,
  headers?: any[]
) {
  if (col < 0 || !TH) return;

  let label = "";
  if (headers && headers[col] !== undefined) {
    const raw = headers[col];
    label = typeof raw === "string" ? raw : raw?.label || raw?.value || "";
  }
  if (!label) {
    label = TH.innerText || TH.textContent || "";
  }

  const tooltip = getColumnTooltip(label);
  const colHeaderSpan = TH.querySelector(".colHeader") as HTMLElement | null;

  if (tooltip) {
    TH.setAttribute("title", tooltip);
    TH.setAttribute("data-tooltip-id", "col-header-tooltip");
    TH.setAttribute("data-tooltip-content", tooltip);

    if (colHeaderSpan) {
      colHeaderSpan.setAttribute("title", tooltip);
      colHeaderSpan.setAttribute("data-tooltip-id", "col-header-tooltip");
      colHeaderSpan.setAttribute("data-tooltip-content", tooltip);
      colHeaderSpan.style.cursor = "help";
      colHeaderSpan.style.textDecoration =
        "underline dotted 1px rgba(255, 255, 255, 0.6)";
      colHeaderSpan.style.textUnderlineOffset = "3px";
    }
  } else {
    TH.removeAttribute("title");
    TH.removeAttribute("data-tooltip-id");
    TH.removeAttribute("data-tooltip-content");

    if (colHeaderSpan) {
      colHeaderSpan.removeAttribute("title");
      colHeaderSpan.removeAttribute("data-tooltip-id");
      colHeaderSpan.removeAttribute("data-tooltip-content");
      colHeaderSpan.style.cursor = "";
      colHeaderSpan.style.textDecoration = "";
      colHeaderSpan.style.textUnderlineOffset = "";
    }
  }
}
