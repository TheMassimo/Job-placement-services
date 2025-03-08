package com.example.crm.entities

import com.example.crm.dtos.JobOfferHistoryDTO
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
class JobOfferHistory {
    @Id
    @GeneratedValue
    val jobOfferHistoryId: Long = 0

    @ManyToOne
    var jobOffer: JobOffer? = null

    var date: LocalDateTime = LocalDateTime.now()
    lateinit var jobOfferStatus: JobStatus

    @OneToMany(mappedBy = "jobOfferHistory", cascade = [CascadeType.ALL], orphanRemoval = true)
    var candidates = mutableSetOf<Application>()

    var note: String? = null

    fun addJobApplication(professional: Professional, status: ApplicationStatus = ApplicationStatus.Pending) {
        val application = Application()

        application.professional = professional
        application.jobOfferHistory = this
        application.status = status

        candidates.add(application)
        professional.jobApplications.add(application)
    }

    fun removeJobApplication(application: Application) {
        candidates.remove(application)
        application.professional.jobApplications.remove(application)
    }

    fun toDto(): JobOfferHistoryDTO =
        JobOfferHistoryDTO(
            this.jobOfferHistoryId,
            this.jobOfferStatus,
            this.date,
            this.candidates.map { it.toDto() }.toMutableSet(),
            this.note
        )
}