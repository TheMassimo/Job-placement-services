import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {Customer} from "./entities/Customer.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"


const URL_CUSTOMER = 'http://localhost:8082/API/customers'

async function AddCustomer(customer){
    const response = await fetch(
        generateUrl(`${URL_CUSTOMER}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'/*, 'X-XSRF-TOKEN': xsrfToken*/},
            body: JSON.stringify(customer)
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return Customer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateNotes(customerId, note) {
    const response = await fetch(
        generateUrl(`${URL_CUSTOMER}/note/${customerId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}, //'X-XSRF-TOKEN': xsrfToken
            body: note //JSON.stringify(note)
        })

    const obj = await response.json()

    if (response.ok) {
        return Customer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteCustomer(customerId) {
    const response = await fetch(
        generateUrl(`${URL_CUSTOMER}/${customerId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })

    if (!response.ok) {
        throw "Error"
    }
}



const CustomerAPI = {
    AddCustomer,
    UpdateNotes,
    DeleteCustomer,
}

export default CustomerAPI
