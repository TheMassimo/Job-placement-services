import React, {useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../App.css';  // Importa il file CSS
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

import JobOffersAPI from "../api/crm/JobOffersAPI.js";



const ViewJobOffers = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [filter, setFilter] = useState({
        status: '',
        value: '',
        duration:''

    });

    const [tempFilter, setTempFilter] = useState({ ...filter });

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Gestione dei filtri temporanei
    const handleTempFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilter({ ...tempFilter, [name]: value });
    };

    // Applica i filtri
    const applyFilters = () => {
        setFilter({ ...tempFilter });
    };

    // Resetta i filtri
    const clearFilters = () => {
        setFilter({ location: '', contractType: '', workMode: '', status: '' });
        setTempFilter({ location: '', contractType: '', workMode: '', status: '' });
    };

    // Filtraggio delle offerte di lavoro
    const filteredJobOffers = jobOffers.filter((offer) => {
        return (
            (filter.status ? offer.status.includes(filter.status) : true) &&
            (filter.value ? offer.value.includes(filter.value) : true) &&
            (filter.duration ? offer.duration.includes(filter.duration) : true)
        );
    });



//USE Effect
    useEffect(() => {
        JobOffersAPI.GetJobOffers(filter, currentPage).then((res) => {
            setJobOffers(res);
            console.log("Massimo", res);
        }).catch((err) => console.log(err))
    }, [filter, currentPage]);




    const offset = currentPage * itemsPerPage;


    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage + 1) * itemsPerPage < filteredJobOffers.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={{display: 'flex', paddingTop: '90px'}}>
            {/* Sidebar for filters */}
            <div style={{width: '30%', padding: '20px'}} className="filterBox">
                <h4 className={"offerTitle"}>Filters</h4>
                <Form.Group controlId="filterStatus" className="mb-3">
                    <Form.Label>Filter by status</Form.Label>
                    <Form.Control
                        type="text"
                        name="status"
                        placeholder="Enter Status"
                        value={tempFilter.status}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterValue" className="mb-3">
                    <Form.Label>Filter by value</Form.Label>
                    <Form.Control
                        type="text"
                        name="value"
                        placeholder="Enter Value"
                        value={tempFilter.value}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterDuration" className="mb-3">
                    <Form.Label>Filter by duration</Form.Label>
                    <Form.Control
                        type="text"
                        name="duration"
                        placeholder="Enter Duration"
                        value={tempFilter.duration}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Button variant="secondary" className="me-2 custom-button" onClick={applyFilters} >
                    <i className="bi bi-search"></i>  Apply Filters
                </Button>
                <Button variant="secondary" onClick={clearFilters}>
                    <i className="bi bi-x-circle"></i>  Clear Filters
                </Button>
            </div>

            {/* Main Content - Job Offers */}
            <div style={{flex: 1, padding: '20px'}}>
                <Button variant="secondary" className="float-end custom-button">
                    <i className="bi bi-plus-circle"></i> Add new job offer
                </Button>
                <h2>Job Offers</h2>


                {/* Job Offer Boxes */}
                <div className="offersContainer">
                    {jobOffers.map((offer) => (
                        <div key={offer.jobOfferId} className="offerBox">
                            <h3 className="offerTitle">{offer.description}</h3>
                            <div className="offerDetails">
                                <div><strong>Duration:</strong> {offer.duration}</div>
                                <div><strong>Description:</strong> {offer.description}</div>
                                <div><strong>Value:</strong> € {offer.offerValue}</div>
                                <div><strong>Status:</strong> {offer.status}</div>
                                <div><strong>Required Skills:</strong> {offer.requiredSkills?.map(skill => skill.skill).join(', ')}</div>
                                <div><strong>Notes:</strong> {offer.notes}</div>
                            </div>
                        </div>
                        ))}
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("prev")}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {Math.ceil(jobOffers.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage) * itemsPerPage >= filteredJobOffers.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewJobOffers;
