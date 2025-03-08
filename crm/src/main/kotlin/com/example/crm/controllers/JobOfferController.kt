package com.example.crm.controllers

import com.example.crm.services.JobOfferServices
import com.example.crm.dtos.*
import com.example.crm.entities.JobStatus
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
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

    @GetMapping("/{jobOfferId}/contact_id", "/{jobOfferId}/contact_id")
    fun getContactId(@PathVariable jobOfferId: Long): Long? {
        return jobOfferServices.getContactIdByJobOfferId(jobOfferId)
    }

    @GetMapping("", "/")
    fun getJobOffers(
        @RequestParam(required = false) customerId: Long?,
        @RequestParam(required = false) professionalId: Long?,
        @RequestParam(required = false) status: JobStatus?,
        @RequestParam(required = false) description: String?,
        @RequestParam(required = false) duration: Int?,
        @RequestParam(required = false) offerValue: Int?,
        @RequestParam(required = false) requiredSkills: String?,
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
    ): ResponseEntity<List<JobOfferDTO>>{
        val jobOffers = jobOfferServices.getJobOffers(
            customerId,
            professionalId,
            status,
            description,
            duration,
            offerValue,
            requiredSkills,
            pageNumber,
            pageSize,
        );

        return ResponseEntity.ok(jobOffers)
    }

    @GetMapping("/{jobOfferId}", "/{jobOfferId}/")
    fun getJobOfferById(
        @PathVariable jobOfferId: Long
    ):JobOfferDTO{
        return jobOfferServices.getJobOfferById(jobOfferId);
    }

    @PutMapping("/{jobOfferId}", "/{jobOfferId}/")
    fun updateJobOffer(
        @PathVariable jobOfferId: Long,
        @RequestBody dto: JobOfferCreateDTO
    ): JobOfferDTO {
        return jobOfferServices.updateJobOffer(jobOfferId, dto);
    }

    @PutMapping("/{joboffersId}/status/{status}", "/{joboffersId}/status/{status}/")
    fun updateJobOfferStatus(@PathVariable @Positive joboffersId: Long,
                             @PathVariable status: String,
                             @RequestBody candidates: List<Long>): JobOfferDTO{
        val jobOffer = jobOfferServices.updateJobOfferStatus(joboffersId, status, candidates)
        return jobOffer
    }

    @GetMapping("/{joboffersId}/value", "/{joboffersId}/value/")
    fun getJobOfferValue(@PathVariable @Positive joboffersId: Long): Double{
        return jobOfferServices.getJobOfferValue(joboffersId)
    }

    @PostMapping("/{contactId}", "/{contactId}/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadJobOffer(
        @PathVariable @Positive contactId: Long,
        @RequestBody dto: JobOfferCreateDTO
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

    @PostMapping("/{id}/requiredSkills", "/{id}/requiredSkills/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadJobOfferRequiredSkills(
        @PathVariable id : Long,
        @RequestBody skill: String,
    ): JobOfferDTO {
        return jobOfferServices.addSkill(id, skill)
    }

    @DeleteMapping("/{id}/requiredSkills/{skillId}", "/{id}/requiredSkills/{skillId}/")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteJobOfferRequiredSkills(
        @PathVariable id: Long,
        @PathVariable skillId: Long
    ) {
        jobOfferServices.deleteSkill(id, skillId)
    }

    @PutMapping("/{id}/requiredSkills/{skillId}", "/{id}/requiredSkills/{skillId}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateJobOfferRequiredSkills(
        @PathVariable id : Long,
        @PathVariable skillId : Long,
        @RequestBody skill: String
    ): JobOfferDTO {
        return jobOfferServices.updateSkill(id, skillId, skill)
    }


    @PostMapping("/{jobOfferId}/applications/{professionalId}", "/{jobOfferId}/applications/{professionalId}/")
    @ResponseStatus(HttpStatus.CREATED)
    fun insertNewApplication(
        @PathVariable(name = "jobOfferId", required = true) jobOfferId: Long,
        @PathVariable(name = "professionalId", required = true) professionalId: Long
    ) {
        jobOfferServices.insertNewApplication(jobOfferId, professionalId)
    }

    @DeleteMapping("/{jobOfferId}/{professionalId}", "/{jobOfferId}/{professionalId}/")
    @ResponseStatus(HttpStatus.CREATED)
    fun deleteNewApplication(
        @PathVariable(name = "jobOfferId", required = true) jobOfferId: Long,
        @PathVariable(name = "professionalId", required = true) professionalId: Long
    ) {
        jobOfferServices.deleteApplication(jobOfferId, professionalId)
    }

    @GetMapping("/{jobOfferId}/history", "/{jobOfferId}/history/")
    fun getJobOfferHistory(@PathVariable("jobOfferId", required = true) jobOfferId: Long): List<JobOfferHistoryDTO> {
        return jobOfferServices.getJobOfferHistory(jobOfferId)
    }

    @GetMapping("/{jobOfferId}/history/newest", "/{jobOfferId}/history/newest/")
    fun getJobOfferNewestHistory(@PathVariable("jobOfferId", required = true) jobOfferId: Long): JobOfferHistoryDTO? {
        return jobOfferServices.getJobOfferNewestHistory(jobOfferId)
    }

    @PutMapping("/{jobOfferId}/history/note", "/{jobOfferId}/history/note/")
    fun updateJobOfferHistoryNote(
        @PathVariable("jobOfferId", required = true) jobOfferId: Long,
        @RequestBody newNote: String,
    ):JobOfferHistoryDTO? {
        return jobOfferServices.updateJobOfferHistoryNote(jobOfferId, newNote);
    }

}