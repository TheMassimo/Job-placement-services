package com.example.analytics.analytics_dtos

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class KafkaMessageDTO<T> (
    val before: T?,
    val after: T?,
    val source: SourceInfo?,
    val op: String?,
    val tsMillis: Long?,
    val transaction: Any?
)

@JsonIgnoreProperties(ignoreUnknown = true)
data class SourceInfo(
    val version: String,
    val connector: String,
    val name: String,
    val tsMillis: Long,
    val snapshot: String?,
    val db: String,
    val sequence: String?,
    val schema: String,
    val table: String,
    val txId: Long?,
    val lsn: Long?,
    val xmin: Long?
)
