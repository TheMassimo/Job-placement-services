import React, {useEffect, useState} from 'react';
import {Card, Dropdown} from "react-bootstrap";
import {Row, Col} from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import { useNotification } from '../contexts/NotificationProvider';
import AnalyticsAPI from "../api/analytics/AnalyticsAPI.js";


function ViewAnalytics(props) {
    const user = props.user;
    const { handleError, handleSuccess } = useNotification()
    const [shownLocations, setShownLocations] = useState(1);
    const [locationList, setLocationList] = useState([]);
    const [averageJobOfferValue, setAverageJobOfferValue] = useState(0);
    const [averageJobOfferDuration, setAverageJobOfferDuration] = useState(0);
    const [minMaxJobOfferValue, setMinMaxJobOfferValue] = useState([0, 0]);
    const [averageJobOfferMonthlyValue, setAverageJobOfferMonthlyValue] = useState(0);

    //USE Effect
    useEffect(() => {
        AnalyticsAPI.GetAverageJobOfferValue(user?.xsrfToken).then((res) => {
            //get data
            setAverageJobOfferValue(res);
        }).catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        AnalyticsAPI.GetAverageJobOfferDuration(user?.xsrfToken).then((res) => {
            //get data
            setAverageJobOfferDuration(res);
        }).catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        AnalyticsAPI.GetMinMaxJobOfferValue(user?.xsrfToken).then((res) => {
            //get data
            setMinMaxJobOfferValue(res);
        }).catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        AnalyticsAPI.GetAverageJobOfferMonthlyValue(user?.xsrfToken).then((res) => {
            //get data
            setAverageJobOfferMonthlyValue(res);
        }).catch((err) => console.log(err))
    }, []);

    useEffect(() => {
        AnalyticsAPI.GetLocationsList(shownLocations, user?.xsrfToken).then((res) => {
            //get data
            setLocationList(res);
        }).catch((err) => console.log(err))
    }, [shownLocations]);

    const handleSelect = (eventKey) => {
        const parsedValue = parseInt(eventKey, 10); // Converte l'eventKey in un numero intero
        setShownLocations(parsedValue)
    };

    return (
        <div style={{paddingTop: '90px', display: 'flex', flexDirection: 'row'}}>
            <div style={{width: '300%', paddingLeft: '100px', paddingRight: '100px'}}>

                {/* Analytics */}
                <h4 className={"filtersTitle"}>Analytics</h4>
                {/* Average Job Offer Value */}
                <Card className="p-0 m-1" style={{height: '70px'}}>
                    <Card.Body>
                        <Row>
                            <Col className="text-start" xs={8}>
                                <Card.Title> Average Job Offer Value </Card.Title>
                            </Col>
                            <Col className="text-end" xs={4}>
                                <span> {averageJobOfferValue ? `€ ${averageJobOfferValue.toFixed(2)}` : 'No data available'}</span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Average Job Offer Duration */}
                <Card className="p-0 m-1" style={{height: '70px'}}>
                    <Card.Body>
                        <Row>
                            <Col className="text-start" xs={8}>
                                <Card.Title> Average Job Offer Duration </Card.Title>
                            </Col>
                            <Col className="text-end" xs={4}>
                                <span>{averageJobOfferDuration ? `${averageJobOfferDuration.toFixed(0)} months` : 'No data available'}</span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Min Max Job Offer Value */}
                <Card className="p-0 m-1" style={{height: '70px'}}>
                    <Card.Body>
                        <Row>
                            <Col className="text-start" xs={8}>
                                <Card.Title> Minimum and Maximum job offer values </Card.Title>
                            </Col>
                            <Col className="text-end" xs={4}>
                                <span>{minMaxJobOfferValue ? `Min: ${minMaxJobOfferValue[0]} - Max: ${minMaxJobOfferValue[1]}` : 'No data available'}</span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Average Job Offer Value per month */}
                <Card className="p-0 m-1" style={{height: '70px'}}>
                    <Card.Body>
                        <Row>
                            <Col className="text-start" xs={8}>
                                <Card.Title> Average Job Offer payment per month </Card.Title>
                            </Col>
                            <Col className="text-end" xs={4}>
                                <span>{averageJobOfferMonthlyValue ? `${averageJobOfferMonthlyValue.toFixed(2)}` : 'No data available'}</span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                {/*
                {/*Professionals locations}
                <Card className="p-0 m-1"
                      style={{height: `${locationList.length > 0 ? 55 + locationList.length * 30 : 85}px`}}>
                    <Card.Body>
                        <Row>
                            <Col className="text-start" xs={4}>
                                <Card.Title> Locations ordered by existing Professionals </Card.Title>
                            </Col>
                            <Col className="text-center" xs={4}>
                                <Dropdown onSelect={handleSelect}>
                                    <Dropdown.Toggle className="custom-button m-2" id="dropdown-basic">
                                        {locationList.length ? `${shownLocations} items` : "Select an option"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey="1">1 item</Dropdown.Item>
                                        <Dropdown.Item eventKey="3">3 items</Dropdown.Item>
                                        <Dropdown.Item eventKey="10">10 items</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col className="center" xs={4} style={{paddingTop: '10px'}}>
                                {/*Show locations list}
                                {locationList.length > 0 ?
                                    <>
                                        {locationList.map((location) => {
                                            return (
                                                <>
                                                    <Row style={{paddingBottom: '10px'}}>
                                                        <Col className="text-end fw-bold">
                                                            {location.location}
                                                        </Col>
                                                        <Col className="text-start">
                                                            {location.professionalsCount} {location.professionals > 1 ? 'professionals' : 'professional'}
                                                        </Col>
                                                    </Row>
                                                </>
                                            );
                                        })}
                                    </>
                                    :
                                    <div className="text-end"> No data available </div>
                                }
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                */}

                <Row style={{paddingTop: '20px'}}>
                    <Col className="center">
                        <Button
                            className={"custom-button m-2"}
                            variant="secondary"
                            href="http://localhost:3000/dashboards"
                            target="_blank"
                        >
                            Grafana monitoring
                        </Button>
                    </Col>
                </Row>


            </div>
        </div>
    );
}

export default ViewAnalytics;
