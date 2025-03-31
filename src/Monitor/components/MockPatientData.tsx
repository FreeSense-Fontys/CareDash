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
                BP: "128/80",
                SPO2: "80",
                ACT: "20"
            },
            {
                carepath: "Diabetes",
                HR: "120",
                SPO2: "80",
                RR: "15"
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
                SPO2: "98",
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
                BP: "109/65",
                SPO2: "97",
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
                BP: "120/70",
                ACT: "18",
            }
        ]
    }
]

export default mock_patient_data;