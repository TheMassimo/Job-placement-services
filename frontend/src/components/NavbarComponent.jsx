import { Navbar, Button, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_tmp.png';  // Importazione dell'immagine


function NavbarComponent() {
    //const navigate = useNavigate();
    //const name = props.user && props.user.name;
    const name = "miriam"

    return (
        <Navbar bg='dark' variant='dark' fixed="top" className="navbar navbar-expand-lg w-100" style={{ zIndex: 1030 }}>
            <Link to="/" className='no-line'>
                <Navbar.Brand className="d-flex align-items-center" style={{ fontFamily: 'monospace, sans-serif' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                    />
                    <span className="fs-2">Progetto webbb</span>
                </Navbar.Brand>
            </Link>

            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home </a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="#">Job offers </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Customers</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Professionals</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Messages</a>
                </li>
                <NavDropdown title="Dropdown" id="navbarDropdown">
                    <NavDropdown.Item href="#">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#">Another action</NavDropdown.Item>
                    <NavDropdown.Divider/>
                    <NavDropdown.Item href="#">Something else here</NavDropdown.Item>
                </NavDropdown>
                <li className="nav-item">
                    <a className="nav-link disabled" href="#">Disabled</a>
                </li>
            </ul>


            <Nav className="ms-auto">
                <Nav.Item>
                    {name ?
                        <>
                        <Navbar.Text className='fs-5'>
                                {"Logged in as: " + "Miriam" + " " + "ueue"}
                            </Navbar.Text>
                            <Link className='btn btn-secondary mx-2' variant='secondary' to={'/'} onClick={() => {
                            }}>Logout <i className="bi bi-person-down"></i> </Link>
                        </> :
                        <Button className='mx-2' variant='warning' onClick={() => navigate('login')}>Login <i
                            className="bi bi-person-square"></i> </Button>}
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default NavbarComponent;