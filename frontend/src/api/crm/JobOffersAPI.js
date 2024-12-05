import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {CustomerDetails} from "./entities/CustomerDetails.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"

import {JobOffer} from "./entities/JobOffer.ts"


const URL_JOBOFFERS = 'http://localhost:8082/API/joboffers'


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

async function GetJobOffers(filters, pagination){
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}`, filters, pagination), {
            method: 'GET',
            credentials: 'include'
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => JobOffer.fromJsonObject(e))
    } else {
        throw obj
    }
}


const JobOffersAPI = {
    TEST,
    GetJobOffers

}

export default JobOffersAPI
