import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {ContactDetails} from "./entities/ContactDetails.ts"
import {CustomerDetails} from "./entities/CustomerDetails.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"


const URL_CONTACTS = 'http://localhost:8080/service_crm/API/contacts'

async function GetContacts(filters, pagination) {
    const response = await fetch(
        generateUrl(URL_CONTACTS, filters, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    //console.log(filters)
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => ContactDetails.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetContactById(contactId) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return ContactDetails.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetContactByProfessionalId(professionalId) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/professional/${professionalId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return ContactDetails.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function AddContact(contact, xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(contact)
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateContact(contact, xsrfToken) {
    console.log("previu",JSON.stringify(contact) );
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contact.contactId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(contact)
        })

    const obj = await response.json()

    if (response.ok) {
        return Contact.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteContact(contactId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if(response.status !== 204){
        const obj = await response.json()

        if (response.ok) {
            return "Contact successfully deleted"
        } else {
            throw obj
        }
    }
}

async function AddTelephoneToContact(contactId, telephone, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/telephone`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: telephone
        })

    const obj = await response.json()

    if (response.ok) {
        return Telephone.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function AddEmailToContact(contactId, email, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/email`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: email
        })

    const obj = await response.json()

    if (response.ok) {
        return Email.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function AddAddressToContact(contactId, address, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/address`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: address
        })

    const obj = await response.json()

    if (response.ok) {
        return Address.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateTelephoneOfContact(contactId, telephoneId, telephone, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/telephone/${telephoneId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: telephone
        })

    const obj = await response.json()

    if (response.ok) {
        return Telephone.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateEmailOfContact(contactId, emailId, email, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/email/${emailId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: email
        })

    const obj = await response.json()

    if (response.ok) {
        return Email.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateAddressOfContact(contactId, addressId, address, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/address/${addressId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: address
        })

    const obj = await response.json()

    if (response.ok) {
        return Address.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteTelephoneOfContact(contactId, telephoneId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/telephone/${telephoneId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function DeleteEmailOfContact(contactId, emailId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/email/${emailId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function DeleteAddressOfContact(contactId, addressId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}/${contactId}/address/${addressId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}



const ContactAPI = {
    GetContacts,
    GetContactById,
    GetContactByProfessionalId,
    AddContact,
    UpdateContact,
    DeleteContact,
    AddTelephoneToContact,
    AddEmailToContact,
    AddAddressToContact,
    UpdateTelephoneOfContact,
    UpdateEmailOfContact,
    UpdateAddressOfContact,
    DeleteTelephoneOfContact,
    DeleteEmailOfContact,
    DeleteAddressOfContact,
}

export default ContactAPI


/*
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
*/