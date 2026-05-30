library(testthat)
library(dplyr)
library(meta)

# Load backend scripts
setwd("tests")
source("../packages.R", chdir = TRUE)
source("../routes/base_scripts.R", chdir = TRUE)
context("TreatMeta Backend API Validation")

test_that("Ci_N_to_SD processes standard inputs and boundary sample sizes", {
  df_std <- data.frame(N = 100, llci = 10, ulci = 20, `CI%` = 0.95, check.names = FALSE)
  res_std <- Ci_N_to_SD(df_std)
  
  expect_true(is.numeric(res_std$SD))
  expect_equal(round(res_std$SD, 2), 25.51)
  
  df_edge <- data.frame(N = 1, llci = 10, ulci = 20, `CI%` = 0.95, check.names = FALSE)
  res_edge <- Ci_N_to_SD(df_edge)
  expect_false(is.nan(res_edge$SD) | is.na(res_edge$SD))
})

test_that("MedianIQ_to_MeanSD accurately approximates missing summary statistics", {
  df_std <- data.frame(N = 50, Median = 15, q1 = 10, q3 = 20, Mean = NA, SD = NA)
  res_std <- MedianIQ_to_MeanSD(df_std)
  
  expect_true(is.numeric(res_std$Mean))
  expect_true(is.numeric(res_std$SD))
  
  df_na <- data.frame(N = 50, Median = NA, q1 = 10, q3 = 20, Mean = NA, SD = NA)
  res_na <- MedianIQ_to_MeanSD(df_na)
  
  expect_true(is.na(res_na$Mean))
})

test_that("PrePost_to_MeanSD handles standard variance and defaults ccoef to 0.5 for zero variance", {
  df_std <- data.frame(
    ID = c(1, 1),
    Study_ID = c("Study_A", "Study_A"),
    group_ID = c(1, 1),
    change_group = c(0, 1),
    Mean = c(50, 40),
    SD = c(5, 6),
    changeSDin = c(NA, NA),
    changeSD = c(NA, NA), 
    ccoef = c(NA, NA),
    N = c(100, 100)
  )
  
  res_std <- PrePost_to_MeanSD(df_std)
  expect_equal(res_std$changeMean[1], -10)
  expect_true(res_std$changeSD[1] > 0)
  
  # Test the updated ccoef logic with zero variance
  df_zero <- df_std
  df_zero$SD <- c(0, 0)
  
  res_zero <- PrePost_to_MeanSD(df_zero)
  
  # The updated logic successfully catches the non-finite result and defaults to 0.5
  expect_equal(res_zero$ccoef[1], 0.5)
})

test_that("calculate_prop computes stable effect sizes for absolute proportions", {
  df_edge <- data.frame(
    Study_ID = c("Study_A", "Study_B"),
    N_events = c(0, 100),
    N = c(100, 100)
  )
  
  res_edge <- calculate_prop(df_edge)
  
  expect_true(all(!is.na(res_edge$TE)))
  expect_true(all(!is.na(res_edge$seTE)))
  expect_true(all(is.finite(res_edge$logTE)))
})

test_that("Two-stage missing data pipeline correctly drops blanks and flags partials", {
  df_input <- data.frame(
    Mean = c(10, NA, NA),
    SD = c(2, NA, NA),
    N = c(50, 50, NA),
    stringsAsFactors = FALSE
  )
  
  # Stage 1: Remove completely blank rows
  df_cleaned <- Remove_NA(df_input)
  expect_equal(nrow(df_cleaned), 2)
  expect_equal(df_cleaned$N[2], 50) 
  
  # Stage 2: Validate requirements flags partial rows
  mock_mandatory <- data.frame(
    ID = 1, Function = "Mock_Func", category = 1, condition = NA, 
    prepost = 0, group_1 = 0, group_2 = 0, group_3. = 0,
    Mean = 1, SD = 1, N = 1 
  )
  
  validated_df <- Validate_requirements(funcIDs = c(1), df = df_cleaned, mandatory = mock_mandatory, pp = 0)
  
  expect_equal(validated_df$invalid[1], 0)
  expect_equal(validated_df$invalid[2], 1)
})

