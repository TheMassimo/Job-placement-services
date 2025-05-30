import {generateUrl} from "../utils/urlBuilder.js"
import {DocumentCategory, DocumentMetadata} from "./entities/DocumentMetadata.ts"
import {DocumentDTO} from "./entities/DocumentDTO.ts";
import {convertFileToBase64} from "../utils/converterFileToBase64.js";

const URL_DOCUMENT_STORE = 'http://localhost:8080/service_ds/API/documents'

async function GetDocuments(filter, pagination) {
    const response = await fetch(
        generateUrl(URL_DOCUMENT_STORE, filter, pagination), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => DocumentMetadata.fromJsonObject(e))
    } else {
        throw obj
    }
}

async function GetDocumentMetadataById(documentMetadataId) {
    const response = await fetch(
        generateUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return DocumentMetadata.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetDocumentDataById(documentMetadataId, filename) {
    /*const response = await fetch(
        generateUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}/data`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }*/

    const link = document.createElement('a');
    link.href = `${URL_DOCUMENT_STORE}/${documentMetadataId}/data`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function InsertNewDocument(file,category, xsrfToken) {
    const id = 42; // un ID mock valido (puoi scegliere qualsiasi intero)

    const base64File = await convertFileToBase64(file)
    const documentDTO = new DocumentDTO(file.name, file.size, base64File.split(';')[0].split(':')[1], category, id, base64File.split(',')[1])

    const response = await fetch(
        generateUrl(URL_DOCUMENT_STORE, null, null), {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(documentDTO)
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function UpdateDocument(documentMetadataId, file, category, id, xsrfToken) {
    const base64File = await convertFileToBase64(file)
    const documentDTO = new DocumentDTO(file.name, file.size, base64File.split(';')[0].split(':')[1], category, id, base64File.split(',')[1])

    const response = await fetch(
        generateUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
            body: JSON.stringify(documentDTO)
        })

    const obj = await response.json()

    if (response.ok) {
        return obj
    } else {
        throw obj
    }
}

async function DeleteDocument(documentMetadataId, xsrfToken) {
    const response = await fetch(
        generateUrl(`${URL_DOCUMENT_STORE}/${documentMetadataId}`, null, null), {
            method: 'DELETE',
            credentials: 'include',
            headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken},
        })

    const obj = await response.json()

    if (!response.ok) {
        throw obj
    }
}


const DocumentStoreAPI = {
    GetDocuments,
    GetDocumentMetadataById,
    GetDocumentDataById,
    InsertNewDocument,
    UpdateDocument,
    DeleteDocument
}

export default DocumentStoreAPI
