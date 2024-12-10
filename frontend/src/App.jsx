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
import ViewCustomers from './components/ViewCustomers';
import ViewJobOffers from './components/ViewJobOffers';
import MassimoTest from "./components/MassimoTest";
import AddContact from "./components/AddContact";
import ViewProfessionals from "./components/ViewProfessionals";
import AddProfessional from "./components/AddProfessional";

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
                        <Route path="/MassimoTest" element={<MassimoTest />} />
                        <Route path="/contacts" element={<ViewContacts />} />
                        <Route path="/contacts/add" element={<AddContact />} />
                        <Route path="/jobOffers" element={<ViewJobOffers />} />
                        <Route path="/professionals" element={<ViewProfessionals />} />
                        <Route path="/professional/add" element={<AddProfessional />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Container>
                <ToastContainer />
            </BrowserRouter>
        </NotificationProvider>
    );
}

export default App;
