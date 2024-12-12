import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Toast } from 'react-bootstrap';
import ContactAPI from "../api/crm/ContactAPI.js";
import CustomerAPI from "../api/crm/CustomerAPI.js";
import ProfessionalAPI from "../api/crm/ProfessionalAPI.js";
import PopupSkills from "./PopupSkills.jsx";
import {useNavigate, useParams} from "react-router-dom";
import { useNotification } from '../contexts/NotificationProvider';

function ContactForm(props) {
    const { contactId } = useParams();
    const { action } = useParams();
    const mode = props.mode;
    const navigate = useNavigate();
    const { handleError, handleSuccess } = useNotification();
    const [contact, setContact] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        ssn: '',
        category: '',
        notes: '',
        telephone: [],
        email: [],
        address: [],
        customerNotes: '',
        geographicalInfo: '',
        dailyRate: 0,
        skills: [],
        professionalNotes: '',
    });

    const [customerChecked, setCustomerChecked] = useState(false);
    const [professionalChecked, setProfessionalChecked] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [submitButton, setSubmitButton] = useState(false);

    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || '',
                surname: contact.surname || '',
                ssn: contact.ssn || '',
                category: contact.category || '',
                notes: contact.notes || '',
                telephone: (contact.telephone || []).map(obj => ({ ...obj })),
                email: (contact.email || []).map(obj => ({ ...obj })),
                address: (contact.address || []).map(obj => ({ ...obj })),
                customerNotes: contact.customer?.notes || '',
                geographicalInfo: contact.professional?.geographicalInfo || '',
                dailyRate: contact.professional?.dailyRate || 0,
                skills: contact.skills || [],
                professionalNotes: contact.professional?.notes || '',
            });
            setCustomerChecked(!!contact.customer);
            setProfessionalChecked(!!contact.professional);
            setSelectedSkills(contact.professional?.skills || []);
        }
    }, [contact]);

    useEffect(() => {
        if (contactId) {
            ContactAPI.GetContactById(contactId)
                .then((res) => {
                    setContact(res);
                })
                .catch((err) => console.log(err));
        }
    }, [contactId]);

    // FUCTIONS
    // Gestione dei cambiamenti nei campi del form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    //Gestione invio form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitButton(true);

        if (action === "add") {
            handleAdd(e);
        } else if (action === "edit") {
            handleEdit(e);
        }

        setSubmitButton(false);
    };
    const handleAdd = async (e) => {
        try {
            //take only id of skills
            if (selectedSkills) {
                formData.skills = selectedSkills.map((skill) => skill.skillId);
            }

            let resAddContact = null;
            // Prima chiamata API per aggiugnere il contatto
            if (mode === null) {
                resAddContact = await ContactAPI.AddContact(formData);
                handleSuccess('Contact added successfully!');
            }

            // Se spuntato aggiungere anche il customer
            if( (mode===null || mode==="Customer") && customerChecked) {
                const contactId = resAddContact?.contactId || contact?.contactId;
                const tmpCustomerData = {contactId: contactId, notes: formData.customerNotes}
                const resAddCustomer = await CustomerAPI.AddCustomer(tmpCustomerData);
                handleSuccess('Customer added successfully!');
            }

            // Se spuntato aggiungere anche il professional
            if( (mode===null || mode==="Professional") && professionalChecked) {
                const contactId = resAddContact?.contactId || contact?.contactId;
                const tmpProfessionalData = {
                    contactId: contactId,
                    geographicalInfo: formData.geographicalInfo,
                    dailyRate: formData.dailyRate,
                    notes: formData.professionalNotes,
                    skills: formData.skills,
                }
                const resAddProfessional = await ProfessionalAPI.AddProfessional(tmpProfessionalData);
                handleSuccess('Professional added successfully!');
            }
            //if all is right go back to contacts
            navigate(`/contacts`)
        } catch (err) {
            console.error("Errore durante l'elaborazione:", err);
            handleError(err);
        }
    };
    const handleEdit = async () => {
        try {

            //change name/surname/ssn
            /*
            let resAddContact = null;
            // Prima chiamata API per aggiugnere il contatto
            if (mode === null) {
                //update name, surname and ssn
                const tmpContact = {contactId:contact.contactId, name:formData.name, surname:formData.surname, ssn:formData.ssn};
                const resUpdateContact = await ContactAPI.UpdateContact(tmpContact);
                //check for email/telephone/address
                processContactChanges(contact, formData)
                handleSuccess('Contact data update!');
            }
            */


            // Se spuntato aggiungere anche il customer
            /*
            if( (mode===null || mode==="Customer") && customerChecked) {
                const customerId = contact?.customer?.customerId;
                const resUpdateCustomer = await CustomerAPI.UpdateNotes(customerId, formData.customerNotes);
                console.log(resUpdateCustomer);
                handleSuccess('Customer data update!');
            }

             */

            /*
            // Se spuntato aggiungere anche il professional
            if( (mode===null || mode==="Professional") && professionalChecked) {
                const contactId = resAddContact?.contactId || contact?.contactId;
                const tmpProfessionalData = {
                    contactId: contactId,
                    geographicalInfo: formData.geographicalInfo,
                    dailyRate: formData.dailyRate,
                    notes: formData.professionalNotes,
                    skills: formData.skills,
                }
                const resAddProfessional = await ProfessionalAPI.AddProfessional(tmpProfessionalData);
                handleSuccess('Professional added successfully!');
            }
            */
            //if all is right go back to contacts
            //navigate(`/contacts`)
        } catch (err) {
            console.error("Errore durante l'elaborazione:", err);
            handleError(err);
        }
    };

    const processContactChanges = (contact, formData, API) => {
        // Mappa i campi alle relative funzioni API
        const fieldAPI = {
            telephone: {
                add: ContactAPI.AddTelephoneToContact,
                update: ContactAPI.UpdateTelephoneOfContact,
                delete: ContactAPI.DeleteTelephoneOfContact,
            },
            email: {
                add: ContactAPI.AddEmailToContact,
                update: ContactAPI.UpdateEmailOfContact,
                delete: ContactAPI.DeleteEmailOfContact,
            },
            address: {
                add: ContactAPI.AddAddressToContact,
                update: ContactAPI.UpdateAddressOfContact,
                delete: ContactAPI.DeleteAddressOfContact,
            },
        };

        const processField = (contactField, formDataField, idKey, valueKey, apiMethods) => {
            // Mappa i dati di origine in oggetti chiave-valore
            const contactMap = new Map((contactField || []).map(item => [item[idKey], item[valueKey]]));
            const formDataMap = new Map((formDataField || []).map(item => [item[idKey], item[valueKey]]));

            //console.log("TEst contact:", contactMap, "  formData:", formDataMap);

            // Gestisci eliminazioni
            for (let id of contactMap.keys()) {
                if (!formDataMap.has(id)) {
                    apiMethods.delete(contactId, id);
                }
            }

            // Gestisci aggiunte e aggiornamenti
            for (let [id, value] of formDataMap.entries()) {
                if (contactMap.has(id)) {
                    if (contactMap.get(id) !== value) {
                        apiMethods.update(contactId, id, value);
                    }
                } else {
                    apiMethods.add(contactId, value);
                }
            }
        };

        // Chiama processField per ogni campo
        processField(contact.telephone, formData.telephone, 'telephoneId', 'telephone', fieldAPI.telephone);
        processField(contact.email, formData.email, 'emailId', 'email', fieldAPI.email);
        processField(contact.address, formData.address, 'addressId', 'address', fieldAPI.address);
    };


    // Funzioni di gestione telefono
    const addPhoneNumber = () => {
        const nextId = String.fromCharCode(65 + formData.telephone.length);
        setFormData({
            ...formData,
            telephone: [
                ...formData.telephone,
                { telephoneId:nextId, telephone: '' }
            ]
        });
    };
    const removePhoneNumber = (index) => {
        setFormData({
            ...formData,
            telephone: formData.telephone.filter((_, i) => i !== index),
        });
    };
    const handlePhoneNumberChange = (index, value) => {
        const updatedNumbers = [...formData.telephone];
        updatedNumbers[index].telephone = value;
        setFormData({ ...formData, telephone: updatedNumbers });
    };

    // Funzioni di gestione email
    const addEmailAddress = () => {
        const nextId = String.fromCharCode(65 + formData.email.length);
        // Aggiungi la nuova email con l'ID incrementale
        setFormData({
            ...formData,
            email: [
                ...formData.email,
                { emailId: nextId, email: '' } // Assegna 'id' come lettera incrementale
            ]
        });
    };
    const removeEmailAddress = (index) => {
        setFormData({
            ...formData,
            email: formData.email.filter((_, i) => i !== index),
        });
    };
    const handleEmailAddressChange = (index, value) => {
        const updatedEmails = [...formData.email];
        updatedEmails[index].email = value;
        setFormData({ ...formData, email: updatedEmails });
    };

    // Funzioni di gestione indirizzi
    const addAddressInfo = () => {
        const nextId = String.fromCharCode(65 + formData.address.length);
        setFormData({
            ...formData,
            address: [
                ...formData.address,
                { addressId:nextId, address: '' }
            ]
        });
    };
    const removeAddressInfo = (index) => {
        setFormData({
            ...formData,
            address: formData.address.filter((_, i) => i !== index),
        });
    };
    const handleAddressInfoChange = (index, value) => {
        const updatedAddresses = [...formData.address];
        updatedAddresses[index].address = value;
        setFormData({ ...formData, address: updatedAddresses });
    };


    // CUSTOMER and PROFESSIONAL Funzione per gestire il cambiamento delle checkbox
    const handleCheckboxChange = (event, setState) => {
        setState(event.target.checked);
    };

    const togglePopup = () => setIsPopupOpen(!isPopupOpen);

    const contactDisable = (mode !== null);
    const customerDisable = (mode !== "Customer" && contactDisable);
    const professionalDisable = (mode !== "Professional" && contactDisable);

    return (
        <div className="container mt-4" style={{paddingTop: '90px'}} >
            <h2 className={"offerTitle"}>
                { mode === "Professional"
                ? "Create New Professional:"
                : mode === "Customer"
                    ? "Create New Customer:"
                    : "Create New Contact:"
            }</h2>
            <form onSubmit={handleSubmit} className="filterBox">
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formName" className="text-start">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter First Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-control-sm"  // Per rendere il campo più stretto
                                disabled={contactDisable}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formSurname" className="text-start">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                placeholder="Enter Last Name"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                                disabled={contactDisable}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formSSN" className="text-start">
                            <Form.Label>SSN</Form.Label>
                            <Form.Control
                                type="text"
                                name="ssn"
                                placeholder="Enter SSN"
                                value={formData.ssn}
                                onChange={handleChange}
                                required
                                className="form-control-sm"
                                disabled={contactDisable}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formTelephone" className="text-start">
                            <Form.Label className="d-block">Telephone</Form.Label>
                            {formData.telephone.map((item, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="telephone"
                                            placeholder={`Enter Telephone ${index + 1}`}
                                            value={item.telephone}
                                            onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                                            required
                                            className="form-control-sm"
                                            disabled={contactDisable}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removePhoneNumber(index)}
                                            disabled={contactDisable}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3"
                                    onClick={addPhoneNumber}
                                    disabled={contactDisable}
                                >
                                    Add Phone Number
                                </button>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formEmail" className="text-start">
                            <Form.Label className="d-block">Email</Form.Label>
                            {formData.email.map((item, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            placeholder={`Enter Email ${index + 1}`}
                                            value={item.email}
                                            onChange={(e) => handleEmailAddressChange(index, e.target.value)}
                                            required
                                            className="form-control-sm"
                                            disabled={contactDisable}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeEmailAddress(index)}
                                            disabled={contactDisable}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3"
                                    onClick={addEmailAddress}
                                    disabled={contactDisable}
                                >
                                    Add Email Address
                                </button>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formAddress" className="text-start">
                            <Form.Label className="d-block">Address</Form.Label>
                            {formData.address.map((item, index) => (
                                <div key={index} className="mb-3">
                                    <div className="input-group">
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder={`Enter Address ${index + 1}`}
                                            value={item.address}
                                            onChange={(e) => handleAddressInfoChange(index, e.target.value)}
                                            required
                                            className="form-control-sm"
                                            disabled={contactDisable}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => removeAddressInfo(index)}
                                            disabled={contactDisable}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-success mb-3"
                                    onClick={addAddressInfo}
                                    disabled={contactDisable}
                                >
                                    Add Address
                                </button>
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    {/* Colonna Customer */}
                    <Col md={4} style={{ backgroundColor: '#D3D3D3', borderRadius: '8px', margin: '25px', padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label>
                                Customer
                            </label>
                            <Form.Check
                                type="checkbox"
                                checked={customerChecked}
                                onChange={(e) => handleCheckboxChange(e, setCustomerChecked)}
                                style={{ marginLeft: '10px' }}
                                disabled = {customerDisable || action==="edit"}
                            />
                        </div>
                        {customerChecked && (
                            <Form.Group controlId="formCustomerNotes" className="text-start">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="customerNotes"
                                    placeholder="Enter Customer Notes"
                                    value={formData.customerNotes}
                                    onChange={handleChange}
                                    className="form-control-sm"
                                    disabled = {customerDisable}
                                />
                            </Form.Group>
                        )}
                    </Col>

                    {/* Colonna Professional */}
                    <Col md={7} style={{ backgroundColor: '#D3D3D3', borderRadius: '8px', margin: '25px', padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label>
                                Professional
                            </label>
                            <Form.Check
                                type="checkbox"
                                checked={professionalChecked}
                                onChange={(e) => handleCheckboxChange(e, setProfessionalChecked)}
                                style={{ marginLeft: '10px' }}
                                disabled = {professionalDisable || action==="edit"}
                            />
                        </div>
                        {professionalChecked && (
                            <>
                                <Form.Group controlId="formGeographicalInfo" className="text-start">
                                    <Form.Label>Geographical Information</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="geographicalInfo"
                                        placeholder="Enter Geographical Information "
                                        value={formData.geographicalInfo}
                                        onChange={handleChange}
                                        required
                                        className="form-control-sm"  // Per rendere il campo più stretto
                                        disabled = {professionalDisable}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDailyRate" className="text-start">
                                    <Form.Label>Daily Rate</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dailyRate"
                                        placeholder="Enter Daily Rate"
                                        value={formData.dailyRate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Permette solo numeri con una virgola e al massimo due cifre decimali
                                            if (/^\d*(,\d{0,2})?$/.test(value)) {
                                                handleChange(e); // Aggiorna lo stato solo se il valore è valido
                                            }
                                        }}
                                        inputMode="decimal" // Mostra tastiera numerica con separatore decimale sui dispositivi mobili
                                        required
                                        className="form-control-sm"
                                        disabled = {professionalDisable}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formSkills" className="text-start">
                                    <div className="d-flex align-items-start justify-content-between">
                                        {/* Bottone per aprire il popup */}
                                        <Button
                                            className="custom-button m-3"
                                            onClick={togglePopup}
                                            disabled = {professionalDisable}
                                        >
                                            Select Skills
                                        </Button>

                                        {/* Mostra le skill selezionate */}
                                        {selectedSkills && selectedSkills.length > 0 && (
                                            <div className="mt-3 ms-3" style={{ flexGrow: 1 }}>
                                                <strong>Selected skills:</strong>
                                                <ul className="mb-0">
                                                    {selectedSkills.map((skill, index) => (
                                                        <li key={index}>{skill.skill}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="formProfessionalNotes" className="text-start">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="professionalNotes"
                                        placeholder="Enter Notes"
                                        value={formData.professionalNotes}
                                        onChange={handleChange}
                                        className="form-control-sm"
                                        disabled = {professionalDisable}
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="custom-button" disabled={submitButton}>
                    Save
                </Button>
            </form>
            {/* PopupSelector */}
            {isPopupOpen && (
                <PopupSkills
                    isOpen={isPopupOpen}
                    onClose={togglePopup}
                    onConfirm={(skills) => {
                        setSelectedSkills(skills); // Salva le skill selezionate
                        togglePopup(); // Chiudi il popup
                    }}
                />
            )}
        </div>
    );
}

export default ContactForm;