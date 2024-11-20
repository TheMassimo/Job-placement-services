package com.example.document_store.services

import com.example.document_store.dtos.DocumentDataDTO
import com.example.document_store.dtos.DocumentMetaDataDTO
import com.example.document_store.entities.DocumentMetaData
import java.time.LocalDateTime
import java.util.Date

interface DocumentServices {
    fun getAllDocuments(page: Int, limit: Int): List<DocumentMetaDataDTO>

    fun getDocumentMetaData(id: Long): DocumentMetaDataDTO

    fun getEntireDocument(id: Long) : Pair<DocumentDataDTO, DocumentMetaDataDTO>

    fun create(name:String, size:Number, content_type:String, creationg_timestamp:LocalDateTime, content_data : ByteArray) : DocumentMetaDataDTO

    fun update(id:Long, name:String, size:Number, content_type: String, creationg_timestamp: LocalDateTime, content_data: ByteArray) : DocumentMetaDataDTO

    fun deleteDocumentById(id: Long)




    /*
    TEMPLATE
    fun create(name:String, size:Number, content_type:String, creationg_timestamp:Date) : DocumentMetaDataDTO

    fun listAll() : List<DocumentMetaDataDTO>

    fun findByName(name:String) : List<DocumentMetaDataDTO>

    fun findById(id:Long) : DocumentMetaDataDTO?

    fun delete(id:Long)
    */
}