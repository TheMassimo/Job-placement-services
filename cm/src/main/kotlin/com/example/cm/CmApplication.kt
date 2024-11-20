package com.example.cm

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CmApplication

fun main(args: Array<String>) {
	runApplication<CmApplication>(*args)
}
