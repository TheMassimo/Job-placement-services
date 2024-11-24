import {Col, Container, Row} from "react-bootstrap";

function HomeLayout(props) {
    return (
        <Container style={{ paddingTop: '80px' }}>
            <Row>
                <Col sm={4}>miao</Col>
                <Col sm={8}>baua</Col>
            </Row>
        </Container>
    );
}

export default HomeLayout;