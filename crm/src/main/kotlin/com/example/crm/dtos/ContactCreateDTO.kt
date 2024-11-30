package com.example.crm.dtos

import com.example.crm.entities.Category


data class ContactCreateDTO(val name: String,
                            val surname: String,
                            val category: Category,
                            val ssnCode: String?,
                            val email:  List<String>?,
                            val address: List<String>?,
                            val telephone: List<String>?)

