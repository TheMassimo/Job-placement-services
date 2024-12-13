package com.example.crm.dtos

class JobOfferCreateDTO (val description: String,
                         val requiredSkills: List<Long>?,
                         val notes: String?,
                         val duration: Double,
                         val offerValue: Double,
)