package com.example.document_store.entities

import jakarta.persistence.*
import java.util.*

@Entity
class DocumentData() {
    @Id
    @GeneratedValue
    var id: Long = 0

    @Lob
    lateinit var content: ByteArray


    @OneToOne(mappedBy = "documentData", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var metaData: DocumentMetaData? = null



}

