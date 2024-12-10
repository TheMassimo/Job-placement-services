import { React } from 'react';
import { Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <>
            <Row style={{ marginTop: "200px" }}> {/* Imposta margine superiore personalizzato */}
                <h2 className="text-center">404 - Page not found!</h2>
            </Row>
            <Row style={{ marginTop: "20px" }}> {/* Imposta margine superiore personalizzato */}
                <Link className="text-center" to="/">
                    <Button variant="success">Go back</Button>
                </Link>
            </Row>
        </>
    );
}

export default NotFoundPage;