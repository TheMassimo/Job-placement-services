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

export interface ContactRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
    email: Email[]
    address: Address[]
    telephone: Telephone[]
}

export class Contact implements ContactRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
    email: Email[]
    address: Address[]
    telephone: Telephone[]

    constructor(contactId: number | null,
                name: string,
                surname: string,
                ssn: string,
                category: Category | null,
                email: Email[],
                address: Address[],
                telephone: Telephone[]

    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.email = email
        this.address = address
        this.telephone = telephone
    }

    static fromJsonObject(obj: ContactRawData): Contact | null {
        try {
            return new Contact(
                obj.contactId,
                obj.name,
                obj.surname,
                obj.ssn,
                obj.category,
                obj.email,
                obj.address,
                obj.telephone)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
