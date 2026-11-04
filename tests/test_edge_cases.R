suppressPackageStartupMessages({
  library(testthat)
  library(dplyr)
  library(tibble)
  library(meta)
  library(uxstats)
  library(DBI)
  library(jsonlite)
})

if (basename(getwd()) != "tests") {
  setwd("tests")
}

suppressWarnings({
  suppressMessages({
    source("../packages.R", chdir = TRUE)
    source("../routes/base_scripts.R", chdir = TRUE)
  })
})

context("TreatMeta Comprehensive Backend & Boundary Case Validation")

# ==============================================================================
# 1. CI and SE to SD Conversions
# ==============================================================================

test_that("Ci_N_to_SD processes standard inputs correctly", {
  df_std <- data.frame(N = 100, llci = 10, ulci = 20, `CI%` = 0.95, check.names = FALSE)
  res_std <- Ci_N_to_SD(df_std)
  
  expect_equal(res_std$invalid, 0)
  expect_true(is.numeric(res_std$SD))
  expect_equal(round(res_std$SD, 2), 25.51)
})

test_that("Ci_N_to_SD validates boundary sample size and flags invalid inputs", {
  # Minimum valid sample size (N = 2)
  df_min_valid <- data.frame(N = 2, llci = 10, ulci = 20, check.names = FALSE)
  res_min_valid <- Ci_N_to_SD(df_min_valid)
  expect_equal(res_min_valid$invalid, 0)
  expect_true(is.finite(res_min_valid$SD))
  
  # Invalid sample size (N <= 1)
  df_inv_n <- data.frame(N = 1, llci = 10, ulci = 20, check.names = FALSE)
  res_inv_n <- Ci_N_to_SD(df_inv_n)
  expect_equal(res_inv_n$invalid, 1)
  expect_true(is.na(res_inv_n$SD))

  # Inverted confidence interval (llci >= ulci)
  df_inv_ci <- data.frame(N = 50, llci = 25, ulci = 15, check.names = FALSE)
  res_inv_ci <- Ci_N_to_SD(df_inv_ci)
  expect_equal(res_inv_ci$invalid, 1)
  expect_true(is.na(res_inv_ci$SD))
})

test_that("SE_N_to_SD calculates standard inputs and flags non-positive values", {
  df_std <- data.frame(N = 64, SE = 2.5)
  res_std <- SE_N_to_SD(df_std)
  expect_equal(res_std$invalid, 0)
  expect_equal(res_std$SD, 20)

  # Non-positive SE
  df_neg_se <- data.frame(N = 50, SE = -1)
  res_neg_se <- SE_N_to_SD(df_neg_se)
  expect_equal(res_neg_se$invalid, 1)
  expect_true(is.na(res_neg_se$SD))

  # Non-positive sample size
  df_zero_n <- data.frame(N = 0, SE = 2)
  res_zero_n <- SE_N_to_SD(df_zero_n)
  expect_equal(res_zero_n$invalid, 1)
  expect_true(is.na(res_zero_n$SD))
})

# ==============================================================================
# 2. Median & Quartiles / Range Conversions
# ==============================================================================

test_that("MedianIQ_to_MeanSD computes approximations and guards boundaries", {
  df_std <- data.frame(N = 50, Median = 15, q1 = 10, q3 = 20, Mean = NA, SD = NA)
  res_std <- MedianIQ_to_MeanSD(df_std)
  expect_equal(res_std$invalid, 0)
  expect_true(is.numeric(res_std$Mean))
  expect_true(is.numeric(res_std$SD))

  # Inverted quartiles (q1 >= q3)
  df_inv_iqr <- data.frame(N = 50, Median = 15, q1 = 20, q3 = 10, Mean = NA, SD = NA)
  res_inv_iqr <- MedianIQ_to_MeanSD(df_inv_iqr)
  expect_equal(res_inv_iqr$invalid, 1)
  expect_true(is.na(res_inv_iqr$Mean))
  expect_true(is.na(res_inv_iqr$SD))

  # Median outside IQR (Median < q1 or Median > q3)
  df_skewed <- data.frame(N = 50, Median = 5, q1 = 10, q3 = 20, Mean = NA, SD = NA)
  res_skewed <- MedianIQ_to_MeanSD(df_skewed)
  expect_equal(res_skewed$invalid, 1)

  # Boundary N <= 1
  df_n1 <- data.frame(N = 1, Median = 15, q1 = 10, q3 = 20, Mean = NA, SD = NA)
  res_n1 <- MedianIQ_to_MeanSD(df_n1)
  expect_equal(res_n1$invalid, 1)
})

