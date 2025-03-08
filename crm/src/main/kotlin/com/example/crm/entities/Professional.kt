package com.example.crm.entities
import com.example.crm.dtos.ProfessionalDTO
import jakarta.persistence.*

enum class ProfessionalEmployment {
    UNEMPLOYED,
    BUSY,
    EMPLOYED;
}

@Entity
class Professional {
    @Id
    @GeneratedValue
    val professionalId: Long = 0

    @Enumerated(EnumType.STRING)
    lateinit var employment: ProfessionalEmployment
    lateinit var geographicalInfo: String
    lateinit var notes: String
    var dailyRate: Double = 0.0

    @OneToOne
    var jobOffer: JobOffer? = null

    @ManyToOne
    var jobOfferProposal: JobOffer? = null

    @OneToMany(mappedBy = "professional", cascade = [CascadeType.ALL], orphanRemoval = true)
    val jobApplications = mutableSetOf<Application>()

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

fun Professional.toDto(): ProfessionalDTO =
    ProfessionalDTO(
        this.professionalId,
        this.employment,
        this.geographicalInfo,
        this.dailyRate,
        this.notes,
        //this.contact,
        this.skills)