import {Email} from "./Email";
import {Telephone} from "./Telephone";
import {Address} from "./Address";
import {Customer} from "./Customer";
import {Professional} from "./Professional";

export enum Category {
    Customer,
    Professional,
    CustomerProfessional,
    Unknown,
}

export interface ContactDetailsRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
    email: Email[]
    address: Address[]
    telephone: Telephone[]
    customer: Customer
    professional: Professional
}

export class ContactDetails implements ContactDetailsRawData {
    contactId: number | null
    name: string
    surname: string
    ssn: string
    category: Category | null
    email: Email[]
    address: Address[]
    telephone: Telephone[]
    customer: Customer
    professional: Professional

    constructor(contactId: number | null,
                name: string,
                surname: string,
                ssn: string,
                category: Category | null,
                email: Email[] | [],
                address: Address[] | [],
                telephone: Telephone[] | [],
                customer: Customer,
                professional: Professional

    ) {
        this.contactId = contactId
        this.name = name
        this.surname = surname
        this.ssn = ssn
        this.category = category
        this.email = email
        this.address = address
        this.telephone = telephone
        this.customer = customer
        this.professional = professional
    }

    static fromJsonObject(obj: ContactDetailsRawData): ContactDetails | null {
        try {
            return new ContactDetails(
                obj.contactId,
                obj.name,
                obj.surname,
                obj.ssn,
                obj.category,
                obj.email,
                obj.address,
                obj.telephone,
                obj.customer,
                obj.professional
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
