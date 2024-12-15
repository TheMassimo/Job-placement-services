package com.example.analytics.entities

import jakarta.persistence.*

@Entity
class Contact {
    @Id
    @GeneratedValue
    var contactId: Long = 0

    lateinit var name: String
    lateinit var surname: String
    lateinit var ssnCode: String
    lateinit var category: String

    @ManyToMany(mappedBy = "contact")
    var email: MutableSet<Email> = mutableSetOf()

    @ManyToMany(mappedBy = "contact")
    var address: MutableSet<Address> = mutableSetOf()

    @ManyToMany(mappedBy = "contact")
    var telephone: MutableSet<Telephone> = mutableSetOf()

    @OneToOne(mappedBy = "contact",  cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var customer: Customer? = null

    @OneToOne(mappedBy = "contact")
    var professional: Professional? = null

    fun addEmail(e: Email){
        e.contact.add(this)
        email.add(e)
    }

    fun removeEmail(e: Email){
        e.contact.remove(this)
        email.remove(e)
    }

    fun addAddress(a: Address){
        a.contact.add(this)
        address.add(a)
    }

    fun removeAddress(a: Address){
        a.contact.remove(this)
        address.remove(a)
    }

    fun addTelephone(t: Telephone){
        t.contact.add(this)
        telephone.add(t)
    }

    fun removeTelephone(t: Telephone){
        t.contact.remove(this)
        telephone.remove(t)
    }
}