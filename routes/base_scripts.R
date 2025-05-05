

source("./loadDB.R")
Ci_N_to_SD<-function(df){
  
  ci<-0.95
  if("CI%" %in% colnames(df)){
    ci<-ifelse(is.na(df$`CI_percent`),0.95,df$`CI%`[1])
  }
  out<-df%>%
    mutate(SD=sqrt(N) * (ulci-llci) / ifelse(N>=100, 3.92, 2*tinv(1-ci,N-1) ) )
  
  return(out)
}

SE_N_to_SD<-function(df){
  out<-df%>%
    mutate(SD=SE*sqrt(N))
  
  return(out)
}

MedianIQ_to_MeanSD<-function(df){
  out<-df%>%
    mutate(Mean= ifelse(!is.na(Mean), Mean, (0.7+0.39/N)*0.5*(q1+q3)+(0.3-0.39/N)*Median))%>%
    mutate(SD=ifelse(!is.na(SD), SD, (q3-q1)/(2*qnorm((0.75*N-0.125)/(N+0.25),0,1))))
  
  return(out)
}

MedianRng_to_MeanSD<-function(df){
  out<-df%>%
    mutate(Mean=ifelse(!is.na(Mean), Mean, 2/(4+N^0.75)*(min+max) + N^0.75/(4+N^0.75)*Median) )%>%
    mutate(SD= ifelse(!is.na(SD), SD,(max-min)/(2*qnorm((N-0.375)/(N+0.25),0,1))) )
  
  return(out)
}


Pval_2N_to_SD<-function(df){
  out<-df%>%
    mutate(SD= (Mean/uxstats::tinv(pval,N1+N2-2))/sqrt(1/N1+1/N2))
  
  return(out)
}

Ci_2N_to_SD<-function(df){
  ci<-0.95
  if("CI_percent" %in% colnames(df)){
    ci<-ifelse(is.na(df$`CI%`),0.95,df$`CI%`[1])
  }
  out<-df%>%
    mutate(SD=((ulci-llci)/ifelse(N1+N2>=100,3.92,uxstats::tinv(1-ci,N1+N2-2)*2))/sqrt(1/N1+1/N2))
  
  return(out)
}

SE_2N_to_SD<-function(df){
  out<-df%>%
    mutate(SD=SE/sqrt(1/N1+1/N2))
  
  return(out)
}

split_df_prepost<-function(df){
  #change_group=0 ->Pre, change_group=1 ->Post 
  #invalidate anything that has more than 2 rows or has invalid prepost groups
  
  ready_df<-data.frame()
  if(nrow(df)==2 && sum(df$change_group) == 1){

    df<-calc_CCoef(df)
    pre_group<-df%>% filter(change_group==0) %>% rename(preMean=Mean, preSD=SD)
    
    post_group<-df%>% filter(change_group==1) %>% rename(postMean=Mean, postSD=SD) %>%
      mutate(changeSD = ifelse(!is.na(changeSDin), changeSDin, changeSD))
    
    ready_df<-cbind(pre_group,postMean=post_group$postMean, postSD=post_group$postSD)%>%mutate(invalid=0, func="PrePost_to_MeanSD")
    
    
  }
  else{

    ready_df<-df%>%rename(preMean=Mean, preSD=SD)%>%
      mutate(postMean=NA, postSD=NA, ccoef=NA, invalid=1)
  }


  ready_df<-ready_df%>%select(any_of(c("ID", "Study_ID","group_ID" ,"change_group","changeSD" ,"preMean","preSD", "postMean", "postSD","N", "ccoef", "invalid", "func")))
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
      browser()
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

  
  return (

     df
      
  )
}

calc_CCoef<-function(df){
  cc_def<-0.5
  ccoef<-data.frame()
  change_sd<-data.frame()
  if("ccoef" %in% colnames(df))
  { 
    ccoef<-df%>%filter(!is.na(`ccoef`))
  }
  else if("changeSDin" %in% colnames(df))
  {  
    change_sd<-df%>%filter(!is.na(changeSD),!is.na(preSD),!is.na(postSD))
  }
  if(nrow(ccoef)){
    cc_def<-mean(ccoef$ccoef)
  }
  else if(nrow(change_sd)){
    change_sd<-change_sd%>%mutate(CC=(preSD^2+postSD^2-changeSD^2)/(2*preSD*postSD))
    cc_def<-mean(change_sd$change_sd)
  }
  
  return(df%>%mutate(ccoef=cc_def))
}


