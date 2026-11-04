library(tibble)
library(DBI)

if (file.exists("./loadDB.R")) {
  source("./loadDB.R")
} else if (file.exists("routes/loadDB.R")) {
  source("routes/loadDB.R")
} else if (file.exists("../routes/loadDB.R")) {
  source("../routes/loadDB.R")
}

Ci_N_to_SD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  ci<-0.95
  
  bad_rows <- is.na(df$N) | is.na(df$llci) | is.na(df$ulci) | df$N <= 1 | df$llci >= df$ulci
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(SD=ifelse(invalid == 0,
                     sqrt(N) * (ulci-llci) / ifelse(N>=100, 3.92, 2*uxstats::tinv(1-ci, pmax(N-1, 1)) ),
                     NA_real_))
  
  return(out)
}

SE_N_to_SD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_rows <- is.na(df$N) | is.na(df$SE) | df$N <= 0 | df$SE <= 0
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(SD=ifelse(invalid == 0, SE*sqrt(N), NA_real_))
  
  return(out)
}

MedianIQ_to_MeanSD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_rows <- is.na(df$N) | is.na(df$Median) | is.na(df$q1) | is.na(df$q3) |
              df$N <= 1 | df$q1 >= df$q3 | df$Median < df$q1 | df$Median > df$q3
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(Mean= ifelse(invalid == 0,
                        ifelse(!is.na(Mean), Mean, (0.7+0.39/N)*0.5*(q1+q3)+(0.3-0.39/N)*Median),
                        NA_real_))%>%
    mutate(SD=ifelse(invalid == 0,
                     ifelse(!is.na(SD), SD, (q3-q1)/(2*qnorm((0.75*N-0.125)/(N+0.25),0,1))),
                     NA_real_))
  
  return(out)
}

MedianRng_to_MeanSD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_rows <- is.na(df$N) | is.na(df$Median) | is.na(df$min) | is.na(df$max) |
              df$N <= 1 | df$min >= df$max | df$Median < df$min | df$Median > df$max
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(Mean=ifelse(invalid == 0,
                       ifelse(!is.na(Mean), Mean, 2/(4+N^0.75)*(min+max) + N^0.75/(4+N^0.75)*Median),
                       NA_real_) )%>%
    mutate(SD= ifelse(invalid == 0,
                      ifelse(!is.na(SD), SD,(max-min)/(2*qnorm((N-0.375)/(N+0.25),0,1))),
                      NA_real_) )
  
  return(out)
}


Pval_2N_to_SD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_rows <- is.na(df$N1) | is.na(df$N2) | is.na(df$pval) | is.na(df$Mean) |
              df$N1 <= 0 | df$N2 <= 0 | (df$N1 + df$N2) <= 2 |
              df$pval <= 0 | df$pval >= 1
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(SD= ifelse(invalid == 0,
                      abs(Mean/uxstats::tinv(pval, pmax(N1+N2-2, 1)))/sqrt(1/N1+1/N2),
                      NA_real_))
  
  return(out)
}

Ci_2N_to_SD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  ci<-0.95
  if("CI_percent" %in% colnames(df)){
    ci<-ifelse(is.na(df$`CI%`),0.95,df$`CI%`[1])
  }
  bad_rows <- is.na(df$N1) | is.na(df$N2) | is.na(df$llci) | is.na(df$ulci) |
              df$N1 <= 0 | df$N2 <= 0 | (df$N1 + df$N2) <= 2 | df$llci >= df$ulci
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(SD=ifelse(invalid == 0,
                     ((ulci-llci)/ifelse(N1+N2>=100,3.92,uxstats::tinv(1-ci, pmax(N1+N2-2, 1))*2))/sqrt(1/N1+1/N2),
                     NA_real_))
  
  return(out)
}

SE_2N_to_SD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_rows <- is.na(df$N1) | is.na(df$N2) | is.na(df$SE) |
              df$N1 <= 0 | df$N2 <= 0 | df$SE <= 0
  df$invalid[bad_rows] <- 1

  out<-df%>%
    mutate(SD=ifelse(invalid == 0, SE/sqrt(1/N1+1/N2), NA_real_))
  
  return(out)
}

