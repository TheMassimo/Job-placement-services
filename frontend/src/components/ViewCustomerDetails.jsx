import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import '../App.css'; // File CSS esistente

import ContactAPI from "../api/crm/ContactAPI.js";

function ViewCustomerDetails() {
    const [contact, setContact] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Stato per gestire il caricamento
    const { contactId } = useParams();

    useEffect(() => {
        ContactAPI.GetContactById(contactId)
            .then((res) => {
                setContact(res);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Errore nel recupero del contatto:", err);
                setIsLoading(false);
            });
    }, [contactId]);

    if (isLoading) {
        return <div className="loading-text">Loading contact details...</div>;
    }

    if (!contact) {
        return <div className="error-text">Contact not found</div>;
    }

    return (

        <div style={{ paddingTop: '90px' }}>
            <Card className="view-customer-details-card m-3 ">
                <h3>Customer details</h3>
                {/* Header */}
                <Card.Header className="d-flex justify-content-between align-items-center custom-card-header">
                    <Card.Title className="custom-card-title">
                        {contact.name} {contact.surname}
                    </Card.Title>
                </Card.Header>

                {/* Corpo */}
                <Card.Body className="custom-card-body">
                    <Row>
                        {/* Sezione Email */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Email:</h5>
                            <ListGroup>
                                {contact.email?.length ? (
                                    contact.email.map((emailObj, index) => (
                                        <ListGroup.Item key={index}>
                                            {emailObj.email}
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <div className="empty-list">No emails available</div>
                                )}
                            </ListGroup>
                        </Col>

                        {/* Sezione Indirizzi */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Address:</h5>
                            <ListGroup>
                                {contact.address?.length ? (
                                    contact.address.map((addressObj, index) => (
                                        <ListGroup.Item key={index}>
                                            {addressObj.address}
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <div className="empty-list">No addresses available</div>
                                )}
                            </ListGroup>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        {/* Sezione Telefoni */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Telephone:</h5>
                            <ListGroup>
                                {contact.telephone?.length ? (
                                    contact.telephone.map((phoneObj, index) => (
                                        <ListGroup.Item key={index}>
                                            {phoneObj.telephone}
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <div className="empty-list">No telephones available</div>
                                )}
                            </ListGroup>
                        </Col>

                        {/* Sezione Note Cliente */}
                        <Col xs={12} md={6}>
                            <h5 className="section-title">Customer Notes</h5>
                            <div className="notes-box">
                                {contact.customer?.notes || "No notes available"}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        {/* Sezione Job Offers */}
                        <Col xs={12}>
                            <h5 className="section-title">Job Offers:</h5>
                            <ListGroup>
                                {contact.customer?.jobOffers?.length ? (
                                    contact.customer.jobOffers.map((jobOffer, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            className=" job-offer-item"
                                        >
                                            <Row className="text-start">
                                                <Col xs={12} md={6}>
                                                    <strong>Description:</strong> {jobOffer.description} <br />
                                                    <strong>Status:</strong> {jobOffer.status} <br />
                                                    <strong>Duration:</strong> {jobOffer.duration}
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <strong>Value:</strong> {jobOffer.offerValue} <br />
                                                    <strong>Notes:</strong> {jobOffer.notes} <br />
                                                    <strong>Required Skills:</strong> {jobOffer.requiredSkills?.map(skill => skill.skill).join(', ') || "N/A"}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <div className="empty-list text-start">No job offers available</div>
                                )}
                            </ListGroup>


                        </Col>
                    </Row>

                    <Row className="mt-4">
                        {/* Sezione Replacement History */}
                        <Col xs={12}>
                            <h5 className="section-title">Replacement History:</h5>
                            <ListGroup>
                                {contact.replacementHistory?.length ? (
                                    contact.replacementHistory.map((historyItem, index) => (
                                        <ListGroup.Item key={index}>
                                            {historyItem} {/* Dettagli specifici */}
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <div className="empty-list">No replacement history available</div>
                                )}
                            </ListGroup>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ViewCustomerDetails;
