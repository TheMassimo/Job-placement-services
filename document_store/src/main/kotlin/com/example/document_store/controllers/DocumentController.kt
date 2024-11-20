package com.example.document_store.controllers

import com.example.document_store.dtos.DocumentMetaDataDTO
import com.example.document_store.exceptions.DocumentNotFoundException
import com.example.document_store.exceptions.ProblemDetailsHandler
import com.example.document_store.services.DocumentServices
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.time.LocalDateTime
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication

@RestController
@RequestMapping("/API/documents")
class DocumentController(private val documentServices: DocumentServices) {

    /*
    @GetMapping("/prova", "/prova/")
    @PreAuthorize("hasAnyAuthority('ROLE_manager')")
    fun home(authentication: Authentication?): Map<String, Any?> {
        return mapOf("NAME" to "PROVAMI/", "principal" to authentication?.principal, "authorities" to authentication?.authorities)
    }
    */

    @GetMapping("", "/")
    fun getAllDocuments(@RequestParam ("page", defaultValue = "0")  @Min(value=0) page: Int,
                        @RequestParam ("limit", defaultValue = "10") @Min(value=1) limit: Int): ResponseEntity<List<DocumentMetaDataDTO>> {
            val documents = documentServices.getAllDocuments(page, limit)
            return ResponseEntity.ok(documents)
    }

    @GetMapping("/{id}", "/{id}/")
    fun getDocumentMetaData(@PathVariable @Positive id: Long): ResponseEntity<DocumentMetaDataDTO>{
        val document = documentServices.getDocumentMetaData(id)
        return ResponseEntity.ok(document)
    }

    @GetMapping("/{id}/data", "/{id}/data/")
    fun getDocumentData(@PathVariable id: Long): ResponseEntity<ByteArray>{

            val (data, metadata) = documentServices.getEntireDocument(id)
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename =\"${metadata.name}\"")
                .header(HttpHeaders.CONTENT_TYPE, metadata.content_type).body(data.content)

    }

    @PostMapping("/", "")
    @ResponseStatus(HttpStatus.CREATED)
    fun uploadDocument(
        @RequestParam file: MultipartFile
    ) : DocumentMetaDataDTO {
        // Check if document with the same name already exists
        return documentServices.create(
            file.originalFilename ?: "",
            file.size,
            file.contentType ?: "",
            LocalDateTime.now(),
            file.bytes
        )
    }

    @PutMapping("/{id}", "/{id}/")
    @ResponseStatus(HttpStatus.OK)
    fun updateDocument(
        @RequestParam file: MultipartFile,
        @PathVariable id : Long
    ) : DocumentMetaDataDTO {
        return documentServices.update(
            id,
            file.originalFilename ?: "",
            file.size,
            file.contentType ?: "",
            LocalDateTime.now(),file.bytes)
    }


    @DeleteMapping("/{id}", "/{id}/")
    fun deleteDocument(@PathVariable id: Long) {
        documentServices.deleteDocumentById(id)
    }
}












