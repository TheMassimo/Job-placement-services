import React, { useState, useEffect } from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import ContactAPI from "../api/crm/ContactAPI";

function ViewContactDetails() {
    const [contact, setContact] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { contactId } = useParams();
    const location = useLocation();
    const mode = location.state?.mode || null; // Valore di default "contact"

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
        <div style={{ paddingTop: "90px" }}>
            <Card className="view-customer-details-card m-3">
                <h3>
                    {mode === "customer"
                        ? "Customer Details"
                        : mode === "professional"
                            ? "Professional Details"
                            : "Contact Details"}
                </h3>
                <Card.Header className="d-flex justify-content-between align-items-center custom-card-header">
                    <Card.Title className="custom-card-title">
                        {contact.name} {contact.surname}
                    </Card.Title>
                </Card.Header>
                <Card.Body className="custom-card-body">
                    <Row>
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

                        <Col xs={12} md={6}>
                            <h5 className="section-title">SSN code:</h5>
                            <div className="notes-box">
                                {contact.ssn || "No ssn available"}
                            </div>
                        </Col>
                    </Row>

                    {/* Sezione info customer */}
                    <Row className="mt-4">

                        {mode === "customer" || (mode===null && contact.customer !== null) && (
                            <>
                                <Row className="mt-4">
                                    <Col xs={12}>
                                        <h5 className="section-title">Customer Notes</h5>
                                        <div className="notes-box">
                                            {contact.customer?.notes || "No notes available"}
                                        </div>
                                    </Col>
                                </Row>
                                {/* Sezione Job Offers */}
                                <Row className="mt-4">
                                    <Col xs={12}>
                                        <h5 className="section-title">Job Offers:</h5>
                                        <ListGroup>
                                            {contact.customer?.jobOffers?.length ? (
                                                contact.customer.jobOffers.map((jobOffer, index) => (
                                                    <ListGroup.Item key={index} className="job-offer-item">
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
                                {/* Placement History */}
                                <Row className="mt-4">
                                    <Col xs={12}>
                                        <h5 className="section-title">Placement History:</h5>
                                        <ListGroup>
                                            {contact.replacementHistory?.length ? (
                                                contact.replacementHistory.map((historyItem, index) => (
                                                    <ListGroup.Item key={index}>
                                                        {historyItem}
                                                    </ListGroup.Item>
                                                ))
                                            ) : (
                                                <div className="empty-list">No placement history available</div>
                                            )}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </>
                        )}


                        {/*Sezione info professional */}
                        {mode === "professional" || (mode===null && contact.professional !== null) && (
                            <>
                                {/* Note Professional */}
                                <Row className="mt-4">
                                    <Col xs={12} md={6}>
                                        <h5 className="section-title">Professional Notes</h5>
                                        <div className="notes-box">
                                            {contact.professional?.notes || "No notes available"}
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={9} md={4}>
                                        <h5 className="section-title">Employment:</h5>
                                        <div className="notes-box">
                                            {contact.professional?.employment || "No employment available"}
                                        </div>
                                    </Col>
                                    <Col xs={9} md={4}>
                                        <h5 className="section-title">Geographical info:</h5>
                                        <div className="notes-box">
                                            {contact.professional?.geographicalInfo || "No geographical info available"}
                                        </div>
                                    </Col>
                                    <Col xs={9} md={4}>
                                        <h5 className="section-title">Daily rate:</h5>
                                        <div className="notes-box">
                                            {contact.professional?.dailyRate || "No daily rate available"}
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="mt-4">
                                    <Col xs={12}>
                                        <h5 className="section-title">Job Offer Proposal:</h5>
                                        <ListGroup>
                                            {contact.professional?.jobOfferProposal?.length ? (
                                                contact.professional.jobOfferProposal.map((jobOffer, index) => (
                                                    <ListGroup.Item key={index} className="job-offer-item">
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
                                {/* Skills */}
                                <Row className="mt-4">
                                    <Col xs={12} md={6}>
                                        <h5 className="section-title">Skills:</h5>
                                        {contact.professional?.skills?.length ? (
                                            contact.professional.skills.map(skill => skill.skill).join(', ')
                                        ) : (
                                            <div className="empty-list">No skills available</div>
                                        )}
                                    </Col>
                                </Row>
                            </>
                        )}


                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ViewContactDetails;
