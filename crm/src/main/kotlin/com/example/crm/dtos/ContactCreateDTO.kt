package com.example.crm.dtos

import com.example.crm.entities.Category


data class ContactCreateDTO(val name: String,
                            val surname: String,
                            val category: Category,
                            val ssnCode: String?,
                            val email: String?,
                            val address: String?,
                            val telephone: String?)

