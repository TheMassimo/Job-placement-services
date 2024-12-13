package com.example.crm.exeptions

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.multipart.MultipartException
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import com.fasterxml.jackson.databind.exc.InvalidFormatException
import com.fasterxml.jackson.databind.exc.MismatchedInputException
import org.springframework.http.*
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.context.request.WebRequest

data class ValidationErrorResponse(val errors: List<ValidationError>)
data class ValidationError(val field: String, val message: String)
@ControllerAdvice
class GlobalValidationExceptionHandler : ResponseEntityExceptionHandler() {
    override fun handleMethodArgumentNotValid(
        ex: MethodArgumentNotValidException,
        headers: HttpHeaders,
        status: HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any>? {
        val errors = ex.bindingResult.allErrors.map { error ->
            val field = (error as FieldError).field
            val message = error.defaultMessage ?: "Invalid value"
            ValidationError(field, message)
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors)
    }

    override fun handleHttpMessageNotReadable(
        ex: HttpMessageNotReadableException,
        headers: HttpHeaders,
        status: HttpStatusCode,
        request: WebRequest
    ): ResponseEntity<Any> {
        val errors = when (val cause = ex.cause) {
            is InvalidFormatException -> cause.path.map { reference ->
                ValidationError(reference.fieldName, "Invalid value")
            }

            is MismatchedInputException -> cause.path.map { reference ->
                ValidationError(reference.fieldName, "Invalid ${reference.fieldName}, it must not be null")
            }

            else -> listOf(ValidationError("body", "Malformed JSON request"))
        }
        val errorResponse = ValidationErrorResponse(errors)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse)
    }
}

@RestControllerAdvice
class ProblemDetailsHandler: ResponseEntityExceptionHandler(){

    @ExceptionHandler(MessageNotFoundException::class)
    fun handleMessageNotFound(e: MessageNotFoundException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!! )

    @ExceptionHandler(CustomerNotFoundException::class)
    fun handleCustomerNotFound(e: CustomerNotFoundException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!! )

    @ExceptionHandler(ProfessionalNotFoundException::class)
    fun handleProfessionalNotFound(e: ProfessionalNotFoundException) =
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



    @ExceptionHandler(ElementNotFoundException::class)
    fun handleElementNotFound(e: ElementNotFoundException) =
        ProblemDetail.forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!! )

    @ExceptionHandler(ProfessionalProcessingException::class)
    fun handleProfessionalProcessingException(e: ProfessionalProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(CustomerProcessingException::class)
    fun handleCustomerProcessingException(e: CustomerProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

    @ExceptionHandler(ContactProcessingException::class)
    fun handleContactProcessingException(e: ContactProcessingException): ResponseEntity<Any> {
        val problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            e.message ?: "Bad request"
        )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problemDetail)
    }

}