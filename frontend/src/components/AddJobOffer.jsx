import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import JobOffersAPI from "../api/crm/JobOffersAPI.js"; // Assicurati di avere una API per le job offers
import { useLocation } from 'react-router-dom';
import PopupSkills from './PopupSkills'; // Importa il componente PopUpSkills

function AddJobOffer(props) {

    const location = useLocation();

    //USE PARAMS
    const { contact, customerId } = location.state || {}; // Recupera il contatto e customerId

    const [formData, setFormData] = useState({
        description: '',
        offerValue: '',
        duration: '',
        notes: '',
        requiredSkills: [], // Stato per le skills richieste
        status: 'CREATED'
    });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);



    // Funzione per nascondere il PopUp
    const handleClosePopUp = () => setShowPopUp(false);

    // Funzione per aggiornare le skills selezionate
    const handleSkillsSelect = (skills) => {
        setFormData((prevData) => ({
            ...prevData,
            requiredSkills: skills
        }));
    };

    // Gestione dei cambiamenti nei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Funzione per inviare i dati del form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { offerValue, duration } = formData;
        const offerValueNumber = parseFloat(offerValue); // Assicurati che sia un numero
        const durationNumber = parseFloat(duration); // Assicurati che sia un numero

        if (isNaN(offerValueNumber) || isNaN(durationNumber)) {
            alert('Offer value and duration must be valid numbers.');
            return;
        }

        const dataToSubmit = {
            customerId: customerId,
            description: formData.description,
            offerValue: offerValueNumber,
            duration: durationNumber,
            notes: formData.notes,
            requiredSkills: formData.requiredSkills,
            status: "CREATED"
        };

        try {
            const res = await JobOffersAPI.AddJobOffer(dataToSubmit); // Chiamata API per aggiungere la job offer
            console.log('Job offer added successfully:', res);
        } catch (err) {
            console.log('Error adding job offer:', err);
        }
    };

    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    return (
        <div className="container mt-4" style={{ paddingTop: '90px' }}>
            <h2 className="offerTitle">Create New Job Offer</h2>

            {contact && (
                <div className="customer-info d-flex justify-content-center align-items-center my-4">
                    <h6 className="offerTitle">Customer info:</h6>
                    <div className="info-item">
                        <strong>Name:</strong> {contact.name}
                    </div>
                    <div className="info-item">
                        <strong>Surname:</strong> {contact.surname}
                    </div>
                    <div className="info-item">
                        <strong>SSN:</strong> {contact.ssn}
                    </div>
                    <div className="info-item">
                        <strong>Job Offers:</strong> {contact.customer?.jobOffers?.length || 0}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="filterBox">
                {/* Descrizione */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formDescription" className="text-start">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                placeholder="Enter Job Offer Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Offer Value */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formOfferValue" className="text-start">
                            <Form.Label>Offer Value</Form.Label>
                            <Form.Control
                                type="number"
                                name="offerValue"
                                placeholder="Enter Offer Value"
                                value={formData.offerValue}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Duration */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formDuration" className="text-start">
                            <Form.Label>Duration (in months)</Form.Label>
                            <Form.Control
                                type="number"
                                name="duration"
                                placeholder="Enter Duration"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Notes */}
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Group controlId="formNotes" className="text-start">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                placeholder="Enter Additional Notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Required Skills */}
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Group controlId="formSkills" className="text-start">
                            <div className="d-flex align-items-start justify-content-between">
                                {/* Bottone per aprire il popup */}
                                <Button className="custom-button m-3" onClick={togglePopup}>
                                    Select Skills
                                </Button>

                                {/* Mostra le skill selezionate */}
                                {selectedSkills.length > 0 && (
                                    <div className="mt-3 ms-3" style={{ flexGrow: 1 }}>
                                        <strong>Selected skills:</strong>
                                        <ul className="mb-0">
                                            {selectedSkills.map((skill, index) => (
                                                <li key={index}>{skill.skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Submit Button */}
                <Button variant="primary" type="submit" className="custom-button">
                    Save
                </Button>
            </form>

            {/* PopUpSkills per la selezione delle skills */}
            {isPopupOpen && (
                <PopupSkills
                    isOpen={isPopupOpen}
                    onClose={togglePopup}
                    onConfirm={(skills) => {
                        setSelectedSkills(skills); // Salva le skill selezionate
                        togglePopup(); // Chiudi il popup
                    }}
                />
            )}
        </div>
    );
}

export default AddJobOffer;
