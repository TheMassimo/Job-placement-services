import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Container } from 'react-bootstrap'
import HomeLayout from "./components/HomeLayout.jsx";



function App() {
  //const [count, setCount] = useState(0)

  return (
        <BrowserRouter>
            <Container>
                <Routes>
                    <Route path = "/">
                        <Route index element={<HomeLayout/>}/>
                    </Route>
                </Routes>
            </Container>
        </BrowserRouter>
  )
}

export default App
