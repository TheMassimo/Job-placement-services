import React, {useEffect, useState} from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import ContactAPI from "../api/crm/ContactAPI.js";
import {Pagination} from "../api/utils/Pagination.ts"
import {ContactFilter} from "../api/crm/filters/ContactFilter.ts";


function Filters(props) {
    const setFilters = props.setFilters;
    const mode = props.mode;
    const setCurrentPage = props.setCurrentPage;
    const [formFilters, setFormFilters] = useState(new ContactFilter(null, null, null, null, null, null, null, 0, null, null, null));

    const handleSubmit = (event) => {
        event.preventDefault();
        //reset the number of page
        setCurrentPage(0);
        //update filters
        setFilters(new ContactFilter(
            formFilters.name,
            formFilters.surname,
            formFilters.ssn,
            formFilters.email,
            formFilters.address,
            formFilters.telephone,
            mode, //category
            formFilters.jobOffers,
            formFilters.skills,
            formFilters.status,
            formFilters.geographicalInfo
        ));
    };

    const handleFilterChange = (event) => {
        let {name, value} = event.target;

        if (name !== "category" || name !== "modeCategory") {
            if (value === "") {
                value = null;
            }
            //update state
            setFormFilters((old) => ({
                ...old,
                [name]: value,
            }));
        }
    }

    const handleClear = (event) => {
        setFormFilters(new ContactFilter(null, null, null, null, null, null, null, 0, null, null, null));
        setFilters(null);
    }

    return (
        <>
            <h4 className={"filtersTitle"}>Filters</h4>
            <Form.Group controlId="filterName" className="mb-2">
                <Form.Label>Filter by Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formFilters.name === null ? "" : formFilters.name}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterSurname" className="mb-2">
                <Form.Label>Filter by Surname</Form.Label>
                <Form.Control
                    type="text"
                    name="surname"
                    placeholder="Enter surname"
                    value={formFilters.surname === null ? "" : formFilters.surname}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterSSN" className="mb-2">
                <Form.Label>Filter by SSN</Form.Label>
                <Form.Control
                    type="text"
                    name="ssn"
                    placeholder="Enter SSN"
                    value={formFilters.ssn === null ? "" : formFilters.ssn}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            {mode===null && (
                <>
                    <Form.Group controlId="filterEmail" className="mb-2">
                        <Form.Label>Filter by Email</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            placeholder="Enter email"
                            value={formFilters.email === null ? "" : formFilters.email}
                            onChange={handleFilterChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="filterTelephone" className="mb-2">
                        <Form.Label>Filter by Telephone</Form.Label>
                        <Form.Control
                            type="text"
                            name="telephone"
                            placeholder="Enter telephone"
                            value={formFilters.telephone === null ? "" : formFilters.telephone}
                            onChange={handleFilterChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="filterAddress" className="mb-2">
                        <Form.Label>Filter by Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Enter address"
                            value={formFilters.address === null ? "" : formFilters.address}
                            onChange={handleFilterChange}
                        />
                    </Form.Group>
                </>
            )}
            {mode==="Customer" && (
                <Form.Group controlId="filterJobOffer" className="mb-2">
                    <Form.Label>Filter by Job Offer</Form.Label>
                    <Form.Control
                        type="number"
                        name="jobOffer"
                        placeholder="Enter Job Offer Number"
                        value={formFilters.JobOffer}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
            )}
            {mode==="Professional" && (
                <>
                    <Form.Group controlId="filterSkill" className="mb-2">
                        <Form.Label>Filter by Skill</Form.Label>
                        <Form.Control
                            type="text"
                            name="skill"
                            placeholder="Enter Skill"
                            value={formFilters.skill}
                            onChange={handleFilterChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="filterStatus" className="mb-2">
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Control
                            type="text"
                            name="status"
                            placeholder="Enter Status"
                            value={formFilters.status}
                            onChange={handleFilterChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="filterGeographicalInfo" className="mb-2">
                        <Form.Label>Filter by Geographical Info</Form.Label>
                        <Form.Control
                            type="text"
                            name="geographicalInfo"
                            placeholder="Enter Geographical Info"
                            value={formFilters.GeographicalInfo}
                            onChange={handleFilterChange}
                        />
                    </Form.Group>
                </>
            )}
            <div className="d-flex justify-content-center align-items-center">
                <Button variant="danger" className="mx-3 my-1" onClick={handleClear}>
                    Clear Filters
                </Button>
                <Button variant="primary" className="custom-button mx-3 my-1" onClick={handleSubmit}>
                    <i className="bi bi-search" style={{marginRight: '10px'}}></i>
                    Find
                </Button>
            </div>
        </>
    );
}

const CustomerTable = ({ contacts, onSelectCustomer }) => {
    const [selectedPerson, setSelectedPerson] = useState("");

    const handleRowClick = (customerId) => {
        console.log("Row clicked, customerId:", customerId);  // Log per vedere quale customerId viene passato
        setSelectedPerson(customerId);
        if (onSelectCustomer) {
            onSelectCustomer(customerId); // Comunica al genitore il cliente selezionato
        }
    };

    console.log("Contacts passed to the table:", contacts);  // Log per vedere i contatti passati alla tabella
    console.log("Selected Person:", selectedPerson);  // Log per vedere quale persona è stata selezionata

    return (

        <div>
            <h4>Select a customer:</h4>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>SSN code</th>
                    <th>Job offers</th>
                </tr>
                </thead>
                <tbody>
                {contacts.map((contact, index) => (
                    <tr
                        key={index}
                        onClick={() => handleRowClick(contact.customer?.customerId)}
                        style={{
                            cursor: "pointer",
                            backgroundColor: selectedPerson === contact.customer?.customerId ? "#d3f9d8" : "white",
                        }}
                    >
                        <td>{index + 1}</td>
                        <td>{contact.name}</td>
                        <td>{contact.surname}</td>
                        <td>{contact.ssn}</td>
                        <td>{contact.customer?.jobOffers}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {selectedPerson && (
                <div>
                    <p>
                        <strong>Selected Customer ID:</strong> {selectedPerson}
                    </p>
                </div>
            )}
        </div>
    );
};

function AddJobOfferButton(props) {
    const [selectedPerson, setSelectedPerson] = useState(""); // Per memorizzare il cliente selezionato
    const navigate = useNavigate(); // Per navigare a un'altra pagina
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const showModal = props.showModal;
    const handleModalClose = props.handleModalClose;
    const pageSize = 10;
    const mode = props.mode;
    const [filter, setFilter] = useState(new ContactFilter(null, null, null, null, null, null, mode, null, null, null, null));


    //USE Effect
    useEffect(() => {
        ContactAPI.GetContacts(filter, new Pagination(currentPage, pageSize)).then((res) => {
            setContacts(res);
            console.log("Massimo");
        }).catch((err) => console.log(err))
    }, [filter, currentPage]);

    const handlePersonSelection = () => {
        if (selectedPerson) {
            navigate("/addNewJobOffer", { state: { customer: selectedPerson } });
        }
    };

    return (
        <>
            {/* Modale */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Filters mode = {mode} setFilter={setFilter} currentPage={currentPage} />
                        <CustomerTable contacts={contacts} onSelectCustomer={(customerId) => setSelectedPerson(customerId)}/>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handlePersonSelection}
                        disabled={!selectedPerson}
                    >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddJobOfferButton;