PrePost_to_MeanSD<-function(df){

  #change into pre, post Means and SDs
  prepared_df<-prepare_prepost(df)

  invalid<-prepared_df%>%filter(invalid==1)%>%mutate(changeMean=preMean,
                                                     changeSD=preSD)
  out<-prepared_df%>%filter(invalid==0)%>%mutate(changeMean=postMean-preMean,
                            changeSD=ifelse(!is.na(changeSD),changeSD,sqrt(preSD^2+postSD^2 - 2*preSD*postSD*ccoef )))
  
   out<-rbind(invalid, out)%>%arrange(ID)
  

  return(out)
  
}

calculate_prop<-function(df){
#Rename N_total -> N_Events
  m.prop.r<-metaprop(N_events,N,studlab = Study_ID ,df, sm = "PRAW",method.incr = "only0")
  m.prop<-metaprop(N_events,N,studlab = Study_ID ,df, sm = "PLN", method.incr = "only0")
  df$TE=m.prop.r$TE
  df$seTE=m.prop.r$seTE
  df$logTE=m.prop$TE
  df$logSeTE=m.prop$seTE
  return  (df)
  
  
}

calculate_sm<-function(df){
  m.mean<-metamean(N,Mean,SD,studlab = Study_ID ,df, sm="MLN")
  m.mean.r<-metamean(N,Mean,SD,studlab = Study_ID ,df)
  df$TE=m.mean.r$TE
  df$seTE=m.mean.r$seTE
  df$logTE=m.mean$TE
  df$logSeTE=m.mean$seTE
  return  (df)
  
  
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
  #arrange studies with groups
  
  #Raise an error if unequal number of studies
  assertthat::are_equal(nrow(group1),
                        nrow(group2))
  
  return(
    cbind(group1, group2)
  )
}

calculate_bin<-function(df){
  df<-prepare_groups(df,0)
  m.bin<-metabin(N1, total1,
                 N2, total2,
                 df, incr = "TACC",studlab = Study_ID)
  df$TE=m.bin$TE
  df$seTE=m.bin$seTE
  df<-df%>%select(ID, Study_ID, TE, seTE,invalid, func)
  return(df)
  
}

calculate_cont<-function(df){
  df<-prepare_groups(df,1)
  m.cont<-metacont(N1,Mean1,SD1,
                   N2,Mean2,SD2,
                   studlab = Study_ID  ,df)
  df$TE=m.cont$TE
  df$seTE=m.cont$seTE
  df<-df%>%select(ID, Study_ID, TE, seTE,invalid, func)
  return(df)  
  
}


combine_MeanSD<-function(df){


  
  df<-df%>%group_by(Study_ID)
  study_id<-df%>%group_by(Study_ID)%>%group_keys()
  IDs<-do.call("rbind",df%>%group_map(~head(.x,1L)))%>%select(ID)
  df<-df%>%group_split()
  df<-lapply(df, function(x) tail(sample.decomp(n=x$N,sample.mean = x$Mean,sample.sd = x$SD, include.sd = TRUE), 1)%>%select(!sample.var))
  df<-cbind(IDs, study_id, do.call("rbind",df)) %>% rename(N=n, Mean=sample.mean, SD=sample.sd) %>%
                                                                        mutate(invalid=0, func="combine_MeanSD")%>%relocate(N, .after= SD)
  rownames(df)<-NULL
  return(df)
}




