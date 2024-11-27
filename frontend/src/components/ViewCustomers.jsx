import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import { useNavigate } from "react-router-dom";

function ViewCustomers() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "Mario", surname: "Rossi", ssn: "mario.rossi@example.com", JobOffer: 1 },
        { id: 2, name: "Luigi", surname: "Verdi", ssn: "luigi.verdi@example.com", JobOffer: 2 },
        { id: 3, name: "Anna", surname: "Bianchi", ssn: "anna.bianchi@example.com", JobOffer: 3 },
        { id: 4, name: "Giulia", surname: "Neri", ssn: "giulia.neri@example.com", JobOffer: 4 },
        { id: 5, name: "Marco", surname: "Blu", ssn: "marco.blu@example.com", JobOffer: 5 },
        { id: 6, name: "Elisa", surname: "Viola", ssn: "elisa.viola@example.com", JobOffer: 6 },
    ]);


    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const [filter, setFilter] = useState({
        name: "",
        surname: "",
        ssn: "",
        JobOffer: "", // Filtro per JobOffer numerico
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
        setFilter({ name: "", surname: "", ssn: "", JobOffer: "" });
        setTempFilter({ name: "", surname: "", ssn: "", JobOffer: "" });
    };

    // Filtraggio dei clienti
    const filteredCustomers = customers.filter((customer) => {
        const nameMatch = filter.name
            ? customer.name.toLowerCase().includes(filter.name.toLowerCase())
            : true;
        const surnameMatch = filter.surname
            ? customer.surname.toLowerCase().includes(filter.surname.toLowerCase())
            : true;
        const ssnMatch = filter.ssn
            ? customer.ssn.toLowerCase().includes(filter.ssn.toLowerCase())
            : true;
        const jobOfferMatch = filter.JobOffer
            ? customer.JobOffer === parseInt(filter.JobOffer)
            : true;

        return nameMatch && surnameMatch && ssnMatch && jobOfferMatch;
    });



    // Pagina corrente dei clienti da visualizzare
    const offset = currentPage * itemsPerPage;
    const currentCustomers = filteredCustomers.slice(offset, offset + itemsPerPage);

    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage + 1) * itemsPerPage < filteredCustomers.length) {
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
                        name="JobOffer"
                        placeholder="Enter Job Offer Number"
                        value={tempFilter.JobOffer}
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
                <h2>Customer List</h2>

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>SSN</th>
                        <th>Job Offer</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.name}</td>
                            <td>{customer.surname}</td>
                            <td>{customer.ssn}</td>
                            <td>{customer.JobOffer}</td>
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
                    <span>Page {currentPage + 1} of {Math.ceil(filteredCustomers.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage + 1) * itemsPerPage >= filteredCustomers.length}
                    >
                        Next
                    </Button>
                </div>
                <Button variant="primary" className="mt-4 custom-button"  onClick={() => navigate('/add-customer')}>
                    Add Customer
                </Button>
            </div>
        </div>
    );
}

export default ViewCustomers;
