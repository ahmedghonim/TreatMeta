library(plumber)
library(tidyverse)
library(uxstats)
library(jsonlite)
library(DBI)
library(readxl)
library(openxlsx)
library(meta)
library(utilities)
options("plumber.port" = 8000)
#* @apiTitle MetaTransformR
#* @apiDescription This is a sample server for a Meta-analysis.
#* @apiTOS http://example.com/terms/
#* @apiContact list(name = "API Support", url = "http://www.example.com/support", email = "support@example.com")
#* @apiLicense list(name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0.html")
#* @apiVersion 1.0.1



#* Log information about the incoming request
#* @filter logger
function(req){
  cat(as.character(Sys.time()), "-",
      req$REQUEST_METHOD, req$PATH_INFO, "-",
      req$HTTP_USER_AGENT, "@", req$REMOTE_ADDR,  "\n")
  print(req$QUERY_STRING)
  plumber::forward()
}



#* Return available categories
#' @return JSON object of available categories and their IDs
#' @serializer json
#* @get /api/available_categories
function(){
  return(categories%>%select(ID, Name))
}


#* Return available lab conversions
#' @return JSON object of available lab conversions and their IDs
#' @serializer json
#* @get /api/labs
function(){
 return(Labs%>%select(ID, Conversion))
}


#* Return available Conversion presets
#' @return JSON object of a list with all conversion presets [Category, Groups, Prepost, Variables...]
#' @serializer json
#* @get /api/presets
function(){
  out_presets<- list()
  for( co in 1:ncol(presets)){
    cur<-presets[,co]
    cur<- cur[!is.na(cur)]
    out_presets<-append(out_presets, list(cur))
  }
  return(out_presets)
}

Rename_variables<-function(input_params, df_names, current_groups, current_prepost, category){
  inputs<-input_params
  #Ignore trailing numbers
  inputs<-unlist(lapply(str_split(inputs," "), FUN = function(x) x[[1]]))
  df_names<-df_names
  
  pp<-current_prepost
  n=as.numeric(current_groups)
  
  
  
  c=category

  conditional<-paste0("C",c,"_G",ifelse(n>2,3,n),"_P", pp)
  
  conditional_names<-df_names%>%filter(condition==conditional)
  default_names<-df_names%>%filter( condition=="D", !(internal %in% conditional_names$internal))
  

  final_names<-rbind(conditional_names, default_names) %>% arrange(ID)
  inds<-match(inputs,final_names$internal)
  output_names<-final_names$ui[inds]
  drf<-as.data.frame(output_names)%>%rowid_to_column("ID")
  param_list<-drf%>%group_by(output_names)%>%group_split()
  param_list<-lapply(param_list, function(x){
    if(nrow(x)>1)
    {
      return(x%>%rowid_to_column("d")%>%mutate(output_names=paste(output_names, d))%>%select(-d))
    }else{
      return(x)
    }
  })
  output_names<-do.call("rbind", param_list)%>%arrange(ID)
  output_names<-output_names$output_names
  return (rbind(inputs,output_names))
  
}
#' check eligible functions for given groups and prepost
#' @post /api/Rename_variables
#' @param var_names column names to be renamed
#' @param current_groups The number of current groups
#' @param current_prepost Whether there's prepost data
#' @param category the current category
#' @return JSON object containing old & new names
#' @serializer json list(na="string")
function(var_names, current_groups, current_prepost, category){
  
  inputs<-fromJSON(var_names)
  inputs<-unlist(lapply(str_split(inputs," "), FUN = function(x) x[[1]]))
  
  pp<-current_prepost
  n=as.numeric(current_groups)
  c=category
  Renamed_vars<-Rename_variables(inputs, df_names, n, pp, c)

  return (Renamed_vars[2,])
  
}


#' check eligible functions for given groups and prepost
#' @post /api/eligible_functions
#' @param category category of operations
#' @param current_groups The number of current groups
#' @param current_prepost Whether there's prepost data
#' @return JSON object containing Available Input parameters for all eligible functions
#' @serializer json list(na="string")
function(current_groups, current_prepost, category){
  pp<-fromJSON(current_prepost)
  n=fromJSON(current_groups)
  c<-fromJSON((category))

  conditional<-paste0("C",c,"_G",ifelse(n>2,3,n),"_P", pp)
  eligible_functions<-mandatory%>%filter(`condition`==conditional) %>% select(`ID`,`Function`)
  
  final_df<-available%>%filter(`condition`==conditional)
  inputs<-colnames(
    final_df%>%
      select(-ID, -Function, -condition) %>%
      select(which(colSums(.)>0))
  )
  types<-df_names$type[match(inputs,df_names$internal)]
  Renamed_vars<-Rename_variables(inputs, df_names, n, pp, c)
  
  
  return(
    list(Renamed_vars,
         eligible_functions$ID, types)
  )
  
}  

#' Check if user inputs satisfies mandatory functions' parameters
#' @post /api/Func_IDs
#' @param input_params JSON object of The IDs from eligible_functions
#' @param user_inputs JSON object of The dataframe containing user-chosen input variables
#' @param current_prepost JSON object of The dataframe containing user-chosen input variables
#' @param category JSON object of The dataframe containing user-chosen input variables
#' @serializer json list(na="string")
function(input_params, user_inputs, current_prepost, category){

  funcs<-fromJSON(input_params)
  outs<-fromJSON(user_inputs)

  available_funcs<-mandatory%>%filter(ID %in% funcs)%>%select(-Function, -condition, -category)
  available_funcs<- available_funcs %>%  rowwise() %>% 
    mutate(original=sum( c_across(2: ncol(available_funcs) ) ), current=0 )
  cols<- match(outs, colnames(available_funcs))
  
  for (i in 1:nrow(available_funcs)) {
    row<-available_funcs[i,]
    available_funcs$current[i]=sum(as.numeric(row[cols]) & rep(1, length(outs)))
    
  }
  
  
  final_iDs<-unlist(available_funcs %>% filter(original== current) %>% select(ID))
  
  return(list(mandatory$`Function`[final_iDs],final_iDs))
  
}  



#' Check available outputs of given function IDs given be Func_IDs
#' @post /api/Output_variables
#' @param funcIDs JSON object for IDs from Func_IDs
#' @return JSON object containing output variables
#' @serializer json list(na="string")
function(funcIDs){
  final_iDs<-fromJSON(funcIDs)
  output<- output_df
  
  out_iDs<-match(mandatory$`Function`[final_iDs],output$`Function`)
  
  
  return(
    list(
      colnames(
        output[out_iDs,]%>%
          select(-ID, -Function) %>%
          select(which(colSums(.)>0))
      )
    )
  )
  
}   






cors <- function(req, res) {
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
  
}

#' @plumber
function(pr) {
  

      
 
    
  pr %>% pr_hook("preroute",cors) %>% 
    pr_mount("/api/scripts", plumb("./routes/base_scripts.R")) 
}



#Filters




