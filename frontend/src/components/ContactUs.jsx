import React, {useEffect, useState} from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import {useNavigate, useParams} from "react-router-dom";
import { useNotification } from '../contexts/NotificationProvider';
import MessageAPI from "../api/crm/MessageAPI";


function ContactUs(props) {
    const [submitButton, setSubmitButton] = useState(false);
    const { handleError, handleSuccess } = useNotification();
    const [formData, setFormData] = useState({
        sender: '',
        subject: '',
        body: '',
        channel: 'Address'
    });

    //Gestione invio form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await MessageAPI.InsertNewMessage(formData, null);
            handleSuccess('Messaggio inviato corettamente');

            //azzero il form
            setFormData({
                sender: '',
                subject: '',
                body: '',
                channel: 'Address'
            });
        }
        catch (err) {
            handleError(err);
        }
    };

    // Gestione dei cambiamenti nei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="container mt-4" style={{paddingTop: '90px'}}>
            <h2 className="offerTitle">
                Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="filterBox">
                {/* Descrizione and notes */}
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formDescription" className="text-start">
                            <Form.Label>Your name</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                name="sender"
                                placeholder="Enter your contact"
                                value={formData.sender}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formDescription" className="text-start">
                            <Form.Label>Your channel</Form.Label>
                            <Form.Control
                                as="select"
                                name="channel"
                                value={formData.channel}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                            >
                                <option value="">Select a channel</option> {/* Opzione predefinita */}
                                <option value="Email">Email</option>
                                <option value="Telephone">Telephone</option>
                                <option value="Other">Other</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formNotes" className="text-start">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="form-control-sm"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Form.Group controlId="formNotes" className="text-start">
                        <Form.Label>Body</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="body"
                            placeholder="Enter what you want here"
                            value={formData.body}
                            onChange={handleChange}
                            className="form-control-sm"
                        />
                    </Form.Group>
                </Row>
                {/* Submit Button */}
                <Button
                    variant="primary"
                    type="submit"
                    className="custom-button"
                >
                    Save
                </Button>
            </form>
        </div>
    );
}

export default ContactUs;
