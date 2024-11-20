package com.example.crm.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OneToOne

@Entity
class Customer {
    @Id
    @GeneratedValue
    val customerId: Long = 0

    @OneToMany(mappedBy = "currentCustomer")
    var jobOffers: MutableSet<JobOffer> = mutableSetOf()

    @OneToMany(mappedBy = "oldCustomer")
    var replacementHistory : MutableSet<JobOffer> = mutableSetOf()

    @OneToOne
    var contact: Contact? = null//tmp :Contact 1to1

    lateinit var notes : String


    fun removeJobOffer(jo: JobOffer){
        jo.currentCustomer = null
        jobOffers.remove(jo)
    }

    fun completeJobOffer(jo: JobOffer){
        jobOffers.remove(jo)
        jo.currentCustomer = null
        jo.oldCustomer = this
        replacementHistory.add(jo)
    }

    fun addContact(c : Contact){
        c.customer = this
        contact = c
    }
}