split_df_prepost<-function(df){
  #change_group=0 ->Pre, change_group=1 ->Post 
  #invalidate anything that has more than 2 rows or has invalid prepost groups
  if(!"changeSDin" %in% colnames(df)) df$changeSDin <- NA_real_
  if(!"changeSD" %in% colnames(df)) df$changeSD <- NA_real_
  if(!"ccoef" %in% colnames(df)) df$ccoef <- NA_real_
  df<-df%>%fill(any_of(c("changeSDin", "ccoef")), .direction = "updown")
  ready_df<-data.frame()
  if(nrow(df)==2 && sum(df$change_group) == 1){

    pre_group<-df%>% filter(change_group==0) %>% rename(preMean=Mean, preSD=SD)
    post_group<-df%>% filter(change_group==1) %>% rename(postMean=Mean, postSD=SD) %>%
      mutate(changeSD = ifelse(!is.na(changeSDin), changeSDin, changeSD))
    
    ready_df<-cbind(pre_group,postMean=post_group$postMean, postSD=post_group$postSD)%>%
      mutate(invalid=0, func="PrePost_to_MeanSD")
  }
  else{
    ready_df<-df%>%rename(preMean=Mean, preSD=SD)%>%
      mutate(postMean=NA, postSD=NA, ccoef=NA, invalid=1)
  }

  ready_df<-ready_df%>%select(any_of(c("ID", "Study_ID","group_ID" ,"change_group","changeSD" ,"preMean","preSD", "postMean", "postSD","N", "changeSDin", "ccoef", "invalid", "func")))
  return (as_tibble(ready_df))
}

compose_followups<-function(df){
  baseline<-df%>%filter(change_group==0)
  followups<-df%>%filter(change_group!=0)%>%rowwise%>%mutate(Study_ID = paste(Study_ID, change_group))%>%
    arrange(change_group)%>%
    group_by(change_group)%>%group_split()
  
  split_followups<-lapply(followups, function(x) {
    if(nrow(baseline)>0){
      bl<-baseline
      bl$Study_ID<-x$Study_ID
      split_df_prepost(rbind(bl, x%>%mutate(change_group=1)) )
    }else{
      split_df_prepost( x%>%mutate(change_group=1) ) 
    }
    }
  )
  merged_followups<-do.call("rbind", split_followups)
  return(merged_followups)
}

prepare_prepost<-function(df){

  grouped_by_study<-df%>%group_by(Study_ID)%>%group_split()
  output_study_list<-list()
  
  for (i in 1:length(grouped_by_study)){
    itm<-grouped_by_study[[i]]
    if(nrow(itm)<=2){
      itm<-compose_followups(itm)
      output_study_list<-append(output_study_list, list(itm))
      
    } else if (nrow(itm)>2 && "group_ID" %in% colnames(itm)){
      output_arm_list<-list()
      grouped_by_arm<-itm%>%group_by(group_ID)%>%group_split()
      
      for (a in 1:length(grouped_by_arm)){
        arm<-grouped_by_arm[[a]]
        if(nrow(arm)<=2){
            arm<-compose_followups(arm)
            output_arm_list<-append(output_arm_list, list(arm))
        }
        else if(min(arm$change_group) == 0 && sum(duplicated(arm$change_group)) == 0 ){
          merged_followups<-compose_followups(arm)
          output_study_list<-append(output_study_list, list(merged_followups))
        }
        else{
          output_study_list<-append(output_study_list, list(split_df_prepost(arm)))
        }
       }
      output_study_list<-append(output_study_list,list(do.call("rbind",output_arm_list)))
    }else if (min(itm$change_group) == 0 && sum(duplicated(itm$change_group)) == 0 ){
      merged_followups<-compose_followups(itm)
      output_study_list<-append(output_study_list, list(merged_followups))
    } else{
      output_study_list<-append(output_study_list, list(split_df_prepost(itm)))
    }
  }

  df<-do.call("rbind", output_study_list)
  return (df)
}

calc_CCoef<-function(df){
  cc_def<-0.5
  ccoef<-data.frame()
  if("ccoef" %in% colnames(df))
  { 
    ccoef<-df%>%filter(!is.na(`ccoef`) | !is.na(changeSDin))
  }

  if(nrow(ccoef)>0){
    valid_sd <- !is.na(ccoef$preSD) & !is.na(ccoef$postSD) & (ccoef$preSD * ccoef$postSD > 0)
    ccoef$ccoef[valid_sd] <- ifelse(is.na(ccoef$ccoef[valid_sd]),
      (ccoef$preSD[valid_sd]^2 + ccoef$postSD[valid_sd]^2 - ccoef$changeSDin[valid_sd]^2) / (2 * ccoef$preSD[valid_sd] * ccoef$postSD[valid_sd]),
      ccoef$ccoef[valid_sd])
    ccoef$ccoef[!valid_sd & is.na(ccoef$ccoef)] <- 0.5
    ccoef$ccoef <- ifelse(is.finite(ccoef$ccoef) & ccoef$ccoef >= -1 & ccoef$ccoef <= 1, ccoef$ccoef, 0.5)
    m_ccoef<-mean(ccoef$ccoef, na.rm = TRUE)
  }else{
    m_ccoef<-0
  }
  if(!is.na(m_ccoef) && m_ccoef!=0){
    cc_def<-m_ccoef
  }
  
  return(df%>%mutate(ccoef=cc_def))
}