test_that("MedianRng_to_MeanSD computes approximations and guards boundaries", {
  df_std <- data.frame(N = 40, Median = 25, min = 10, max = 50, Mean = NA, SD = NA)
  res_std <- MedianRng_to_MeanSD(df_std)
  expect_equal(res_std$invalid, 0)
  expect_true(is.finite(res_std$Mean))
  expect_true(is.finite(res_std$SD))

  # Inverted range (min >= max)
  df_inv_rng <- data.frame(N = 40, Median = 25, min = 50, max = 10, Mean = NA, SD = NA)
  res_inv_rng <- MedianRng_to_MeanSD(df_inv_rng)
  expect_equal(res_inv_rng$invalid, 1)
  expect_true(is.na(res_inv_rng$SD))

  # Median outside range
  df_out_rng <- data.frame(N = 40, Median = 55, min = 10, max = 50, Mean = NA, SD = NA)
  res_out_rng <- MedianRng_to_MeanSD(df_out_rng)
  expect_equal(res_out_rng$invalid, 1)
})

# ==============================================================================
# 3. Two-Sample (2N) Conversions: P-Value and CI
# ==============================================================================

test_that("Pval_2N_to_SD computes valid inputs and prevents -Inf on invalid p-values", {
  df_std <- data.frame(Mean = 5, pval = 0.05, N1 = 30, N2 = 30)
  res_std <- Pval_2N_to_SD(df_std)
  expect_equal(res_std$invalid, 0)
  expect_true(res_std$SD > 0)

  # Boundary invalid: pval = 0 (which would evaluate to -Inf in tinv)
  df_zero_p <- data.frame(Mean = 5, pval = 0, N1 = 30, N2 = 30)
  res_zero_p <- Pval_2N_to_SD(df_zero_p)
  expect_equal(res_zero_p$invalid, 1)
  expect_true(is.na(res_zero_p$SD))
  expect_false(is.infinite(res_zero_p$SD))

  # Boundary invalid: pval >= 1
  df_one_p <- data.frame(Mean = 5, pval = 1, N1 = 30, N2 = 30)
  res_one_p <- Pval_2N_to_SD(df_one_p)
  expect_equal(res_one_p$invalid, 1)

  # Invalid sample sizes (N1 + N2 <= 2, i.e., degrees of freedom <= 0)
  df_df0 <- data.frame(Mean = 5, pval = 0.05, N1 = 1, N2 = 1)
  res_df0 <- Pval_2N_to_SD(df_df0)
  expect_equal(res_df0$invalid, 1)
})

test_that("Ci_2N_to_SD and SE_2N_to_SD validate inputs and flag non-positive parameters", {
  # Valid 2N CI
  df_ci <- data.frame(llci = 2, ulci = 8, N1 = 25, N2 = 25)
  res_ci <- Ci_2N_to_SD(df_ci)
  expect_equal(res_ci$invalid, 0)
  expect_true(res_ci$SD > 0)

  # Inverted 2N CI
  df_inv_ci <- data.frame(llci = 8, ulci = 2, N1 = 25, N2 = 25)
  res_inv_ci <- Ci_2N_to_SD(df_inv_ci)
  expect_equal(res_inv_ci$invalid, 1)
  expect_true(is.na(res_inv_ci$SD))

  # Valid 2N SE
  df_se <- data.frame(SE = 1.5, N1 = 20, N2 = 20)
  res_se <- SE_2N_to_SD(df_se)
  expect_equal(res_se$invalid, 0)
  expect_true(res_se$SD > 0)

  # Negative 2N SE
  df_neg_se <- data.frame(SE = -1.5, N1 = 20, N2 = 20)
  res_neg_se <- SE_2N_to_SD(df_neg_se)
  expect_equal(res_neg_se$invalid, 1)
})

