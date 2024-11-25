import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function ViewCustomers() {
    const [customers, setCustomers] = useState([
        { id: 1, name: "Mario", surname: "Rossi", ssn: "mario.rossi@example.com", JobOffer: 1 },
        { id: 2, name: "Luigi", surname: "Verdi", ssn: "luigi.verdi@example.com", JobOffer: 2 },
        { id: 3, name: "Anna", surname: "Bianchi", ssn: "anna.bianchi@example.com", JobOffer: 3 },
        { id: 4, name: "Giulia", surname: "Neri", ssn: "giulia.neri@example.com", JobOffer: 4 },
        { id: 5, name: "Marco", surname: "Blu", ssn: "marco.blu@example.com", JobOffer: 5 },
        { id: 6, name: "Elisa", surname: "Viola", ssn: "elisa.viola@example.com", JobOffer: 6 },
    ]);

    const [showPopUp, setShowPopUp] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: "", surname: "", ssn: "", JobOffer: 1 });

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const [filters, setFilters] = useState({
        name: "",
        surname: "",
        ssn: "",
        JobOffer: "", // Filtro per JobOffer numerico
    });

    const [sortOrder, setSortOrder] = useState("asc"); // Stato per ordinamento

    // Funzione per gestire il cambiamento dei filtri
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Funzione per resettare i filtri
    const clearFilters = () => {
        setFilters({ name: "", surname: "", ssn: "", JobOffer: "" });
    };

    // Filtraggio dei clienti
    const filteredCustomers = customers.filter((customer) => {
        const nameMatch = filters.name
            ? customer.name.toLowerCase().includes(filters.name.toLowerCase())
            : true;
        const surnameMatch = filters.surname
            ? customer.surname.toLowerCase().includes(filters.surname.toLowerCase())
            : true;
        const ssnMatch = filters.ssn
            ? customer.ssn.toLowerCase().includes(filters.ssn.toLowerCase())
            : true;
        const jobOfferMatch = filters.JobOffer
            ? customer.JobOffer === parseInt(filters.JobOffer)
            : true;

        return nameMatch && surnameMatch && ssnMatch && jobOfferMatch;
    });

    // Ordinamento alfabetico per cognome
    const sortedCustomers = filteredCustomers.sort((a, b) => {
        if (sortOrder === "asc") {
            return a.surname.localeCompare(b.surname);
        } else {
            return b.surname.localeCompare(a.surname);
        }
    });

    // Pagina corrente dei clienti da visualizzare
    const offset = currentPage * itemsPerPage;
    const currentCustomers = sortedCustomers.slice(offset, offset + itemsPerPage);

    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage + 1) * itemsPerPage < filteredCustomers.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Funzione per aggiungere un nuovo cliente
    const addCustomer = () => {
        setCustomers([...customers, { id: customers.length + 1, ...newCustomer }]);
        setShowPopUp(false);
        setNewCustomer({ name: "", surname: "", ssn: "", JobOffer: 1 });
    };

    return (
        <div style={{ paddingTop: '90px', display: 'flex', flexDirection: 'row' }}>
            {/* Filtri */}
            <div style={{ width: '30%', padding: '20px' }}>
                <h4>Filters</h4>
                <Form.Group controlId="filterName" className="mb-3">
                    <Form.Label>Filter by Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={filters.name}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterSurname" className="mb-3">
                    <Form.Label>Filter by Surname</Form.Label>
                    <Form.Control
                        type="text"
                        name="surname"
                        placeholder="Enter surname"
                        value={filters.surname}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterSSN" className="mb-3">
                    <Form.Label>Filter by SSN</Form.Label>
                    <Form.Control
                        type="text"
                        name="ssn"
                        placeholder="Enter SSN"
                        value={filters.ssn}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterJobOffer" className="mb-3">
                    <Form.Label>Filter by Job Offer</Form.Label>
                    <Form.Control
                        type="number"
                        name="JobOffer"
                        placeholder="Enter Job Offer Number"
                        value={filters.JobOffer}
                        onChange={handleFilterChange}
                    />
                </Form.Group>
                <Button variant="secondary" onClick={clearFilters}>
                    Clear Filters
                </Button>
            </div>

            {/* Tabella */}
            <div style={{ width: '70%', padding: '20px' }}>
                <h2>Customer List</h2>

                {/* Ordinamento per cognome */}
                <div className="mb-3">
                    <Button
                        variant="outline-primary"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        Sort by Surname ({sortOrder === "asc" ? "Ascending" : "Descending"})
                    </Button>
                </div>

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
                        variant="outline-primary"
                        onClick={() => changePage("prev")}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage + 1} of {Math.ceil(filteredCustomers.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-primary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage + 1) * itemsPerPage >= filteredCustomers.length}
                    >
                        Next
                    </Button>
                </div>
                <Button variant="primary" className="mt-4" onClick={() => setShowPopUp(true)}>
                    Add Customer
                </Button>
            </div>

            {/* Modale per aggiungere un cliente */}
            <Modal show={showPopUp} onHide={() => setShowPopUp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter name"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                placeholder="Enter surname"
                                value={newCustomer.surname}
                                onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formSSN">
                            <Form.Label>SSN</Form.Label>
                            <Form.Control
                                type="text"
                                name="ssn"
                                placeholder="Enter SSN"
                                value={newCustomer.ssn}
                                onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formJobOffer">
                            <Form.Label>Job Offer</Form.Label>
                            <Form.Control
                                type="number"
                                name="JobOffer"
                                value={newCustomer.JobOffer}
                                onChange={(e) => setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPopUp(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addCustomer}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ViewCustomers;