PrePost_to_MeanSD<-function(df){
  prepared_df<-prepare_prepost(df)
  prepared_df<-calc_CCoef(prepared_df)
  
  bad_prepost <- is.na(prepared_df$preSD) | is.na(prepared_df$postSD) |
                 prepared_df$preSD <= 0 | prepared_df$postSD <= 0 |
                 (!is.na(prepared_df$N) & prepared_df$N <= 0)
  prepared_df$invalid[bad_prepost] <- 1

  invalid<-prepared_df%>%filter(invalid==1)%>%mutate(changeMean=preMean,
                                                     changeSD=preSD)
  valid_subset <- prepared_df%>%filter(invalid==0)
  if(nrow(valid_subset) > 0){
    variance_term <- pmax(0, valid_subset$preSD^2 + valid_subset$postSD^2 - 2 * valid_subset$preSD * valid_subset$postSD * valid_subset$ccoef)
    valid_subset <- valid_subset %>% mutate(
      changeMean = postMean - preMean,
      changeSD = ifelse(!is.na(changeSD), changeSD, sqrt(variance_term))
    )
  }
  
  out<-rbind(invalid, valid_subset)%>%arrange(ID)
  return(out)
}

calculate_prop<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  
  bad_rows <- is.na(df$N) | is.na(df$N_events) | df$N <= 0 | df$N_events < 0 | df$N_events > df$N
  df$invalid[bad_rows] <- 1
  
  if(!"TE" %in% colnames(df)) df$TE <- NA_real_
  if(!"seTE" %in% colnames(df)) df$seTE <- NA_real_
  if(!"logTE" %in% colnames(df)) df$logTE <- NA_real_
  if(!"logSeTE" %in% colnames(df)) df$logSeTE <- NA_real_
  
  valid_idx <- which(df$invalid == 0)
  if(length(valid_idx) > 0){
    sub_df <- df[valid_idx, ]
    m.prop.r <- meta::metaprop(N_events, N, studlab = Study_ID, data = sub_df, sm = "PRAW", method.incr = "all", incr = 0.5)
    m.prop <- meta::metaprop(N_events, N, studlab = Study_ID, data = sub_df, sm = "PLOGIT", method.incr = "all", incr = 0.5)
    
    logTE_vals <- m.prop$TE
    logSeTE_vals <- m.prop$seTE
    for(k in seq_along(logTE_vals)){
      if(!is.finite(logTE_vals[k])){
        ev <- sub_df$N_events[k]
        tot <- sub_df$N[k]
        adj_p <- (ev + 0.5) / (tot + 1)
        logTE_vals[k] <- log(adj_p / (1 - adj_p))
        logSeTE_vals[k] <- sqrt(1 / (ev + 0.5) + 1 / (tot - ev + 0.5))
      }
    }
    
    df$TE[valid_idx] <- m.prop.r$TE
    df$seTE[valid_idx] <- m.prop.r$seTE
    df$logTE[valid_idx] <- logTE_vals
    df$logSeTE[valid_idx] <- logSeTE_vals
  }
  
  if(any(bad_rows)){
    df$TE[bad_rows] <- NA_real_
    df$seTE[bad_rows] <- NA_real_
    df$logTE[bad_rows] <- NA_real_
    df$logSeTE[bad_rows] <- NA_real_
  }
  
  return(df)
}

