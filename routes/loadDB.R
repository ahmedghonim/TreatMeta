db_path <- if (file.exists("routes/API.sqlite")) {
  "routes/API.sqlite"
} else if (file.exists("./API.sqlite")) {
  "./API.sqlite"
} else if (file.exists("../routes/API.sqlite")) {
  "../routes/API.sqlite"
} else {
  "API.sqlite"
}

mydb <- dbConnect(RSQLite::SQLite(), db_path)

available <- dbReadTable(mydb, "possibleVars")
mandatory <- dbReadTable(mydb, "mandatoryVars")
output_df <- dbReadTable(mydb, "outputVars")
df_names <- dbReadTable(mydb, "VariableDef")
Labs <- dbReadTable(mydb, "Labs")
categories <- dbReadTable(mydb, "Categories")

dbDisconnect(mydb)
