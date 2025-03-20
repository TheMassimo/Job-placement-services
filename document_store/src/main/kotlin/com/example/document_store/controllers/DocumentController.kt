package com.example.document_store.controllers

import com.example.document_store.dtos.DocumentDTO
import com.example.document_store.dtos.DocumentMetadataDTO
import com.example.document_store.exceptions.DocumentNotFoundException
import com.example.document_store.exceptions.ProblemDetailsHandler
import com.example.document_store.services.DocumentServices
import com.example.document_store.utils.DocumentCategory
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import java.time.LocalDateTime
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Positive
import org.springframework.http.*
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import java.util.*

@RestController
@RequestMapping("/API/documents")
@CrossOrigin(origins = ["http://localhost:5173"])
class DocumentController(private val documentServices: DocumentServices) {
    @PostMapping("", "/")
    @ResponseStatus(code = HttpStatus.CREATED)
    //@PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun insertNewDocument(@RequestBody newDocument: DocumentDTO): DocumentMetadataDTO {
        return documentServices.insertNewDocument(newDocument)
    }

    @PutMapping("/{metadataId}")
    //@PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun updateDocument(
        @PathVariable("metadataId") metadataId: Long,
        @RequestBody newDocument: DocumentDTO
    ): DocumentMetadataDTO {
        return documentServices.updateDocument(metadataId, newDocument)
    }

    @DeleteMapping("/{metadataId}")
    //@PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    fun deleteDocument(@PathVariable("metadataId") metadataId: Long) {
        documentServices.deleteDocument(metadataId)
    }

    @GetMapping("", "/")
    //@PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun getDocuments(
        @RequestParam("pageNumber", required = false) @Min(
            value = 0,
            message = "Page number not valid, value must be great or equal to 0"
        ) pageNumber: Int = 0,
        @RequestParam("pageSize", required = false) @Min(
            value = 1,
            message = "Page size not valid, value must be great or equal to 1"
        ) pageSize: Int = 20,
        @RequestParam(
            "category", required = false
        ) category: DocumentCategory?,
        @RequestParam(
            "id", required = false
        ) id: Long?
    ): List<DocumentMetadataDTO> {
        return documentServices.getDocuments(pageNumber, pageSize, category, id)
    }

    @GetMapping("/{metadataId}")
    //@PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun getDocumentMetadataById(@PathVariable("metadataId") metadataId: Long): DocumentMetadataDTO {
        return documentServices.getDocumentMetadataById(metadataId)
    }

    @GetMapping("/{metadataId}/data")
    //@PreAuthorize("hasAnyRole('ROLE_manager', 'ROLE_operator')")
    fun getDocumentDataById(@PathVariable("metadataId") metadataId: Long): ResponseEntity<ByteArray> {
        try {
            val documentMetadataDTO = documentServices.getDocumentMetadataById(metadataId)
            val documentDataDTO = documentServices.getDocumentDataById(metadataId)

            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${documentMetadataDTO.name}\"")
                .contentType(MediaType.parseMediaType(documentMetadataDTO.contentType))
                .body(Base64.getDecoder().decode(documentDataDTO.data))
        } catch (e: DocumentNotFoundException) {
            throw DocumentNotFoundException("Document data not found")
        }
    }
}