calculate_sm<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  
  bad_rows <- is.na(df$N) | is.na(df$Mean) | is.na(df$SD) | df$N <= 0 | df$SD <= 0 | df$Mean <= 0
  df$invalid[bad_rows] <- 1
  
  if(!"TE" %in% colnames(df)) df$TE <- NA_real_
  if(!"seTE" %in% colnames(df)) df$seTE <- NA_real_
  if(!"logTE" %in% colnames(df)) df$logTE <- NA_real_
  if(!"logSeTE" %in% colnames(df)) df$logSeTE <- NA_real_

  valid_idx <- which(df$invalid == 0)
  if(length(valid_idx) > 0){
    sub_df <- df[valid_idx, ]
    m.mean <- meta::metamean(N, Mean, SD, studlab = Study_ID, data = sub_df, sm = "MLN")
    m.mean.r <- meta::metamean(N, Mean, SD, studlab = Study_ID, data = sub_df)
    
    df$TE[valid_idx] <- m.mean.r$TE
    df$seTE[valid_idx] <- m.mean.r$seTE
    df$logTE[valid_idx] <- m.mean$TE
    df$logSeTE[valid_idx] <- m.mean$seTE
  }
  
  if(any(bad_rows)){
    df$TE[bad_rows] <- NA_real_
    df$seTE[bad_rows] <- NA_real_
    df$logTE[bad_rows] <- NA_real_
    df$logSeTE[bad_rows] <- NA_real_
  }
  
  return(df)
}

prepare_groups<-function(df, data_type){
  #data_type 0:binary  1:continuous
  if(data_type){
    group1<-df%>% filter(group_ID==1) %>% rename(Mean1=Mean, SD1=SD, N1=N)
    group2<-df%>% filter(group_ID==2) %>% rename(Mean2=Mean, SD2=SD, N2=N) %>%select(Mean2, SD2, N2)
  }
  else{
    group1<-df%>% filter(group_ID==1) %>% rename(N1=N, total1=N_total)
    group2<-df%>% filter(group_ID==2) %>% rename(N2=N, total2=N_total) %>%select(N2, total2)
  }

  if(nrow(group1) == 0 || nrow(group2) == 0 || nrow(group1) != nrow(group2)){
    group1$invalid <- 1
    return(group1)
  }
  
  return(cbind(group1, group2))
}

calculate_bin<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_counts <- is.na(df$N) | is.na(df$N_total) | df$N < 0 | df$N_total <= 0 | df$N > df$N_total
  df$invalid[bad_counts] <- 1

  df_prep <- prepare_groups(df, 0)
  if(all(df_prep$invalid == 1)){
    df$TE <- NA_real_
    df$seTE <- NA_real_
    return(df %>% select(any_of(c("ID", "Study_ID", "TE", "seTE", "invalid", "func"))))
  }
  
  m.bin<-meta::metabin(N1, total1, N2, total2, data = df_prep, incr = "TACC", studlab = Study_ID)
  df_prep$TE=m.bin$TE
  df_prep$seTE=m.bin$seTE
  out<-df_prep%>%select(any_of(c("ID", "Study_ID", "TE", "seTE", "invalid", "func")))
  return(out)
}

calculate_cont<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_vars <- is.na(df$N) | is.na(df$Mean) | is.na(df$SD) | df$N <= 0 | df$SD <= 0
  df$invalid[bad_vars] <- 1

  df_prep <- prepare_groups(df, 1)
  if(all(df_prep$invalid == 1)){
    df$TE <- NA_real_
    df$seTE <- NA_real_
    return(df %>% select(any_of(c("ID", "Study_ID", "TE", "seTE", "invalid", "func"))))
  }
  
  m.cont<-meta::metacont(N1, Mean1, SD1, N2, Mean2, SD2, studlab = Study_ID, data = df_prep)
  df_prep$TE=m.cont$TE
  df_prep$seTE=m.cont$seTE
  out<-df_prep%>%select(any_of(c("ID", "Study_ID", "TE", "seTE", "invalid", "func")))
  return(out)  
}

