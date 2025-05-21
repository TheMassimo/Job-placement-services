import React, { useEffect, useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import SkillAPI from "../api/crm/SkillAPI.js";
import Form from "react-bootstrap/Form";
import ContactAPI from "../api/crm/ContactAPI.js";
import {useNotification} from "../contexts/NotificationProvider.jsx";

const PopupSkills = ({props, isOpen, onClose, onConfirm, preSelectedSkills = [] }) => {
    const user = props.user;
    const [selectedValues, setSelectedValues] = useState([]); // Tiene traccia delle selezioni
    const [skills, setSkills] = useState([]); // Tiene traccia delle skill disponibili
    const [newSkill, setNewSkill] = useState({
        skill: ''
    });
    const { handleError, handleSuccess } = useNotification();


    // Aggiorna i selectedValues con le skill pre-selezionate
    useEffect(() => {
        if (preSelectedSkills.length > 0) {
            setSelectedValues(preSelectedSkills);
        }
    }, [preSelectedSkills]);

    // Recupera le skill dall'API quando il componente viene montato
    useEffect(() => {
        SkillAPI.GetSkills(user?.xsrfToken)
            .then((res) => {
                setSkills(res);
            })
            .catch((err) => console.log(err));
    }, []);


    // Funzione per aggiungere/rimuovere una selezione
    const toggleSelection = (skill) => {
        setSelectedValues((prev) => {
            const exists = prev.some((selected) => selected.skillId === skill.skillId); // Controlla se esiste già
            if (exists) {
                // Rimuovi la skill se già selezionata
                return prev.filter((selected) => selected.skillId !== skill.skillId);
            } else {
                // Aggiungi la skill se non selezionata
                return [...prev, skill];
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSkill((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newSkill.skill === "")
            handleError("New skill must have a name", null);
        else{
            handleAdd(e);
            onConfirm(selectedValues)
        }

        //onClose()
    };

    const handleAdd = async (e) => {
        try {

            let resAddSkill = null;
            const tmpSkill = {
                skill: newSkill.skill
            };

            resAddSkill = await SkillAPI.AddSkill(tmpSkill, user?.xsrfToken);
            handleSuccess('Skill added successfully!');
            toggleSelection(resAddSkill)

        } catch (err) {
            console.error("Errore durante l'aggiunta della nuova skill:", err);
            handleError(err);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Seleziona le Skill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {skills.map((skill, index) => {
                    const isSelected = selectedValues.some(
                        (selected) => selected.skillId === skill.skillId // Controlla se la skill è selezionata
                    );
                    return (
                        <Card
                            key={index}
                            className={`p-0 m-2 text-center ${isSelected ? "border-success" : ""}`} // Aggiunge bordo verde se selezionata
                            style={{
                                backgroundColor: isSelected ? "lightgreen" : "white", // Cambia il colore di sfondo
                                cursor: "pointer", // Indica che è cliccabile
                            }}
                            onClick={() => toggleSelection(skill)} // Passa l'intero oggetto skill
                        >
                            <Card.Body>{skill.skill}</Card.Body>
                        </Card>
                    );
                })}

                <Form onSubmit={handleSubmit} className="newSkillForm">
                    <Form.Group controlId="addNewSkill" className="mb-2">
                        <Form.Control
                            type="text"
                            name="skill"
                            placeholder="Create new skill"
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="custom-button">
                        Add new skill
                    </Button>
                </Form>
        </Modal.Body>
    <Modal.Footer>
                <Button variant="primary" onClick={() => onConfirm(selectedValues)}>
                    Confirm
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default PopupSkills;
