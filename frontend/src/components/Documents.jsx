import {useEffect, useState} from "react";
import DocumentStoreAPI from "../api/document_store/DocumentStoreAPI.js";
import {Pagination} from "../api/utils/Pagination.ts";
import {DocumentMetadataFilter} from "../api/document_store/filters/DocumentMetadataFilter.ts";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function DocumentSearchBar({onFilterChange, filter}) {
    const [selectedStatuses, setSelectedStatuses] = useState(filter);
    const [openSelectedStatuses, setOpenSelectedStatuses] = useState(false);

    const handleStatusChange = (status) => {
        // Check if the status is already selected
        if (selectedStatuses.includes(status)) {
            // If yes, remove it from the list
            setSelectedStatuses(selectedStatuses.filter(s => s !== status));
        } else {
            // If no, add it to the list
            setSelectedStatuses([...selectedStatuses, status]);
        }
    };

    const handleSearch = () => {
        // Create filter object based on state
        const filter = {
            status: selectedStatuses.length ? selectedStatuses : null,
        };
        onFilterChange(filter);
    };

    return (
        <div className="flex justify-between gap-6 h-[10%] items-center">
            <div className="p-2 flex gap-4 border rounded-md shadow-md">
                <div className="relative w-48">
                    <button
                        className=" flex gap-4 w-full items-center appearance-nonebg-white hover:border-gray-500 px-4 py-2 pr-6 leading-tight focus:outline-none focus:shadow-outline"
                        onClick={() => setOpenSelectedStatuses(!openSelectedStatuses)}>
                        Status Selection
                        <Icon name={'arrowDown'} className={"w-2 h-2"}></Icon>
                    </button>
                    {
                        openSelectedStatuses
                            ?
                            <div
                                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
                                <div className="p-2 w-fit">
                                    {
                                        ['Curriculum', 'Contact', 'Attachment', 'Unknown',].map(status => (
                                            <div key={status}>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        value={status}
                                                        checked={selectedStatuses.includes(status)}
                                                        onChange={() => handleStatusChange(status)}
                                                    />
                                                    <span>{status}</span>
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>
            <button className="page-button" onClick={handleSearch}>Search</button>
        </div>
    );
}


// eslint-disable-next-line react/prop-types
function Documents({currentUser}) {
    const [data, setData] = useState([])
    const [load, setLoad] = useState(false)
    const [page, setPage] = useState(1);
    const [openFilter, setOpenFilter] = useState(false);
    const navigate = useNavigate(); // Hook per navigare
    const [filter, setFilter] = useState({
        type: [
            'Curriculum',
            'Contact',
            'Attachment',
            'Unknown',
        ]
    });

    useEffect(() => {
        // Function to fetch data
        const fetchDocuments = async () => {
            setLoad(true);
            try {
                const result = await DocumentStoreAPI.GetDocuments(new DocumentMetadataFilter(filter.type, null), new Pagination(page - 1, 8));
                setData(result);
            } catch (error) {
                console.error('Failed to fetch jobOffers:', error);
            } finally {
                setLoad(false);
            }
        };
        fetchDocuments();
    }, [page, filter]);


    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1)
    };

    useEffect(() => {
        DocumentStoreAPI.GetDocuments().then((result) => {
            setData(result)
        }).catch(err => console.log(err))
    }, [load])


    if (load) {
        return (
            <div style={{paddingTop: '90px'}}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (<>
            <div style={{paddingTop: '90px'}}>
                <div style={{paddingBottom: '10px'}}>
                    <Button variant="success" className="mx-2" onClick={() => navigate("/fileform")}>
                        <i className="bi bi-plus-circle p-1"></i> Add File
                    </Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Timestamp</th>
                        <th>Category</th>
                        <th>Actions</th>
                        {/* Aggiunto il titolo per la colonna delle azioni */}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((document, index) => (
                        <tr key={document.metadataId} className="hover:bg-stone-100 cursor-pointer">
                            <td>{index + 1}</td>
                            {/* Numero progressivo */}
                            <td>{document.name}</td>
                            <td>{document.size}</td>
                            <td>{document.timestamp}</td>
                            <td>{document.category}</td>
                            <td>
                                <div className="flex gap-2 items-center">
                                    {/*
                                    <Icon
                                        name="download"
                                        className="w-4 h-4 fill-blue-500 cursor-pointer"
                                        onClick={() => {
                                            DocumentStoreAPI.GetDocumentDataById(document.metadataId)
                                                .then(() => console.log("Download iniziato"))
                                                .catch((err) => console.error("Errore nel download:", err));
                                        }}
                                    >
                                        Download
                                    </Icon>
                                    */}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <div className="d-flex justify-content-center my-4">
                <Button variant="primary" className="mx-2" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <i className="bi bi-arrow-left"></i> Previous
                </Button>

                <Button variant="primary" className="mx-2" onClick={() => setPage(page + 1)}>
                    Next <i className="bi bi-arrow-right"></i>
                </Button>
            </div>
            <div className={"w-full flex-1 p-6 flex flex-col justify-between items-center"}>
                {
                    openFilter
                        ?
                        <DocumentSearchBar onFilterChange={handleFilterChange} filter={filter}/>
                        :
                        <></>
                }
            </div>
        </>
    )

}

export default Documents;
