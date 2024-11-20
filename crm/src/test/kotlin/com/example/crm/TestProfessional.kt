package com.example.crm

import com.example.crm.dtos.ProfessionalCreateDTO
import com.example.crm.services.ContactServices
import com.example.crm.services.ProfessionalServices
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class TestProfessional: IntegrationTest() {
    @Autowired
    private lateinit var professionalServices: ProfessionalServices
    @Autowired
    private lateinit var contactServices: ContactServices

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAllProfessionals() {
        val professionalList = professionalServices.getAllProfessionals(0, 100, "", "", "")

        assert(professionalList.isNotEmpty())
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetProfessionalById() {
        val professionalList = professionalServices.getAllProfessionals(0, 100, "", "", "")
        val professionalId = professionalList[0].professionalId
        val professional = professionalServices.getProfessionalById(professionalId)

        assert(professional in professionalList)
        assert(professional.professionalId == professionalId)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldCreateProfessional() {
        val contactId = contactServices.getAllContacts(0, 100, "", "", "")[0].contactId
        val newProfessional = professionalServices.create(ProfessionalCreateDTO(
            "Cuneo",
            150.0,
            contactId,
            "this is a note"
        ))
        val professionalsList = professionalServices.getAllProfessionals(0, 100, "", "", "")

        assert(newProfessional in professionalsList)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddNoteToProfessional() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "")[0].professionalId
        professionalServices.addNote(professionalId, "this is a new note")
        val professional = professionalServices.getProfessionalById(professionalId)

        assert(professional.notes == "this is a new note")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddSkillToProfessional() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "").last().professionalId
        professionalServices.addSkill(professionalId, "this is a new skill")
        val professional = professionalServices.getProfessionalById(professionalId)


        assert(professional.skills.size == 2)
        val skillList = professional.skills.toList().map { it.skill }
        assert("this is a new skill" in skillList)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldDeleteSkillFromProfessional() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "").last().professionalId
        professionalServices.addSkill(professionalId, "this is a new skill")
        professionalServices.addSkill(professionalId, "this is another skill")
        var professional = professionalServices.getProfessionalById(professionalId)
        val firstSkillId = professionalServices.getSkillByName("this is a new skill").skillId

        assert(professional.skills.size == 3)

        professionalServices.deleteSkill(professionalId, firstSkillId)
        professional = professionalServices.getProfessionalById(professionalId)

        assert(professional.skills.size == 2)
        val skillList = professional.skills.toList().map { it.skill }
        assert("this is another skill" in skillList)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateSkill() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "").last().professionalId
        professionalServices.addSkill(professionalId, "this is a new skill")
        professionalServices.addSkill(professionalId, "this is another skill")
        var professional = professionalServices.getProfessionalById(professionalId)
        val firstSkillId = professionalServices.getSkillByName("this is a new skill").skillId

        assert(professional.skills.size == 3)

        professionalServices.updateSkill(professionalId, firstSkillId, "updated skill")
        professional = professionalServices.getProfessionalById(professionalId)
        val skillList = professional.skills.toList().map { it.skill }

        assert(professional.skills.size == 3)
        assert("this is another skill" in skillList)
        assert("updated skill" in skillList)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateEmploymentState() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "")[0].professionalId
        var professional = professionalServices.getProfessionalById(professionalId)
        assert(professional.employment.ordinal == 0)
        professionalServices.updateEmploymentState(professionalId, "EMPLOYED")
        professional = professionalServices.getProfessionalById(professionalId)

        assert(professional.employment.name == "EMPLOYED")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateLocation() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "")[0].professionalId
        var professional = professionalServices.getProfessionalById(professionalId)
        assert(professional.geographicalInfo == "Torino")
        professionalServices.updateLocation(professionalId, "Milano")
        professional = professionalServices.getProfessionalById(professionalId)

        assert(professional.geographicalInfo == "Milano")
    }
}