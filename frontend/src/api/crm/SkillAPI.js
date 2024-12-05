import {generateUrl} from "../utils/urlBuilder.js"
import {Skill} from "./entities/Skill.ts"

const URL_CONTACTS = 'http://localhost:8082/API/skills'

async function GetSkills() {
    const response = await fetch(
        URL_CONTACTS, {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => Skill.fromJsonObject(e))
    } else {
        throw obj
    }
}


const SkillAPI = {
    GetSkills
}

export default SkillAPI
