package com.example.document_store.exceptions

class DocumentNotFoundException(message: String?) : RuntimeException(message)

class DuplicateDocumentException(message: String?) : RuntimeException(message)

class MissingServletRequestParameterException(message: String?) : RuntimeException(message)

class InvalidFileException(message: String?) : RuntimeException(message)
class DocumentProcessingException(message: String?, cause: Throwable? = null) : RuntimeException(message, cause)
