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
import PopupCandidate from "./PopupCandidate";
import PopupConfirmation from "./PopupConfirmation";
import SkillAPI from "../api/crm/SkillAPI.js";
import { useNotification } from '../contexts/NotificationProvider';
import ContactAPI from "../api/crm/ContactAPI.js"; // Assicurati di avere una API per le job offers
import JobOffersAPI from "../api/crm/JobOffersAPI.js"; // Assicurati di avere una API per le job offers
import StepProgress from "../components/StepProgress";

function JobOfferHistoryCard({ historyItem }) {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // get all id
                const candidatePromises = historyItem.candidates.map(async (application) => {
                    return await ContactAPI.GetContactByProfessionalId(application.professionalId);
                });
                //Attendi che tutte le promesse siano risolte
                const resolvedCandidates = await Promise.all(candidatePromises);
                //Aggiorna lo stato con i candidati ricevuti
                setCandidates(resolvedCandidates);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [historyItem]);

    return (
        <Card className="view-job-offer-history-card m-3">
            {/* Header */}
            <Card.Header className="d-flex justify-content-between align-items-center custom-card-header">
                <Card.Title className="custom-card-title">
                    Status: {historyItem.jobOfferStatus}
                </Card.Title>
            </Card.Header>

            {/* Corpo */}
            <Card.Body className="custom-card-body">
                <Row>
                    {/* Job Offer History ID */}
                    <Col xs={12} md={6}>
                        <h5 className="section-title">Date and time:</h5>
                        <ListGroup.Item>{new Date(historyItem.date).toLocaleString()}</ListGroup.Item>
                    </Col>

                    {/* Status */}
                    <Col xs={12} md={6}>
                        <h5 className="section-title">Status:</h5>
                        <ListGroup.Item>{historyItem.jobOfferStatus}</ListGroup.Item>
                    </Col>
                </Row>

                <Row className="mt-4">
                    {/* Note */}
                    <Col xs={12}>
                        <h5 className="section-title">Notes:</h5>
                        <div className="notes-box">
                            {historyItem.note || "No notes available"}
                        </div>
                    </Col>
                </Row>

                {/* Tabella Candidati (se presenti) */}
                {(historyItem.jobOfferStatus=="SELECTION_PHASE" && candidates.length > 0) && (
                    <Row className="mt-4">
                        <Col>
                            <h5 className="section-title">Candidates</h5>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>SSN</th>
                                </tr>
                                </thead>
                                <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={index}>
                                        <td>{candidate.professional?.professionalId || "-"}</td>
                                        <td>{candidate.name || "-"}</td>
                                        <td>{candidate.surname || "-"}</td>
                                        <td>{candidate.ssn || "-"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                )}

                {/* Tabella Candidati (se presenti) */}
                {(historyItem.jobOfferStatus=="CANDIDATE_PROPOSAL" && candidates.length > 0) && (
                    <Row className="mt-4">
                        <Col>
                            <h5 className="section-title">Candidates</h5>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>SSN</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={index}>
                                        <td>{candidate.professional?.professionalId || "-"}</td>
                                        <td>{candidate.name || "-"}</td>
                                        <td>{candidate.surname || "-"}</td>
                                        <td>{candidate.ssn || "-"}</td>
                                        <td>{candidate.ApplicationStatus || "-"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
}

function ViewJobOfferHistory(props) {
    const { jobOfferId } = useParams();
    const [history, setHistory] = useState([]);
    const { handleError, handleSuccess } = useNotification();

    useEffect(() => {
        const fetchData = async () => {
            try {
                //get the history of the job offer
                const response = await JobOffersAPI.GetJobOfferHistory(jobOfferId);
                // Ordina per data (dal meno recente al più recente)
                const sortedHistory = response.sort((a, b) => new Date(a.date) - new Date(b.date));
                // Imposta lo stato con la cronologia ordinata
                setHistory(sortedHistory);
                console.log(sortedHistory);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [jobOfferId]);


    return (
        <div style={{paddingTop: '90px'}}>
            <h3>Job Offer History</h3>
            {history.map((item) => (
                <JobOfferHistoryCard key={item.jobOfferHistoryId} historyItem={item} />
            ))}
        </div>
    );
}

export default ViewJobOfferHistory;
