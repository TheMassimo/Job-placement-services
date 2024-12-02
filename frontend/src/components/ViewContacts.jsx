import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ContactAPI from "../api/crm/ContactAPI.js";
import {ContactFilter} from "../api/crm/filters/ContactFilter.ts";
import {Card, Badge, ListGroup, ListGroupItem} from "react-bootstrap";
import {Row, Col} from "react-bootstrap"

function Filters(props) {
    const setFilters = props.setFilters;
    const [formFilters, setFormFilters] = useState(new ContactFilter(null, null, null, null, null, null, null, 0));

    const handleSubmit = (event) => {
        event.preventDefault();

        setFilters(new ContactFilter(
            formFilters.name,
            formFilters.surname,
            formFilters.category,
            formFilters.email,
            formFilters.address,
            formFilters.ssn,
            formFilters.telephone,
            formFilters.jobOffers
        ));
    };

    const handleFilterChange = (event) => {
        let {name, value} = event.target;

        if (name !== "category") {
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
        setFormFilters(new ContactFilter(null, null, null, null, null, null, null, 0));
        setFilters(null);
    }

    return (
        <>
            <h4 className={"offerTitle"}>Filters</h4>
            <Form.Group controlId="filterName" className="mb-3">
                <Form.Label>Filter by Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formFilters.name === null ? "" : formFilters.name}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterSurname" className="mb-3">
                <Form.Label>Filter by Surname</Form.Label>
                <Form.Control
                    type="text"
                    name="surname"
                    placeholder="Enter surname"
                    value={formFilters.surname === null ? "" : formFilters.surname}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterSSN" className="mb-3">
                <Form.Label>Filter by SSN</Form.Label>
                <Form.Control
                    type="text"
                    name="ssn"
                    placeholder="Enter SSN"
                    value={formFilters.ssn === null ? "" : formFilters.snnCode}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterJobOffer" className="mb-3">
                <Form.Label>Filter by Job Offer</Form.Label>
                <Form.Control
                    type="number"
                    name="JobOffer"
                    placeholder="Enter Job Offer Number"
                    value={formFilters.JobOffer}
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <div className="d-flex justify-content-center align-items-center">
                <Button variant="secondary" className="me-5" onClick={handleClear}>
                    Clear Filters
                </Button>
                <Button variant="primary" className="me-5" onClick={handleSubmit}>
                    <i className="bi bi-search" style={{marginRight: '10px'}}></i>
                    Find
                </Button>
            </div>
        </>
    );
}



function ViewContacts(props) {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [filters, setFilters] = useState(new ContactFilter());
    const [currentPage, setCurrentPage] = useState(1);

    //USE Effect
    useEffect(() => {
        ContactAPI.GetContacts(filters, currentPage).then((res) => {
            setContacts(res);
            console.log("Contacts ->", res);
        }).catch((err) => console.log(err))
    }, [filters, currentPage]);


    // LOCAL VARIABLES
    const itemsPerPage = 5;
    // Pagina corrente dei clienti da visualizzare
    const offset = currentPage * itemsPerPage;

    // FUNCTIONS
    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage) * itemsPerPage < contacts.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <div style={{paddingTop: '90px', display: 'flex', flexDirection: 'row'}}>

            {/* Filtri */}
            <div style={{width: '30%', padding: '20px'}} className="filterBox">
                <Filters setFilters={setFilters}/>
            </div>

            {/* Tabella */}
            <div style={{width: '70%', padding: '20px'}}>
                <h2>Contacts List</h2>

                {/* Ordinamento per cognome */}
                <div className="mb-3">
                    <Button
                        variant="outline-primary"
                        onClick={() => console.log("pressed")}
                    >
                        Do somethong ({/* bla bla*/})
                    </Button>
                </div>

                {contacts.length > 0 ?
                    <>
                    {contacts.map((contact) => (
                        <Card key={contact.contactId} className="p-0 m-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                {/* Nome a sinistra */}
                                <span><Card.Title>Massimo Porcheddu</Card.Title></span>

                                {/* Pulsanti a destra */}
                                <div>
                                    {(contact.category === "Customer" || contact.category === "CustomerProfessional") ? (
                                        <Badge pill bg="secondary" className="me-2">
                                            Customer
                                        </Badge>
                                    ) : null}
                                    {(contact.category === "Professional" || contact.category === "CustomerProfessional") ? (
                                        <Badge pill bg="secondary" className="me-2">
                                            Professional
                                        </Badge>
                                    ) : null}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {/* Prima colonna - Email */}
                                    <Col xs={12} md={4}>
                                        <h6>Email</h6>
                                        {contact.email.map((emailObj) => (
                                            <div key={emailObj.emailId}>{emailObj.email}</div>
                                        ))}
                                    </Col>

                                    {/* Seconda colonna - Indirizzi */}
                                    <Col xs={12} md={4}>
                                        <h6>Addresses</h6>
                                        {contact.address.map((addressObj) => (
                                            <div key={addressObj.addressId}>{addressObj.address}</div>
                                        ))}
                                    </Col>

                                    {/* Terza colonna - Numeri di telefono */}
                                    <Col xs={12} md={4}>
                                        <h6>Telephone</h6>
                                        {contact.telephone.map((telephoneObj) => (
                                            <div key={telephoneObj.telephoneId}>{telephoneObj.telephone}</div>
                                        ))}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        ))}
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                variant="outline-primary"
                                onClick={() => changePage("prev")}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span>Page {currentPage} of {Math.ceil(contacts.length / itemsPerPage)}</span>
                            <Button
                                variant="outline-primary"
                                onClick={() => changePage("next")}
                                disabled={(currentPage) * itemsPerPage >= contacts.length}
                            >
                                Next
                            </Button>
                        </div>
                        <Button variant="primary" className="mt-4" onClick={() => navigate(`/contact/add`)}>
                            Add Customer
                        </Button>
                    </>
                    :
                    <div> Nessun contatto disponibile </div>}
            </div>
        </div>
    );
}

export default ViewContacts;
