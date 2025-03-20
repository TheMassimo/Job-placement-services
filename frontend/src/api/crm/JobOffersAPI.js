import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {CustomerDetails} from "./entities/CustomerDetails.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"
import {JobOffer} from "./entities/JobOffer.ts"
import {JobOfferHistory} from "./entities/JobOfferHistory.ts"
import {Skill} from "./entities/Skill.ts"

const URL_JOBOFFERS = 'http://localhost:8080/service_crm/API/joboffers'

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

async function GetJobOfferById(jobOfferId){

    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetJobOffersContactId(jobOfferId){
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/contact_id`, null, null), {
            method: 'GET',
            credentials: 'include'
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function AddJobOffer(contactId, jobOffer, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${contactId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(jobOffer)
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateJobOffer(jobOfferId, jobOffer, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(jobOffer)
        })

    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteJobOffer(jobOfferId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function AddRequiredSkillToJobOffer(jobOfferId, skill, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/requiredSkills`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: skill
        })

    const obj = await response.json()

    if (response.ok) {
        return Skill.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateRequiredSkillToJobOffer(jobOfferId, skillId, skill, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/requiredSkills/${skillId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: skill
        })

    const obj = await response.json()

    if (response.ok) {
        return Skill.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteRequiredSkillToJobOffer(jobOfferId, skillId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/requiredSkills/${skillId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function UpdateStatusJobOffer(jobOfferId, status, candidates, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/status/${status}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(candidates)
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function GetJobOfferHistory(jobOfferId){
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/history`, null, null), {
            method: 'GET',
            credentials: 'include'
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => JobOfferHistory.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetJobOfferNewestHistory(jobOfferId){
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/history/newest`, null, null), {
            method: 'GET',
            credentials: 'include'
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return JobOfferHistory.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateJobOfferHistoryNote(jobOfferId, newNote, xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/history/note`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(newNote)
        }
    )

    const obj = await response.json()

    if (response.ok) {
        return JobOfferHistory.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const JobOffersAPI = {
    GetJobOffers,
    GetJobOfferById,
    GetJobOffersContactId,
    AddJobOffer,
    UpdateJobOffer,
    DeleteJobOffer,
    AddRequiredSkillToJobOffer,
    UpdateRequiredSkillToJobOffer,
    DeleteRequiredSkillToJobOffer,
    UpdateStatusJobOffer,
    GetJobOfferHistory,
    GetJobOfferNewestHistory,
    UpdateJobOfferHistoryNote,
}

export default JobOffersAPI
