package com.example.document_store.services

import com.example.document_store.dtos.DocumentDTO
import com.example.document_store.dtos.DocumentDataDTO
import com.example.document_store.dtos.DocumentMetadataDTO
import com.example.document_store.utils.DocumentCategory
import java.time.LocalDateTime

interface DocumentServices {
    fun insertNewDocument(newDocument: DocumentDTO): DocumentMetadataDTO

    fun updateDocument(id: Long, newDocument: DocumentDTO): DocumentMetadataDTO

    fun deleteDocument(id: Long)

    fun getDocuments(pageNumber: Int, pageSize: Int, category: DocumentCategory?, id: Long?): List<DocumentMetadataDTO>

    fun getDocumentMetadataById(id: Long): DocumentMetadataDTO

    fun getDocumentDataById(id: Long): DocumentDataDTO
}