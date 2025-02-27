import { Navbar, Button, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, NavLink  } from 'react-router-dom';
import logo from '../assets/logo_tmp.png';  // Importazione dell'immagine



function NavbarComponent(props) {
    //const navigate = useNavigate();
    //const name = props.user && props.user.name;

    const name = "miriam"
    const navigate = useNavigate();

    return (
        <Navbar  fixed="top" className="navbar navbar-expand-lg w-100" style={{ backgroundColor: '#003366', zIndex: 1030 }}>
            <Link to="/" className='no-line'>
                <Navbar.Brand className="d-flex align-items-center" style={{ fontFamily: 'monospace, sans-serif' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                    />
                    <span className="fs-2" style={{ color: 'white' }}>Progetto webbb</span>
                </Navbar.Brand>
            </Link>

            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <NavLink
                        to="/"
                        className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                        style={{color: 'white'}}>
                        Home
                    </NavLink>
                </li>
                <li className="nav-item active">
                    <NavLink
                        to="/contacts"
                        className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                        style={{color: 'white'}}>
                        Contacts
                    </NavLink>
                </li>
                <li className="nav-item active">
                    <NavLink
                        to="/jobOffers"
                        className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                        style={{color: 'white'}}>
                        Job Offers
                    </NavLink>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#" style={{color: 'white'}}>Messages</a>
                </li>
                <li className="nav-item active">
                    <NavLink
                        to="/analytics"
                        className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
                        style={{color: 'white'}}>
                        Analytics
                    </NavLink>
                </li>
            </ul>


            <Nav className="ms-auto">
                <Nav.Item>
                    {props.user?.username!= '' ?
                        <>
                            <Navbar.Text className='fs-5'>
                                <i className="bi bi-person-circle"
                                   style={{fontStyle: 'normal', color: 'white'}}>{props.user?.name +' '+ props.user?.surname}</i>
                            </Navbar.Text>
                            <Link
                                className="btn btn-secondary mx-2"
                                to="/"
                                onClick={() => {
                                    // Get CSRF token from cookies
                                    const csrfToken = props.user.xsrfToken;

                                    fetch('http://localhost:8080/logout', {
                                        method: 'POST',
                                        credentials: 'include',
                                        headers: {
                                            'X-XSRF-TOKEN': csrfToken, // Include CSRF token in the header
                                            'Content-Type': 'application/json', // Optional but good practice
                                        },
                                    })
                                        .then(response => {
                                            if (response.ok) {
                                                console.log('Logout successful');
                                                window.location.href = '/jobOffers'; // Redirect after logout
                                            } else {
                                                console.error('Logout failed:', response.status);
                                                window.location.href = '/jobOffers';
                                            }
                                        })
                                        .catch(error =>    window.location.href = '/jobOffers' // Redirect after logout
                                );
                                }}
                            >
                                Logout <i className="bi bi-person-down"></i>
                            </Link>

                        </> :
                        <Button className='mx-2' variant='warning' onClick={() =>  window.location.href = 'http://localhost:8080' + props.user.loginUrl
                        }>Login <i
                            className="bi bi-person-square"></i> </Button>}
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default NavbarComponent;