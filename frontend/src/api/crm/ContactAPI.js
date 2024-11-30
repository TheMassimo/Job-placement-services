import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {CustomerDetails} from "./entities/CustomerDetails.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"


const URL_CONTACTS = 'http://localhost:8082/API/contacts'

async function GetContacts(filters, pagination) {
    const response = await fetch(
        generateUrl(URL_CONTACTS, filters, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        //return obj.map((e) => Contact.fromJsonObject(e))
        return obj.map((e) => ({ Prova: "aaa", Test: "bbb" }))
    } else {
        throw obj
    }
}

async function TEST(filters, pagination) {
    console.log("link -> ", URL_CONTACTS );
    const response = await fetch(
        generateUrl(URL_CONTACTS, filters, pagination),{
            method: 'GET',
            credentials: 'include'
        })
    console.log("MAssimomsmsom-->",response);
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => CustomerDetails.fromJsonObject(e))
        //return obj.map((e) => ({ Prova: "aaa", Test: "bbb" }))
    } else {
        throw obj
    }
}

async function GetConstactsAreCustomer(filters, pagination){
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/customers`, filters, pagination), {
            method: 'GET',
            credentials: 'include'
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => CustomerDetails.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function getConstactsAreProfessional(filters, pagination){
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/professionals`, filters, pagination), {
            method: 'GET',
            credentials: 'include'
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => ProfessionalDetails.fromJsonObject(e))
    } else {
        throw obj
    }
}

const ContactAPI = {
    GetContacts,
    TEST,
<<<<<<< HEAD
<<<<<<< HEAD
    GetConstactsAreCustomer,
    PostContactCustomer,
=======
    getConstactsAreCustomer,
    getConstactsAreProfessional
>>>>>>> origin/main
=======
    getConstactsAreCustomer,
    getConstactsAreProfessional
>>>>>>> origin/main
}

export default ContactAPI
