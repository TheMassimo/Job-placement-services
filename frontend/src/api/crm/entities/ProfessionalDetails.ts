import {Email} from "./Email";
import {Telephone} from "./Telephone";
import {Address} from "./Address";
import {JobOffer} from "./JobOffer";
import {Skill} from "./Skill";

export enum Category {
    Customer,
    Professional,
    CustomerProfessional,
    Unknown,
}

export enum ProfessionalEmployment {
    UNEMPLOYED,
    BUSY,
    EMPLOYED
}

export interface ProfessionalDetailsRawData {
    contactId: number | null
    name: string
    surname: string
    category: Category | null
    email: Email[]
    address: Address[]
    ssn: string
    telephone: Telephone[]
    employment: ProfessionalEmployment
    dailyRate: number
    skills: Skill[]
    notes: string | null

}

export class ProfessionalDetails implements ProfessionalDetailsRawData {
    contactId: number | null
    name: string
    surname: string
    category: Category | null
    email: Email[]
    address: Address[]
    ssn: string
    telephone: Telephone[]
    employment: ProfessionalEmployment
    dailyRate: number
    skills: Skill[]
    notes: string | null

    constructor(
        contactId: number | null,
        name: string,
        surname: string,
        category: Category | null,
        email: Email[],
        address: Address[],
        ssn: string,
        telephone: Telephone[],
        employment: ProfessionalEmployment,
        dailyRate: number,
        skills: Skill[],
        notes: string | null
    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.category = category
        this.email = email
        this.address = address
        this.ssn = ssn
        this.telephone = telephone
        this.employment = employment
        this.dailyRate = dailyRate
        this.skills = skills
        this.notes = notes

    }

    static fromJsonObject(obj: ProfessionalDetailsRawData): ProfessionalDetailsRawData | null {
        try {
            return new ProfessionalDetails(
                obj.contactId,
                obj.name,
                obj.surname,
                obj.category,
                obj.email,
                obj.address,
                obj.ssn,
                obj.telephone,
                obj.employment,
                obj.dailyRate,
                obj.skills,
                obj.notes
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
