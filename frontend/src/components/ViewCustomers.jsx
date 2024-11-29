import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ContactAPI from "../api/crm/ContactAPI.js";
import {CustomersFilter} from "../api/crm/filters/CustomersFilter.ts";


function Filters(props){
    const setFilters = props.setFilters;
    const [formFilters, setFormFilters] = useState(new CustomersFilter(null, null, null, null, null, null, null, 0));

    const handleSubmit = (event) => {
        event.preventDefault();

        setFilters(new CustomersFilter(
            formFilters.name,
            formFilters.surname,
            formFilters.category,
            formFilters.email,
            formFilters.address,
            formFilters.ssnCode,
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
        setFormFilters( new CustomersFilter(null, null, null, null, null, null, null, 0) );
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
                    value={formFilters.ssnCode === null ? "" : formFilters.snnCode}
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

        function ViewCustomers(props) {
                                          const navigate = useNavigate();
                                          const [customers, setCustomers] = useState([]);
                                          const [filters, setFilters] = useState(new CustomersFilter());
                                          const [currentPage, setCurrentPage] = useState(1);

    //USE Effect
    useEffect(() => {
        ContactAPI.getConstactsAreCustomer(filters, currentPage).then((res) => {
             setCustomers(res);
             console.log("Massimo");
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
            <div style={{ width: '30%', padding: '20px' }} className="filterBox">
                <Filters setFilters={setFilters} />
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
                <Button variant="primary" className="mt-4" onClick={() => navigate(`/customers/add`)}>
                    Add Customer
                </Button>
            </div>

        </div>
    );
}

export default ViewCustomers;
