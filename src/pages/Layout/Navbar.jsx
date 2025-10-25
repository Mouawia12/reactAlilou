import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { AiOutlineUser, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import {Link, useNavigate} from "react-router-dom";
import avatar from "../../assets/img/avatar2.png";
import { confirmLogout } from "../../helper/Tools";


const MyNavbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="shadow-sm py-2 custom-navbar">
            <Container fluid>
                {/* Brand / Home */}
                <Navbar.Brand as={Link} to="/home" className="fw-bold text-light">
                    Home
                </Navbar.Brand>

                {/* Toggler for mobile */}
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    {/* Center title */}
                    <Nav className="mx-auto">
                        <h3 className="navbar-title">Gestion De Enterprise</h3>
                    </Nav>

                    {/* Right side dropdown */}
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="dark"
                            id="dropdown-user"
                            className="d-flex align-items-center border-0 bg-transparent"
                        >
                            <span className="me-2 fw-bold text-light">{user?.name}</span>
                            <Image
                                src={avatar}
                                alt="profile"
                                roundedCircle
                                width="40"
                                height="40"
                                className="avatar-img"
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow dropdown-menu-dark">
                            <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                                <AiOutlineUser className="me-2" /> Profile
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/setting" className="d-flex align-items-center">
                                <AiOutlineSetting className="me-2" /> Settings
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                as="button"
                                onClick={() => confirmLogout(navigate)}
                                className="d-flex align-items-center text-danger"
                            >
                                <AiOutlineLogout className="me-2" /> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
};

export default MyNavbar;
