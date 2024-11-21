export const tabs = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "ConvertLab",
    href: "/start/default",
  },
  {
    name: "Presets",
    href: "/presets",
  },
  {
    name: "Guide",
    href: "/content/meansd",
  },
  {
    name: "Cite us",
    href: "/cite-us",
  },
  {
    name: "Contact us",
    href: "/contact-us",
  },
];

export const presets =[
        {
            "ID":"MeanSdOps",
            "Name": "Mean and SD Conversions",
            "category":1,
            "groups":10,
            "prepost":0,
            "colnames":[
                "Study_ID",
                "group_ID",
                "Mean",
                "SD",
                "N",
                "SE",
                "llci",
                "ulci",
                "Median",
                "q1",
                "q3",
                "min",
                "max"

            ],
            "conversions": [
              "Mean and SE",
              "Mean and CI",
              "Median and IQR",
              "Median and Range"
              
            ]
        },  
        {
          "ID":"B2G",
          "Name": "In-between Group Difference",
          "category":1,
          "groups":2,
          "prepost":0,
          "colnames":[
              "Study_ID",
              "group_ID",
              "Mean",
              "SD",
              "N1",
              "N2",
              "SE",
              "llci",
              "ulci",
              "pval"

          ],
          "conversions": [
            "Mean and SE",
            "Mean and CI",
            "Mean and P-value"
          ]
      }, 
        {
          "ID":"MeanSdPP",
          "Name": "Change from baseline<span class='text-lg text-gray-400'> (All formats)</span>",
          "category":1,
          "groups":1,
          "prepost":1,
          "colnames":[
              "Study_ID",
              "group_ID",
              "change_group",
              "Mean",
              "SD",
              "N",
              "SE",
              "llci",
              "ulci",
              "Median",
              "q1",
              "q3",
              "min",
              "max",
              "changeSDin",
              "ccoef"

          ],
          sub:"Pre-Post",
          "conversions": [
            "Mean and SD",
            "Mean and SE",
            "Mean and CI",
            "Median and IQR",
            "Median and Range"
            
          ]
      },
       
        {
          "ID":"PPS",
          "Name": "Change from baseline",
          "category":1,
          "groups":1,
          "prepost":1,
          "colnames":[
              "Study_ID",
              "change_group",
              "Mean",
              "SD",
              "changeSDin",
              "ccoef"

          ],
          sub:"Pre-Post",
          "conversions": [
            "Mean and SD"
          ]
      },
      
        {
            "ID":"TeSe",
            "Name": "Effect size estimation",
            "category":2,
            "groups":1,
            "prepost":0,
            "colnames":[
                "Study_ID",
                "N_events",
                "N",
                "Mean",
                "SD"
            ],
            "conversions": [
              "Event and Total",
              "Mean, SD, and Total"
            ]
        },
        {
            "ID":"CombineMeans",
            "Name": "Multiple groups combination",
            "category":3,
            "groups":2,
            "prepost":0,
            "colnames":[
               "Study_ID",
                "Mean",
                "SD",
                "N",
                "SE",
                "Median",
                "q1",
                "q3",
                "min",
                "max", 
                "llci",
                "ulci"
            ],
            sub:"Combine rows with common ID",
            "conversions": [
              "Mean and SD",
              "Mean and SE",
              "Mean and CI",
              "Median and IQR",
              "Median and Range"
              
            ]
        },
        {
            "ID":"Labs",
            "Name": "Lab unit conversions",
            "category":5,
            "groups":1,
            "prepost":0,
            "colnames":[
                "lab_apply",
                "labs"
            ],
            "conversions": [
              "Value to be converted [From (unit) to (unit)]"
            ]
        },
        {
            "ID":"IPD",
            "Name": "Data summary",
            "category":4,
            "groups":1,
            "prepost":0,
            "colnames":[
                "patient_data"
            ],
            "conversions": [
               "Calculate mean and SD from individual subject data"
            ]
        }
    ]