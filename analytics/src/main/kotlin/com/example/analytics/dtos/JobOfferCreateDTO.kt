package com.example.analytics.dtos

class JobOfferCreateDTO (val description: String,
                         val requiredSkills: String,
                         val notes: String,
                         val duration: Double,
                         val offerValue: Double,
                         //val professional: List<ProfessionalDTO>,
                         //val customer: Contact
)