# ==============================================================================
# 4. Pre-Post Conversions
# ==============================================================================

test_that("PrePost_to_MeanSD handles standard variance, calculates ccoef, and flags negatives", {
  df_std <- data.frame(
    ID = c(1, 1),
    Study_ID = c("Study_A", "Study_A"),
    group_ID = c(1, 1),
    change_group = c(0, 1),
    Mean = c(50, 40),
    SD = c(5, 6),
    changeSDin = c(NA, 4), 
    changeSD = c(NA, NA), 
    ccoef = c(NA, NA),
    N = c(100, 100)
  )
  
  res_std <- PrePost_to_MeanSD(df_std)
  expect_equal(res_std$changeMean[1], -10)
  expect_true(res_std$changeSD[1] > 0)
  expect_equal(res_std$invalid[1], 0)
  expect_true(is.finite(res_std$ccoef[1]))
  
  # Zero variance defaults ccoef to 0.5 without failure
  df_zero <- df_std
  df_zero$SD <- c(0, 0)
  res_zero <- PrePost_to_MeanSD(df_zero)
  expect_equal(res_zero$invalid[1], 1)

  # Negative SD in pre-post is flagged invalid
  df_neg <- df_std
  df_neg$SD <- c(-5, 6)
  res_neg <- PrePost_to_MeanSD(df_neg)
  expect_equal(res_neg$invalid[1], 1)

  # Multiple follow-up time points
  df_follow <- data.frame(
    ID = c(1, 1, 1),
    Study_ID = c("Study_F", "Study_F", "Study_F"),
    group_ID = c(1, 1, 1),
    change_group = c(0, 1, 2),
    Mean = c(50, 40, 35),
    SD = c(5, 6, 7),
    changeSDin = c(NA, NA, NA),
    changeSD = c(NA, NA, NA),
    ccoef = c(NA, NA, NA),
    N = c(80, 80, 80)
  )
  res_follow <- PrePost_to_MeanSD(df_follow)
  expect_equal(nrow(res_follow), 2)
  expect_true(all(res_follow$invalid == 0))
})

# ==============================================================================
# 5. Effect Size Estimations: Proportions and Single-Arm Continuous
# ==============================================================================

test_that("calculate_prop prevents -Inf on zero events and catches invalid boundaries", {
  # 0 events and 100% events with continuity correction
  df_edge <- data.frame(
    Study_ID = c("Study_Zero", "Study_Full"),
    N_events = c(0, 100),
    N = c(100, 100)
  )
  res_edge <- calculate_prop(df_edge)
  
  expect_equal(res_edge$invalid, c(0, 0))
  expect_true(all(is.finite(res_edge$logTE)))
  expect_false(any(is.infinite(res_edge$logTE)))
  expect_false(any(res_edge$logTE == -Inf))

  # Invalid: Events exceeding sample size (N_events > N)
  df_overflow <- data.frame(Study_ID = "Study_Bad", N_events = 150, N = 100)
  res_overflow <- calculate_prop(df_overflow)
  expect_equal(res_overflow$invalid, 1)
  expect_true(is.na(res_overflow$logTE))

  # Invalid: Negative events
  df_neg_ev <- data.frame(Study_ID = "Study_Neg", N_events = -5, N = 100)
  res_neg_ev <- calculate_prop(df_neg_ev)
  expect_equal(res_neg_ev$invalid, 1)

  # Invalid: Non-positive sample size
  df_zero_n <- data.frame(Study_ID = "Study_N0", N_events = 0, N = 0)
  res_zero_n <- calculate_prop(df_zero_n)
  expect_equal(res_zero_n$invalid, 1)
})

