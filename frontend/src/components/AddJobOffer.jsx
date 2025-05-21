import React, {useEffect, useState} from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import {useNavigate, useParams} from "react-router-dom";
import { useNotification } from '../contexts/NotificationProvider';
import PopupSkills from './PopupSkills'; // Importa il componente PopUpSkills
import ContactAPI from "../api/crm/ContactAPI.js"; // Assicurati di avere una API per le job offers
import JobOffersAPI from "../api/crm/JobOffersAPI.js"; // Assicurati di avere una API per le job offers


function AddJobOffer(props) {
    const user = props.user;
    const { contactId, jobOfferId } = useParams();
    const isEditMode = !!jobOfferId; // Modalità 'edit' se jobOfferId è presente
    const navigate = useNavigate();
    const { handleError, handleSuccess } = useNotification();
    const location = useLocation();
    const [contact, setContact] = useState({});
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [submitButton, setSubmitButton] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        offerValue: '',
        duration: '',
        notes: '',
        requiredSkills: [], // Stato per le skills richieste
        status: 'CREATED'
    });

    //USE Effect
    useEffect(() => {
        const fetchData = async () => {
            try {
                let contactIdToUse = contactId;

                if (isEditMode) {
                    //get the contact id if needed
                    const response = await JobOffersAPI.GetJobOffersContactId(jobOfferId);
                    contactIdToUse = response;
                    //get old job offer data
                    const oldOffer = await JobOffersAPI.GetJobOfferById(jobOfferId);
                    setFormData({
                        description: oldOffer.description,
                        notes: oldOffer.notes,
                        duration: oldOffer.duration,
                        offerValue: oldOffer.offerValue,
                        requiredSkills: oldOffer.requiredSkills || [],
                    });
                }

                const res = await ContactAPI.GetContactById(contactIdToUse);
                setContact(res);

            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [jobOfferId, contactId]);


    // Funzione per nascondere il PopUp
    const handleClosePopUp = () => setShowPopUp(false);

    // Gestione dei cambiamenti nei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //Gestione invio form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitButton(true);

        if (isEditMode) {
            handleEdit(e);
        } else {
            handleAdd(e);
        }

        setSubmitButton(false);
    };
    const handleAdd = async (e) => {
        try {
            // prendo solo gli id delle skill
            const tmpSkills = formData.requiredSkills.map((skill) => skill.skillId);

            const tmpJobOffer = {
                description:formData.description,
                notes: formData.notes,
                duration:formData.duration,
                offerValue: formData.offerValue,
                requiredSkills: tmpSkills,
            };
            const resAddJobOffer = await JobOffersAPI.AddJobOffer(contactId, tmpJobOffer, user?.xsrfToken);
            handleSuccess('Job Offer added successfully!');

            //if all is right go back to contacts
            navigate(`/jobOffers`)
        } catch (err) {
            console.error("Errore durante l'elaborazione:", err);
            handleError(err);
        }
    };
    const handleEdit = async (e) => {
        try {
            // prendo solo gli id delle skill
            const tmpSkills = formData.requiredSkills.map((skill) => skill.skillId);

            const tmpJobOffer = {
                description:formData.description,
                notes: formData.notes,
                duration:formData.duration,
                offerValue: formData.offerValue,
                //requiredSkills: tmpSkills,
            };
            const resUpdateJobOffer = await JobOffersAPI.UpdateJobOffer(jobOfferId, tmpJobOffer, user?.xsrfToken);
            processJobOfferRequiredSkillsChanges(resUpdateJobOffer, formData)
            handleSuccess('Job Offer successfully updated!');

            //if all is right go back to contacts
            navigate(`/jobOffers`)
        } catch (err) {
            console.error("Errore durante l'elaborazione:", err);
            handleError(err);
        }
    };

    const processJobOfferRequiredSkillsChanges = (jobOffer, formData) => {
        const jobOfferField = jobOffer.requiredSkills || [];
        const formDataField = formData.requiredSkills || [];

        // Mappa i dati di origine in oggetti chiave-valore
        const jobOfferMap = new Map(jobOfferField.map(item => [item.skillId, item.skill]));
        const formDataMap = new Map(formDataField.map(item => [item.skillId, item.skill]));

        // Gestisci eliminazioni
        for (let id of jobOfferMap.keys()) {
            if (!formDataMap.has(id)) {
                JobOffersAPI.DeleteRequiredSkillToJobOffer(jobOfferId, id, user?.xsrfToken);
            }
        }

        // Gestisci aggiunte e aggiornamenti
        for (let [id, value] of formDataMap.entries()) {
            if (jobOfferMap.has(id)) {
                if (jobOfferMap.get(id) !== value) {
                    JobOffersAPI.UpdateRequiredSkillToJobOffer(jobOfferId, id, value, user?.xsrfToken);
                }
            } else {
                JobOffersAPI.AddRequiredSkillToJobOffer(jobOfferId, value, user?.xsrfToken);
            }
        }
    };



    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    return (
        <div className="container mt-4" style={{paddingTop: '90px'}}>
            <h2 className="offerTitle">
                {isEditMode ? "Edit Job Offer" : "Create New Job Offer"}
            </h2>

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
                {/* Descrizione and notes */}
                <Row className="mb-3">
                    <Col md={8}>
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
                    <Col md={4}>
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

                <Row className="mb-3">
                    {/* Duration */}
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
                    {/* Offer Value */}
                    <Col>
                        <Form.Group controlId="formOfferValue" className="text-start">
                            <Form.Label>Offer Value (€)</Form.Label>
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
                    {/* Required Skills */}
                    <Col>
                        <Form.Group controlId="formSkills" className="text-start">
                            <Form.Label>Select required skills</Form.Label>
                            <div className="d-flex align-items-start justify-content-between">
                                {/* Bottone per aprire il popup */}
                                <Button
                                    className="custom-button m-3"
                                    onClick={togglePopup}
                                >
                                    Select Skills
                                </Button>

                                {/* Mostra le skill selezionate */}
                                {formData.requiredSkills && formData.requiredSkills.length > 0 && (
                                    <div className="mt-3 ms-3" style={{flexGrow: 1}}>
                                        <strong>Selected skills:</strong>
                                        <ul className="mb-0">
                                            {formData.requiredSkills
                                                .slice() // Creare una copia per non modificare l'array originale
                                                .sort((a, b) => a.skill.localeCompare(b.skill)) // Ordinare alfabeticamente
                                                .map((skill, index) => (
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
                <Button
                    variant="primary"
                    type="submit"
                    className="custom-button"
                    disabled={submitButton}
                >
                    Save
                </Button>
            </form>

            {/* PopUpSkills per la selezione delle skills */}
            {isPopupOpen && (
                <PopupSkills
                    props={props}
                    isOpen={isPopupOpen}
                    onClose={togglePopup}
                    preSelectedSkills={formData.requiredSkills}
                    onConfirm={(skills) => {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            requiredSkills: skills, // Aggiorna il campo skills direttamente
                        }));
                        console.log("===>", formData);
                        togglePopup(); // Chiudi il popup
                    }}
                />
            )}
        </div>
    );
}

export default AddJobOffer;
