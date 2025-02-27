import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {Card, Badge, Dropdown, ListGroup, ListGroupItem} from "react-bootstrap";
import {Row, Col} from "react-bootstrap"
import {Pagination} from "../api/utils/Pagination.ts";
import PopupContact from "./PopupContact";
import PopupConfirmation from "./PopupConfirmation";
import SkillAPI from "../api/crm/SkillAPI.js";
import { useNotification } from '../contexts/NotificationProvider';
import ContactAPI from "../api/crm/ContactAPI.js"; // Assicurati di avere una API per le job offers
import JobOffersAPI from "../api/crm/JobOffersAPI.js"; // Assicurati di avere una API per le job offers
import StepProgress from "../components/StepProgress";


function ProgressJobOffer(props) {
    const { jobOfferId } = useParams();
    const [contact, setContact] = useState({});
    const [jobOffer, setJobOffer] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                //get the contact id if needed
                const response = await JobOffersAPI.GetJobOffersContactId(jobOfferId);
                const contactIdToUse = response;
                //get old job offer data
                const theOffer = await JobOffersAPI.GetJobOfferById(jobOfferId);
                setJobOffer(theOffer);
                //get contact data
                const theContact = await ContactAPI.GetContactById(contactIdToUse);
                setContact(theContact);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [jobOfferId]);

    const states = [
        'CREATED',
        'SELECTION_PHASE',
        'CANDIDATE_PROPOSAL',
        'CONSOLIDATED',
        'DONE'
    ];

    const goToState = async (targetState = null) => {
        try {
            let nextState;

            if (targetState) {
                // Se è stato specificato un targetState (es. "PIPPO"), usa quello
                nextState = targetState;
            } else {
                // Altrimenti continua con la logica standard per ottenere il prossimo stato
                const currentStateIndex = states.indexOf(jobOffer.status);

                if (currentStateIndex !== -1 && currentStateIndex < states.length - 1) {
                    nextState = states[currentStateIndex + 1];
                } else {
                    console.log('Non ci sono altri stati successivi.');
                    return;
                }
            }

            // Aggiorna lo stato della job offer nel database
            const response = await JobOffersAPI.UpdateStatusJobOffer(jobOfferId, nextState);

            if (response) {
                console.log('Stato aggiornato con successo nel database:', response);
                // Aggiorna lo stato locale per riflettere il cambiamento nell'interfaccia
                setJobOffer((prev) => ({ ...prev, status: nextState }));
            }
        } catch (err) {
            console.error(err);
        }
    };





    return (
        <div style={{paddingTop: '90px'}}>
            {jobOffer.status && (
                <StepProgress currentStep={jobOffer.status}/>
            )}
            <Card className="view-customer-details-card m-3 ">
                <h3>Job Offer</h3>
                {/* Header */}
                <Card.Header className="d-flex justify-content-between align-items-center custom-card-header">
                    <Card.Title className="custom-card-title">
                        {jobOffer.description}
                    </Card.Title>
                </Card.Header>

                {/* Corpo */}
                <Card.Body className="custom-card-body">
                    <Row>
                        {/* Sezione Email */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Duration:</h5>
                            <ListGroup.Item>
                                {jobOffer.duration}
                            </ListGroup.Item>
                        </Col>

                        {/* Sezione Indirizzi */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Offer Value:</h5>
                            <ListGroup.Item>
                                {jobOffer.offerValue}
                            </ListGroup.Item>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        {/* Sezione Telefoni */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Required Skills:</h5>
                            <ListGroup>
                                {jobOffer.requiredSkills?.length ? (
                                    jobOffer.requiredSkills
                                        .slice() // Crea una copia per non modificare direttamente l'array originale
                                        .sort((a, b) => a.skill.localeCompare(b.skill)) // Ordina in ordine alfabetico
                                        .map((skill, index) => (
                                            <ListGroup.Item key={index}>
                                                {skill.skill}
                                            </ListGroup.Item>
                                        ))
                                ) : (
                                    <div className="empty-list">No Skill available</div>
                                )}
                            </ListGroup>
                        </Col>

                        {/* Sezione Note Cliente */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Job Offer Notes</h5>
                            <div className="notes-box">
                                {jobOffer.notes || "No notes available"}
                            </div>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>

            <div className="d-flex justify-content-center my-4">
                {jobOffer.status!="ABORTED" && (
                    <Button variant="danger" className="mx-2" onClick={() => goToState("ABORTED")}>
                        Abort <i className="bi bi-x-lg"></i>
                    </Button>
                )}
                {jobOffer.status!="CREATED" && jobOffer.status!="SELECTION_PHASE" && jobOffer.status!="ABORTED" && (
                    <Button variant="warning" className="mx-2" onClick={() => goToState("SELECTION_PHASE")}>
                        Selection Phase <i className="bi bi-arrow-return-left"></i>
                    </Button>
                )}
                {jobOffer.status!="DONE" && jobOffer.status!="ABORTED" && (
                    <Button variant="success" className="mx-2" onClick={() => goToState()}>
                        Next <i className="bi bi-arrow-right"></i>
                    </Button>
                )}
            </div>


        </div>
    );
}

export default ProgressJobOffer;
