import {Skill} from "./Skill";

export enum JobOfferStatus {
    CREATED,
    ABORTED,
    SELECTION_PHASE,
    CANDIDATE_PROPOSAL,
    CONSOLIDATED,
    DONE
}

interface JobOfferRawData {
    jobOfferId: number | null
    description: string
    status: JobOfferStatus | null
    requiredSkills: Skill[]
    duration: number
    offerValue: number | null
    notes: string | null
}

export class JobOffer implements JobOfferRawData {
    jobOfferId: number | null
    description: string
    status: JobOfferStatus | null
    requiredSkills: Skill[]
    duration: number
    offerValue: number | null
    notes: string | null

    constructor(
        jobOfferId: number | null,
        description: string,
        status: JobOfferStatus | null,
        requiredSkills: Skill[],
        duration: number,
        offerValue: number | null,
        notes: string | null,
    ) {
        this.jobOfferId = jobOfferId
        this.description = description
        this.status = status
        this.requiredSkills = requiredSkills
        this.duration = duration
        this.offerValue = offerValue
        this.notes = notes
    }

    static fromJsonObject(obj: JobOfferRawData): JobOffer | null {
        try {
            return new JobOffer(
                obj.jobOfferId,
                obj.description,
                obj.status,
                obj.requiredSkills,
                obj.duration,
                obj.offerValue,
                obj.notes,
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
