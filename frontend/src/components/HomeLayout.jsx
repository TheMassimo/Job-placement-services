import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
/* eslint-disable react/prop-types */


function HomeLayout(props) {

    const [profile, setProfile] = useState({
        name: props.user? props.user.name : '',
        surname: props.user? props.user.surname : '',
        ssn: '', //'123-45-6789'
        email: '',
        telephone: '', //'+123456789'
        address: '', //'123 Main St, Anytown, USA'
    });

    useEffect(() => {
        if (props.user) {
            setProfile(prevProfile => ({
                ...prevProfile, // Preserve the existing state
                name: props.user.name ,
                surname: props.user.surname,
                email: props.user.email
            }));
        }
    }, [props.user]);
    const [isEditing, setIsEditing] = useState(false);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully!');
        // Here you would send the updated profile to your backend
    };

    return (
        <Container className="page-container mt-4 filterBox">
            <Row>
                <Col md={4} className="mx-auto">
                    <div className="d-flex align-items-center mb-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/c/c7/Chill_guy_original_artwork.jpg"
                            alt="Profile"
                            className="rounded-circle me-3"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                        <h3 className="mb-0">Profile Page</h3>
                    </div>
                    <Form>
                        {Object.entries(profile).map(([key, value]) => (
                            <Form.Group className="mb-3" controlId={`form-${key}`} key={key}>
                                <Form.Label className="text-capitalize">{key}</Form.Label>
                                <Form.Control
                                    type={key === 'email' ? 'email' : 'text'}
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    readOnly={!isEditing}
                                />
                            </Form.Group>
                        ))}
                        {/*
                        {isEditing ? (
                            <div className="d-flex justify-content-end">
                                <Button variant="success" onClick={handleSave} className="custom-button">
                                    Save
                                </Button>
                                <Button variant="secondary" onClick={handleEditToggle} className="custom-button">
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <Button variant="primary" onClick={handleEditToggle} className="custom-button">
                                Edit Profile
                            </Button>
                        )}
                        */}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default HomeLayout;
