package com.example.crm.controllers

import com.example.crm.dtos.SkillCreateDTO
import com.example.crm.dtos.SkillDTO
import com.example.crm.services.SkillServices
import jakarta.validation.constraints.Positive
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/API/skills")
class SkillController(private val skillServices: SkillServices) {

    @GetMapping("", "/")
    fun getAllSkills() : List<SkillDTO> {
        return skillServices.getAllSkills()
    }

    @GetMapping("/{id}", "/{id}/")
    fun getSkillById(@PathVariable @Positive id: Long): SkillDTO {
        return skillServices.getSkillById(id)
    }

    @PostMapping("", "/")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadSkill(@RequestBody dto: SkillCreateDTO): SkillDTO {
        return skillServices.create(dto)
    }



}