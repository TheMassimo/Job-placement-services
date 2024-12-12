import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title || "Confirm"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message || "Are you sure you want to proceed?"}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onConfirm}>
                    Confirm
                </Button>
                <Button variant="success" onClick={onClose}>
                    Abort
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationPopup;
