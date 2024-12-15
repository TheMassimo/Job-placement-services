import React, {useState, useEffect} from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import '../App.css';  // Importa il file CSS
import ContactAPI from "../api/crm/ContactAPI.js";
import { useParams } from 'react-router-dom';



function ViewCustomerDetails(props) {
    const [contact, setContact] = useState();
    const [isLoading, setIsLoading] = useState(true); // Stato per gestire il caricamento
    const { contactId } = useParams();

    //USE Effect
    useEffect(() => {
        console.log("dentro use effect");
        ContactAPI.GetContactById(contactId).then((res) => {
            //get data
            setContact(res);
            setIsLoading(false); // Disabilita lo stato di caricamento

            console.log("CONTACT ",res);
        }).catch((err) => {
            console.error("Errore nel recupero del contatto:", err);
            setIsLoading(false); // Disabilita lo stato di caricamento anche in caso di errore
        });
    }, [contactId]);

    if (isLoading) {
        return <div>Loading contact details...</div>; // Stato di caricamento
    }

    console.log("AAAAAAAAAAAA", contactId);
    return (
        <Card className="p-0 m-3">
            {/* Header del Card */}
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Row className="w-100">
                    <Col xs={4} className="text-start">
                        {/* Nome a sinistra */}
                        <Card.Title>
                            {contact.name}
                        </Card.Title>
                    </Col>
                </Row>
            </Card.Header>

            {/* Corpo del Card */}
            <Card.Body>
                <Row>
                    {/* Prima colonna - Numeri di telefono */}
                    <Col xs={12} md={4}>
                        <h6>Telephone</h6>
                    </Col>

                    {/* Seconda colonna - Email */}
                    <Col xs={12} md={4}>
                        <h6>Email</h6>
                    </Col>

                    {/* Terza colonna - Indirizzi */}
                    <Col xs={12} md={4}>
                        <h6>Addresses</h6>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default ViewCustomerDetails;
