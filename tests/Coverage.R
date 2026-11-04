library(covr)
library(testthat)
# Measure coverage of test suite
cov <- file_coverage(
  source_files = "routes/base_scripts.R",
  test_files   = "tests/test_edge_cases.R"
)
# Print percentage
percent_coverage(cov)
# Generate a summary table
coverage_df <- tally_coverage(cov)
