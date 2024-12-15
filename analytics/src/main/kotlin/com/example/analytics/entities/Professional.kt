package com.example.analytics.entities

import com.example.analytics.services.ProfessionalEmployment
import jakarta.persistence.*

@Entity
class Professional {
    @Id
    @GeneratedValue
    val professionalId: Long = 0

    lateinit var employment: ProfessionalEmployment
    lateinit var geographicalInfo: String
    lateinit var notes: String
    var dailyRate: Double = 0.0

    @ManyToOne
    var jobOfferProposal: JobOffer? = null

    @OneToOne
    var jobOffer: JobOffer? = null

    @ManyToMany(mappedBy = "professional")
    var skills: MutableSet<Skill> = mutableSetOf()

    @OneToOne
    var contact: Contact? = null//tmp :Contact 1to1

    fun addSkill(s: Skill){
        s.professional.add(this)
        skills.add(s)
    }

    fun removeSkill(s: Skill){
        s.professional.remove(this)
        skills.remove(s)
    }

    fun addJobOffer(jo: JobOffer){
        jo.professional = this
        jobOffer = jo
    }

    fun removeJobOffer(jo: JobOffer){
        jo.professional = null
        jobOffer = null
    }


}