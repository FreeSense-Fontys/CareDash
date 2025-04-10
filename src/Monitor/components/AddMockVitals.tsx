// Adds mock vitals to each patient of Frank. Works with AddMockPatients since the password remains the same.
// Doesn't work for Henry because the password for his first patient isn't known

import exh from "../../Auth";
import { Patient, rqlBuilder } from "@extrahorizon/javascript-sdk"
import defaultGenerator from "./mock_tools/generate_mock_data"
import Cookies from "js-cookie"
import credentials from "../../Auth/const";

async function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so we add 1
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zero
    return `${year}-${month}-${day}`;
}

const AddMockVitals = {
    AddMockVitals: async () => {
        const currentdate = await getCurrentDate();
        const patients = await exh.data.documents.findAll<Patient>("patient")

        for (const patient of patients) {
          console.log(patient.data)
          const wearableID = patient.data.coupledWearables[0].wearableId
          const vitals = await exh.tasks.api.get("get-observations-by-day", "?wearableId=" + wearableID + "&date=" + currentdate, {})
          const vitalsData = vitals?.vitals[0]?.series.length;

          // Add vital data if there is no data added yet
          if (vitalsData === undefined || vitalsData === 0 ){
            const email = patient.data.email;  
            const password = email === "wearable1@freesense-solutions.com" ? "Wearable1" : "Secret1234"
  
            // log in to patient
            await exh.auth.authenticate({
              username: email,
              password: password,
            })
  
            const carepaths: Map<string, number> = new Map([
                ["Heart Failure", 1],
                ["COPD", 5]
            ]);
            await defaultGenerator(currentdate, carepaths);
          } else{
            console.log("Already added!")
          }
        }

        // Revert to the current user
        const refreshtoken  = Cookies.get(credentials.REFRESH_TOKEN)
        if (refreshtoken){
          await exh.auth.authenticate({
            refreshToken: refreshtoken,
          })
        }
    }
}

export default AddMockVitals