package com.example.document_store.dtos

import com.example.document_store.entities.DocumentData
import com.example.document_store.entities.DocumentMetaData
import java.util.*

data class DocumentDataDTO(
    val id: Long,
    val content: ByteArray,
)

fun DocumentData.toDto(): DocumentDataDTO =
    DocumentDataDTO(this.id, this.content)


