import React, { useEffect, useState } from 'react';
import DocumentStoreAPI from "../api/document_store/DocumentStoreAPI.js";
import { DocumentMetadataFilter } from "../api/document_store/filters/DocumentMetadataFilter.ts";
import { DocumentCategory } from "../api/document_store/entities/DocumentMetadata.ts";
import Button from 'react-bootstrap/Button';
import {useNotification} from "../contexts/NotificationProvider.jsx"
import {useNavigate, useParams} from "react-router-dom";

function FileUploadForm(props) {
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState(DocumentCategory.Curriculum); // Categoria selezionata
    const user = props.user;
    const { handleError, handleSuccess } = useNotification();
    const navigate = useNavigate();

    const [fileList, setFileList] = useState(null);
    const [load, setLoad] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            if (file) {
                DocumentStoreAPI.InsertNewDocument(file, category, user?.xsrfToken)
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));
                handleSuccess('File caricato con successo');
                navigate(`/documents`)
            }
        }
        catch (err){
            handleError(err);
        }

    };

    useEffect(() => {
        if (!load) {
            DocumentStoreAPI.GetDocuments(new DocumentMetadataFilter(DocumentCategory.Curriculum, 1), null)
                .then(r => setFileList(r))
                .catch((e) => console.log(e));
        }
    }, [load]);

    console.log(fileList);

    return (
        <div style={{ paddingTop: "90px" }}>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">
                        Seleziona un file:
                    </label>
                    <input type="file" id="file" className="form-control" onChange={handleFileChange}/>
                </div>

                <div>
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="0">Curriculum</option>
                        <option value="1">Contract</option>
                        <option value="2">Attachment</option>
                        <option value="3">Unknown</option>
                    </select>
                    <p>Valore selezionato: {category}</p>
                </div>

                <div style={{paddingTop: "10px"}}>
                    <Button type="submit" variant="success" className="mx-2">
                        Carica <i className="bi bi-cloud-arrow-up-fill"></i>
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FileUploadForm;
