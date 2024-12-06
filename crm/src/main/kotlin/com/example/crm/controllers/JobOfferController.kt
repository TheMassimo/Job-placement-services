package com.example.crm.controllers

import com.example.crm.services.JobOfferServices
import com.example.crm.dtos.*
import com.example.crm.entities.JobStatus
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/API/joboffers")
class JobOfferController(private val jobOfferServices: JobOfferServices) {

    @GetMapping("/open/{customerId}", "/open/{customerId}/")
    fun getOpenJobOffers (@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                          @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
                          @PathVariable @Positive customerId: Long) : ResponseEntity<List<JobOfferDTO>> {
        val jobOffers = jobOfferServices.getOpenJobOffers(customerId, page, limit)
        return ResponseEntity.ok(jobOffers)
    }

    @GetMapping("/accepted/{professionalId}", "/accepted/{professionalId}/")
    fun getAcceptedJobOffers (@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                              @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
                              @PathVariable @Positive professionalId: Long) : ResponseEntity<List<JobOfferDTO>> {
        val jobOffers = jobOfferServices.getAcceptedJobOffers(professionalId, page, limit)
        return ResponseEntity.ok(jobOffers)
    }

    @GetMapping("/aborted", "/aborted/")
    fun getAbortedJobOffers (@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                             @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
                             @RequestParam(defaultValue = "") customer: String,
                             @RequestParam(defaultValue = "") professional: String) : ResponseEntity<List<JobOfferDTO>> {
        val jobOffers = jobOfferServices.getAbortedJobOffers(page, limit, customer, professional)
        return ResponseEntity.ok(jobOffers)
    }

    @GetMapping("", "/")
    fun getJobOffers(@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                             @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
                             @RequestParam(required = false) customerId: Long?,
                             @RequestParam(required = false) professionalId: Long?,
                             @RequestParam(required = false) status: JobStatus?,
                            ): ResponseEntity<List<JobOfferDTO>>{
        val jobOffers = jobOfferServices.getJobOffers(page, limit, customerId, professionalId, status)

        return ResponseEntity.ok(jobOffers)
    }

    @PutMapping("/{joboffersId}", "/{joboffersId}/")
    fun updateJobOfferStatus(@PathVariable @Positive joboffersId: Long,
                             @RequestParam status: String,
                             @RequestParam(required = false) professionalId: Long?): JobOfferDTO{
        val jobOffer = jobOfferServices.updateJobOfferStatus(joboffersId, status, professionalId)
        return jobOffer
    }

    @GetMapping("/{joboffersId}/value", "/{joboffersId}/value/")
    fun getJobOfferValue(@PathVariable @Positive joboffersId: Long): Double{
        return jobOfferServices.getJobOfferValue(joboffersId)
    }

    @PostMapping("/{contactId}", "/{contactId}/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadJobOffer(
        @RequestBody dto: JobOfferCreateDTO,
        @PathVariable @Positive contactId: Long
    ):JobOfferDTO{
        return jobOfferServices.create(dto, contactId)
    }

    @DeleteMapping("/{joboffersId}", "/{joboffersId}/")
    fun deleteJobOfferById(@PathVariable @Positive joboffersId: Long) {
        jobOfferServices.deleteJobOffer(joboffersId)
    }

    @PutMapping("/{joboffersId}/updatenotes", "/{joboffersId}/updatenotes/")
    fun updateNotes(@PathVariable @Positive joboffersId: Long,  @RequestParam notes: String): JobOfferDTO {
        val jobOffer = jobOfferServices.updateNotes(joboffersId, notes)
        return jobOffer
    }

    @PutMapping("/{joboffersId}/addnotes", "/{joboffersId}/addnotes/")
    fun addNotes(@PathVariable @Positive joboffersId: Long,  @RequestParam notes: String): JobOfferDTO {
        val jobOffer = jobOfferServices.addNotes(joboffersId, notes)
        return jobOffer
    }

}