combine_MeanSD<-function(df){
  if(!"invalid" %in% colnames(df)) df$invalid <- 0
  bad_rows <- is.na(df$N) | is.na(df$Mean) | is.na(df$SD) | df$N <= 0 | df$SD < 0
  df$invalid[bad_rows] <- 1

  valid_studies <- df %>% group_by(Study_ID) %>% filter(all(invalid == 0))
  invalid_studies <- df %>% group_by(Study_ID) %>% filter(any(invalid == 1))
  
  out_valid <- data.frame()
  if(nrow(valid_studies) > 0){
    v_df <- valid_studies %>% group_by(Study_ID)
    study_id <- v_df %>% group_keys()
    IDs <- do.call("rbind", v_df %>% group_map(~head(.x, 1L))) %>% select(ID)
    split_df <- v_df %>% group_split()
    decomp_res <- lapply(split_df, function(x) {
      tail(utilities::sample.decomp(n = x$N, sample.mean = x$Mean, sample.sd = x$SD, include.sd = TRUE), 1) %>% select(!sample.var)
    })
    out_valid <- cbind(IDs, study_id, do.call("rbind", decomp_res)) %>%
      rename(N = n, Mean = sample.mean, SD = sample.sd) %>%
      mutate(invalid = 0, func = "combine_MeanSD") %>% relocate(N, .after = SD)
  }
  
  out_invalid <- data.frame()
  if(nrow(invalid_studies) > 0){
    inv_df <- invalid_studies %>% group_by(Study_ID)
    study_id <- inv_df %>% group_keys()
    IDs <- do.call("rbind", inv_df %>% group_map(~head(.x, 1L))) %>% select(ID)
    out_invalid <- cbind(IDs, study_id, Mean = NA_real_, SD = NA_real_, N = NA_real_) %>%
      mutate(invalid = 1, func = "combine_MeanSD")
  }
  
  out <- rbind(out_valid, out_invalid) %>% arrange(ID)
  rownames(out) <- NULL
  return(out)
}

Validate_numeric_bounds <- function(df) {
  if (!"invalid" %in% colnames(df)) df$invalid <- 0
  
  for (r in seq_len(nrow(df))) {
    if (df$invalid[r] == 1) next
    
    # Sample size checks
    if ("N" %in% colnames(df) && !is.na(df$N[r])) {
      if (df$N[r] <= 0 || !is.finite(df$N[r])) df$invalid[r] <- 1
    }
    if ("N1" %in% colnames(df) && !is.na(df$N1[r])) {
      if (df$N1[r] <= 0 || !is.finite(df$N1[r])) df$invalid[r] <- 1
    }
    if ("N2" %in% colnames(df) && !is.na(df$N2[r])) {
      if (df$N2[r] <= 0 || !is.finite(df$N2[r])) df$invalid[r] <- 1
    }
    if ("total1" %in% colnames(df) && !is.na(df$total1[r])) {
      if (df$total1[r] <= 0 || !is.finite(df$total1[r])) df$invalid[r] <- 1
    }
    if ("total2" %in% colnames(df) && !is.na(df$total2[r])) {
      if (df$total2[r] <= 0 || !is.finite(df$total2[r])) df$invalid[r] <- 1
    }
    
    # Non-negative variances / spread
    if ("SD" %in% colnames(df) && !is.na(df$SD[r])) {
      if (df$SD[r] <= 0 || !is.finite(df$SD[r])) df$invalid[r] <- 1
    }
    if ("SE" %in% colnames(df) && !is.na(df$SE[r])) {
      if (df$SE[r] <= 0 || !is.finite(df$SE[r])) df$invalid[r] <- 1
    }
    if ("preSD" %in% colnames(df) && !is.na(df$preSD[r])) {
      if (df$preSD[r] <= 0 || !is.finite(df$preSD[r])) df$invalid[r] <- 1
    }
    if ("postSD" %in% colnames(df) && !is.na(df$postSD[r])) {
      if (df$postSD[r] <= 0 || !is.finite(df$postSD[r])) df$invalid[r] <- 1
    }
    
    # Confidence intervals
    if (all(c("llci", "ulci") %in% colnames(df)) && !is.na(df$llci[r]) && !is.na(df$ulci[r])) {
      if (df$llci[r] >= df$ulci[r] || !is.finite(df$llci[r]) || !is.finite(df$ulci[r])) df$invalid[r] <- 1
    }
    
    # Interquartile range
    if (all(c("q1", "q3") %in% colnames(df)) && !is.na(df$q1[r]) && !is.na(df$q3[r])) {
      if (df$q1[r] >= df$q3[r] || !is.finite(df$q1[r]) || !is.finite(df$q3[r])) df$invalid[r] <- 1
    }
    
    # Range
    if (all(c("min", "max") %in% colnames(df)) && !is.na(df$min[r]) && !is.na(df$max[r])) {
      if (df$min[r] >= df$max[r] || !is.finite(df$min[r]) || !is.finite(df$max[r])) df$invalid[r] <- 1
    }
    
    # Median within bounds
    if ("Median" %in% colnames(df) && !is.na(df$Median[r])) {
      if ("q1" %in% colnames(df) && !is.na(df$q1[r]) && df$Median[r] < df$q1[r]) df$invalid[r] <- 1
      if ("q3" %in% colnames(df) && !is.na(df$q3[r]) && df$Median[r] > df$q3[r]) df$invalid[r] <- 1
      if ("min" %in% colnames(df) && !is.na(df$min[r]) && df$Median[r] < df$min[r]) df$invalid[r] <- 1
      if ("max" %in% colnames(df) && !is.na(df$max[r]) && df$Median[r] > df$max[r]) df$invalid[r] <- 1
    }
    
    # Events
    if (all(c("N_events", "N") %in% colnames(df)) && !is.na(df$N_events[r]) && !is.na(df$N[r])) {
      if (df$N_events[r] < 0 || df$N_events[r] > df$N[r]) df$invalid[r] <- 1
    }
    
    # P-value
    if ("pval" %in% colnames(df) && !is.na(df$pval[r])) {
      if (df$pval[r] <= 0 || df$pval[r] >= 1 || !is.finite(df$pval[r])) df$invalid[r] <- 1
    }
  }
  
  return(df)
}

