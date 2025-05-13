export class MessageFilter {
    sender: string | null
    channel: string | null
    state: string | null

    constructor(
        sender: string | null,
        channel: string | null,
        state: string | null
    ){

        if (sender?.trim() === "") {
            this.sender = null
        } else {
            this.sender = sender
        }
        if (channel?.trim() === "") {
            this.channel = null
        } else {
            this.channel = channel
        }
        if (state?.trim() === "") {
            this.state = null
        } else {
            this.state = state
        }
    }
}



