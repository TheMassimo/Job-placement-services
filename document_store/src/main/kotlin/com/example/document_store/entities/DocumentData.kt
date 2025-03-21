package com.example.document_store.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "documents_data")
class DocumentData() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    var documentId: Long = 0

    @Column(name = "data")
    lateinit var data: ByteArray

    @OneToOne(mappedBy = "documentData", cascade = [CascadeType.ALL])
    lateinit var documentMetadata: DocumentMetadata
    override fun toString(): String {
        return "DocumentData(documentId=$documentId)"
    }
}

