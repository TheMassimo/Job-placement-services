import {useEffect, useState} from 'react';
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
import ContactForm from "./components/ContactForm";
import AddJobOffer from "./components/AddJobOffer";
import ProgressJobOffer from "./components/ProgressJobOffer";
import ViewContactDetails from "./components/ViewContactDetails";
import ViewAnalytics from "./components/ViewAnalytics";
import ViewJobOfferHistory from "./components/ViewJobOfferHistory";
import Documents from "./components/Documents";
import FileForm from "./components/FileForm";
import ContactUs from "./components/ContactUs";
import ViewMessages from "./components/ViewMessages";
import {Navigate} from "react-router-dom";

// Import del provider di errore
import {NotificationProvider} from './contexts/NotificationProvider';
import axios from "axios";


const PrivateRoute = ({ user, children }) => {
    if (!user?.roles || user?.roles.length === 0) {
        return <Navigate to="/reach_us" replace />;
    }
    return children;
};

function App() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userInfo = await getCurrentUser();
            if (userInfo) {
                setUser(userInfo);
            }
        };

        fetchUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const xsrfToken = document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            const response = await axios.get('http://localhost:8080/current-user', {
                headers: { 'X-XSRF-TOKEN': xsrfToken },
                withCredentials: true,
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            return null;
        }
    };


    console.log("ddddd",user?.roles)

    return (
        <NotificationProvider>
            <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
                <Container fluid>
                    <NavbarComponent user={user} />
                    <Routes>
                        {/* Pubbliche */}
                        <Route path="/reach_us" element={<ContactUs />} />

                        {/* Protette */}
                        <Route path="/" element={
                            <PrivateRoute user={user}>
                                <HomeLayout user={user}/>
                            </PrivateRoute>
                        } />

                        <Route path="/analytics" element={
                            <PrivateRoute user={user}>
                                <ViewAnalytics />
                            </PrivateRoute>
                        } />

                        <Route path="/contacts" element={
                            <PrivateRoute user={user}>
                                <ViewContacts role={user?.roles} />
                            </PrivateRoute>
                        } />

                        <Route path="/contacts/:action/" element={
                            <PrivateRoute user={user}>
                                <ContactForm mode={null} user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/contacts/:action/:contactId" element={
                            <PrivateRoute user={user}>
                                <ContactForm mode={null} user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/contact/:contactId/details" element={
                            <PrivateRoute user={user}>
                                <ViewContactDetails user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/customer/:action/:contactId" element={
                            <PrivateRoute user={user}>
                                <ContactForm mode="Customer" user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/documents" element={
                            <PrivateRoute user={user}>
                                <Documents user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/fileform" element={
                            <PrivateRoute user={user}>
                                <FileForm user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/jobOffers" element={
                            <PrivateRoute user={user}>
                                <ViewJobOffers role={user?.roles} user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/jobOffers/add/:contactId" element={
                            <PrivateRoute user={user}>
                                <AddJobOffer user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/jobOffers/edit/:jobOfferId" element={
                            <PrivateRoute user={user}>
                                <AddJobOffer user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/jobOffers/history/:jobOfferId" element={
                            <PrivateRoute user={user}>
                                <ViewJobOfferHistory user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/jobOffers/progress/:jobOfferId" element={
                            <PrivateRoute user={user}>
                                <ProgressJobOffer user={user} />
                            </PrivateRoute>
                        } />

                        <Route path="/messages" element={
                            <PrivateRoute user={user}>
                                <ViewMessages />
                            </PrivateRoute>
                        } />

                        <Route path="/professional/:action/:contactId" element={
                            <PrivateRoute user={user}>
                                <ContactForm mode="Professional" user={user} />
                            </PrivateRoute>
                        } />
                    </Routes>
                </Container>
                <ToastContainer/>
            </BrowserRouter>
        </NotificationProvider>
    );
}


export default App;
