package com.example.cm.exeptions

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.MultipartException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler


@RestControllerAdvice
class ProblemDetailsHandler: ResponseEntityExceptionHandler(){

    @ExceptionHandler(MessageNotFoundException::class)
    fun handleMessageNotFound(e: MessageNotFoundException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!! )


    @ExceptionHandler(DuplicateMessageException::class)
    fun handleDuplicateMessage(e: DuplicateMessageException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.CONFLICT, e.message!! )

    @ExceptionHandler(BadParameterException::class)
    fun handleBadParameter(e: BadParameterException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.BAD_REQUEST, e.message!! )

    @ExceptionHandler(MultipartException::class)
    fun handleMultipartException(
        e: MultipartException
    ) =        ProblemDetail.forStatusAndDetail( HttpStatus.BAD_REQUEST, e.message!! )


    @ExceptionHandler(ContactNotFoundException::class)
    fun handleContactNotFound(e: ContactNotFoundException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!! )

}