test_that("calculate_sm prevents -Inf / NaN on non-positive Mean and flags invalid SD", {
  # Standard single arm mean
  df_std <- data.frame(Study_ID = "Study_A", N = 50, Mean = 20, SD = 4)
  res_std <- calculate_sm(df_std)
  expect_equal(res_std$invalid, 0)
  expect_true(is.finite(res_std$logTE))

  # Invalid: Mean = 0 would produce -Inf on log-mean (MLN) scale
  df_zero_m <- data.frame(Study_ID = "Study_M0", N = 50, Mean = 0, SD = 4)
  res_zero_m <- calculate_sm(df_zero_m)
  expect_equal(res_zero_m$invalid, 1)
  expect_true(is.na(res_zero_m$logTE))
  expect_false(is.infinite(res_zero_m$logTE))

  # Invalid: Negative Mean
  df_neg_m <- data.frame(Study_ID = "Study_NegM", N = 50, Mean = -5, SD = 4)
  res_neg_m <- calculate_sm(df_neg_m)
  expect_equal(res_neg_m$invalid, 1)

  # Invalid: Negative SD
  df_neg_sd <- data.frame(Study_ID = "Study_NegSD", N = 50, Mean = 20, SD = -4)
  res_neg_sd <- calculate_sm(df_neg_sd)
  expect_equal(res_neg_sd$invalid, 1)
})

# ==============================================================================
# 6. Comparative Effect Sizes: Binary and Continuous
# ==============================================================================

test_that("calculate_bin and calculate_cont validate arms and flag boundary violations", {
  # Valid binary comparative study
  df_bin <- data.frame(
    ID = c(1, 2),
    Study_ID = c("Study_1", "Study_1"),
    group_ID = c(1, 2),
    N = c(10, 20),
    N_total = c(100, 100)
  )
  res_bin <- calculate_bin(df_bin)
  expect_equal(res_bin$invalid[1], 0)
  expect_true(is.finite(res_bin$TE[1]))

  # Invalid binary: events exceed total
  df_bin_bad <- data.frame(
    ID = c(1, 2),
    Study_ID = c("Study_1", "Study_1"),
    group_ID = c(1, 2),
    N = c(150, 20),
    N_total = c(100, 100)
  )
  res_bin_bad <- calculate_bin(df_bin_bad)
  expect_equal(res_bin_bad$invalid[1], 1)

  # Valid continuous comparative study
  df_cont <- data.frame(
    ID = c(1, 2),
    Study_ID = c("Study_2", "Study_2"),
    group_ID = c(1, 2),
    Mean = c(50, 45),
    SD = c(5, 6),
    N = c(30, 30)
  )
  res_cont <- calculate_cont(df_cont)
  expect_equal(res_cont$invalid[1], 0)
  expect_true(is.finite(res_cont$TE[1]))

  # Invalid continuous: non-positive SD
  df_cont_bad <- data.frame(
    ID = c(1, 2),
    Study_ID = c("Study_2", "Study_2"),
    group_ID = c(1, 2),
    Mean = c(50, 45),
    SD = c(-5, 6),
    N = c(30, 30)
  )
  res_cont_bad <- calculate_cont(df_cont_bad)
  expect_equal(res_cont_bad$invalid[1], 1)
})

# ==============================================================================
# 7. Group Combination, IPD, and Unit Conversion
# ==============================================================================

