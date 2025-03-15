export enum DocumentCategory {
    Curriculum,
    Contract,
    Attachment,
    Unknown
}

interface DocumentMetadataRawData {
    metadataId: number
    name: string
    size: number
    contentType: string
    timestamp: string
    category: DocumentCategory
    id: number
}

export class DocumentMetadata implements DocumentMetadataRawData {
    metadataId: number
    name: string
    size: number
    contentType: string
    timestamp: string
    category: DocumentCategory
    id: number

    constructor(
        metadataId: number,
        name: string,
        size: number,
        contentType: string,
        timestamp: string,
        category: DocumentCategory,
        id: number
    ) {
        this.metadataId = metadataId
        this.name = name
        this.size = size
        this.contentType = contentType
        this.timestamp = timestamp
        this.category = category
        this.id = id
    }

    static fromJsonObject(obj: DocumentMetadataRawData): DocumentMetadata | null {
        try {
            return new DocumentMetadata(obj.metadataId, obj.name, obj.size, obj.contentType, obj.timestamp, obj.category, obj.id)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
