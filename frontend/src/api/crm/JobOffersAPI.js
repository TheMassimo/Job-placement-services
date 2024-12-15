import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {CustomerDetails} from "./entities/CustomerDetails.ts"
import {ProfessionalDetails} from "./entities/ProfessionalDetails.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"
import {JobOffer} from "./entities/JobOffer.ts"
import {Skill} from "./entities/Skill.ts"

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

async function AddJobOffer(contactId, jobOffer) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${contactId}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'/*, 'X-XSRF-TOKEN': xsrfToken*/},
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

async function UpdateJobOffer(jobOfferId, jobOffer) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(jobOffer)
        })

    const obj = await response.json()

    if (response.ok) {
        return JobOffer.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteJobOffer(jobOfferId) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function AddRequiredSkillToJobOffer(jobOfferId, skill) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/requiredSkills`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: skill
        })

    const obj = await response.json()

    if (response.ok) {
        return Skill.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateRequiredSkillToJobOffer(jobOfferId, skillId, skill) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/requiredSkills/${skillId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: skill
        })

    const obj = await response.json()

    if (response.ok) {
        return Skill.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteRequiredSkillToJobOffer(jobOfferId, skillId) {
    const response = await fetch(
        generateUrl(`${URL_JOBOFFERS}/${jobOfferId}/requiredSkills/${skillId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
        })

    if (!response.ok) {
        throw "Error"
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
}

export default JobOffersAPI
