export class JobOffersFilter {
    description: string | null
    status: string | null
    duration: number | null
    offerValue: number | null
    requiredSkills: string | null

    constructor(
        description: string | null,
        status: string | null,
        duration: number | null,
        offerValue: number | null,
        requiredSkills: string | null
    ){

        if (description?.trim() === "") {
            this.description = null
        } else {
            this.description = description
        }
        if (status?.trim() === "") {
            this.status = null
        } else {
            this.status = status
        }
        if (duration == null || duration <= 0) { // Verifica null, undefined e valori non validi
            this.duration = 0;
        } else {
            this.duration = duration;
        }
        if (offerValue == null || offerValue <= 0) { // Verifica null, undefined e valori non validi
            this.offerValue = 0;
        } else {
            this.offerValue = offerValue;
        }
        if (requiredSkills?.trim() === "") {
            this.requiredSkills = null
        } else {
            this.requiredSkills = requiredSkills
        }
    }
}



