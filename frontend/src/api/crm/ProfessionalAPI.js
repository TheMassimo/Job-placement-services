import {generateUrl} from "../utils/urlBuilder.js"
import {Contact} from "./entities/Contact.ts"
import {Customer} from "./entities/Customer.ts"
import {Professional} from "./entities/Professional.ts"
import {Address} from "./entities/Address.ts"
import {Email} from "./entities/Email.ts"
import {Telephone} from "./entities/Telephone.ts"
import {Skill} from "./entities/Skill.ts"


const URL_PROFESSIONALS = 'http://localhost:8080/service_crm/API/professionals'

async function AddProfessional(professional, xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_PROFESSIONALS}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
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

async function UpdateProfessional(professional, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_PROFESSIONALS}/${professional.professionalId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(professional)
        })

    const obj = await response.json()

    if (response.ok) {
        return Professional.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function DeleteProfessional(professionalId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_PROFESSIONALS}/${professionalId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}

async function AddSkillToProfessional(professionalId, skill, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_PROFESSIONALS}/${professionalId}/skill`, null, null), {
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

async function UpdateSkillOfProfessional(professionalId, skillId, skill, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_PROFESSIONALS}/${professionalId}/skill/${skillId}`, null, null), {
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

async function DeleteSkillOfProfessioanl(professionalId, skillId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_PROFESSIONALS}/${professionalId}/skill/${skillId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    if (!response.ok) {
        throw "Error"
    }
}


const ProfessionalAPI = {
    AddProfessional,
    UpdateProfessional,
    DeleteProfessional,
    AddSkillToProfessional,
    UpdateSkillOfProfessional,
    DeleteSkillOfProfessioanl,
}

export default ProfessionalAPI
