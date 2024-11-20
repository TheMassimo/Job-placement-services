package com.example.document_store.exceptions

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler


@RestControllerAdvice
class ProblemDetailsHandler: ResponseEntityExceptionHandler(){

    @ExceptionHandler(DocumentNotFoundException::class)
    fun handleDocumentNotFound(e: DocumentNotFoundException): ResponseEntity<ProblemDetail> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.message!!)
        )

    @ExceptionHandler(DuplicateDocumentException::class)
    fun handleDuplicateDocument(e: DuplicateDocumentException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.CONFLICT, e.message!! )

    @ExceptionHandler(BadParameterException::class)
    fun handleBadParamater(e: BadParameterException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.BAD_REQUEST, e.message!! )

}