test_that("combine_MeanSD and IPD_MeanSD summarize data and catch boundary errors", {
  # Multi-arm pooling
  df_pool <- data.frame(
    ID = c(1, 2),
    Study_ID = c("Study_P", "Study_P"),
    Mean = c(10, 12),
    SD = c(2, 3),
    N = c(25, 25)
  )
  res_pool <- combine_MeanSD(df_pool)
  expect_equal(res_pool$invalid, 0)
  expect_equal(res_pool$N, 50)
  expect_equal(round(res_pool$Mean, 1), 11.0)

  # Pooling with negative variance
  df_pool_bad <- df_pool
  df_pool_bad$SD <- c(-2, 3)
  res_pool_bad <- combine_MeanSD(df_pool_bad)
  expect_equal(res_pool_bad$invalid, 1)

  # IPD summarization
  df_ipd <- data.frame(patient_data = c(10, 12, 14, 16, 18))
  res_ipd <- IPD_MeanSD(df_ipd)
  expect_equal(res_ipd$invalid, 0)
  expect_equal(res_ipd$Mean, 14)
  expect_equal(res_ipd$N, 5)

  # IPD insufficient data (N <= 1)
  df_ipd_single <- data.frame(patient_data = c(10))
  res_ipd_single <- IPD_MeanSD(df_ipd_single)
  expect_equal(res_ipd_single$invalid, 1)

  # Unit conversions and blanks
  expect_equal(unit_convert(10, 2), 20)
  expect_equal(unit_convert(10, "text"), 10)
  df_na_test <- data.frame(Mean = c(10, "NA"), SD = c(2, "NA"))
  expect_equal(nrow(Remove_NA(df_na_test)), 1)
})

# ==============================================================================
# 8. Numeric Bounds Validator and Two-Stage Pipeline
# ==============================================================================

test_that("Validate_numeric_bounds systematically flags all invalid parameters", {
  df_multi <- data.frame(
    N = c(50, -1, 40, 30),
    llci = c(10, 10, 25, 10),
    ulci = c(20, 20, 15, 20),
    pval = c(0.05, 0.05, 0.05, 0.00),
    invalid = c(0, 0, 0, 0)
  )
  
  res_val <- Validate_numeric_bounds(df_multi)
  expect_equal(res_val$invalid[1], 0)  # Valid row
  expect_equal(res_val$invalid[2], 1)  # N = -1
  expect_equal(res_val$invalid[3], 1)  # llci > ulci
  expect_equal(res_val$invalid[4], 1)  # pval = 0
})

test_that("Two-stage missing data pipeline correctly drops blanks and flags partials", {
  df_input <- data.frame(
    Mean = c(10, NA, NA),
    SD = c(2, NA, NA),
    N = c(50, 50, NA),
    stringsAsFactors = FALSE
  )
  
  df_cleaned <- Remove_NA(df_input)
  expect_equal(nrow(df_cleaned), 2)
  expect_equal(df_cleaned$N[2], 50) 
  
  mock_mandatory <- data.frame(
    ID = 1, Function = "Mock_Func", category = 1, condition = NA, 
    prepost = 0, group_1 = 0, group_2 = 0, group_3. = 0,
    Mean = 1, SD = 1, N = 1 
  )
  
  validated_df <- Validate_requirements(funcIDs = c(1), df = df_cleaned, mandatory = mock_mandatory, pp = 0)
  expect_equal(validated_df$invalid[1], 0)
  expect_equal(validated_df$invalid[2], 1)
})

# ==============================================================================
# 9. Task_manager End-to-End API Integration
# ==============================================================================

