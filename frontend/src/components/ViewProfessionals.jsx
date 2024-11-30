import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import { useNavigate } from "react-router-dom";
import ContactAPI from "../api/crm/ContactAPI.js";

function ViewProfessionals() {
    const [professionals, setProfessionals] = useState([]);

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [filter, setFilter] = useState({
        name: "",
        surname: "",
        ssn: "",
        employment: "",
        skills: ""
    });


    //USE Effect
    useEffect(() => {
        ContactAPI.getConstactsAreProfessional(filter, currentPage).then((res) => {
            setProfessionals(res);
            console.log("Massimo", res);
        }).catch((err) => console.log(err))
    }, [filter, currentPage]);


    const [tempFilter, setTempFilter] = useState({ ...filter });



    // Gestione dei filtri temporanei
    const handleTempFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilter({ ...tempFilter, [name]: value });
    }

    // Applica i filtri
    const applyFilters = () => {
        setFilter({ ...tempFilter });
    };


    // Funzione per resettare i filtri
    const clearFilters = () => {
        setFilter({ name: "", surname: "", ssn: "", employment: "", skills: "" });
        setTempFilter({ name: "", surname: "", ssn: "", employment: "", skills: "" });
    };

    // Filtraggio dei clienti
    const filteredProfessionals = professionals.filter((professional) => {
        const nameMatch = filter.name
            ? professional.name.toLowerCase().includes(filter.name.toLowerCase())
            : true;
        const surnameMatch = filter.surname
            ? professional.surname.toLowerCase().includes(filter.surname.toLowerCase())
            : true;
        const ssnMatch = filter.ssn
            ? professional.ssn.toLowerCase().includes(filter.ssn.toLowerCase())
            : true;
        const employmentMatch = filter.employment
            ? professional.employment === parseInt(filter.employment)
            : true;
        const skillsMatch = filter.skills
            ? professional.skills === parseInt(filter.skills)
            : true;

        return nameMatch && surnameMatch && ssnMatch && employmentMatch && skillsMatch;
    });



    // Pagina corrente dei clienti da visualizzare
    const offset = currentPage * itemsPerPage;
    const currentProfessionals = filteredProfessionals.slice(offset, offset + itemsPerPage);

    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage + 1) * itemsPerPage < filteredProfessionals.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <div style={{ paddingTop: '90px', display: 'flex', flexDirection: 'row' }}>
            {/* Filtri */}
            <div style={{ width: '30%', padding: '20px' }} className="filterBox">
                <h4 className={"offerTitle"}>Filters</h4>
                <Form.Group controlId="filterName" className="mb-3">
                    <Form.Label>Filter by Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={tempFilter.name}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterSurname" className="mb-3">
                    <Form.Label>Filter by Surname</Form.Label>
                    <Form.Control
                        type="text"
                        name="surname"
                        placeholder="Enter surname"
                        value={tempFilter.surname}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterSSN" className="mb-3">
                    <Form.Label>Filter by SSN</Form.Label>
                    <Form.Control
                        type="text"
                        name="ssn"
                        placeholder="Enter SSN"
                        value={tempFilter.ssn}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterJobOffer" className="mb-3">
                    <Form.Label>Filter by Job Offer</Form.Label>
                    <Form.Control
                        type="number"
                        name="employment"
                        placeholder="Enter employment"
                        value={tempFilter.employment}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterJobOffer" className="mb-3">
                    <Form.Label>Filter by Skill</Form.Label>
                    <Form.Control
                        type="number"
                        name="skills"
                        placeholder="Enter skill"
                        value={tempFilter.skills}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Button variant="secondary" className="me-2 custom-button" onClick={applyFilters} >
                    <i className="bi bi-search"></i>  Apply Filters
                </Button>
                <Button variant="secondary" onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>

            {/* Tabella */}
            <div style={{ width: '70%', padding: '20px' }}>
                <h2>Professional List</h2>

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>SSN</th>
                        <th>Employment</th>
                        <th>Skills</th>
                    </tr>
                    </thead>
                    <tbody>
                    {professionals.map((professional) => (
                        <tr key={professional.contactId}>
                            <td>{professional.name}</td>
                            <td>{professional.surname}</td>
                            <td>{professional.ssn}</td>
                            <td>{professional.employment}</td>
                            <td>{professional.skills?.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("prev")}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {Math.ceil(filteredProfessionals.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage) * itemsPerPage >= filteredProfessionals.length}
                    >
                        Next
                    </Button>
                </div>
                <Button variant="primary" className="mt-4 custom-button"  onClick={() => navigate('/add-professional')}>
                    Add PRofessional
                </Button>
            </div>
        </div>
    );
}

export default ViewProfessionals;
