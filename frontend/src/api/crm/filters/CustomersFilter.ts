export class CustomersFilter {
    name: string | null
    surname: string | null
    category: String | null
    email: string | null
    address: string | null
    ssn: string | null
    telephone: string | null
    jobOffers: number | 0

    constructor(
        name: string | null,
        surname: string | null,
        category: number | null,
        email: string | null,
        address: string | null,
        ssn: string | null,
        telephone: string | null,
        jobOffers: number | 0) {

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
        if (jobOffers == null || jobOffers <= 0) { // Verifica null, undefined e valori non validi
            this.jobOffers = 0;
        } else {
            this.jobOffers = jobOffers;
        }

        switch (category) {
            case 0:
                this.category = "Customer"
                break
            case 1:
                this.category = "Professional"
                break
            case 2:
                this.category = "Unknown"
                break
            case 3:
                this.category = "CustomerProfessional"
                break
            default:
                this.category = null
        }
    }
}