Validate_requirements<-function(funcIDs, df, mandatory, pp){
  df<-df%>%mutate(invalid=0, func="")
  available_funcs<-mandatory[funcIDs,]%>% select(-Function, -condition, -category)
  available_funcs<- available_funcs %>%  rowwise() %>% 
    mutate(original=sum( c_across(2: ncol(available_funcs) ) ), current=0 )
  
  for (v in 1:nrow(df)){
    df_row<-df[v,] %>% select(!invalid)
    df_row<-df_row%>%select_if(function(x) x!=""  &!is.na(x))
    for (i in 1:nrow(available_funcs)) {
      row<-available_funcs[i,]
      col_inds<-match(colnames(df_row),colnames(available_funcs))
      available_funcs$current[i]=sum(rep(1, length(df_row))& as.numeric(row[col_inds]) )
    }
    
    eligible<-available_funcs%>%filter(current==original)
    ifelse(nrow(eligible), df$func[v]<-mandatory$`Function`[eligible$`ID`[1]], df$invalid[v]<-1)
    available_funcs<-available_funcs%>%mutate(current=0)
  }

  return(df)
}

IPD_MeanSD<-function(df){
  clean_data <- df$patient_data[!is.na(df$patient_data) & is.finite(df$patient_data)]
  if(length(clean_data) <= 1){
    return(data.frame(ID = 1, Mean = NA_real_, SD = NA_real_, N = length(clean_data), invalid = 1, func = "IPD_MeanSD"))
  }
  output_df<-cbind(ID=c(1),df%>%summarise(Mean=mean(patient_data),
                            SD=sd(patient_data)),N=nrow(df), invalid = 0, func = "IPD_MeanSD")
  return(output_df)
}

unit_convert<-function(x,unit){
  suppressWarnings(num_unit <- as.numeric(unit))
  if(!is.na(num_unit)){
    return(x*num_unit)
  }
  else{
    return(x)
  }
}

apply_labs<-function(df){
  exceptionCols<-c(char_cols,"group_ID","N")
  removedCols<-df%>%select(any_of(exceptionCols))
  df<-df%>%mutate(labs=ifelse(!is.na(labs), Labs$ratio[labs], labs))
  
  df<-df%>%select(!any_of(exceptionCols))%>%rowwise()%>%
    mutate(across(everything(),~ unit_convert(.,labs)))%>%select(-labs)
  df<-cbind(removedCols,df)
  return(df)
}

Remove_NA<-function(df){
  Na_indices<-c()
  for (row in 1: nrow(df)){
    row_vals <- as.character(unlist(df[row, ]))
    if (all(is.na(row_vals) | row_vals == "NA" | trimws(row_vals) == "")){
      Na_indices<-c(Na_indices, row)
    }
  }
  if(length(Na_indices)){
    cn<-colnames(df)
    df<-as.data.frame(df[-Na_indices, , drop = FALSE])
    colnames(df)<-cn
    return (df)
  }
  else{
    return (df)
  }
}

Order_outCols<-function(df, lcols){
  acc<-df
  for(itr in 1:length(lcols)-1){
      acc<-acc%>%relocate(lcols[itr+1], .after = lcols[itr])
  }
  return (acc)
}

char_cols <- df_names$internal[which(df_names$type == "text")]

