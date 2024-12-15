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



    return (
        <div style={{paddingTop: '90px'}}>
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
        </div>
    );
}

export default ProgressJobOffer;
