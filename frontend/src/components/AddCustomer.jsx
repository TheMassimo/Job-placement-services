import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

function CustomerForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        ssn: '',
        telephone: '',
        category: 'Customer', // Predefinito e non modificabile
        notes: '',
        jobOffer: '',
        replacementHistory: '',
    });

    // Gestione dei cambiamenti nei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // metrere API per creare il contact
            const contactResponse = await fetch('https://API/createContact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    address: formData.address,
                    ssn: formData.ssn,
                    telephone: formData.telephone,
                    category: formData.category,
                }),
            });

            if (contactResponse.ok) {
                const contactData = await contactResponse.json();
                setContactId(contactData.contactId); // Memorizza l'ID del Contact

                //metter api per creare un nuovo customer
                const customerResponse = await fetch('https://API/createCustomer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notes: formData.notes,
                        jobOffer: formData.jobOffer,
                        replacementHistory: formData.replacementHistory,
                        contactId: contactData.contactId, // Usa l'ID del Contact
                    }),
                });

                if (customerResponse.ok) {
                    const customerData = await customerResponse.json();
                    alert('Customer and Contact created successfully!');
                    console.log('Customer ID:', customerData.customerId);
                } else {
                    alert('Error creating customer.');
                }
            } else {
                alert('Error creating contact.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };


    return (
        <div className="container mt-4" style={{paddingTop: '90px'}} >
            <h2 className={"offerTitle"}>Create New Customer</h2>
            <form onSubmit={handleSubmit} className="filterBox">
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formFirstName" className="text-start">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="Enter First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="form-control-sm"  // Per rendere il campo più stretto
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formLastName" className="text-start">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="Enter Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formEmail" className="text-start">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formAddress" className="text-start">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder="Enter Address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formSSN" className="text-start">
                            <Form.Label>SSN</Form.Label>
                            <Form.Control
                                type="text"
                                name="ssn"
                                placeholder="Enter SSN"
                                value={formData.ssn}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formTelephone" className="text-start">
                            <Form.Label>Telephone</Form.Label>
                            <Form.Control
                                type="text"
                                name="telephone"
                                placeholder="Enter Telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formCategory" className="text-start">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={formData.category}
                                disabled
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formJobOffer" className="text-start">
                            <Form.Label>Job Offer</Form.Label>
                            <Form.Control
                                type="text"
                                name="jobOffer"
                                placeholder="Enter Job Offer"
                                value={formData.jobOffer}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>

                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formNotes" className="text-start">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                placeholder="Enter Notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formReplacementHistory" className="text-start">
                            <Form.Label>Replacement History</Form.Label>
                            <Form.Control
                                type="text"
                                name="replacementHistory"
                                placeholder="Enter Replacement History"
                                value={formData.replacementHistory}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="custom-button">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default CustomerForm;
