package com.example.crm.services

import com.example.crm.dtos.*
import com.example.crm.entities.MachineState
import com.example.crm.entities.Message
import com.example.crm.exeptions.BadParameterException
import com.example.crm.exeptions.MessageNotFoundException
import com.example.crm.repositories.MachineStateRepository
import com.example.crm.repositories.MessageRepository
import jakarta.persistence.criteria.CriteriaBuilder
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import jakarta.persistence.criteria.*
import jakarta.persistence.EntityManager

enum class State{
    RECEIVED,
    READ,
    DISCARDED,
    PROCESSING,
    DONE,
    FAILED;

    fun getStateFor( ) : List<State> {
        return stateMap[this] ?: emptyList() //empty list if state is a leaf, consider throwing something instead
    }

    companion object {
        private val stateMap = mapOf(
            RECEIVED to listOf(READ),
            READ to listOf(DISCARDED, PROCESSING, DONE, FAILED),
            PROCESSING to listOf(DONE, FAILED),
        )

    }
}

@Service
class MessageServicesImpl(private val entityManager: EntityManager,
                          private val messageRepository: MessageRepository,
                          private val machineStateRepository: MachineStateRepository) : MessageServices {

    private val logger: Logger = LoggerFactory.getLogger(MessageServices::class.java)

    override fun getAllMessages(
        sender: String?,
        channel: String?,
        state: State?,
        pageNumber: Int,
        pageSize: Int
    ): List<MessageDTO> {
        val cb: CriteriaBuilder = entityManager.criteriaBuilder
        val cqMessage: CriteriaQuery<Message> = cb.createQuery(Message::class.java)
        val rootMessage: Root<Message> = cqMessage.from(Message::class.java)

        val predicates = mutableListOf<Predicate>()

        if (!sender.isNullOrBlank()) {
            predicates.add(cb.like(cb.lower(rootMessage.get<String>("sender")), "${sender.lowercase()}%"))
        }

        if (!channel.isNullOrBlank()) {
            predicates.add(cb.like(cb.lower(rootMessage.get<String>("channel")), "${channel.lowercase()}%"))
        }

        if (state != null) {
            predicates.add(cb.equal(rootMessage.get<State>("state"), state))
        }


        // Combine all filters
        if (predicates.isNotEmpty()) {
            cqMessage.where(*predicates.toTypedArray())
        }

        cqMessage.orderBy(cb.asc(rootMessage.get<Long>("messageId")))

        val query = entityManager.createQuery(cqMessage)
        query.firstResult = pageNumber * pageSize
        query.maxResults = pageSize

        return query.resultList.map { it.toDto() }
    }

    override fun create(dto: MessageCreateDTO) : MessageDTO {
        val m = Message()
        val s = MachineState()

        val date = LocalDateTime.now()
        s.state = State.RECEIVED
        s.date = date
        s.comments = "Message created"

        machineStateRepository.save(s)

        m.sender = dto.sender
        m.date = date
        m.channel = dto.channel
        m.subject = dto.subject ?: ""
        m.body = dto.body ?: ""
        m.priority = 5
        m.addMachineState(s)


        val messageDTO = messageRepository.save(m).toDto()

        logger.info("Message successfully created")
        return messageDTO
    }

    override fun getMessage(id: Long): MessageDTO {
        val message = messageRepository.findByIdOrNull(id)
            ?: throw MessageNotFoundException("Message not found")
        logger.info("Message fetched successfully")
        return message.toDto()
    }

    override fun updateState(id: Long, state: String, comment: String): MessageDTO {
        val message = messageRepository.findByIdOrNull(id)
            ?: throw MessageNotFoundException("Message not found")

        val possibleStates = message.state.getStateFor()
        val newState : State
        try {
             newState = State.valueOf(state.uppercase())
        } catch (e: Exception){
            throw BadParameterException("$state is not a valid state")
        }
        if (!possibleStates.contains(newState)) {
            throw BadParameterException("Cannot transition to this state from " + message.state.name)
        }

        val s = MachineState()

        s.date = LocalDateTime.now()
        s.comments = comment
        s.state = newState

        message.addMachineState(s)
        machineStateRepository.save(s)

        message.state = newState
        messageRepository.save(message)

        logger.info("State successfully update")
        return message.toDto()
    }

    override fun getHistory(id: Long): List<MachineStateDTO> {
        val message = messageRepository.findByIdOrNull(id)
            ?: throw MessageNotFoundException("Message not found")

        logger.info("History fetched")
        return message.machineState.map { it.toDto() }
    }

    override fun updatePriority(id: Long, priority: Int): MessageDTO {
        val message = messageRepository.findByIdOrNull(id)
            ?: throw MessageNotFoundException("Message not found")

        message.priority = priority

        logger.info("Priority updated")
        return messageRepository.save(message).toDto()
    }
}