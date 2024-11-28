import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import { useNavigate } from "react-router-dom";

function ViewProfessionals() {
    const [professionals, setProfessionals] = useState([
        { id: 1, name: "Mario", surname: "Rossi", ssn: "mario.rossi@example.com", employment: "Software Engineer", skills: ["JavaScript", "React", "Node.js"] },
        { id: 2, name: "Luigi", surname: "Verdi", ssn: "luigi.verdi@example.com", employment: "Data Scientist", skills: ["Python", "SQL", "Machine Learning"] },
        { id: 3, name: "Anna", surname: "Bianchi", ssn: "anna.bianchi@example.com", employment: "Product Manager", skills: ["Product Strategy", "Agile", "Team Leadership"] },
        { id: 4, name: "Giulia", surname: "Neri", ssn: "giulia.neri@example.com", employment: "UX/UI Designer", skills: ["Figma", "Adobe XD", "Wireframing"] },
        { id: 5, name: "Marco", surname: "Blu", ssn: "marco.blu@example.com", employment: "Full Stack Developer", skills: ["Java", "Spring Boot", "React"] },
        { id: 6, name: "Elisa", surname: "Viola", ssn: "elisa.viola@example.com", employment: "Marketing Specialist", skills: ["SEO", "Content Marketing", "Google Analytics"] },
    ]);


    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const [filter, setFilter] = useState({
        name: "",
        surname: "",
        ssn: "",
        employment: "",
        skills: ""
    });

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
        } else if (direction === "prev" && currentPage > 0) {
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
                    {currentProfessionals.map((professional) => (
                        <tr key={professional.id}>
                            <td>{professional.name}</td>
                            <td>{professional.surname}</td>
                            <td>{professional.ssn}</td>
                            <td>{professional.employment}</td>
                            <td>{professional.skills.join(', ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("prev")}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage + 1} of {Math.ceil(filteredProfessionals.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage + 1) * itemsPerPage >= filteredProfessionals.length}
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