Validate_requirements<-function(funcIDs, df, mandatory, pp){
  #Check whether each entry satisfies the mandatory inputs
  #assign the proper function ID to valid entries
  
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
  output_df<-cbind(ID=c(1),df%>%summarise(Mean=mean(patient_data),
                            SD=sd(patient_data)),N=nrow(df))
  return(output_df)
}
unit_convert<-function(x,unit){
  if(!is.na(as.numeric(unit))){
    return(x*unit)
  }
  else{
  return(
    x
  )}
}
apply_labs<-function(df){
  exceptionCols<-c(char_cols,"group_ID","N")
  removedCols<-df%>%select(any_of(exceptionCols))
  df<-df%>%mutate(labs=ifelse(!is.na(labs), Labs$ratio[labs], labs))
  
  df<-df%>%select(!any_of(exceptionCols))%>%rowwise()%>%
    mutate(across(everything(),~ unit_convert(.,labs)))%>%select(-labs)
  df<-cbind(removedCols,df)
  return(
    df
    )
}
Remove_NA<-function(df){
  Na_indices<-c()
  for (row in 1: nrow(df)){
    if (sum(is.na(df[row, ]))+ sum(which(df[row,]== "NA")) == ncol(df)){
      Na_indices<-c(Na_indices, row)
    }
  }
  if(length(Na_indices)){
    cn<-colnames(df)
    df<-as.data.frame(df[-Na_indices,])
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


char_cols<-df_names%>%filter(type=="text")
char_cols<-char_cols$internal

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
  #make sure output columns exist in data // pre-processing step
  df<-fromJSON(df)

  #find a better way to exclude string variables
  if(sum(char_cols %in% colnames(df))>0){
    
    
  df<-cbind(df%>%select(all_of(char_cols)),
            df%>%select(!any_of(char_cols))%>%mutate_all(as.numeric)%>%rowwise())
  }
  else{
    df<-df%>%mutate_all(as.numeric)
  }

  if("labs" %in% colnames(df)){
   df<-apply_labs(df)
  }
  #Remove empty rows
  df<-Remove_NA(df)

  
  mandatory_inputs<-mandatory
  funcIDs<-as.vector(fromJSON(funcIDs))
  current_outs<-as.vector(fromJSON(current_outputs))
  output_placeholder_indices<-match(current_outs,colnames(df))
  current_prepost<-fromJSON(current_prepost)
  c<-fromJSON(category)
  
  #Remove prepost from func_ID as it's determined by variables as a post-processor in the final step of category 1
  prepost_indicies<-which(mandatory$Function=="PrePost_to_MeanSD")
  funcIDs<-funcIDs[!funcIDs %in% prepost_indicies]

  old_colnames<-colnames(df)
  #prepare columns for output variables if they aren't in the user input df
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
  validated_df<-Validate_requirements(funcIDs, df, mandatory_inputs, current_prepost)%>%rowid_to_column("ID")

  valid_rows<-validated_df%>%filter(invalid==0)
  ready_rows<-validated_df%>%filter_at(vars(current_outs), all_vars(!is.na(.))) %>% filter(!(ID %in% valid_rows$ID))%>%mutate(invalid=0)
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
    grouped_rows<-valid_rows%>%group_by(func)%>%group_split()
    grouped_rows<-lapply(grouped_rows, function(df) do.call(df$func[1], list(df)))
    valid_rows<-do.call("rbind", grouped_rows)%>%select(any_of(c("ID", "Study_ID", "TE", "seTE","logTE", "logSeTE","invalid", "func")))
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
  
    valid_rows<-IPD_MeanSD(valid_rows)%>%mutate(invalid=0, func="IPD_MeanSD")
    ready_rows<-ready_rows%>%select(ID,Mean, SD, N, invalid, func)
    invalid_rows<-invalid_rows%>%select(ID, Mean, SD, N,invalid, func)
  }
  else if(c==5){
    valid_rows<-valid_rows%>%mutate(lab_output=lab_apply)%>%select(ID,lab_output,invalid, func)
    ready_rows<-ready_rows%>%mutate(lab_output=lab_apply)%>%select(ID,lab_output,invalid, func)
    invalid_rows<-invalid_rows%>%mutate(lab_output=lab_apply)%>%select(ID,lab_output,invalid, func)
  }
  out_df<-rbind(ready_rows,valid_rows, invalid_rows)%>%arrange(ID)
  
  if(current_prepost && all(c("Mean", "SD", "change_group") %in% colnames(out_df)) ){
    current_outs<-c("changeMean", "changeSD", "N")

    valid_prepost<-out_df%>%filter(!is.na(change_group),!is.na(Mean), !is.na(SD), !is.na(Study_ID))
    invalid_prepost<-out_df%>%filter(!(ID %in% valid_prepost$ID))%>%
      mutate(changeMean=Mean, changeSD=ifelse(!is.na(changeSDin),changeSDin,SD))
    valid_prepost<-PrePost_to_MeanSD(valid_prepost)
    Prepost_output_vars<-c("ID", "Study_ID","group_ID", "changeMean", "changeSD","N","invalid", "func" )

    out_df<-rbind(valid_prepost%>%select(any_of(Prepost_output_vars))
                  ,invalid_prepost%>%select(any_of(Prepost_output_vars))
                  )%>%arrange(ID)%>%select(-ID)%>%rowid_to_column("ID")
    
  }

  if("group_ID" %in% colnames(out_df) && category == 1){

   
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
      g_df<-g_df%>%pivot_wider(names_from = group_ID, values_from = current_outs, names_glue = "{.value} {group_ID}", names_sort = TRUE, names_repair = "unique")
      if(!is.null(na_df) && nrow(na_df) > 0){
        
        na_df<-na_df%>%rename_at(vars(current_outs), ~newnames)
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
      # 
       out_df<-Order_outCols(g_df, paircols)%>%relocate(c(invalid, func), .after = last_col())%>%rowid_to_column("ID")

    }else{
      out_df<-out_df%>%select(-group_ID)
    }
  

  }

  return(out_df)
  
}



