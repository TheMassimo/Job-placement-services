export enum Channel {
    Email, Telephone, Other
}

export enum MessageStatus {
    RECEIVED,
    READ,
    DISCARDED,
    PROCESSING,
    DONE,
    FAILED
}

interface MessageRawData {
    messageId: number | null
    sender: string
    date: string
    subject: string | null
    body: string | null
    channel: Channel | null
    state: MessageStatus | null
    priority: number | null
}


export class Message implements MessageRawData {
    messageId: number | null
    sender: string
    date: string
    subject: string | null
    body: string | null
    channel: Channel
    priority: number | null
    state: MessageStatus | null

    constructor(
        messageId: number | null,
        sender: string,
        date: string,
        subject: string | null,
        body: string | null,
        channel: Channel,
        priority: number | null,
        state: MessageStatus | null,
    ) {
        this.messageId = messageId
        this.sender = sender
        this.date = date
        this.subject = subject
        this.body = body
        this.channel = channel
        this.priority = priority
        this.state = state
    }

    static fromJsonObject(obj: MessageRawData): Message | null {
        try {
            return new Message(
                obj.messageId,
                obj.sender,
                obj.date,
                obj.subject,
                obj.body,
                obj.channel,
                obj.priority,
                obj.state,
            )
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
