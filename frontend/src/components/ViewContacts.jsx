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
import PopupContact from "./PopupContact";
import PopupConfirmation from "./PopupConfirmation";
import ContactAPI from "../api/crm/ContactAPI.js";
import CustomerAPI from "../api/crm/CustomerAPI.js";
import ProfessionalAPI from "../api/crm/ProfessionalAPI.js";
import SkillAPI from "../api/crm/SkillAPI.js";
import { useNotification } from '../contexts/NotificationProvider';

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
        <Form>
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
                            <option key={skill.skillId} value={skill.skill}>
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
                    <i className="bi bi-x-circle"></i> Clear Filters
                </Button>
                <Button variant="primary" className="custom-button mx-3 my-1" onClick={handleSubmit}>
                    <i className="bi bi-search"></i> Apply Filters
                </Button>
            </div>
        </Form>
    );
}

function ContactCard(props) {
    const contact = props.contact;
    const navigate = useNavigate(); // Hook per navigare

    const handleNavigate = () => {
        navigate(`/contact/${contact.contactId}/details`, {
            state: { mode: null }, // Passa il valore di "mode"
        });
    };

    return(
        <Card  className="p-0 m-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Row className="w-100">
                    <Col xs={4} className="text-start">
                        {/* Nome a sinistra */}
                        <Card.Title className="hover-underline cursor-pointer"
                                    onClick={handleNavigate}>
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
                    {/* Prima colonna - Numeri di telefono */}
                    <Col xs={12} md={4}>
                        <h6>Telephone</h6>
                        {contact.telephone
                            .slice() // Copia l'array
                            .sort((a, b) => a.telephone.localeCompare(b.telephone)) // Ordina alfabeticamente
                            .map((telephoneObj) => (
                                <div key={telephoneObj.telephoneId}>{telephoneObj.telephone}</div>
                            ))}
                    </Col>

                    {/* Seconda colonna - Email */}
                    <Col xs={12} md={4}>
                        <h6>Email</h6>
                        {contact.email
                            .slice() // Copia l'array
                            .sort((a, b) => a.email.localeCompare(b.email)) // Ordina alfabeticamente
                            .map((emailObj) => (
                                <div key={emailObj.emailId}>{emailObj.email}</div>
                            ))}
                    </Col>

                    {/* Terza colonna - Indirizzi */}
                    <Col xs={12} md={4}>
                        <h6>Addresses</h6>
                        {contact.address
                            .slice() // Copia l'array
                            .sort((a, b) => a.address.localeCompare(b.address)) // Ordina alfabeticamente
                            .map((addressObj) => (
                                <div key={addressObj.addressId}>{addressObj.address}</div>
                            ))}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

function CustomerCard(props) {
    const contact = props.contact;
    const navigate = useNavigate(); // Hook per navigare

    const handleNavigate = () => {
        navigate(`/contact/${contact.contactId}/details`, {
            state: { mode: "customer" }, // Passa il valore di "mode"
        });
    };

    return (
        <Card className="p-0 m-1" style={{ height: '100px' }}>
            <Card.Body>
                <Row>
                    <Col className="text-start" xs={4}>
                        <Card.Title className="hover-underline cursor-pointer"
                                    onClick={handleNavigate}> {contact.name} {contact.surname}</Card.Title>
                    </Col>
                    <Col className="text-center" xs={4}>
                    <span className="custom-text">
                        <Card.Title>ssn: {contact.ssn}</Card.Title>
                    </span>
                    </Col>
                    <Col className="text-center" xs={4}>
                        <span>{contact.customer?.jobOffers?.length || 0} job offers</span>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

function ProfessionalCard(props) {
    const contact = props.contact;

    const navigate = useNavigate(); // Hook per navigare

    const handleNavigate = () => {
        navigate(`/contact/${contact.contactId}/details`, {
            state: { mode: "professional" }, // Passa il valore di "mode"
        });
    };

    return(
        <Card  className="p-0 m-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Row className="w-100">
                    <Col xs={4} className="text-start">
                        {/* Nome a sinistra */}
                        <Card.Title className="hover-underline cursor-pointer"
                                    onClick={handleNavigate}>
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
                    Daily Rate: {contact.professional?.dailyRate+"€" || "N/A"}
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
    const { handleError, handleSuccess } = useNotification();
    const [contacts, setContacts] = useState([]);
    const [filters, setFilters] = useState(new ContactFilter());
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [mode, setMode] = useState(null);
    const [operation, setOperation] = useState(null);
    const [skills, setSkills] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [refreshContact, setRefreshContact] = useState(0);

    //Per gestione modal
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    //USE Effect
    useEffect(() => {
        //console.log("pagina corrente:  page size", currentPage, pageSize);
        ContactAPI.GetContacts(filters, new Pagination(currentPage, pageSize)).then((res) => {
            //get data
            setContacts(res);
            //console.log("CONTACTS ",res);
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

    // FUNCTIONS
    const changeMode = (newMode) => {
        setMode(newMode)
        //update state of filters
        setFilters(new ContactFilter(null, null, null, null, null, null, newMode, null, null, null, null));
        //reset page
        setCurrentPage(0);
    };

    const handleSelect = (eventKey) => {
        const parsedValue = parseInt(eventKey, 10); // Converte l'eventKey in un numero intero
        setPageSize(parsedValue);
        //reset page
        setCurrentPage(0);
    };

    const handleConfirmContact = (contact) => {
        navigate(`/${mode.toLowerCase()}/add/${contact.contactId}`);
    }

    const onCloseConfirmation = () => {
        setIsOpenConfirmation(false);
        setContactToDelete(null)
    }

    const onConfirmConfirmation = async () => {
        try {
            if (mode === "Customer") {
                await CustomerAPI.DeleteCustomer(contactToDelete.customer.customerId); // Chiamata asincrona
                handleSuccess('Customer successfully deleted!');
                setIsOpenConfirmation(false);
                setRefreshContact(prev => prev + 1);
            } else if (mode === "Professional") {
                await ProfessionalAPI.DeleteProfessional(contactToDelete.professional.professionalId); // Chiamata asincrona
                handleSuccess('Professional successfully deleted!');
                setIsOpenConfirmation(false);
                setRefreshContact(prev => prev + 1);
            } else {
                await ContactAPI.DeleteContact(contactToDelete.contactId); // Chiamata asincrona
                handleSuccess('Contact successfully deleted!');
                setIsOpenConfirmation(false);
                setRefreshContact(prev => prev + 1);
            }
        } catch (error) {
            console.error("Errore durante la conferma:", error);
            handleError(error);
        }
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
                {/*Pop up per contatti*/}
                <PopupContact
                    mode={mode}
                    showModal={showModal}
                    handleModalClose={handleModalClose}
                    toLoad={"Contacts"}
                    handleConfirmContact={handleConfirmContact}
                />
                {/* Popup per confermare*/}
                <PopupConfirmation
                    isOpen={isOpenConfirmation}
                    onClose={onCloseConfirmation}
                    onConfirm={onConfirmConfirmation}
                    title="Confirm"
                    message={"Are you sure you want to proceed?"}
                />

                {/*Title of list*/}
                <h2>{mode === null ? "Contacts" : mode + "s"} list:</h2>
                <Row className="d-flex align-items-center">
                    <Col>
                        <Dropdown onSelect={handleSelect}>
                            <Dropdown.Toggle className="custom-button m-2" id="dropdown-basic">
                                {pageSize ? `${pageSize} items` : "Select an option"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="5">5 items</Dropdown.Item>
                                <Dropdown.Item eventKey="10">10 items</Dropdown.Item>
                                <Dropdown.Item eventKey="20">20 items</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        {mode === null && (
                        <Button className="m-2"
                                variant="success"
                                onClick={() => navigate(`/contacts/add`, {
                                    state: {
                                        mode: mode,
                                        operation: "add",
                                    }
                                })}>
                            <i className="bi bi-plus-circle p-1"></i>
                            {"Create new Contact"}
                        </Button>
                        )}
                        {mode !== null && (
                            <Button className="m-2"
                                    variant="success"
                                    onClick={() => setShowModal(true)}>
                                <i className="bi bi-plus-circle p-1"></i>
                                {mode === "Customer"
                                    ? "Create new Customer"
                                    : mode === "Professional"
                                        ? "Create new Professional"
                                        : "Create new Contact"}
                            </Button>
                        )}
                    </Col>
                </Row>

                {/*Show all contacts*/}
                {contacts.length > 0 ?
                    <>
                        {contacts.map((contact) => {
                            return (
                                <div key={contact.contactId} className="d-flex w-100 position-relative">
                                    {/* Contenitore card con padding per lasciare spazio ai tasti */}
                                    <div className="flex-grow-1" style={{ paddingRight: "50px" }}>
                                        {mode === "Customer" ? (
                                            <CustomerCard contact={contact} />
                                        ) : mode === "Professional" ? (
                                            <ProfessionalCard contact={contact} />
                                        ) : (
                                            <ContactCard contact={contact} />
                                        )}
                                    </div>

                                    {/* Contenitore dei tasti, con larghezza fissa per evitare sovrapposizioni */}
                                    <div
                                        className="position-absolute top-50 end-0 translate-middle-y d-flex flex-column align-items-center"
                                        style={{ width: "50px" }} // larghezza fissa per i tasti
                                    >
                                        <button
                                            className="btn btn-primary mb-2"
                                            style={{ width: "40px", height: "40px" }}
                                            onClick={() => {
                                                const path = mode ? mode.toLowerCase() : "contacts";
                                                navigate(`/${path}/edit/${contact.contactId}`);
                                            }}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        {console.log(props.role)}

                                        {props.role?.includes("manager") && (
                                            <button
                                                className="btn btn-danger"
                                                style={{ width: "40px", height: "40px" }}
                                                onClick={() => {
                                                    setIsOpenConfirmation(true);
                                                    setContactToDelete(contact);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </>

                    :
                    <div> No data available </div>}
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
                        disabled={contacts.length < pageSize}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ViewContacts;
