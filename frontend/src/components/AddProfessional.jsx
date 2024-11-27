import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

function ProfessionalForm() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        address: '',
        ssn: '',
        telephone: '',
        category: 'Professional',
        employment: '',
        geographicalInfo: '',
        dailyRate: '',
        skills: '',
        jobOffer: '',
        jobOfferProposal: '',
        notes: '',
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
            // mettere api per crare il conatct
            const contactResponse = await fetch('https://API/createContact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    surname: formData.surname,
                    email: formData.email,
                    address: formData.address,
                    ssn: formData.ssn,
                    telephone: formData.telephone,
                    category: formData.category,
                }),
            });

            if (contactResponse.ok) {
                const contactData = await contactResponse.json();

                // metter api per creare il professional
                const professionalResponse = await fetch('https://API/createProfessional', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        employment: formData.employment,
                        geographicalInfo: formData.geographicalInfo,
                        dailyRate: formData.dailyRate,
                        skills: formData.skills.split(',').map((skill) => skill.trim()), // Splitta le skills in array
                        jobOffer: formData.jobOffer,
                        jobOfferProposal: formData.jobOfferProposal,
                        notes: formData.notes,
                        contactId: contactData.contactId, // Collegamento con il Contact appena creato
                    }),
                });

                if (professionalResponse.ok) {
                    const professionalData = await professionalResponse.json();
                    alert('Professional and Contact created successfully!');
                    console.log('Professional ID:', professionalData.professionalId);
                } else {
                    alert('Error creating professional.');
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
        <div className="container mt-4" style={{ paddingTop: '90px' }}>
            <h2 className={"offerTitle"}>Create New Professional</h2>
            <form onSubmit={handleSubmit} className="filterBox">
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formName" className="text-start">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formSurname" className="text-start">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                placeholder="Enter Surname"
                                value={formData.surname}
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
                        <Form.Group controlId="formEmployment" className="text-start">
                            <Form.Label>Employment</Form.Label>
                            <Form.Control
                                type="text"
                                name="employment"
                                placeholder="Enter Employment"
                                value={formData.employment}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formGeographicalInfo" className="text-start">
                            <Form.Label>Geographical Info</Form.Label>
                            <Form.Control
                                type="text"
                                name="geographicalInfo"
                                placeholder="Enter Geographical Info"
                                value={formData.geographicalInfo}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formDailyRate" className="text-start">
                            <Form.Label>Daily Rate</Form.Label>
                            <Form.Control
                                type="number"
                                name="dailyRate"
                                placeholder="Enter Daily Rate"
                                value={formData.dailyRate}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>

                    <Col>
                        <Form.Group controlId="formSkills" className="text-start">
                            <Form.Label>Skills</Form.Label>
                            <Form.Control
                                type="text"
                                name="skills"
                                placeholder="Enter Skills (comma-separated)"
                                value={formData.skills}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
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

                    <Col>
                        <Form.Group controlId="formJobOfferProposal" className="text-start">
                            <Form.Label>Job Offer Proposal</Form.Label>
                            <Form.Control
                                type="text"
                                name="jobOfferProposal"
                                placeholder="Enter Job Offer Proposal"
                                value={formData.jobOfferProposal}
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
                </Row>

                <Button variant="primary" type="submit" className="custom-button">
                    Submit
                </Button>
            </form>
        </div>
    );
}

export default ProfessionalForm;
