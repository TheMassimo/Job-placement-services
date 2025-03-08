import {JobOfferStatus} from "./JobOffer";
import {Application, ApplicationRawData} from "./Application";

interface JobOfferHistoryRawData {
    jobOfferHistoryId: number
    jobOfferStatus: JobOfferStatus
    date: string | null
    candidates: ApplicationRawData[]
    note: string | null
}

export class JobOfferHistory implements JobOfferHistoryRawData {
    jobOfferHistoryId: number
    jobOfferStatus: JobOfferStatus
    date: string | null
    candidates: Application[]
    note: string | null

    constructor(
        jobOfferHistoryId: number,
        jobOfferStatus: JobOfferStatus,
        date: string | null,
        candidates: Application[],
        note: string | null
    ) {
        this.jobOfferHistoryId = jobOfferHistoryId
        this.jobOfferStatus = jobOfferStatus
        this.date = date
        this.candidates = candidates
        this.note = note
    }

    static fromJsonObject(obj: JobOfferHistoryRawData): JobOfferHistory | null {
        try {
            // Corretto: rimuoviamo `.values()` e gestiamo `null`
            const candidates: Application[] = obj.candidates
                .map((e: ApplicationRawData) => Application.fromJsonObject(e))
                .filter((e): e is Application => e !== null) // Filtriamo eventuali null

            return new JobOfferHistory(
                obj.jobOfferHistoryId,
                obj.jobOfferStatus,
                obj.date,
                candidates,
                obj.note ? obj.note.replace(/^["'](.*)["']$/, '$1') : null // Rimuove apici se presenti
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }

}
