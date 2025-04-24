// Adds a patient to the current user (To do this use fstud email). Change the first and last name, and the caregroup id and run this
const firstname = "Hanna"
const lastname = "Rinus"

// This is Frank. It is from:
// const patients = await exh.data.documents.findAll<Patient>("patient")
// const caregroupid = patients[0].groupIds[0]
const caregroupid = "67e6ccb78bd54ed3040d3f71"; // Caregroup ID (schema: caregroup.id)

import { rqlBuilder } from "@extrahorizon/javascript-sdk";
import exh from "../../Auth"

async function AddUser(firstName, lastName, email){
    await exh.users.createAccount({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: "Secret1234",
        phoneNumber: "027682374297",
        language: "NL",
    });
}

async function GetWearableRole() {
    const roles = await exh.users.globalRoles.find()
    console.log(roles)
    return roles.data.find(role => role.name === "Wearable")
}

async function AddRole(email){    
    const rql = rqlBuilder().eq('email', email).build();
    const wearable = await GetWearableRole()
    console.log(wearable.id)
    await exh.users.globalRoles.addToUsers(rql, {
      roles: [wearable.id],
    });
}

async function getUser(email) {
    const rql = rqlBuilder().eq('email', email).build();
    return await exh.users.find({
        rql,
    });
}

async function AddPatient(name, email, wid) {
    console.log("Creating patient connection")
    const document = await exh.data.documents.create("patient", {
        coupledWearables: [{
            wearableId: wid,
            productName: "CareBuddy",
            status: "active",
            enrolledGroups: [caregroupid]
        }],
        name: name,
        email: email,
        phoneNumber: '',
        gender: 'M',
        birthDate: '20-05-1990',
        language: 'NL',
    });
    await exh.data.documents.linkGroups("patient", document.id, {
        groupIds: [caregroupid]
    })
    console.log(document);
}

const AddMockPatients = {
    AddMockPatient: async () => { 
        const currentUser = await exh.users.me()
        if (currentUser.email !== "fstud@freesense-solutions.com") {
            console.log("You need to be logged in as fstud to add mock patients!")
            return;
        }
        
        console.log(currentUser)    
        const email = firstname.toLowerCase() + lastname.toLowerCase() + "@example.com"
        const name = firstname + " " + lastname

        await AddUser(firstname, lastname, email)
        await AddRole(email)
        const user = await getUser(email)
        console.log(user)
        await AddPatient(name, email, user.data[0].id)
    }
}

export default AddMockPatients
