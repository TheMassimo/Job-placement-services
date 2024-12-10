import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {Customer} from "./entities/Customer.ts"
import {Professional} from "./entities/Professional.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"


const URL_CONTACTS = 'http://localhost:8082/API/professionals'

async function AddProfessional(professional){
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'/*, 'X-XSRF-TOKEN': xsrfToken*/},
            body: JSON.stringify(professional)
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return Professional.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const ProfessionalAPI = {
    AddProfessional,
}

export default ProfessionalAPI
