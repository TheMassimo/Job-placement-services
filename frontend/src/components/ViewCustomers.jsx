import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ContactAPI from "../api/crm/ContactAPI.js";


function Filters(){
    return (
        <>
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
        </>
    );
}

function ViewCustomers(props) {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        status: [
            //'filter_1',
        ]
    });
    const [currentPage, setCurrentPage] = useState(1);

    //USE Effect
    useEffect(() => {
        ContactAPI.getConstactsAreCustomer(filters, currentPage).then((res) => {
             setCustomers(res);
             console.log("massimo -->", res);
        }).catch((err) => console.log(err))
    }, [filters, currentPage]);

    // LOCAL VARIABLES
    const itemsPerPage = 5;
    // Pagina corrente dei clienti da visualizzare
    const offset = currentPage * itemsPerPage;

    // FUNCTIONS
    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage) * itemsPerPage < customers.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    return (
        <div style={{ paddingTop: '90px', display: 'flex', flexDirection: 'row' }}>
            {/* Filtri */}
            <div style={{ width: '30%', padding: '20px' }}>
                {/*<Filters />*/}

            </div>

            {/* Tabella */}
            <div style={{ width: '70%', padding: '20px' }}>
                <h2>Customer List</h2>

                {/* Ordinamento per cognome */}
                <div className="mb-3">
                    <Button
                        variant="outline-primary"
                        onClick={() => console.log("pressed")}
                    >
                        Do somethong ({/* bla bla*/})
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
                    {customers.map((customer) => (
                        <tr key={customer.contactId}>
                            <td>{customer.name}</td>
                            <td>{customer.surname}</td>
                            <td>{customer.ssnCode}</td>
                            <td>{customer.jobOffers?.length || 0}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        variant="outline-primary"
                        onClick={() => changePage("prev")}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage} of {Math.ceil(customers.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-primary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage) * itemsPerPage >= customers.length}
                    >
                        Next
                    </Button>
                </div>
                <Button variant="primary" className="mt-4" onClick={() => navigate(`/MassimoTest`)}>
                    Add Customer
                </Button>
            </div>

        </div>
    );
}

export default ViewCustomers;
