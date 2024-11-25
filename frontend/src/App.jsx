import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Container } from 'react-bootstrap'
import HomeLayout from "./components/HomeLayout.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarComponent from './components/NavbarComponent';
import ViewCustomers from './components/ViewCustomers';
import ViewJobOffers from './components/ViewJobOffers';
//import 'bootstrap-icons/font/bootstrap-icons.css';




function App() {
  //const [count, setCount] = useState(0)

  return (
        <BrowserRouter>
            <Container fluid>
                <NavbarComponent />
                <Routes>
                    <Route path = "/" >
                        <Route index element={<HomeLayout/>}/>

                        <Route path="/view-customers" element={<ViewCustomers />} />

                        <Route path="/view-jobOffers" element={<ViewJobOffers />} />
                    </Route>
                </Routes>
            </Container>

        </BrowserRouter>
  )
}
// commento
// commento ricevuto
export default App