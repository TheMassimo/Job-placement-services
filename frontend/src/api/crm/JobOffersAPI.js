import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {CustomerDetails} from "./entities/CustomerDetails.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"

import {JobOffer} from "./entities/JobOffer.ts"


const URL_JOBOFFERS = 'http://localhost:8082/API/joboffers'

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
    GetJobOffers,
}

export default JobOffersAPI
