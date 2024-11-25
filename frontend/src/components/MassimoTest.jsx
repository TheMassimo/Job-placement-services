import {useState, useEffect} from "react";
import {Col, Container, Row} from "react-bootstrap";
import ContactAPI from "../api/crm/ContactAPI.js";

function MassimoTest(props) {
    const [filter, setFilter] = useState({
        status: [
            'Created',
            'SelectionPhase',
            'CandidateProposal',
            'Consolidated',
            'Done',
            'Aborted'
        ]
    });
    const [page, setPage] = useState(1);

    useEffect(() => {
        ContactAPI.TEST(filter, page).then((res) => {
            console.log("Entrato", res);
        }).catch((err) => console.log(err))
        console.log("useEffect triggered!");
    }, []);

    return (
        <Container style={{ paddingTop: '80px' }}>
            <Row>
                <Col sm={4}>Massimo</Col>
                <Col sm={8}>Test</Col>
            </Row>
        </Container>
    );
}

export default MassimoTest;