package com.example.crm.services

import com.example.crm.dtos.*
import com.example.crm.entities.JobStatus

interface JobOfferServices {
    fun getOpenJobOffers(customerId: Long, page: Int, limit: Int): List<JobOfferDTO>

    fun getAcceptedJobOffers(professionalId: Long, page: Int, limit: Int): List<JobOfferDTO>

    fun getAbortedJobOffers(page: Int, limit: Int, customer: String, professional: String): List<JobOfferDTO>

    fun getJobOffers(
        customerId: Long?,
        professionalId: Long?,
        status: JobStatus?,
        description: String?,
        duration: Int?,
        offerValue: Int?,
        requiredSkills: String?,
        pageNumber: Int,
        pageSize: Int
    ): List<JobOfferDTO>

    fun create(dto: JobOfferCreateDTO, contactId: Long): JobOfferDTO

    fun getContactIdByJobOfferId(jobOfferId: Long): Long?

    fun updateJobOfferStatus(jobOfferId: Long, status: String, candidates:List<Long>): JobOfferDTO

    fun getJobOfferValue(jobOfferId: Long): Double

    fun deleteJobOffer(jobOfferId: Long)

    fun updateNotes(jobOfferId: Long, notes: String): JobOfferDTO

    fun addNotes(jobOfferId: Long, newNotes: String): JobOfferDTO

    fun getJobOfferById(jobOfferId: Long): JobOfferDTO

    fun updateJobOffer(jobOfferId: Long, dto:JobOfferCreateDTO): JobOfferDTO

    fun addSkill(id : Long, skill : String) : JobOfferDTO

    fun deleteSkill(id : Long, skillId : Long)

    fun updateSkill(id : Long, skillId : Long, skill : String) : JobOfferDTO

    fun insertNewApplication(jobOfferId: Long, professionalId: Long)

    fun deleteApplication(jobOfferId: Long, professionalId: Long)

    fun getJobOfferHistory(jobOfferId: Long): List<JobOfferHistoryDTO>

    fun getJobOfferNewestHistory(jobOfferId: Long): JobOfferHistoryDTO?

    fun updateJobOfferHistoryNote(jobOfferId: Long, note:String): JobOfferHistoryDTO?
}