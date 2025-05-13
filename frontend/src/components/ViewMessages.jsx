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
import {MessageFilter} from "../api/crm/filters/MessageFilter.ts";


function Filters(props) {
    const user = props.user;
    const setFilters = props.setFilters;
    const setCurrentPage = props.setCurrentPage;
    const [formFilters, setFormFilters] = useState(new MessageFilter(null, null, null));
    //const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        //reset the number of page
        setCurrentPage(0);
        //update filters
        setFilters(new MessageFilter(
            formFilters.sender,
            formFilters.channel,
            formFilters.state
        ));
    };

    const handleFilterChange = (event) => {
        let {name, value} = event.target;
        //update state
        setFormFilters((old) => ({
            ...old,
            [name]: value,
        }));
    }

    const handleClear = (event) => {
        const tmpFilter = new MessageFilter(null, null, null);
        setFormFilters(tmpFilter);
        setFilters(tmpFilter);
    }

    return (
        <div style={{width: '30%', padding: '20px'}} className="filterBox">
            <h4 className={"offerTitle"}>Filters</h4>
            <Form.Group controlId="filterSender" className="mb-3">
                <Form.Label>Filter by sender</Form.Label>
                <Form.Control
                    type="text"
                    name="sender"
                    value={formFilters.sender ?? ""}
                    placeholder="Enter sender"
                    onChange={handleFilterChange}
                />
            </Form.Group>
            <Form.Group controlId="filterChannel" className="mb-2">
                <Form.Label>Filter by Channel</Form.Label>
                <Form.Select
                    name="channel"
                    value={formFilters.channel ?? ""} // Imposta "all" come valore di default
                    onChange={handleFilterChange} // Funzione per gestire il cambiamento
                >
                    <option value="">All</option>
                    <option value="Email">Email</option>
                    <option value="Telephone">Telephone</option>
                    <option value="Other">Other</option>
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="filterState" className="mb-2">
                <Form.Label>Filter by State</Form.Label>
                <Form.Select
                    name="state"
                    value={formFilters.state ?? ""} // Imposta "all" come valore di default
                    onChange={handleFilterChange} // Funzione per gestire il cambiamento
                >
                    <option value="">All</option>
                    <option value="RECEIVED">Received</option>
                    <option value="READ">Read</option>
                    <option value="DISCARDED">Discarded</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DONE">Done</option>
                    <option value="FAILED">Failed</option>
                </Form.Select>
            </Form.Group>
            <Button variant="danger" onClick={handleClear}>
                <i className="bi bi-x-circle"></i> Clear Filters
            </Button>
            <Button variant="primary" className="custom-button mx-3 my-1" onClick={handleSubmit}>
                <i className="bi bi-search"></i> Apply Filters
            </Button>
        </div>
    );
}

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
    const [filters, setFilters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await MessageAPI.GetMessages(filters, new Pagination(currentPage, pageSize));
                setMessages(res);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [refresh, filters, currentPage, pageSize]);

    const handleSelect = (eventKey) => {
        const parsedValue = parseInt(eventKey, 10); // Converte l'eventKey in un numero intero
        setPageSize(parsedValue);
        //reset page
        setCurrentPage(0);
    };


    return(
        <div style={{display:'flex', paddingTop: '90px'}}>
            <Filters setFilters={setFilters} setCurrentPage={setCurrentPage}></Filters>
            <div style={{flex: 1, padding: '20px'}}>
                <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle className="custom-button m-2" id="dropdown-basic">
                        {pageSize ? `${pageSize} items` : "Select an option"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="5">5 items</Dropdown.Item>
                        <Dropdown.Item eventKey="10">10 items</Dropdown.Item>
                        <Dropdown.Item eventKey="20">20 items</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {messages.map((message, index) => (
                    <MyCard key={index} message={message} setRefresh={setRefresh}></MyCard>
                ))}
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        className="m-3"
                        variant="outline-primary"
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                        }}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage + 1}</span>
                    <Button
                        className="m-3"
                        variant="outline-primary"
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                        }}
                        disabled={messages.length < pageSize}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ViewMessages;