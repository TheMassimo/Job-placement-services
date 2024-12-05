import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {ContactFilter} from "../api/crm/filters/ContactFilter.ts";
import {Card, Badge, Dropdown, ListGroup, ListGroupItem} from "react-bootstrap";
import {Row, Col} from "react-bootstrap"
import {Pagination} from "../api/utils/Pagination.ts";
import ContactAPI from "../api/crm/ContactAPI.js";
import SkillAPI from "../api/crm/SkillAPI.js";

function Filters(props) {
    const setFilters = props.setFilters;
    const setCurrentPage = props.setCurrentPage;
    const mode = props.mode;
    const skills = props.skills;
    const [formFilters, setFormFilters] = useState(new ContactFilter(null, null, null, null, null, null, mode, null, null, null, null));

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
        const tmpFilter = new ContactFilter(null, null, null, null, null, null, mode, null, null, null, null)
        setFormFilters(tmpFilter);
        setFilters(tmpFilter);
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
                <Form.Group controlId="filterJobOffers" className="mb-2">
                    <Form.Label>Filter by Job Offer</Form.Label>
                    <Form.Control
                        type="number"
                        name="jobOffers"
                        placeholder="Enter Job Offer Number"
                        value={formFilters.jobOffers === null ? 0 : formFilters.jobOffers}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
            )}
            {mode==="Professional" && (
                <>
                <Form.Group controlId="filterSkill" className="mb-2">
                    <Form.Label>Filter by Skill</Form.Label>
                    <Form.Control
                        as="select"
                        name="skills"
                        value={formFilters.skills === null ? "" : formFilters.skills}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Skills</option>
                        {skills && skills.map((skill) => (
                            <option key={skill.skillId} value={skill.skillId}>
                                {skill.skill}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="filterStatus" className="mb-2">
                    <Form.Label>Filter by Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={formFilters.status ?? ""} // Imposta "all" come valore di default
                        onChange={handleFilterChange} // Funzione per gestire il cambiamento
                    >
                        <option value="">All</option>
                        <option value="UNEMPLOYED">Unemployed</option>
                        <option value="BUSY">Busy</option>
                        <option value="EMPLOYED">Employed</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="filterGeographicalInfo" className="mb-2">
                    <Form.Label>Filter by Geographical Info</Form.Label>
                    <Form.Control
                        type="text"
                        name="geographicalInfo"
                        placeholder="Enter Geographical Info"
                        value={formFilters.geographicalInfo === null ? "" : formFilters.geographicalInfo}
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

function ContactCard(props) {
    const contact = props.contact;

    return(
        <Card  className="p-0 m-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Row className="w-100">
                    <Col xs={4} className="text-start">
                        {/* Nome a sinistra */}
                        <Card.Title>
                            {contact.name} {contact.surname}
                        </Card.Title>
                    </Col>
                    <Col>
                        <span className="custom-text">
                            <Card.Title>ssn: {contact.ssn}</Card.Title>
                        </span>
                    </Col>
                    <Col xs={4} className="text-end">
                        {(contact.category === "Customer" || contact.category === "CustomerProfessional") ? (
                            <Badge pill bg="success" className="me-2">
                                Customer
                            </Badge>
                        ) : null}
                        {(contact.category === "Professional" || contact.category === "CustomerProfessional") ? (
                            <Badge pill bg="success" className="me-2">
                                Professional
                            </Badge>
                        ) : null}
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    {/* Prima colonna - Email */}
                    <Col xs={12} md={4}>
                        <h6>Email</h6>
                        {contact.email
                            .slice() // Copia l'array
                            .sort((a, b) => a.email.localeCompare(b.email)) // Ordina alfabeticamente
                            .map((emailObj) => (
                                <div key={emailObj.emailId}>{emailObj.email}</div>
                            ))}
                    </Col>

                    {/* Seconda colonna - Indirizzi */}
                    <Col xs={12} md={4}>
                        <h6>Addresses</h6>
                        {contact.address
                            .slice() // Copia l'array
                            .sort((a, b) => a.address.localeCompare(b.address)) // Ordina alfabeticamente
                            .map((addressObj) => (
                                <div key={addressObj.addressId}>{addressObj.address}</div>
                            ))}
                    </Col>

                    {/* Terza colonna - Numeri di telefono */}
                    <Col xs={12} md={4}>
                        <h6>Telephone</h6>
                        {contact.telephone
                            .slice() // Copia l'array
                            .sort((a, b) => a.telephone.localeCompare(b.telephone)) // Ordina alfabeticamente
                            .map((telephoneObj) => (
                                <div key={telephoneObj.telephoneId}>{telephoneObj.telephone}</div>
                            ))}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

function CustomerCard(props) {
    const contact = props.contact;

    return(
        <Card  className="p-0 m-1">
            <Card.Body>
                <Row>
                    <Col className="text-start" xs={4}>
                        <Card.Title className="">{contact.name} {contact.surname}</Card.Title>
                    </Col>
                    <Col className="text-center" xs={4}>
                        <span className="custom-text">
                            <Card.Title>ssn: {contact.ssn}</Card.Title>
                        </span>
                    </Col>
                    <Col className="text-center" xs={4}>
                        <span>{contact.customer?.jobOffers?.length | 0} job offers</span>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

function ProfessionalCard(props) {
    const contact = props.contact;

    return(
        <Card  className="p-0 m-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Row className="w-100">
                    <Col xs={4} className="text-start">
                        {/* Nome a sinistra */}
                        <Card.Title>
                            {contact.name} {contact.surname}
                        </Card.Title>
                    </Col>
                    <Col xs={4}>
                        <span className="custom-text">
                            <Card.Title>ssn: {contact.ssn}</Card.Title>
                        </span>
                    </Col>
                    <Col xs={4} className="text-end">
                        <Badge
                            pill
                            className={`me-1 ${
                                contact.professional?.employment === "UNEMPLOYED"
                                    ? "bg-danger"
                                    : contact.professional?.employment === "BUSY"
                                    ? "bg-warning"
                                    : contact.professional?.employment === "EMPLOYED"
                                    ? "bg-success"
                                    : "bg-secondary"
                            }`}
                        >
                            {contact.professional?.employment}
                        </Badge>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <Row>
                    Nation: {contact.professional?.geographicalInfo || "N/A"}
                </Row>
                <Row>
                    Skills: {contact.professional?.skills && contact.professional.skills.length > 0
                    ? contact.professional.skills
                        .slice() // Copia l'array per evitare di mutare i dati originali
                        .sort((a, b) => a.skill.localeCompare(b.skill)) // Ordina alfabeticamente
                        .map(skill => skill.skill)
                        .join(", ") // Usa una virgola o uno spazio per separare le skill
                    : "No skills available"}
                </Row>
            </Card.Body>
        </Card>
    );
}


function ViewContacts(props) {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [filters, setFilters] = useState(new ContactFilter());
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [mode, setMode] = useState(null);
    const [skills, setSkills] = useState([]);

    //USE Effect
    useEffect(() => {
        ContactAPI.GetContacts(filters, new Pagination(currentPage, pageSize)).then((res) => {
            //get data
            setContacts(res);
            console.log("CONTACTS ",res);
        }).catch((err) => console.log(err))
    }, [filters, currentPage, pageSize]);

    useEffect(() => {
        SkillAPI.GetSkills()
            .then((res) => {
                // Setta le skills
                setSkills(res);
                console.log("skills", res);
            })
            .catch((err) => console.log(err));
    }, []); // Esegui solo una volta quando il componente viene montato

    // FUNCTIONS
    const changeMode = (newMode) => {
        setMode(newMode)
        //update state of filters
        setFilters((old) => ({
            ...old,
            ["category"]: newMode,
        }));
        //reset page
        setCurrentPage(0);
    };

    const handleSelect = (eventKey) => {
        const parsedValue = parseInt(eventKey, 10); // Converte l'eventKey in un numero intero
        setPageSize(parsedValue);
    };

    return (
        <div style={{paddingTop: '90px', display: 'flex', flexDirection: 'row'}}>

            {/* Filtri */}
            <div style={{width: '30%', padding: '20px'}} className="filterBox">
                <Filters setFilters={setFilters} setCurrentPage={setCurrentPage} mode={mode} skills={skills} />
            </div>

            {/*Center of the page*/}
            <div style={{width: '70%', padding: '10px'}}>

                {/* Choose from:  Contact, Customer, Professional */}
                <div className="mb-3">
                    <Button className={mode == null ? "custom-button m-2" : "m-2"}
                            variant="secondary"
                            onClick={() => changeMode(null)}
                    >
                        Contacts
                    </Button>
                    <Button className={mode == "Customer" ? "custom-button m-2" : "m-2"}
                            variant="secondary"
                            onClick={() => changeMode("Customer")}
                    >
                        Customers
                    </Button>
                    <Button className={mode == "Professional" ? "custom-button m-2" : "m-2"}
                            variant="secondary"
                            onClick={() => changeMode("Professional")}
                    >
                        Professionals
                    </Button>
                </div>

                {/*Title of list*/}
                <h2>{mode === null ? "Contacts" : mode+"s"} list:</h2>
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className="custom-button m-2"  id="dropdown-basic">
                        {pageSize ? `${pageSize} items` : "Select an option"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="5">5 items</Dropdown.Item>
                        <Dropdown.Item eventKey="10">10 items</Dropdown.Item>
                        <Dropdown.Item eventKey="20">20 items</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/*Show all contacts*/}
                {contacts.length > 0 ?
                    <>
                        {contacts.map((contact) => {
                            if (mode === "Customer") {
                                return <CustomerCard key={contact.contactId} contact={contact} />;
                            } else if (mode === "Professional") {
                                return <ProfessionalCard key={contact.contactId} contact={contact} />;
                            } else {
                                return <ContactCard key={contact.contactId} contact={contact} />;
                            }
                        })}
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                className="m-3"
                                variant="outline-primary"
                                onClick={() => {setCurrentPage(currentPage - 1);}}
                                disabled={currentPage === 0}
                            >
                                Previous
                            </Button>
                            <span>Page {currentPage+1}</span>
                            <Button
                                className="m-3"
                                variant="outline-primary"
                                onClick={() => {setCurrentPage(currentPage + 1);}}
                                disabled={contacts.length < pageSize}
                            >
                                Next
                            </Button>
                        </div>
                        <Button variant="primary" className="mt-4" onClick={() => navigate(`/contact/add`)}>
                            Add Customer
                        </Button>
                    </>
                    :
                    <div> No data available </div>}
            </div>
        </div>
    );
}

export default ViewContacts;
