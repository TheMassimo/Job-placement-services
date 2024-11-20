package com.example.crm

import com.example.crm.dtos.JobOfferCreateDTO
import com.example.crm.services.ContactServices
import com.example.crm.services.CustomerServices
import com.example.crm.services.JobOfferServices
import com.example.crm.services.ProfessionalServices
import jakarta.transaction.Transactional
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.jdbc.Sql

class TestJobOffers: IntegrationTest() {
    @Autowired
    private lateinit var jobOfferServices: JobOfferServices
    @Autowired
    private lateinit var contactServices: ContactServices
    @Autowired
    private lateinit var professionalServices: ProfessionalServices
    @Autowired
    private lateinit var customerServices: CustomerServices

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAllJobOffers() {
        val jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)

        assert(jobOfferList.isNotEmpty())
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetJobOfferById() {
        val jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)
        val id = jobOfferList[0].jobOfferId
        val jobOffer = jobOfferServices.getJobOfferById(id)

        assert(jobOffer.jobOfferId == id)
    }


    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAcceptedJobOffers() {
        val professionalId1 = professionalServices.getAllProfessionals(0, 100, "", "", "")[0].professionalId
        val professionalId2 = professionalServices.getAllProfessionals(0, 100, "", "", "")[1].professionalId

        // setting a few of jobOffer statuses manually since we can't do it directly from sql query
        val jobOfferId1 = jobOfferServices.getJobOffers(0, 100, null, null, null)[0].jobOfferId
        assert(jobOfferServices.getJobOfferById(jobOfferId1).status.ordinal == 0)
        jobOfferServices.updateJobOfferStatus(jobOfferId1, "SELECTION_PHASE", null)
        jobOfferServices.updateJobOfferStatus(jobOfferId1, "CANDIDATE_PROPOSAL", professionalId1)
        jobOfferServices.updateJobOfferStatus(jobOfferId1, "CONSOLIDATED", professionalId1)
        //jobOfferServices.updateJobOfferStatus(jobOfferId1, "DONE", professionalId1)

        val jobOfferId2 = jobOfferServices.getJobOffers(0, 100, null, null, null)[1].jobOfferId
        assert(jobOfferServices.getJobOfferById(jobOfferId2).status.ordinal == 0)
        jobOfferServices.updateJobOfferStatus(jobOfferId2, "SELECTION_PHASE", null)
        jobOfferServices.updateJobOfferStatus(jobOfferId2, "CANDIDATE_PROPOSAL", professionalId2)
        jobOfferServices.updateJobOfferStatus(jobOfferId2, "CONSOLIDATED", professionalId2)

//        println("-------------------------------")
//        println(jobOfferServices.getJobOffers(0, 100, null, null, null).map { it.status })
//        println(jobOfferServices.getJobOffers(0, 100, null, null, null).map { it.jobOfferId })

        val acceptedJobOfferList1 = jobOfferServices.getAcceptedJobOffers(professionalId1, 0, 100)
        val statusList1 = acceptedJobOfferList1.map { it.status.ordinal }

        val acceptedJobOfferList2 = jobOfferServices.getAcceptedJobOffers(professionalId2, 0, 100)
        val statusList2 = acceptedJobOfferList2.map { it.status.ordinal }

//        println(statusList1)
//        println(statusList2)

        assert(acceptedJobOfferList1.isNotEmpty()) //else the test is meaningless
        assert(statusList1.all { it == 4 || it == 5 })
        assert(acceptedJobOfferList2.isNotEmpty()) //else the test is meaningless
        assert(statusList2.all { it == 4 || it == 5 })
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetOpenJobOffers() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "")[0].professionalId

        // setting a couple of jobOffer statuses manually since we can't do it directly from sql query
        val jobOfferId1 = jobOfferServices.getJobOffers(0, 100, null, null, null)[0].jobOfferId
        assert(jobOfferServices.getJobOfferById(jobOfferId1).status.ordinal == 0)
        jobOfferServices.updateJobOfferStatus(jobOfferId1, "SELECTION_PHASE", null)
        jobOfferServices.updateJobOfferStatus(jobOfferId1, "CANDIDATE_PROPOSAL", professionalId)

        val jobOfferId2 = jobOfferServices.getJobOffers(0, 100, null, null, null)[1].jobOfferId
        assert(jobOfferServices.getJobOfferById(jobOfferId2).status.ordinal == 0)
        jobOfferServices.updateJobOfferStatus(jobOfferId2, "SELECTION_PHASE", null)

        val customerId1 = customerServices.getAllCustomers()[0].customerId
        val openJobOfferList1 = jobOfferServices.getOpenJobOffers(customerId1, 0, 100)
        val statusList1 = openJobOfferList1.map { it.status.ordinal }

        val customerId2 = customerServices.getAllCustomers()[1].customerId
        val openJobOfferList2 = jobOfferServices.getOpenJobOffers(customerId2, 0, 100)
        val statusList2 = openJobOfferList2.map { it.status.ordinal }

        assert(openJobOfferList1.isNotEmpty())
        assert(statusList1.all { it != 1 && it != 4 && it !=  5 })
        assert(openJobOfferList2.isNotEmpty())
        assert(statusList2.all { it != 1 && it != 4 && it !=  5 })
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetAbortedJobOffers() {
        val abortedJobOfferList = jobOfferServices.getAbortedJobOffers(0, 100, "", "")
        val statusList = abortedJobOfferList.map { it.status.ordinal }

        assert(abortedJobOfferList.isNotEmpty())
        assert(statusList.all { it == 1 })
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateJobOfferStatus() {
        val professionalId = professionalServices.getAllProfessionals(0, 100, "", "", "")[0].professionalId
        var jobOffer = jobOfferServices.getJobOffers(0, 100, null, null, null)[0]
        var jobOfferId = jobOffer.jobOfferId
        assert(jobOffer.status.ordinal == 0)
        jobOfferServices.updateJobOfferStatus(jobOfferId, "SELECTION_PHASE", null)
        jobOffer = jobOfferServices.getJobOfferById(jobOfferId)
        assert(jobOffer.status.ordinal == 2)

        jobOfferServices.updateJobOfferStatus(jobOfferId, "CANDIDATE_PROPOSAL", professionalId)
        jobOffer = jobOfferServices.getJobOfferById(jobOfferId)
        assert(jobOffer.status.ordinal == 3)

        jobOfferServices.updateJobOfferStatus(jobOfferId, "CONSOLIDATED", professionalId)
        jobOffer = jobOfferServices.getJobOfferById(jobOfferId)
        assert(jobOffer.status.ordinal == 4)

        jobOfferServices.updateJobOfferStatus(jobOfferId, "DONE", professionalId)
        jobOffer = jobOfferServices.getJobOfferById(jobOfferId)
        assert(jobOffer.status.ordinal == 5)


        // testing unsuccessful job offer
        jobOffer = jobOfferServices.getJobOffers(0, 100, null, null, null)[1]
        jobOfferId = jobOffer.jobOfferId
        assert(jobOffer.status.ordinal == 0)
        jobOfferServices.updateJobOfferStatus(jobOfferId, "ABORTED", null)
        jobOffer = jobOfferServices.getJobOfferById(jobOfferId)
        assert(jobOffer.status.ordinal == 1)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldGetJobOfferValue() {
        val jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)
        val id = jobOfferList[0].jobOfferId
        val jobOffer = jobOfferServices.getJobOfferById(id)
        val offer = jobOfferServices.getJobOfferValue(id)

        assert(jobOffer.offerValue == offer)
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUploadJobOffer() {
        val numInitialJobOffers = jobOfferServices.getJobOffers(0, 100, null, null, null).size

        val contact = contactServices.getAllContacts(0, 100, "", "", "")
        val contactId = contact[0].contactId

        jobOfferServices.create(JobOfferCreateDTO(
            "job offer description",
            "these are the required skills",
            "some notes about the job offer",
            2.0,
            100.0
        ),contactId)

        jobOfferServices.create(JobOfferCreateDTO(
            "second job offer description",
            "these are the required skills",
            "some notes about the second job offer",
            1.0,
            100.0
        ),contactId)

        val jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)

        assert(jobOfferList.size == numInitialJobOffers + 2 )
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldDeleteJobOfferById() {
        var jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)
        assert(jobOfferList.isNotEmpty()) //else the test is meaningless
        val id = jobOfferList[0].jobOfferId
        jobOfferServices.deleteJobOffer(id)
        jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)
        val ids = jobOfferList.map { it.jobOfferId }

        assert(ids.all { it != id })
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldAddNotes() {
        val jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)
        val id = jobOfferList[0].jobOfferId
        jobOfferServices.addNotes(id, "new note")
        val jobOffer = jobOfferServices.getJobOfferById(id)

        assert(jobOffer.notes == "new note")
    }

    @Test
    @Sql("/sql/data.sql")
    @Transactional
    @Rollback
    fun shouldUpdateNotes() {
        val jobOfferList = jobOfferServices.getJobOffers(0, 100, null, null, null)
        val id = jobOfferList[0].jobOfferId
        jobOfferServices.addNotes(id, "new note")
        var jobOffer = jobOfferServices.getJobOfferById(id)

        assert(jobOffer.notes == "new note")

        jobOfferServices.updateNotes(id, "+ something else")
        jobOffer = jobOfferServices.getJobOfferById(id)

        //println(jobOffer.notes)
        assert(jobOffer.notes == "new note + something else")
    }



}