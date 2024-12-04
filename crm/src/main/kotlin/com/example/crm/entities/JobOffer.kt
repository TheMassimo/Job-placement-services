package com.example.crm.entities

import jakarta.persistence.*

enum class JobStatus {
    CREATED,
    ABORTED,
    SELECTION_PHASE,
    CANDIDATE_PROPOSAL,
    CONSOLIDATED,
    DONE;

    fun getJobStatusFor(): List<JobStatus> {
        return JobStatus.stateMap[this]
            ?: emptyList() //empty list if state is a leaf, consider throwing something instead
    }

    companion object {
        private val stateMap = mapOf(
            //JobStatus.CREATED to listOf(JobStatus.ABORTED, JobStatus.SELECTION_PHASE),
            CREATED to listOf(ABORTED, SELECTION_PHASE),
            SELECTION_PHASE to listOf(ABORTED, CANDIDATE_PROPOSAL),
            CANDIDATE_PROPOSAL to listOf(ABORTED, CONSOLIDATED, SELECTION_PHASE),
            CONSOLIDATED to listOf(ABORTED, DONE, SELECTION_PHASE),
            DONE to listOf(SELECTION_PHASE),
        )
    }
}


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

    @ManyToMany(mappedBy = "jobOffer")
    var requiredSkills: MutableSet<Skill> = mutableSetOf()

    @OneToMany(mappedBy = "jobOfferProposal")
    var candidateProfiles: MutableSet<Professional> = mutableSetOf()

    @OneToOne(mappedBy = "jobOffer")
    var professional: Professional? = null

    @ManyToOne
    var currentCustomer: Customer? = null

    @ManyToOne
    var oldCustomer : Customer? = null

    fun addSkill(s: Skill){
        s.jobOffer.add(this)
        requiredSkills.add(s)
    }

    fun removeSkill(s: Skill){
        s.jobOffer.remove(this)
        requiredSkills.remove(s)
    }

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

