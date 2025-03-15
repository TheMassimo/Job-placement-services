import React, {useEffect, useState} from 'react';
import DocumentStoreAPI from "../api/document_store/DocumentStoreAPI.js";
import {DocumentMetadataFilter} from "../api/document_store/filters/DocumentMetadataFilter.ts";
import {DocumentCategory} from "../api/document_store/entities/DocumentMetadata.ts";
import Button from 'react-bootstrap/Button';

function FileUploadForm({currentUser}) {
    const [file, setFile] = useState(null);

    const [fileList, setFileList] = useState(null);
    const [load, setLoad] = useState(false);

    // Funzione per gestire il cambiamento del file
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Funzione per gestire il submit del form
    const handleSubmit = (event) => {
        event.preventDefault();

        if (file) {
            DocumentStoreAPI.InsertNewDocument(file, currentUser.xsrfToken).then((res) => console.log(res)).catch((err) => console.log(err))
        } else {
            console.log('Nessun file selezionato');
        }
    };

    useEffect(() => {
        if (!load) {
            DocumentStoreAPI.GetDocuments(new DocumentMetadataFilter(DocumentCategory.Curriculum, 1), null)
                .then(r => setFileList(r)).catch((e) => console.log(e))
        }
    }, [load]);

    console.log(fileList)

    return (
        <div style={{ paddingTop: "90px" }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                        Seleziona un file:
                    </label>
                    <input type="file" id="file" className="form-control" onChange={handleFileChange} />
                </div>
                <div style={{ paddingTop: "10px" }}>
                    <Button type="submit" variant="success" className="mx-2">
                        Carica <i className="bi bi-cloud-arrow-up-fill"></i>
                    </Button>
                </div>
            </form>
        </div>
    );

};

export default FileUploadForm;
