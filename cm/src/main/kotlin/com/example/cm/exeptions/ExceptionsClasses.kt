package com.example.cm.exeptions

import org.springframework.web.multipart.MultipartException

class MessageNotFoundException(message: String) : RuntimeException(message)
class DuplicateMessageException(message: String) : RuntimeException(message)
class BadParameterException(message: String) : RuntimeException(message)

class NoFileExeption(message: String) : MultipartException(message)

class ContactNotFoundException(message: String) : RuntimeException(message)