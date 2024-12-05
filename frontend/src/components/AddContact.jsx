import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ContactAPI from "../api/crm/ContactAPI.js";

function AddContact() {
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const [emailAddress, setEmailAddress] = useState([]);
    const [addressInfo, setAddressInfo] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        ssn: '',
        category: 'Customer', // Predefinito e non modificabile
        notes: '',
        telephone: [],
        email: [],
        address: []
    });
    // Stati per gestire il valore delle checkbox
    const [customerChecked, setCustomerChecked] = useState(false);
    const [professionalChecked, setProfessionalChecked] = useState(false);

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

        const all = formData;
        formData.telephone = phoneNumbers;
        formData.email = emailAddress;
        formData.address = addressInfo;

        ContactAPI.AddCustomer(formData).then((res) => {
            console.log("Add result ->", res);
        }).catch((err) => console.log(err))
    };


    // TELEPHONE
    // Aggiungi un nuovo campo per il numero di telefono
    const addPhoneNumber = () => {
        setPhoneNumbers([...phoneNumbers, ""]);
    };
    // Rimuovi un campo per il numero di telefono
    const removePhoneNumber = (index) => {
        setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    };
    // Aggiorna il valore di un campo specifico
    const handlePhoneNumberChange = (index, value) => {
        const updatedNumbers = [...phoneNumbers];
        updatedNumbers[index] = value;
        setPhoneNumbers(updatedNumbers);
    };

    //EMAIL
    // Aggiungi un nuovo campo per la email
    const addEmailAddress = () => {
        setEmailAddress([...emailAddress, ""]);
    };
    // Rimuovi un campo per la email
    const removeEmailAddress = (index) => {
        setEmailAddress(emailAddress.filter((_, i) => i !== index));
    };
    // Aggiorna il valore di un campo specifico
    const handleEmailAddressChange = (index, value) => {
        const updatedEmail = [...emailAddress];
        updatedEmail[index] = value;
        setEmailAddress(updatedEmail);
    };

    //ADDRESS
    // Aggiungi un nuovo campo per la email
    const addAddressInfo = () => {
        setAddressInfo([...addressInfo, ""]);
    };
    // Rimuovi un campo per la email
    const removeAddressInfo = (index) => {
        setAddressInfo(addressInfo.filter((_, i) => i !== index));
    };
    // Aggiorna il valore di un campo specifico
    const handleAddressInfoChange = (index, value) => {
        const updatedAddress = [...addressInfo];
        updatedAddress[index] = value;
        setAddressInfo(updatedAddress);
    };

    // CUSTOMER and PROFESSIONAL Funzione per gestire il cambiamento delle checkbox
    const handleCheckboxChange = (event, setState) => {
        setState(event.target.checked);
    };


    return (
        <div className="container mt-4" style={{paddingTop: '90px'}} >
            <h2 className={"offerTitle"}>Create New Customer</h2>
            <form onSubmit={handleSubmit} className="filterBox">

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formName" className="text-start">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter First Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-control-sm"  // Per rendere il campo più stretto
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formSurname" className="text-start">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                placeholder="Enter Last Name"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
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
                </Row>

                <Row className="mb-3">
                    <Col md={8}>
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
                    <Col md={4}>
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
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formTelephone" className="text-start">
                            <Form.Label className="d-block">Telephone</Form.Label>
                            {phoneNumbers.map((number, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="telephone"
                                            placeholder={`Enter Telephone ${index + 1}`}
                                            value={number}
                                            onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                                            required
                                            className="form-control-sm"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removePhoneNumber(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3"
                                    onClick={addPhoneNumber}
                                >
                                    Add Phone Number
                                </button>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formEmail" className="text-start">
                            <Form.Label className="d-block">Email</Form.Label>
                            {emailAddress.map((email, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            placeholder={`Enter Email ${index + 1}`}
                                            value={email}
                                            onChange={(e) => handleEmailAddressChange(index, e.target.value)}
                                            required
                                            className="form-control-sm"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeEmailAddress(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3"
                                    onClick={addEmailAddress}
                                >
                                    Add Email Address
                                </button>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formAddress" className="text-start">
                            <Form.Label className="d-block">Address</Form.Label>
                            {addressInfo.map((number, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder={`Enter Address ${index + 1}`}
                                            value={number}
                                            onChange={(e) => handleAddressInfoChange(index, e.target.value)}
                                            required
                                            className="form-control-sm"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeAddressInfo(index)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3"
                                    onClick={addAddressInfo}
                                >
                                    Add Address
                                </button>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    {/* Colonna Customer */}
                    <Col md={4} style={{ backgroundColor: '#D3D3D3', borderRadius: '8px', margin: '25px', padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label>
                                Customer
                            </label>
                            <Form.Check
                                type="checkbox"
                                checked={customerChecked}
                                onChange={(e) => handleCheckboxChange(e, setCustomerChecked)}
                                style={{ marginLeft: '10px' }}
                            />
                        </div>
                        {customerChecked && (
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
                        )}
                    </Col>

                    {/* Colonna Professional */}
                    <Col md={7} style={{ backgroundColor: '#D3D3D3', borderRadius: '8px', margin: '25px', padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label>
                                Professional
                            </label>
                            <Form.Check
                                type="checkbox"
                                checked={professionalChecked}
                                onChange={(e) => handleCheckboxChange(e, setProfessionalChecked)}
                                style={{ marginLeft: '10px' }}
                            />
                        </div>
                        {professionalChecked && (
                            <>
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
                            </>
                        )}
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="custom-button">
                    Save
                </Button>
            </form>
        </div>
    );
}

export default AddContact;
