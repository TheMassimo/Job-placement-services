import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
//import {Address} from "./entities/Address.ts"
//import {Email} from "./entities/Email.ts"
//import {Telephone} from "./entities/Telephone.ts"


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
        URL_CONTACTS, {
            method: 'GET',
            credentials: 'include'
        })
    console.log("MAssimomsmsom-->",response);
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Contact.fromJsonObject(e))
        //return obj.map((e) => ({ Prova: "aaa", Test: "bbb" }))
    } else {
        throw obj
    }
}

const ContactAPI = {
    GetContacts,
    TEST
}

export default ContactAPI
