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

// Import del provider di errore
import {NotificationProvider} from './contexts/NotificationProvider';
import axios from "axios";

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




    return (
        <NotificationProvider>
            <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
                <Container fluid>
                    <NavbarComponent user={user} />
                    <Routes>
                        <Route path="/" element={<HomeLayout user={user} />}/>

                        <Route path="/analytics" element={<ViewAnalytics/>}/>

                        {/* action= add/edit */}
                        <Route path="/contacts" element={<ViewContacts role = {user?.roles}/>} />
                        <Route path="/contacts/:action/" element={<ContactForm mode={null} user={user} />} />
                        <Route path="/contacts/:action/:contactId" element={<ContactForm mode={null} user={user}/>} />
                        <Route path="/contact/:contactId/details" element={<ViewContactDetails user={user} />} />

                        <Route path="/customer/:action/:contactId" element={<ContactForm mode={"Customer"} user={user}/>} />

                        <Route path="/documents" element={<Documents user={user}/>}/>
                        <Route path="/fileform" element={<FileForm user={user}/>}/>

                        <Route path="/jobOffers" element={<ViewJobOffers role = {user?.roles} user={user}/>}/>
                        <Route path="/jobOffers/add/:contactId" element={<AddJobOffer user={user}/>} />
                        <Route path="/jobOffers/edit/:jobOfferId" element={<AddJobOffer user={user}/>} />
                        <Route path="/jobOffers/history/:jobOfferId" element={<ViewJobOfferHistory user={user}/>} />
                        <Route path="/jobOffers/progress/:jobOfferId" element={<ProgressJobOffer user={user}/>} />

                        <Route path="/messages" element={<ViewMessages />}/>

                        <Route path="/professional/:action/:contactId" element={<ContactForm mode={"Professional"} user={user}/>} />

                        <Route path="/reach_us" element={<ContactUs />} />

                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </Container>
                <ToastContainer/>
            </BrowserRouter>
        </NotificationProvider>
    );
}


export default App;
