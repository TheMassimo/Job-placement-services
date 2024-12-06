package com.example.crm.dtos


data class ContactCreateDTO(val name: String,
                            val surname: String,
                            val ssn: String?,
                            val email:  List<String>?,
                            val address: List<String>?,
                            val telephone: List<String>?)

