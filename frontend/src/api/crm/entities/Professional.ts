import {Contact, ContactRawData} from "./Contact";
import {Skill} from "./Skill";
import {JobOffer} from "./JobOffer";

export enum ProfessionalEmployment {
    UNEMPLOYED,
    BUSY,
    EMPLOYED
}

interface ProfessionalRawData {
    professionalId: number | null
    employment: ProfessionalEmployment | null
    geographicalInfo: string
    dailyRate: number
    jobOffer: JobOffer[]
    jobOfferProposal: JobOffer[]
    notes: string
    skills: Skill[]
}

export class Professional implements ProfessionalRawData {
    professionalId: number | null
    employment: ProfessionalEmployment | null
    geographicalInfo: string
    dailyRate: number
    jobOffer: JobOffer[]
    jobOfferProposal: JobOffer[]
    notes: string
    skills: Skill[]

    constructor(
        professionalId: number | null,
        employment: ProfessionalEmployment | null,
        geographicalInfo: string | null,
        dailyRate: number | null,
        jobOffer: JobOffer[] | [],
        jobOfferProposal: JobOffer[] | [],
        notes: string | null,
        skills: Skill[] | [],
    ) {
        this.professionalId = professionalId
        this.employment = employment
        this.geographicalInfo = geographicalInfo
        this.dailyRate = dailyRate
        this.jobOffer = jobOffer
        this.jobOfferProposal = jobOfferProposal
        this.notes = notes
        this.skills = skills
    }

    static fromJsonObject(obj: ProfessionalRawData): Professional | null {
        try {
            return new Professional(
                obj.professionalId,
                obj.employment,
                obj.geographicalInfo,
                obj.dailyRate,
                obj.jobOffer,
                obj.jobOfferProposal,
                obj.notes,
                obj.skills
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
