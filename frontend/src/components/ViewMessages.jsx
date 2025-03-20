import React, {useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../App.css';  // Importa il file CSS
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import {Pagination} from "../api/utils/Pagination.ts";
import {Card, Badge, Dropdown, ListGroup, ListGroupItem} from "react-bootstrap";
import { Row, Col, Toast } from 'react-bootstrap';
import { useNotification } from '../contexts/NotificationProvider';
import MessageAPI from "../api/crm/MessageAPI.js";

function MyCard(props){
    const message = props.message;
    const setRefresh = props.setRefresh;
    const { handleError, handleSuccess } = useNotification();

    const formattedDate = new Date(message.date).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
    const getBadgeColor = (state) => {
        switch (state) {
            case "RECEIVED":
                return "primary"; // Blu
            case "READ":
                return "info"; // Azzurro
            case "DISCARDED":
                return "secondary"; // Grigio
            case "PROCESSING":
                return "warning"; // Giallo
            case "DONE":
                return "success"; // Verde
            case "FAILED":
                return "danger"; // Rosso
            default:
                return "dark"; // Nero come fallback
        }
    };
    const getButtonColor = (state) => {
        switch (state) {
            case "RECEIVED":
                return "primary"; // Blu
            case "READ":
                return "info"; // Azzurro
            case "DISCARDED":
                return "secondary"; // Grigio
            case "PROCESSING":
                return "warning"; // Giallo
            case "DONE":
                return "success"; // Verde
            case "FAILED":
                return "danger"; // Rosso
            default:
                return "dark"; // Nero come fallback
        }
    };

    const updateMessage = async (newState) => {
        try {
            const res = await MessageAPI.UpdateStatusOfMessage(message.messageId, newState, null);
            handleSuccess("Message updated successfully.");
            setRefresh(message.messageId+"_"+newState)
        }
        catch (err) {
            handleError(err)
        }
    };

    return(
        <Card className="p-0 m-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
            <Row className="w-100">
                <Col xs={4} className="text-start">
                    {/* Nome a sinistra */}
                    <Card.Title className="hover-underline cursor-pointer">
                        Sender:{message.sender}
                    </Card.Title>
                </Col>
                <Col>
                    <span className="custom-text">
                        <Card.Title>Channel: {message.channel} </Card.Title>
                    </span>
                </Col>
                <Col xs={4} className="text-end">
                    <Badge pill bg={getBadgeColor(message.state)} className="me-2">
                        {message.state}
                    </Badge>
                </Col>
            </Row>
        </Card.Header>
        <Card.Body>
            <Row>
                {message.body}
            </Row>
        </Card.Body>
        <Card.Footer className="text-muted d-flex justify-content-between align-items-center">
            <span>Date: {formattedDate}</span>
            <div>
                {message.state == "RECEIVED" && (
                    <Button variant={getButtonColor("READ")} size="sm" className="me-2" onClick={() => updateMessage("READ")} >
                        READ
                    </Button>
                )}
                {message.state == "READ" && (
                    <>
                        <Button variant={getButtonColor("PROCESSING")} size="sm" className="me-2" onClick={() => updateMessage("PROCESSING")} >
                            PROCESSING
                        </Button>
                        <Button variant={getButtonColor("DONE")} size="sm" className="me-2" onClick={() => updateMessage("DONE")} >
                            DONE
                        </Button>
                        <Button variant={getButtonColor("DISCARDED")} size="sm" className="me-2" onClick={() => updateMessage("DISCARDED")} >
                            DISCARDED
                        </Button>
                        <Button variant={getButtonColor("FAILED")} size="sm" className="me-2" onClick={() => updateMessage("FAILED")} >
                            FAILED
                        </Button>
                    </>
                )}
                {message.state == "PROCESSING" && (
                    <>
                        <Button variant={getButtonColor("DONE")} size="sm" className="me-2" onClick={() => updateMessage("DONE")} >
                            DONE
                        </Button>
                        <Button variant={getButtonColor("FAILED")} size="sm" className="me-2" onClick={() => updateMessage("FAILED")} >
                            FAILED
                        </Button>
                    </>
                )}
            </div>
        </Card.Footer>
    </Card>);
}

function ViewMessages (props)  {
    const [messages, setMessages] = useState([]);
    const [refresh, setRefresh] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await MessageAPI.GetMessages(null, null);
                setMessages(res);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [refresh]);

    return(
        <div className="container mt-4" style={{paddingTop: '90px'}}>
            {messages.map((message, index) => (
                <MyCard key={index} message={message} setRefresh={setRefresh} ></MyCard>
            ))}
        </div>
    );
}

export default ViewMessages;