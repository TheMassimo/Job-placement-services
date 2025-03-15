import React, {useEffect, useState} from "react";
import { Button, Modal, Form, ListGroup, Dropdown } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import ContactAPI from "../api/crm/ContactAPI.js";
import {Pagination} from "../api/utils/Pagination.ts"
import {ContactFilter} from "../api/crm/filters/ContactFilter.ts";
import SkillAPI from "../api/crm/SkillAPI.js";
import '../App.css';  // Importa il file CSS

function Filters(props) {
    const setFilters = props.setFilters;
    const toLoad = props.toLoad;
    const skills = props.skills;
    const setCurrentPage = props.setCurrentPage;
    const [formFilters, setFormFilters] = useState(new ContactFilter(null, null, null, null, null, null, toLoad, null, null, null, null));

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
            toLoad, //category
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
        const tmpFilter = new ContactFilter(null, null, null, null, null, null, toLoad, null, null, null, null)
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
            {toLoad === "Contacts" && (
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
            {toLoad === "Customer" && (
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
            {toLoad==="Professional" && (
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
                    Clear Filters
                </Button>
                <Button variant="primary" className="custom-button mx-3 my-1" onClick={handleSubmit}>
                    <i className="bi bi-search" style={{marginRight: '10px'}}></i>
                    Find
                </Button>
            </div>
        </Form>
    );
}

const ContactTable = ({contacts, setSelectedContact, mode}) => {
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleRowClick = (contact) => {
        //update select to color in green
        setSelectedPerson(contact.contactId);
        //call external function
        if (setSelectedContact) {
            setSelectedContact(contact); // Comunica al genitore il cliente selezionato
        }
    };
    useEffect(() => {
        setSelectedPerson(null)
    }, [contacts]);

    return (
        <Form>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>SSN</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Telephone</th>
                </tr>
                </thead>
                <tbody>
                {contacts.map((contact, index) => {
                    const rowProps = (contact.category === mode || contact.category==="CustomerProfessional")
                        ? {
                            className: "table-danger", // Classe speciale se la categoria corrisponde al mode
                        }
                        : {
                            onClick: () => handleRowClick(contact),
                            className: String(selectedPerson) === String(contact.contactId) ? "table-success" : null,
                        };
                    return (<tr
                            key={index}
                            {...rowProps} // Applica le proprietà calcolate
                        >

                            <td>{contact.contactId}</td>
                            <td>{contact.name}</td>
                            <td>{contact.surname}</td>
                            <td>{contact.ssn}</td>
                            <td>{Array.isArray(contact.customer?.jobOffers)
                                ? contact.customer.jobOffers.length
                                : 0}</td>
                            <td>{contact.email
                                .slice() // Copia l'array
                                .sort((a, b) => a.email.localeCompare(b.email)) // Ordina alfabeticamente
                                .map((emailObj) => (
                                    <span key={emailObj.emailId}>{emailObj.email}<br/></span>
                                ))}</td>
                            <td>{contact.address
                                .slice() // Copia l'array
                                .sort((a, b) => a.address.localeCompare(b.address)) // Ordina alfabeticamente
                                .map((addressObj) => (
                                    <div key={addressObj.addressId}>{addressObj.address}<br/></div>
                                ))}</td>
                            <td>{contact.telephone
                                .slice() // Copia l'array
                                .sort((a, b) => a.telephone.localeCompare(b.telephone)) // Ordina alfabeticamente
                                .map((telephoneObj) => (
                                    <div key={telephoneObj.telephoneId}>{telephoneObj.telephone}<br/></div>
                                ))}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </Form>
    );
};

const ProfessionalTable = ({ contacts, selectedProfessionals, handleRowClick }) => {
    return (
        <Form>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>SSN code</th>
                    <th>Skills</th>
                </tr>
                </thead>
                <tbody>
                {contacts.map((contact, index) => {
                    const isSelected = selectedProfessionals.some(c => c.contactId === contact.contactId);
                    const rowProps = (contact.professional.employment !== "UNEMPLOYED")
                        ? {
                            className: "table-danger", // Classe speciale se non è disoccupato
                        }
                        : {
                            onClick: () => handleRowClick(contact),
                            className: isSelected ? "table-success" : "" // Qui ci voleva ":" invece di "="
                        };

                    return (
                        <tr
                            key={index}
                            {...rowProps} // Applica le proprietà calcolate
                        >
                            <td>{contact.professional.professionalId}</td>
                            <td>{contact.name}</td>
                            <td>{contact.surname}</td>
                            <td>{contact.ssn}</td>
                            <td>
                                {Array.isArray(contact.professional?.skills)
                                    ? contact.professional.skills
                                        .map(skillObj => skillObj.skill)
                                        .sort((a, b) => a.localeCompare(b))
                                        .join(', ')
                                    : 'N/A'}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </Form>
    );
};

function PopupContact(props) {
    const [selectedContact, setSelectedContact] = useState(null);
    const navigate = useNavigate(); // Per navigare a un'altra pagina
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const showModal = props.showModal;
    const handleModalClose = props.handleModalClose;
    const mode = props.mode;
    const toLoad = props.toLoad;
    const preSelectedProfessionals = props.preSelectedProfessionals
    const handleConfirmContact = props.handleConfirmContact;
    const [pageSize, setPageSize] = useState(5);
    const [skills, setSkills] = useState([]);
    const [filters, setFilters] = useState(new ContactFilter(null, null, null, null, null, null, toLoad, null, null, null, null));
    const [selectedProfessionals, setSelectedProfessionals] = useState([]); // Tiene traccia delle selezioni

    //USE Effect
    useEffect(() => {
        ContactAPI.GetContacts(filters, new Pagination(currentPage, pageSize)).then((res) => {
            setContacts(res);
        }).catch((err) => console.log(err))
    }, [filters, currentPage]);

    // Aggiorna i selectedValues con i professional pre-selezionati
    useEffect(() => {
        if (preSelectedProfessionals.length > 0) {
            setSelectedProfessionals(preSelectedProfessionals);
        }
    }, [preSelectedProfessionals]);

    useEffect(() => {
        SkillAPI.GetSkills()
            .then((res) => {
                // Setta le skills
                setSkills(res);
                //console.log("skills", res);
            })
            .catch((err) => console.log(err));
    }, []); // Esegui solo una volta quando il componente viene montato

    const handleContinue = () => {
        //richiamo l'evento esterno passandogli il contatto selezionato
        handleConfirmContact(selectedProfessionals);
    };

    const handleCancel = () => {
        //reimposto i valori iniziali prima di chiudere
        setSelectedProfessionals(preSelectedProfessionals);
        //chiamo il metodo esterno che gestisce la chiusura
        handleModalClose()
    };
    const handleSelect = (eventKey) => {
        const parsedValue = parseInt(eventKey, 10); // Converte l'eventKey in un numero intero
        setPageSize(parsedValue);
        //reset page
        setCurrentPage(0);
    };

    const localOnHide = (event) => {
        //reset page
        setCurrentPage(0);
        //call external on hide
        handleModalClose(event);
    };

    const handleRowClick = (contact) => {
        setSelectedProfessionals((prevSelected) => {
            const isSelected = prevSelected.some(c => c.contactId === contact.contactId);

            if (isSelected) {
                // Se già selezionato, rimuovilo
                return prevSelected.filter(c => c.contactId !== contact.contactId);
            } else {
                // Altrimenti, aggiungilo
                return [...prevSelected, contact];
            }
        });
    };

    return (
        <>
            {/* Modale */}
            <Modal show={showModal} onHide={localOnHide} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{ toLoad === "Professional"
                        ? "Choose Professional"
                        : toLoad === "Customer"
                            ? "Choose Customer"
                            : "Choose Contacts"
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Filters toLoad={toLoad} setFilters={setFilters} setCurrentPage={setCurrentPage} skills={skills} />
                    <h4>{ toLoad === "Professional"
                        ? "Select Professional:"
                        : toLoad === "Customer"
                            ? "Select Customer:"
                            : "Select Contacts:"
                    }</h4>
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
                    {toLoad === "Contacts" && (
                        <ContactTable
                            contacts={contacts}
                            setSelectedContact={setSelectedContact}
                            mode={mode}
                        />
                    )}
                    {toLoad === "Professional" && (
                        <ProfessionalTable
                            contacts={contacts}
                            selectedProfessionals = {selectedProfessionals}
                            handleRowClick={handleRowClick}
                        />
                    )}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                            className="m-3"
                            variant="outline-primary"
                            onClick={() => {
                                setCurrentPage(currentPage - 1);
                                setSelectedContact(null);
                            }}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </Button>
                        <div className="d-flex justify-content-center align-items-center flex-grow-1">
                            <span>Page {currentPage + 1}</span>
                        </div>
                        <Button
                            className="m-3"
                            variant="outline-primary"
                            onClick={() => {
                                setCurrentPage(currentPage + 1);
                                setSelectedContact(null);
                            }}
                            disabled={contacts.length < pageSize}
                        >
                            Next
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"
                        onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="custom-button"
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PopupContact;