test_that("Task_manager integrates validation and guarantees finite outputs across categories", {
  # Category 1: Mean and SD conversion from CI
  df_cat1 <- data.frame(Study_ID = "Study_C1", N = 100, llci = 10, ulci = 20)
  res_cat1 <- Task_manager(
    df = jsonlite::toJSON(df_cat1),
    funcIDs = jsonlite::toJSON(c(1)),
    current_outputs = jsonlite::toJSON(c("Mean", "SD", "N")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(1)
  )
  expect_equal(res_cat1$invalid[1], 0)
  expect_true(res_cat1$SD[1] > 0)

  # Category 1: Multi-arm wide pivoting
  df_cat1_multi <- data.frame(
    Study_ID = c("Study_P1", "Study_P1"),
    group_ID = c(1, 2),
    N = c(50, 50),
    llci = c(10, 12),
    ulci = c(20, 22)
  )
  res_cat1_multi <- Task_manager(
    df = jsonlite::toJSON(df_cat1_multi),
    funcIDs = jsonlite::toJSON(c(2)),
    current_outputs = jsonlite::toJSON(c("Mean", "SD", "N")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(1)
  )
  expect_true(any(grepl("SD 1", colnames(res_cat1_multi))))
  expect_true(any(grepl("SD 2", colnames(res_cat1_multi))))

  # Category 2: Proportion effect size with 0 and 100 events (no -Inf)
  df_cat2 <- data.frame(
    Study_ID = c("Study_1", "Study_2"),
    N_events = c(0, 100),
    N = c(100, 100)
  )
  res_cat2 <- Task_manager(
    df = jsonlite::toJSON(df_cat2),
    funcIDs = jsonlite::toJSON(c(32)),
    current_outputs = jsonlite::toJSON(c("TE", "seTE", "logTE", "logSeTE")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(2)
  )
  expect_true(all(res_cat2$invalid == 0))
  expect_true(all(is.finite(res_cat2$logTE)))
  expect_false(any(res_cat2$logTE == -Inf))

  # Category 2: Invalid inputs (events > N) flagged invalid
  df_cat2_bad <- data.frame(Study_ID = "Study_Bad", N_events = 150, N = 100)
  res_cat2_bad <- Task_manager(
    df = jsonlite::toJSON(df_cat2_bad),
    funcIDs = jsonlite::toJSON(c(32)),
    current_outputs = jsonlite::toJSON(c("TE", "seTE", "logTE", "logSeTE")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(2)
  )
  expect_equal(res_cat2_bad$invalid[1], 1)
  expect_true(is.na(res_cat2_bad$logTE[1]))

  # Category 1: Pre-post conversion via Task_manager
  df_prepost_tm <- data.frame(Study_ID = c("Study_A", "Study_A"), change_group = c(0, 1), Mean = c(50, 40), SD = c(5, 6), N = c(100, 100))
  res_pp_tm <- Task_manager(
    df = jsonlite::toJSON(df_prepost_tm),
    funcIDs = jsonlite::toJSON(c(1)),
    current_outputs = jsonlite::toJSON(c("Mean", "SD", "N")),
    current_prepost = jsonlite::toJSON(TRUE),
    category = jsonlite::toJSON(1)
  )
  expect_equal(res_pp_tm$invalid[1], 0)
  expect_equal(res_pp_tm$changeMean[1], -10)

  # Category 3: Multi-arm combination via Task_manager
  df_c3_tm <- data.frame(Study_ID = c("Study_1", "Study_1"), N = c(50, 50), Median = c(10, 12), q1 = c(8, 9), q3 = c(12, 14), Mean = c(NA, NA), SD = c(NA, NA))
  res_c3_tm <- Task_manager(
    df = jsonlite::toJSON(df_c3_tm),
    funcIDs = jsonlite::toJSON(c(24)),
    current_outputs = jsonlite::toJSON(c("Mean", "SD", "N")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(3)
  )
  expect_equal(res_c3_tm$invalid[1], 0)
  expect_equal(res_c3_tm$N[1], 100)

  # Category 4: IPD summarization
  df_cat4 <- data.frame(patient_data = c(5, 10, 15, 20))
  res_cat4 <- Task_manager(
    df = jsonlite::toJSON(df_cat4),
    funcIDs = jsonlite::toJSON(c(36)),
    current_outputs = jsonlite::toJSON(c("Mean", "SD", "N")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(4)
  )
  expect_equal(res_cat4$invalid[1], 0)
  expect_equal(res_cat4$Mean[1], 12.5)

  # Category 5: Lab conversions via Task_manager
  df_cat5 <- data.frame(lab_apply = 100, labs = 1)
  res_cat5 <- Task_manager(
    df = jsonlite::toJSON(df_cat5),
    funcIDs = jsonlite::toJSON(c(40)),
    current_outputs = jsonlite::toJSON(c("lab_output")),
    current_prepost = jsonlite::toJSON(FALSE),
    category = jsonlite::toJSON(5)
  )
  expect_equal(res_cat5$invalid[1], 0)
  expect_equal(res_cat5$lab_output[1], 3)
})
