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
              "Median and IQR",
              "Median and Range",
              "Mean and SE",
              "Mean and CI"
            ]
        },  
        {
          "ID":"MeanSdPP",
          "Name": "Change from baseline",
          "category":1,
          "groups":1,
          "prepost":1,
          "colnames":[
              "Study_ID",
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
          "conversions": [
            "Mean and SD",
            "Median and IQR",
            "Median and Range",
            "Mean and SE",
            "Mean and CI",
            "Pre-post"
          ]
      },
       
        {
          "ID":"PPS",
          "Name": "Change from baseline (??)",
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
          "conversions": [
            "Mean and SD",
            "Pre-post"

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
            "conversions": [
              "Mean and SD",
              "Mean and SE",
              "Mean and CI",
              "Median and IQR",
              "Median and Range",
              "Combine rows with same ID??"
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
            "Name": "Patient data summary",
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