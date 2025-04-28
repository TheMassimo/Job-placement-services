package com.example.crm.controllers

import com.example.crm.services.ProfessionalServices
import com.example.crm.dtos.*
import com.example.crm.entities.ProfessionalEmployment
import jakarta.validation.constraints.Min
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/API/professionals")
class ProfessionalController(private val professionalServices : ProfessionalServices) {

    @GetMapping("", "/")
    fun getAllProfessionals(@RequestParam("page", defaultValue = "0")  @Min(value = 0) page: Int,
                            @RequestParam("limit", defaultValue = "10") @Min(value = 1) limit: Int,
                            @RequestParam(defaultValue = "") skills: String,
                            @RequestParam(defaultValue = "") location: String,
                            @RequestParam(defaultValue = "") employmentState: String
    ) : List<ProfessionalDTO> {
        return professionalServices.getAllProfessionals(page, limit, skills, location, employmentState)
    }

    @GetMapping("/{id}", "/{id}/")
    fun getProfessionalById(@PathVariable id : Long) : ProfessionalDTO {
        return professionalServices.getProfessionalById(id)
    }

    @PostMapping("", "/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadProfessional(@RequestBody dto : ProfessionalCreateDTO) : ProfessionalDTO {
        return professionalServices.create(dto)
    }

    @PostMapping("/note/{id}", "/note/{id}/")
    @ResponseStatus(HttpStatus.OK)
    fun addNote(@PathVariable id : Long, @RequestBody note : String) : ProfessionalDTO {
        return professionalServices.addNote(id, note)
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROLE_operator', 'ROLE_manager', 'ROLE_recruiter')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProfessional(
        @PathVariable("id", required = true) professionalId: Long
    ) {
        professionalServices.deleteProfessional(professionalId)
    }



    @PutMapping("/{id}", "/{id}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateProfessional(
        @PathVariable id: Long,
        @RequestBody dto: ProfessionalCreateDTO
    ): ProfessionalDTO{

        return professionalServices.updateProfessional(id, dto)
    }

    @PostMapping("/{id}/skill", "/{id}/skill/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadProfessionalSkill(
        @PathVariable id : Long,
        @RequestBody skill: String,
    ): ProfessionalDTO {
        return professionalServices.addSkill(id, skill)
    }

    @DeleteMapping("/{id}/skill/{skillId}", "/{id}/skill/{skillId}/")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProfessionalSkill(
        @PathVariable id: Long,
        @PathVariable skillId: Long
    ) {
        professionalServices.deleteSkill(id, skillId)
    }

    @PutMapping("/{id}/skill/{skillId}", "/{id}/skill/{skillId}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateProfessionalSkill(
        @PathVariable id : Long,
        @PathVariable skillId : Long,
        @RequestBody skill: String
    ): ProfessionalDTO {
        return professionalServices.updateSkill(id, skillId, skill)
    }

    @PutMapping("/{id}/location", "/{id}/location/")
    @ResponseStatus(HttpStatus.OK)
    fun updateProfessionalLocation(
        @PathVariable id : Long,
        @RequestParam location: String
    ): ProfessionalDTO {
        return professionalServices.updateLocation(id, location)
    }

    @PutMapping("/{id}/state", "/{id}/state/")
    @ResponseStatus(HttpStatus.OK)
    fun updateProfessionalState(
        @PathVariable id : Long,
        @RequestParam state: ProfessionalEmployment
    ): ProfessionalDTO {
        return professionalServices.updateEmploymentState(id, state)
    }

    @GetMapping("/{id}/skill", "/{id}/skill/")
    @ResponseStatus(HttpStatus.OK)
    fun getAllSkillsFromProfessional(
        @PathVariable id : Long
    ): List<SkillDTO> {
        return professionalServices.getAllSkills(id)
    }
}