# TreatMeta / MetaTransformR

[![Website]](https://www.treatmeta.net)
[![R]](https://cran.r-project.org/)
[![License]](LICENSE)

> **One-Click Batch Conversion for Meta-Analysis Data**

TreatMeta is a free, web-based platform that streamlines data preparation for systematic reviews and meta-analyses. This repository contains **MetaTransformR**, the R-powered statistical engine that handles all data transformations via a RESTful API.

## 🌟 Overview

Systematic reviews often encounter studies reporting the same outcome in different statistical formats (median vs. mean, IQR vs. SD, etc.). Manual conversion is time-consuming and error-prone. TreatMeta solves this by:

- **Batch Processing**: Convert entire datasets with one click, not one value at a time
- **Statistical Rigor**: Implements established formulas (Hozo et al., Wan et al., Cochrane Handbook)
- **Advanced Features**: Pre-post analysis, group pooling, unit conversions, effect size estimation
- **Accessibility**: Web-based interface requiring no installation or programming knowledge

## 🏗️ Architecture

TreatMeta uses a full-stack architecture:

```
┌─────────────────┐      HTTP/REST       ┌──────────────────┐
│   Next.js       │ ◄──────────────────► │   MetaTransformR │
│   (Frontend)    │   (plumber API)      │   (R Backend)    │
│                 │                      │                  │
│  - React UI     │                      │  - Data validation│
│  - Spreadsheet  │                      │  - Conversions   │
│  - Presets      │                      │  - Meta-analysis │
└─────────────────┘                      │    calculations  │
                                         └──────────────────┘
```

This repository contains the **MetaTransformR** R API.

## 🚀 Features

### Conversion Categories

| Category | Description | Example Conversions |
|----------|-------------|---------------------|
| **1. Mean & SD** | Convert various statistics to Mean ± SD | Median[IQR] → Mean±SD, Median(Range) → Mean±SD, SE → SD, CI → SD, P-value → SD |
| **2. Effect Size Estimation** | Calculate effect sizes for single-arm studies | Prevalence with log transformation, Indirect meta-analysis (Mean→SE) |
| **3. Group Combination** | Pool multiple independent groups | Combine 2+ study arms into single estimate |
| **4. Individual Patient Data** | Summarize raw data | List of values → Mean±SD |
| **5. Unit Conversions** | Laboratory value conversions | 448+ medical unit conversions |

### Special Capabilities

- **Pre-Post Analysis**: Calculate change-from-baseline using correlation coefficients
- **Group Pivoting**: Auto-pivot multi-arm study data into wide format for RevMan/Robovi
- **Input Validation**: Automatic detection of required parameters
- **History**: Local browser storage of conversion sessions
- **Citations**: Auto-generation of RIS bibliography files

## 📋 Prerequisites

- R ≥ 4.0
- Required packages:
  ```r
  install.packages(c("plumber", "metafor", "dplyr", "tidyr", "jsonlite", 
                     "purrr", "assertthat", "meta", "sample.decomp"))
  ```
- SQLite database (for function metadata storage)

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/ahmedghonim/r_project.git
cd r_project
```

### 2. Database Setup
Ensure `loadDB.R` initializes the SQLite database:

```r
source("./loadDB.R")
```

Required tables:
- `functions`: Conversion functions and metadata
- `variables`: Input/output variable definitions  
- `Labs`: Unit conversion ratios (448+ entries)

### 3. Start API Server

```r
library(plumber)
source("./base_scripts.R")
pr("plumber.R") %>% pr_run(port = 8000)
```

API available at `http://localhost:8000`

## 🔌 API Endpoints

### Main Endpoint: `/Task_manager`

**Method**: `POST`

**Parameters**:
- `df` (JSON): Input data frame
- `funcIDs` (JSON): Valid function indices
- `current_outputs` (JSON): Expected output columns
- `current_prepost` (boolean): Pre-post data flag
- `category` (integer): Conversion category (1-5)

**Returns**: JSON object with converted data

### Example Request

```r
library(httr)
library(jsonlite)

data <- data.frame(
  Study_ID = "Smith_2020",
  Median = 15.2, Q1 = 12.1, Q3 = 18.4, N = 45
)

response <- POST(
  url = "http://localhost:8000/Task_manager",
  body = list(
    df = toJSON(data),
    funcIDs = toJSON(c(2)),
    current_outputs = toJSON(c("Mean", "SD")),
    current_prepost = toJSON(FALSE),
    category = toJSON(1)
  ),
  encode = "multipart"
)
```

## 🧮 Core Functions

### Mean & SD Conversions

| Function | Input | Method |
|----------|-------|--------|
| `MedianIQ_to_MeanSD` | Median, Q1, Q3, N | Wan et al. (2014) |
| `MedianRng_to_MeanSD` | Median, Min, Max, N | Hozo et al. (2005) |
| `Ci_N_to_SD` | Mean, CI bounds, N | Cochrane Handbook |
| `SE_N_to_SD` | SE, N | SE × √N |
| `Pval_2N_to_SD` | Mean Diff, N1, N2, P-value | t-distribution |

### Pre-Post Analysis

| Function | Description |
|----------|-------------|
| `PrePost_to_MeanSD` | Calculates change scores with SD of change |
| `prepare_prepost` | Structures multi-timepoint data |
| `calc_CCoef` | Imputes correlation from available data |

### Meta-Analysis Functions

| Function | Purpose | Package |
|----------|---------|---------|
| `calculate_prop` | Prevalence MA (raw + log) | `meta` |
| `calculate_sm` | Single-arm MA | `meta` |
| `calculate_bin` | Binary two-group MA | `metafor` |
| `calculate_cont` | Continuous two-group MA | `metafor` |
| `combine_MeanSD` | Pool multiple groups | `sample.decomp` |

### Utilities

- `Validate_requirements`: Matches inputs to eligible functions
- `apply_labs`: Applies unit conversions (448+ lab units)
- `Task_manager`: Main API orchestrator

## 📊 Example Workflows

### Median[IQR] to Mean±SD
```r
# Input: Median=20, Q1=15, Q3=25, N=30
# Output: Mean ≈ 20.0, SD ≈ 7.4
```

### Pre-Post Calculation
```r
# Input: Baseline Mean=120, SD=15; Follow-up Mean=110, SD=14; N=50
# Output: Mean Change = -10, SD Change ≈ 16.4 (assuming r=0.5)
```

### Pooling Groups
```r
# Input: Arm 1: Mean=100, SD=10, N=30; Arm 2: Mean=105, SD=12, N=30
# Output: Pooled Mean=102.5, SD≈11.1, N=60
```

## 📝 Citation

```
Nourelden AZ, Mamdouh M, Fathallah AH, et al. 
TreatMeta: An Online Platform for One-Click Conversions of Entire Datasets in Meta-analysis. 
[Journal details upon publication]
```

## 🤝 Contributing

Areas for enhancement:
- Additional statistical conversion methods
- Time-to-event data support
- Graphic data extraction (digitization)

## 🐛 Limitations

- Pre-post assumes r=0.5 if correlation not provided (conduct sensitivity analyses)
- ~10% relative error possible for highly skewed distributions
- History stored locally (not synced across devices)

## 📬 Contact

- **Website**: https://www.treatmeta.net
- **Email**: mmamdoh144@gmail.com
- **Issues**: GitHub Issues

---

**Disclaimer**: Verify conversions against original sources. Conduct sensitivity analyses when using estimated values.
