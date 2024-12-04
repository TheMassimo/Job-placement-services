import {JobOffer} from "./JobOffer";

interface CustomerRawData {
    customerId: number | null
    jobOffers: JobOffer[] | null
    replacementHistory: JobOffer[] | null
    notes: string[] | null
}

export class Customer implements CustomerRawData {
    customerId: number | null
    jobOffers: JobOffer[] | null
    replacementHistory: JobOffer[] | null
    notes: string[] | null

    constructor(customerId: number | null, jobOffers: JobOffer[] | null, replacementHistory: JobOffer[]| null, notes: string[] | null) {
        this.customerId = customerId
        this.jobOffers = jobOffers
        this.replacementHistory = replacementHistory
        this.notes = notes
    }

    static fromJsonObject(obj: CustomerRawData): Customer | null {
        try {
            return new Customer(obj.customerId, obj.jobOffers, obj.replacementHistory, obj.notes)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
