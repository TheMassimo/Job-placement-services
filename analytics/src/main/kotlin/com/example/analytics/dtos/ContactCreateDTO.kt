package com.example.analytics.dtos



data class ContactCreateDTO(val name: String,
                            val surname: String,
                            val category: String,
                            val ssnCode: String?,
                            val email: String?,
                            val address: String?,
                            val telephone: String?)

