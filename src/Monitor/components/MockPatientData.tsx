const mock_patient_data = [
    {
        id: 1,
        name: "Eric Berry",
        online: true,
        checked: false,
        carepaths: [
            {
                carepath: "COPD",
                HR: "120",
                BP: "128 /80",
                SPO2: "80",
                RR: "",
                ACT: "20",
                T: ""
            },
            {
                carepath: "Diabetes",
                HR: "120",
                BP: "",
                SPO2: "80",
                RR: "15",
                ACT: "",
                T: ""
            }
        ]
    },
    {
        id: 2,
        name: "Emma Martin",
        online: true,
        checked: false,
        carepaths: [
            {
                carepath: "Diabetes",
                HR: "",
                BP: "",
                SPO2: "95",
                RR: "15",
                ACT: "20",
                T: "39,1"
            }
        ]
    },
    {
        id: 3,
        name: "Zoya Robertson",
        online: true,
        checked: true,
        carepaths: [
            {
                carepath: "Heart failure",
                HR: "92",
                BP: "",
                SPO2: "98",
                RR: "",
                ACT: "",
                T: ""
            }
        ]
    },
    {
        id: 4,
        name: "Lily-Rose Flynn",
        online: true,
        checked: true,
        carepaths: [
            {
                carepath: "Tia",
                HR: "110",
                BP: "109 /65",
                SPO2: "97",
                RR: "",
                ACT: "12",
                T: "37,7"            
            }
        ]
    },
    {
        id: 5,
        name: "Jim Benton",
        online: false,
        checked: true,
        carepaths: [
            {
                carepath: "Hypertension",
                HR: "98",
                BP: "120 /70",
                SPO2: "",
                RR:"",
                ACT: "18",
                T: ""
            }
        ]
    }
]

export default mock_patient_data;