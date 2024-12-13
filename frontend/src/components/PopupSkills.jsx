import React, { useEffect, useState } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import SkillAPI from "../api/crm/SkillAPI.js";

const PopupSkills = ({ isOpen, onClose, onConfirm, preSelectedSkills = [] }) => {
    const [selectedValues, setSelectedValues] = useState([]); // Tiene traccia delle selezioni
    const [skills, setSkills] = useState([]); // Tiene traccia delle skill disponibili

    // Aggiorna i selectedValues con le skill pre-selezionate
    useEffect(() => {
        if (preSelectedSkills.length > 0) {
            setSelectedValues(preSelectedSkills);
        }
    }, [preSelectedSkills]);

    // Recupera le skill dall'API quando il componente viene montato
    useEffect(() => {
        SkillAPI.GetSkills()
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
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => onConfirm(selectedValues)}>
                    Conferma
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Chiudi
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default PopupSkills;
