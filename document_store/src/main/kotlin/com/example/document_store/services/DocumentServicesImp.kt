package com.example.document_store.services

import com.example.document_store.dtos.DocumentDataDTO
import com.example.document_store.dtos.DocumentMetaDataDTO
import com.example.document_store.dtos.toDto
import com.example.document_store.entities.DocumentData
import com.example.document_store.entities.DocumentMetaData
import com.example.document_store.exceptions.BadParameterException
import com.example.document_store.exceptions.DocumentNotFoundException
import com.example.document_store.exceptions.DuplicateDocumentException
import com.example.document_store.repositories.DocumentDataRepository
import com.example.document_store.repositories.DocumentMetaDataRepository
import jakarta.transaction.Transactional
import org.springframework.data.domain.PageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestParam
import java.time.LocalDateTime
import java.util.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import kotlin.Exception

@Service
class DocumentServicesImp(
    private val documentMetaDataRepository: DocumentMetaDataRepository,
    private val documentDataRepository: DocumentDataRepository

) : DocumentServices {
    private val logger: Logger = LoggerFactory.getLogger(DocumentServices::class.java)

    override fun getAllDocuments(page: Int, limit: Int): List<DocumentMetaDataDTO> {

        try {
            val pageable = PageRequest.of(page, limit)
            val documents = documentMetaDataRepository.findAll(pageable)
            logger.info("Document fetched successfully")
            return documents.content.map { it.toDto() }
        }catch(ex: Exception){
            throw ex
        }

    }

    override fun getDocumentMetaData(id: Long): DocumentMetaDataDTO {
        val doc = documentMetaDataRepository.findByIdOrNull(id)
            ?: throw BadParameterException("Document metadata not found")
        logger.info("Document fetched successfully")
        return doc.toDto()
    }


    @Transactional
    override fun getEntireDocument(id: Long): Pair<DocumentDataDTO, DocumentMetaDataDTO> {
        val docData = documentDataRepository.findByIdOrNull(id)?:
        throw DocumentNotFoundException("Document data not found")

        val docMetadata = documentMetaDataRepository.findByIdOrNull(id)?:
        throw DocumentNotFoundException("Document metadata not found")

        logger.info("Document fetched successfully")

        return Pair(docData.toDto(), docMetadata.toDto())
    }

    @Transactional
    override fun create(
        name: String,
        size: Number,
        content_type: String,
        creationg_timestamp: LocalDateTime,
        content_data : ByteArray
    ): DocumentMetaDataDTO {
        if(documentMetaDataRepository.findByNameIgnoreCase(name).isNotEmpty()){
            throw DuplicateDocumentException("A document with this name already exist")
        }

        val d = DocumentMetaData()
        val c = DocumentData()


        c.content = content_data
        documentDataRepository.save(c)

        d.name = name
        d.size = size
        d.content_type = content_type
        d.creation_timestamp = creationg_timestamp
        d.documentData = c

        logger.info("Document posted successfully")

        return documentMetaDataRepository.save(d).toDto()
    }

    @Transactional
    override fun update(
        id: Long,
        name: String,
        size: Number,
        content_type: String,
        creationg_timestamp: LocalDateTime,
        content_data: ByteArray
    ): DocumentMetaDataDTO {
        // Fetch the existing document from the database
        val existingMetadata = documentMetaDataRepository.findById(id)
            .orElseThrow {
                logger.error("Document not found")
                DocumentNotFoundException("Document with id $id not found in MetaDataRepository") }

        val existingData = documentDataRepository.findById(id)
            .orElseThrow {
                logger.error("Document not found ")
                DocumentNotFoundException("Document with id $id not found in DataRepository") }

        try {
            existingData.content = content_data
            documentDataRepository.save(existingData)

            existingMetadata.name = name
            existingMetadata.size = size
            existingMetadata.content_type = content_type
            existingMetadata.creation_timestamp = creationg_timestamp
            existingMetadata.documentData = existingData
            logger.info("Document modified successfully")

            return documentMetaDataRepository.save(existingMetadata).toDto()
        } catch (ex : Exception){
            throw ex
        }
    }

    @Transactional
    override fun deleteDocumentById(id: Long) {
        val documentMetadata = documentMetaDataRepository.findById(id)
        documentMetadata.ifPresentOrElse({documentMetaDataRepository.deleteById(id)
        },{
            logger.error("Document metadata not found")
            throw DocumentNotFoundException("Document metadata not found")})

        val documentData = documentDataRepository.findById(id)
        documentData.ifPresentOrElse({documentDataRepository.deleteById(id)},
            {
                logger.error("Document data not found")
                throw DocumentNotFoundException("Document data not found")})

        logger.info("Document successfully deleted")


    }

    /*
    TEMPLATE

    override fun create(
        name: String,
        size: Number,
        content_type: String,
        creationg_timestamp: Date
    ): DocumentMetaDataDTO {
        val d = DocumentMetaData()
        d.name = name
        d.size = size
        d.content_type = content_type
        d.creation_timestamp = creationg_timestamp
        return documentMetaDataRepository.save(d).toDto()
    }

    override fun listAll(): List<DocumentMetaDataDTO> {
        return documentMetaDataRepository.findAll().map { it.toDto() }
    }

    override fun findByName(name: String): List<DocumentMetaDataDTO> {
        return documentMetaDataRepository.findByNameIgnoreCase(name).map { it.toDto() }
    }

    override fun findById(id: Long): DocumentMetaDataDTO? {
        return documentMetaDataRepository.findDocumentById(id)?.toDto()
    }

    override fun delete(id: Long) {
        documentMetaDataRepository.deleteById(id)
    }
    */

}