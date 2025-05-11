import {generateUrl} from "../utils/urlBuilder.js"
import {Message} from "./entities/Message.ts"

const URL_MESSAGES = 'http://localhost:8080/service_crm/API/messages'

async function GetMessages(filter, pagination) {
    const response = await fetch(
        generateUrl(URL_MESSAGES, filter, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj
            .map((e) => Message.fromJsonObject(e))
            .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordina per data
    } else {
        throw obj
    }
}

async function GetMessageById(messageId) {
    const response = await fetch(
        generateUrl(`${URL_MESSAGES}/${messageId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function InsertNewMessage(message, ) {
    const response = await fetch(
        generateUrl(URL_MESSAGES, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(message)
        })

    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdatePriorityOfMessage(messageId, priority, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_MESSAGES}/${messageId}/priority`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: priority
        })

    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function UpdateStatusOfMessage(messageId, newState, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_MESSAGES}/${messageId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: newState
        })

    const obj = await response.json()

    if (response.ok) {
        return Message.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const MessageAPI = {
    GetMessages,
    GetMessageById,
    InsertNewMessage,
    UpdatePriorityOfMessage,
    UpdateStatusOfMessage
}

export default MessageAPI
