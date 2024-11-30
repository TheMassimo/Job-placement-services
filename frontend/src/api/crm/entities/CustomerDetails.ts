import {Email} from "./Email";
import {Telephone} from "./Telephone";
import {Address} from "./Address";
import {JobOffer} from "./JobOffer";

export enum Category {
    Customer,
    Professional,
    CustomerProfessional,
    Unknown,
}

export interface CustomerDetailsRawData {
    contactId: number | null
    name: string
    surname: string
    category: Category | null
    email: Email[]
    address: Address[]
    ssn: string
    telephone: Telephone[]
    notes: string | null
    jobOffers: JobOffer[]
}

export class CustomerDetails implements CustomerDetailsRawData {
    contactId: number | null
    name: string
    surname: string
    category: Category | null
    email: Email[]
    address: Address[]
    ssn: string
    telephone: Telephone[]
    notes: string | null
    jobOffers: JobOffer[]

    constructor(
        contactId: number | null,
        name: string,
        surname: string,
        category: Category | null,
        email: Email[],
        address: Address[],
        ssn: string,
        telephone: Telephone[],
        notes: string | null,
        jobOffers: JobOffer[]
    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.category = category
        this.email = email
        this.address = address
        this.ssn = ssn
        this.telephone = telephone
        this.notes = notes
        this.jobOffers = jobOffers
    }

    static fromJsonObject(obj: CustomerDetailsRawData): CustomerDetailsRawData | null {
        try {
            return new CustomerDetails(
                obj.contactId,
                obj.name,
                obj.surname,
                obj.category,
                obj.email,
                obj.address,
                obj.ssn,
                obj.telephone,
                obj.notes,
                obj.jobOffers
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
