import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Container } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap-icons/font/bootstrap-icons.css';


//OUR component
import NavbarComponent from './components/NavbarComponent';
import HomeLayout from "./components/HomeLayout.jsx";
import ViewContacts from './components/ViewContacts';
import ViewCustomers from './components/ViewCustomers';
import ViewJobOffers from './components/ViewJobOffers';
import MassimoTest from "./components/MassimoTest";
import AddCustomer from "./components/AddCustomer";
import ViewProfessionals from "./components/ViewProfessionals";
import AddProfessional from "./components/AddProfessional";


function App() {
    //const [count, setCount] = useState(0)

    let parametro = "prm_Massimo"

    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Container fluid>
                <NavbarComponent />
                <Routes>
                    <Route path="/" element={<HomeLayout />} />
                    <Route path="/MassimoTest" element={<MassimoTest />} />

                    <Route path="/contacts" element={<ViewContacts />} />
                    <Route path="/customers" element={<ViewCustomers />} />
                    <Route path="/customers/add" element={<AddCustomer />} />
                    <Route path="/jobOffers" element={<ViewJobOffers />} />

                    <Route path="/professionals" element={<ViewProfessionals />} />
                    <Route path="/professional/add" element={<AddProfessional />} />
                </Routes>
            </Container>

        </BrowserRouter>
    );
}
// commento
// commento ricevuto
export default App