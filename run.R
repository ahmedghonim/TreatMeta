library(plumber)

root <- pr("api.R")
root %>% pr_run(port = 3071)
