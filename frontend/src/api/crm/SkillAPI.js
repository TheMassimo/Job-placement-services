import {generateUrl} from "../utils/urlBuilder.js"
import {Skill} from "./entities/Skill.ts"

const URL_CONTACTS = 'http://localhost:8080/service_crm/API/skills'

async function GetSkills(xsrfToken) {
    const response = await fetch(
        URL_CONTACTS, {
            method: 'GET',
            credentials: 'include',
            headers: {'X-XSRF-TOKEN': xsrfToken}
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Skill.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function AddSkill(skill, xsrfToken){
    const response = await fetch(
        generateUrl(`${URL_CONTACTS}`, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(skill)
        }
    )
    const obj = await response.json()

    if (response.ok) {
        return Skill.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const SkillAPI = {
    GetSkills,
    AddSkill
}

export default SkillAPI
