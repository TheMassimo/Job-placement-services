import React, {useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../App.css';  // Importa il file CSS
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import PopupContact from "./PopupContact";
import {JobOffersFilter} from "../api/crm/filters/JobOffersFilter.ts";
import {Pagination} from "../api/utils/Pagination.ts";
import {Card, Badge, Dropdown, ListGroup, ListGroupItem} from "react-bootstrap";
import SkillAPI from "../api/crm/SkillAPI.js";
import JobOffersAPI from "../api/crm/JobOffersAPI.js";
import { Row, Col, Toast } from 'react-bootstrap';

function Filters(props) {
    const setFilters = props.setFilters;
    const setCurrentPage = props.setCurrentPage;
    const mode = props.mode;
    const skills = props.skills;
    const [formFilters, setFormFilters] = useState(new JobOffersFilter(null, null, 0, 0, null));

    const handleSubmit = (event) => {
        event.preventDefault();
        //reset the number of page
        setCurrentPage(0);
        //update filters
        setFilters(new JobOffersFilter(
            formFilters.description,
            formFilters.status,
            formFilters.duration,
            formFilters.offerValue,
            formFilters.requiredSkills,
        ));
    };

    const handleFilterChange = (event) => {
        let {name, value} = event.target;
        //update state
        setFormFilters((old) => ({
            ...old,
            [name]: value,
        }));
    }

    const handleClear = (event) => {
        const tmpFilter = new JobOffersFilter(null, null, 0, 0, null);
        setFormFilters(tmpFilter);
        setFilters(tmpFilter);
    }

    return (
        <div style={{width: '30%', padding: '20px'}} className="filterBox">
            <h4 className={"offerTitle"}>Filters</h4>
            <Form.Group controlId="filterDescription" className="mb-3">
                <Form.Label>Filter by description</Form.Label>
                <Form.Control
                    type="text"
                    name="description"
                    placeholder="Enter Description"
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterStatus" className="mb-2">
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                    name="status"
                    value={formFilters.status ?? ""} // Imposta "all" come valore di default
                    onChange={handleFilterChange} // Funzione per gestire il cambiamento
                >
                    <option value="">All</option>
                    <option value="CREATED">Created</option>
                    <option value="ABORTED">Aborted</option>
                    <option value="SELECTION_PHASE">Selection phase</option>
                    <option value="CANDIDATE_PROPOSAL">Candidate proposal</option>
                    <option value="CONSOLIDATED">Consolidated</option>
                    <option value="DONE">Done</option>
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="filterDuration" className="mb-3">
                <Form.Label>Filter by duration</Form.Label>
                <Form.Control
                    type="text"
                    name="duration"
                    placeholder="Enter Duration"
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterOfferValue" className="mb-3">
                <Form.Label>Filter by value</Form.Label>
                <Form.Control
                    type="text"
                    name="offerValue"
                    placeholder="Enter Value"
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterSkill" className="mb-2">
                <Form.Label>Filter by Skill</Form.Label>
                <Form.Control
                    as="select"
                    name="requiredSkills"
                    value={formFilters.skills === null ? "" : formFilters.skills}
                    onChange={handleFilterChange}
                >
                    <option value="">All Skills</option>
                    {skills &&
                        skills
                            .sort((a, b) => a.skill.localeCompare(b.skill)) // Ordina alfabeticamente
                            .map((skill) => (
                                <option key={skill.skillId} value={skill.skill}>
                                    {skill.skill}
                                </option>
                            ))}
                </Form.Control>
            </Form.Group>
            <Button variant="danger" onClick={handleClear}>
                <i className="bi bi-x-circle"></i> Clear Filters
            </Button>
            <Button variant="primary" className="custom-button mx-3 my-1" onClick={handleSubmit}>
                <i className="bi bi-search"></i> Apply Filters
            </Button>
        </div>
    );
}


const ViewJobOffers = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [filters, setFilters] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(6);
    const [showModal, setShowModal] = useState(false); // Per gestire la visibilità del modale
    const [skills, setSkills] = useState([]);
    const [refreshContact, setRefreshContact] = useState(0);

    //USE Effect
    useEffect(() => {
        JobOffersAPI.GetJobOffers(filters, new Pagination(currentPage, pageSize)).then((res) => {
            setJobOffers(res);
            console.log("Massimo", res);
        }).catch((err) => console.log(err))
    }, [filters, currentPage, pageSize, refreshContact]);

    useEffect(() => {
        SkillAPI.GetSkills()
            .then((res) => {
                // Setta le skills
                setSkills(res);
                //console.log("skills", res);
            })
            .catch((err) => console.log(err));
    }, []); // Esegui solo una volta quando il componente viene montato

    const offset = currentPage * pageSize;


    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage + 1) * pageSize < jobOffers.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    //Per gestione modal
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const handleConfirmContact = (contact) => {
        navigate(`/jobOffers/add/${contact.contactId}`);
    }

    const handleSelect = (eventKey) => {
        const parsedValue = parseInt(eventKey, 10); // Converte l'eventKey in un numero intero
        setPageSize(parsedValue);
        //reset page
        setCurrentPage(0);
    };

    return (
        <div style={{display: 'flex', paddingTop: '90px'}}>
            {/* Sidebar for filters */}
            <Filters setFilters={setFilters} setCurrentPage={setCurrentPage} skills={skills} />

            {/* Main Content - Job Offers */}
            <div style={{flex: 1, padding: '20px'}}>
                <PopupContact showModal={showModal}
                              handleModalClose={handleModalClose}
                              toLoad={"Customer"}
                              handleConfirmContact={handleConfirmContact}/>

                <Button variant="success" className="float-end" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-circle"></i> Add new job offer
                </Button>
                <h2>Job Offers</h2>

                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className="custom-button m-2" id="dropdown-basic">
                        {pageSize ? `${pageSize} items` : "Select an option"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="6">6 items</Dropdown.Item>
                        <Dropdown.Item eventKey="12">12 items</Dropdown.Item>
                        <Dropdown.Item eventKey="24">24 items</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Job Offer Boxes */}
                <div className="offersContainer">
                    {jobOffers.map((offer) => (
                        <Card key={offer.jobOfferId} className="mb-4" style={{backgroundColor: '#f8f9fa'}}>
                            <Card.Body className="p-1">
                                <Card.Title>{offer.description}</Card.Title>
                                <div className="card-content-row">
                                    <div><strong>Duration:</strong> {offer.duration}</div>
                                    <div><strong>Status:</strong> {offer.status}</div>
                                </div>
                                <div className="card-content-row">
                                    <div><strong>Value:</strong> € {offer.offerValue}</div>
                                    <div>
                                        <strong>Required Skills:</strong> {offer.requiredSkills?.map(skill => skill.skill).join(', ')}
                                    </div>
                                </div>
                                <Row className="mt-3">
                                    <Col className="text-center">
                                        <Button variant="danger" className="bi bi-trash me-2"> </Button>

                                        <Button variant="warning" className="bi bi-pencil text-white"> </Button>
                                    </Col>
                                </Row>
                            </Card.Body>

                        </Card>
                    ))}
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <Button
                        className="m-3"
                        variant="outline-primary"
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                        }}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage + 1}</span>
                    <Button
                        className="m-3"
                        variant="outline-primary"
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                        }}
                        disabled={jobOffers.length < pageSize}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewJobOffers;
