package com.example.document_store.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.Date

@Entity
class DocumentMetaData {
    @Id
    @GeneratedValue
    var id: Long = 0

    lateinit var name: String
    lateinit var size: Number
    lateinit var content_type: String
    lateinit var creation_timestamp: LocalDateTime

    @MapsId
    @OneToOne()
    var documentData: DocumentData? = null



}