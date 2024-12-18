package com.example.analytics.repositories

import com.example.analytics.services.JobStatus
import com.example.analytics.entities.Customer
import com.example.analytics.entities.JobOffer
import com.example.analytics.entities.Professional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

@Repository                                 //Entity , Id
interface JobOfferRepository: JpaRepository<JobOffer, Long> {

    fun findByStatusInAndCurrentCustomer(status: List<JobStatus>, customer: Customer, pageable: Pageable): Page<JobOffer>

    fun findByStatusInAndProfessional(status: List<JobStatus>, professional: Professional, pageable: Pageable): Page<JobOffer>

    fun findByStatusIn(status: List<JobStatus>, pageable: Pageable): Page<JobOffer>

    fun findByCurrentCustomerAndProfessionalAndStatus(customer: Customer, professional: Professional, status: JobStatus, pageable: Pageable): Page<JobOffer>

    fun findByCurrentCustomerAndProfessional(customer: Customer, professional: Professional, pageable: Pageable): Page<JobOffer>

    fun findByCurrentCustomerAndStatus(customer: Customer, status: JobStatus, pageable: Pageable): Page<JobOffer>

    fun findByProfessionalAndStatus(professional: Professional, status: JobStatus, pageable: Pageable): Page<JobOffer>

    fun findByCurrentCustomer(customer: Customer, pageable: Pageable): Page<JobOffer>

    fun findByProfessional(professional: Professional, pageable: Pageable): Page<JobOffer>

    fun findByStatus(status: JobStatus, pageable: Pageable): Page<JobOffer>

}