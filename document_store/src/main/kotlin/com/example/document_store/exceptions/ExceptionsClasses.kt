package com.example.document_store.exceptions

class DocumentNotFoundException(message: String) : RuntimeException(message)
class DuplicateDocumentException(message: String) : RuntimeException(message)
class BadParameterException(message: String) : RuntimeException(message)