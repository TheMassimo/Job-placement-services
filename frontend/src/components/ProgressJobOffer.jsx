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

function ProgressJobOffer(props) {
    const { jobOfferId } = useParams();
    const [contact, setContact] = useState({});
    const [jobOffer, setJobOffer] = useState({});
    const [candidates, setCandidates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState(null);
    const [note, setNote] = useState("");
    const { handleError, handleSuccess } = useNotification();
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);

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

                //get last history
                const history = await JobOffersAPI.GetJobOfferNewestHistory(jobOfferId);
                //set candidate profile
                // Imposta i profili dei candidati
                if (history.candidates) {
                    // get all id
                    const candidatePromises = history.candidates.map(async (application) => {
                        return await ContactAPI.GetContactByProfessionalId(application.professionalId);
                    });
                    //Attendi che tutte le promesse siano risolte
                    const resolvedCandidates = await Promise.all(candidatePromises);
                    //Aggiorna lo stato con i candidati ricevuti
                    setCandidates(resolvedCandidates);
                }
                //set previous note
                if(history.note) {
                    setNote(history.note)
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [jobOfferId]);

    //Per gestione modal
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);
    const handleConfirmContact = (contact) => {
        setCandidates(contact)
        setShowModal(false);
    }

    // Gestione dei cambiamenti nei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote(value);
    };

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
                // Se è stato specificato un targetState, usa quello
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

            if((nextState == "CANDIDATE_PROPOSAL")&&(candidates.length < 1)) {
                const err = {
                    message: "Aggiungere almeno un professional"
                };
                handleError(err);
            }else if((nextState == "CONSOLIDATED")&&(selectedCandidateId == null)) {
                const err = {
                    message: "Selezionare un professionista"
                };
                handleError(err);
            }else{
                //Aggiorna le note di questa history
                const upNote = await JobOffersAPI.UpdateJobOfferHistoryNote(jobOfferId, note);

                let tmpCandidatesId = []
                //decido cosa impostare
                if(nextState == "CANDIDATE_PROPOSAL") {
                    //prendo solo gli id dei professional e rimuovo tutte le altre informazioni
                    tmpCandidatesId = candidates.map(item => item.professional?.professionalId).filter(id => id !== undefined);
                }else if(nextState == "CONSOLIDATED") {
                    tmpCandidatesId.push(selectedCandidateId)
                }

                // Aggiorna lo stato della job offer nel database
                const response = await JobOffersAPI.UpdateStatusJobOffer(jobOfferId, nextState, tmpCandidatesId);

                if (response) {
                    console.log("Response=>", response);
                    // Aggiorna lo stato locale per riflettere il cambiamento nell'interfaccia
                    setJobOffer((prev) => ({ ...prev, status: nextState }));
                }

                setNote("")
                handleSuccess('Step completato');
            }
        } catch (err) {
            console.error(err);
            handleError(err);
        }
    };

    const handleRowClick = (professionalId) => {
        setSelectedCandidateId(professionalId);
    };

    const cancelCandidate = (professionalId) =>{
        // Rimuovere l'elemento con il professionalId specificato
        const updatedCandidates = candidates.filter(candidate => candidate.professional.professionalId !== professionalId);

        // Aggiornare lo stato con la lista dei candidati aggiornata
        setCandidates(updatedCandidates);
    }

    return (
        <div style={{paddingTop: '90px'}}>
            {jobOffer.status && (
                <StepProgress currentStep={jobOffer.status}/>
            )}

            <PopupCandidate
                mode={mode}
                showModal={showModal}
                handleModalClose={handleModalClose}
                toLoad={"Professional"}
                handleConfirmContact={handleConfirmContact}
                preSelectedProfessionals={candidates}
            />

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

                    <Row>
                        <Form.Group controlId="formNotes" className="text-start">
                            <Form.Label>Note di questa fase</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                placeholder="Enter Additional Notes"
                                value={note}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Row>

                    {/*Tabella selezione candidati */}
                    {jobOffer.status == "SELECTION_PHASE" && (
                    <Row className="mt-4">
                        {/* Sezione Note Cliente */}
                        <Col>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="section-title m-0">Selected Profiles</h5>
                                <Button variant="success" className="mx-2" onClick={handleModalShow}>
                                    Select Professional <i className="bi bi-plus-lg"></i>
                                </Button>
                            </div>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Surname</th>
                                    <th>SSN</th>
                                    <th> </th>
                                </tr>
                                </thead>
                                <tbody>
                                {candidates.map((candidate, index) => (
                                    <tr key={candidate.professional.professionalId}>
                                        <td>{candidate.professional.professionalId}</td>
                                        <td>{candidate.name}</td>
                                        <td>{candidate.surname}</td>
                                        <td>{candidate.ssn}</td>
                                        <td>
                                            <Button variant="danger" className="mx-2"
                                                    onClick={() => cancelCandidate(candidate.professional.professionalId)}>
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    )}

                    {/*Tabella candidati propsti */}
                    {jobOffer.status === "CANDIDATE_PROPOSAL" && (
                        <Row className="mt-4">
                            <Col>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="section-title m-0">Candidate Profiles</h5>
                                </div>
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
                                    {candidates.map((candidate) => {
                                        const isSelected = candidate.professional.professionalId === selectedCandidateId;
                                        return (
                                            <tr
                                                key={candidate.professional.professionalId}
                                                onClick={() => handleRowClick(candidate.professional.professionalId)}
                                                className = {isSelected ? "table-success" : null}
                                            >
                                                <td>{candidate.professional.professionalId}</td>
                                                <td>{candidate.name}</td>
                                                <td>{candidate.surname}</td>
                                                <td>{candidate.ssn}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    )}

                </Card.Body>
            </Card>

            <div className="d-flex justify-content-center my-4">
                {jobOffer.status != "ABORTED" && (
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
