package com.example.crm.entities

import com.example.crm.dtos.ApplicationDTO
import jakarta.persistence.*
import java.io.Serializable
import java.time.LocalDateTime

enum class ApplicationStatus {
    Pending, Accepted, Aborted
}

@Entity
class Application {
    @Id
    @GeneratedValue
    val applicationId: Long = 0

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    lateinit var professional: Professional

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    lateinit var jobOfferHistory: JobOfferHistory

    @Enumerated(EnumType.STRING)
    var status: ApplicationStatus = ApplicationStatus.Pending

    val date: LocalDateTime = LocalDateTime.now()

    fun toDto(): ApplicationDTO {
        return ApplicationDTO(
            this.professional.professionalId,
            this.jobOfferHistory.jobOfferHistoryId,
            this.status,
            this.date
        )
    }
}