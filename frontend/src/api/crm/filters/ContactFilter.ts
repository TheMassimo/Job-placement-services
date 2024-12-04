export class ContactFilter {
    name: string | null
    surname: string | null
    ssn: string | null
    email: string | null
    address: string | null
    telephone: string | null
    category: string | null
    jobOffers: number | null
    skills: string | null
    status: string | null
    geographicalInfo: string | null

    constructor(
        name: string | null,
        surname: string | null,
        ssn: string | null,
        email: string | null,
        address: string | null,
        telephone: string | null,
        category: string | null,
        jobOffers: number | null,
        skills: string | null,
        status: string | null,
        geographicalInfo: string | null
    ){

        if (name?.trim() === "") {
            this.name = null
        } else {
            this.name = name
        }
        if (surname?.trim() === "") {
            this.surname = null
        } else {
            this.surname = surname
        }
        if (email?.trim() === "") {
            this.email = null
        } else {
            this.email = email
        }
        if (address?.trim() === "") {
            this.address = null
        } else {
            this.address = address
        }
        if (ssn?.trim() === "") {
            this.ssn = null
        } else {
            this.ssn = ssn
        }
        if (telephone?.trim() === "") {
            this.telephone = null
        } else {
            this.telephone = telephone
        }
        if(category?.trim() === "Customer" || category?.trim() === "Professional") {
            this.category = category
        }else{
            this.category = null
        }
        if (jobOffers == null || jobOffers <= 0) { // Verifica null, undefined e valori non validi
            this.jobOffers = 0;
        } else {
            this.jobOffers = jobOffers;
        }
        if (skills?.trim() === "") {
            this.skills = null
        } else {
            this.skills = skills
        }
        if (status?.trim() === "") {
            this.status = null
        } else {
            this.status = status
        }
        if (geographicalInfo?.trim() === "") {
            this.geographicalInfo = null
        } else {
            this.geographicalInfo = geographicalInfo
        }
    }
}
