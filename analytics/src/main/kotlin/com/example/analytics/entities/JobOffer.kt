package com.example.analytics.entities

import com.example.analytics.services.JobStatus
import jakarta.persistence.*

@Entity
class JobOffer {
    @Id
    @GeneratedValue
    var jobOfferId: Long = 0

    lateinit var description: String
    var status: JobStatus = JobStatus.CREATED
    lateinit var requiredSkills: String
    lateinit var notes: String
    var duration: Double = 0.0
    var offerValue: Double = 0.0

    @OneToMany(mappedBy = "jobOfferProposal")
    var candidateProfiles: MutableSet<Professional> = mutableSetOf()

    @OneToOne(mappedBy = "jobOffer")
    var professional: Professional? = null

    @ManyToOne
    var currentCustomer: Customer? = null

    @ManyToOne
    var oldCustomer : Customer? = null

    fun addCustomer(c: Customer) {
        c.jobOffers.add(this) // Aggiungi questa jobOffer alla collezione di jobOffers del cliente

        currentCustomer = c // Imposta il cliente per questa jobOffer
    }

    fun addProfessional(p: Professional) {
        p.jobOffer = this
        professional = p
    }
    fun removeProfessional(p: Professional) {
        p.jobOffer = null
        professional = null
    }

    fun addCandidateProfiles(p: Professional){
        p.jobOfferProposal = this
        candidateProfiles.add(p)
    }

    fun removeCandidateProfiles(p: Professional){
        p.jobOfferProposal = null
        candidateProfiles.remove(p)
    }
}