#' Convert Standard error and sample size into Standard Deviation
#' @post /Task_manager
#' @param df JSON object of The dataframe containing user input
#' @param funcIDs JSON object of the indices of valid functions in mandatory_inputs
#' @param current_outputs JSON object of The outputs of current funcIDs
#' @param current_prepost Whether there's prepost data
#' @param category category of operations
#' @return JSON object containing final result of the api call
#' @serializer json list(na="string")
Task_manager<-function( df, funcIDs, current_outputs, current_prepost, category ){
  df<-fromJSON(df)

  if(sum(char_cols %in% colnames(df))>0){
    df<-cbind(df%>%select(all_of(char_cols)),
              df%>%select(!any_of(char_cols))%>%mutate_all(as.numeric)%>%rowwise())
  }
  else{
    df<-df%>%mutate_all(as.numeric)
  }

  c<-fromJSON(category)
  if("labs" %in% colnames(df) && c != 5){
   df<-apply_labs(df)
  }
  df<-Remove_NA(df)

  mandatory_inputs<-mandatory
  funcIDs<-as.vector(fromJSON(funcIDs))
  current_outs<-as.vector(fromJSON(current_outputs))
  output_placeholder_indices<-match(current_outs,colnames(df))
  current_prepost<-fromJSON(current_prepost)
  
  prepost_indicies<-which(mandatory$Function=="PrePost_to_MeanSD")
  funcIDs<-funcIDs[!funcIDs %in% prepost_indicies]

  old_colnames<-colnames(df)
  if(sum(is.na(output_placeholder_indices))){
    for(out in 1:length(output_placeholder_indices)){
      if(is.na(output_placeholder_indices[out])){
        df<-cbind(
          rep(NA,nrow(df)),
          df
        )
      }
    }
    colnames(df)<-c(current_outs[is.na(output_placeholder_indices)], old_colnames)
  }
  validated_df<-Validate_requirements(funcIDs, df, mandatory_inputs, current_prepost)
  if("ID" %in% colnames(validated_df)) validated_df<-validated_df%>%select(-ID)
  validated_df<-validated_df%>%rowid_to_column("ID")
  validated_df<-Validate_numeric_bounds(validated_df)

  valid_rows<-validated_df%>%filter(invalid==0)
  ready_rows<-validated_df%>%filter_at(vars(any_of(current_outs)), all_vars(!is.na(.))) %>% filter(!(ID %in% valid_rows$ID))%>%mutate(invalid=0)
  invalid_rows<-validated_df%>%filter(invalid!=0 ,  !(ID %in% ready_rows$ID))

  if (c ==1){
      if(nrow(valid_rows)>0){
        for(v in 1:nrow(valid_rows)){
             valid_rows[v,]<-do.call(valid_rows$func[v], list(valid_rows[v,]))
        }
      }
    Cat1_output_vars<-c("ID", "Study_ID", "group_ID", "Mean", "SD","N", "invalid", "func")
    
    if(current_prepost && "change_group" %in% colnames(df)){
      Cat1_output_vars<-c("ID", "Study_ID", "group_ID", "change_group", "changeMean", "changeSD", "changeSDin", "Mean", "SD","N","ccoef", "invalid", "func")
    }
    
    valid_rows<-valid_rows%>%select(any_of(Cat1_output_vars))
    ready_rows<-ready_rows%>%select(any_of(Cat1_output_vars))
    invalid_rows<-invalid_rows%>%select(any_of(Cat1_output_vars))
  }
  else if(c == 2){
    if(nrow(valid_rows)>0){
      grouped_rows<-valid_rows%>%group_by(func)%>%group_split()
      grouped_rows<-lapply(grouped_rows, function(df) do.call(df$func[1], list(df)))
      valid_rows<-do.call("rbind", grouped_rows)%>%select(any_of(c("ID", "Study_ID", "TE", "seTE","logTE", "logSeTE","invalid", "func")))
    }
    ready_rows<-ready_rows%>%select(any_of(c("ID", "Study_ID", "TE", "seTE","logTE", "logSeTE","invalid", "func")))
    invalid_rows<-invalid_rows%>%select(any_of(c("ID", "Study_ID", "TE", "seTE","logTE", "logSeTE","invalid", "func")))
  }
  else if(c==3){
    if(nrow(valid_rows)>0){
      for(v in 1:nrow(valid_rows)){
        valid_rows[v,]<-do.call(valid_rows$func[v], list(valid_rows[v,]))
      }
    }
    valid_rows<-combine_MeanSD(rbind(valid_rows,ready_rows))
    ready_rows<-ready_rows[0,]
  }
  else if(c==4){
    if(nrow(valid_rows)>0){
      valid_rows<-IPD_MeanSD(valid_rows)%>%mutate(func="IPD_MeanSD")
    }
    ready_rows<-ready_rows%>%select(ID,Mean, SD, N, invalid, func)
    invalid_rows<-invalid_rows%>%select(ID, Mean, SD, N,invalid, func)
  }
  else if(c==5){
    if(nrow(valid_rows) > 0){
      valid_rows <- valid_rows %>% mutate(lab_output = unit_convert(lab_apply, Labs$ratio[labs])) %>% select(any_of(c("ID", "lab_output", "invalid", "func")))
    }
    ready_rows <- ready_rows %>% select(any_of(c("ID", "lab_output", "invalid", "func")))
    invalid_rows <- invalid_rows %>% select(any_of(c("ID", "lab_output", "invalid", "func")))
  }
  out_df<-rbind(ready_rows,valid_rows, invalid_rows)%>%arrange(ID)
  
  if(current_prepost && all(c("Mean", "SD", "change_group") %in% colnames(out_df)) ){
    current_outs<-c("changeMean", "changeSD", "N")
    if(!"changeSDin" %in% colnames(out_df)) out_df$changeSDin <- NA_real_

    valid_prepost<-out_df%>%filter(!is.na(change_group),!is.na(Mean), !is.na(SD), !is.na(Study_ID))
    invalid_prepost<-out_df%>%filter(!(ID %in% valid_prepost$ID))%>%
      mutate(changeMean=Mean, changeSD=ifelse(!is.na(changeSDin),changeSDin,SD), invalid=1)
    valid_prepost<-PrePost_to_MeanSD(valid_prepost)
    Prepost_output_vars<-c("ID", "Study_ID","group_ID", "changeMean", "changeSD","N","invalid", "func" )

    out_df<-rbind(valid_prepost%>%select(any_of(Prepost_output_vars))
                  ,invalid_prepost%>%select(any_of(Prepost_output_vars))
                  )%>%arrange(ID)%>%select(-ID)%>%rowid_to_column("ID")
  }

  if("group_ID" %in% colnames(out_df) && (c == 1 || category == 1)){
    lst<-out_df%>%group_by(Study_ID)%>%group_split()
    valid_inds<-lapply(lst, function(x){if(nrow(x%>%distinct(group_ID))==nrow(x) && nrow(x)>1 && max(x$group_ID)<11){ 
      return(TRUE)
    }else {return(FALSE)}})
    g_df<-do.call("rbind", lst[unlist(valid_inds)])
    na_df<-do.call("rbind", lst[!unlist(valid_inds)])
  
    max_group_val<-max(g_df$group_ID)
    ma=ifelse(is.infinite(max_group_val),1,max_group_val)
    
    if(ma>1){
      g_df<-g_df%>%mutate(func=NA)
      newnames<-paste(current_outs,"1")
      newcols<-paste(current_outs, sort(rep(seq(2,ma), length(current_outs))) )
      
      g_df<-g_df%>%select(-ID)
      g_df<-g_df%>%pivot_wider(names_from = group_ID, values_from = all_of(current_outs), names_glue = "{.value} {group_ID}", names_sort = TRUE, names_repair = "unique")
      if(!is.null(na_df) && nrow(na_df) > 0){
        na_df<-na_df%>%rename_at(vars(any_of(current_outs)), ~newnames)
        na_df<-na_df %>% `is.na<-`(newcols)%>%select(-ID, -group_ID)
        if(length(colnames(g_df))!= length(colnames(na_df)) ){
          diff_columns<-colnames(na_df)[which(!(colnames(na_df) %in%  colnames(g_df) ))]
          g_df[,diff_columns]<-NA
        }
        out_df<-rbind(na_df, g_df )%>%relocate(c(invalid, func), .after = last_col())%>%rowid_to_column("ID")
      }
      else{
        out_df<-g_df%>%relocate(c(invalid, func), .after = last_col())%>%rowid_to_column("ID")
      }
  
       paircols<-paste(current_outs, sort(rep(seq(1,ma), length(current_outs))))
       out_df<-Order_outCols(g_df, paircols)%>%relocate(c(invalid, func), .after = last_col())%>%rowid_to_column("ID")

    }else{
      out_df<-out_df%>%select(-group_ID)
    }
  }

  return(out_df)
}
