import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import dei componenti
import NavbarComponent from './components/NavbarComponent';
import NotFoundPage from './components/NotFoundPage';
import HomeLayout from "./components/HomeLayout.jsx";
import ViewContacts from './components/ViewContacts';
import ViewJobOffers from './components/ViewJobOffers';
import MassimoTest from "./components/MassimoTest";
import ContactForm from "./components/ContactForm";
import AddProfessional from "./components/AddProfessional";
import AddJobOffer from "./components/AddJobOffer";

// Import del provider di errore
import { NotificationProvider } from './contexts/NotificationProvider';

function App() {
    return (
        <NotificationProvider>
            <BrowserRouter>
                <Container fluid>
                    <NavbarComponent />
                    <Routes>
                        <Route path="/" element={<HomeLayout />} />

                        {/* action= add/edit */}
                        <Route path="/contacts" element={<ViewContacts />} />
                        <Route path="/contacts/:action/" element={<ContactForm mode={null} />} />
                        <Route path="/contacts/:action/:contactId" element={<ContactForm mode={null} />} />
                        <Route path="/customer/:action/:contactId" element={<ContactForm mode={"Customer"} />} />
                        <Route path="/professional/:action/:contactId" element={<ContactForm mode={"Professional"} />} />

                        <Route path="/jobOffers" element={<ViewJobOffers />} />
                        <Route path="/jobOffer/add" element={<AddJobOffer />} />

                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Container>
                <ToastContainer />
            </BrowserRouter>
        </NotificationProvider>
    );
}

export default App;
