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
import ViewCustomerDetails from "./components/ViewCustomerDetails";
import ViewProfessionalDetails from "./components/ViewProfessionalDetails";
import ViewAnalytics from "./components/ViewAnalytics";

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

                        {/* action= add/edit */}
                        <Route path="/contacts" element={<ViewContacts />} />
                        <Route path="/contacts/:action/" element={<ContactForm mode={null} />} />
                        <Route path="/contacts/:action/:contactId" element={<ContactForm mode={null} />} />

                        <Route path="/customer/:action/:contactId" element={<ContactForm mode={"Customer"} />} />
                        <Route path="/customer/:contactId/details" element={<ViewCustomerDetails />} />


                        <Route path="/professional/:action/:contactId" element={<ContactForm mode={"Professional"} />} />
                        <Route path="/professional/:contactId/details" element={<ViewProfessionalDetails />} />


                        <Route path="/jobOffers" element={<ViewJobOffers/>}/>
                        <Route path="/jobOffers/add/:contactId" element={<AddJobOffer />} />
                        <Route path="/jobOffers/edit/:jobOfferId" element={<AddJobOffer />} />
                        <Route path="/jobOffers/progress/:jobOfferId" element={<ProgressJobOffer />} />

                        <Route path="/analytics" element={<ViewAnalytics/>}/>

                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </Container>
                <ToastContainer/>
            </BrowserRouter>
        </NotificationProvider>
    );
}


export default App;
