package com.example.crm.services

import com.example.crm.dtos.ContactDTO
import com.example.crm.dtos.JobOfferCreateDTO
import com.example.crm.dtos.JobOfferDTO
import com.example.crm.entities.JobStatus

interface JobOfferServices {
    fun getOpenJobOffers(customerId: Long, page: Int, limit: Int): List<JobOfferDTO>

    fun getAcceptedJobOffers(professionalId: Long, page: Int, limit: Int): List<JobOfferDTO>

    fun getAbortedJobOffers(page: Int, limit: Int, customer: String, professional: String): List<JobOfferDTO>

    fun getJobOffers(page: Int, limit: Int, customerId:Long?, professionalId:Long?, status: JobStatus?): List<JobOfferDTO>

    fun create(dto: JobOfferCreateDTO, contactId: Long): JobOfferDTO

    fun updateJobOfferStatus(jobOfferId: Long, status: String, professionalId: Long?): JobOfferDTO

    fun getJobOfferValue(jobOfferId: Long): Double

    fun deleteJobOffer(jobOfferId: Long)

    fun updateNotes(jobOfferId: Long, notes: String): JobOfferDTO

    fun addNotes(jobOfferId: Long, newNotes: String): JobOfferDTO

    fun getJobOfferById(jobOfferId: Long): JobOfferDTO

}