import React from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { AiOutlineUser, AiOutlineSetting, AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../assets/img/avatar2.png";
import { confirmLogout } from "../../helper/Tools";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useLanguage } from "../../context/LanguageContext";

const MyNavbar = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    return (
        <Navbar expand="lg" fixed="top" className="shadow-sm app-navbar py-2">
            <Container fluid>
                <Navbar.Brand as={Link} to="/home" className="brand-logo">
                    <span className="brand-initials">EF</span>
                    <span className="brand-text">{t("common.brand")}</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto align-items-center gap-3">
                        <LanguageSwitcher variant="outline-primary" />
                        <Dropdown align="end" className="user-menu">
                            <Dropdown.Toggle
                                variant="light"
                                id="dropdown-user"
                                className="d-flex align-items-center border-0 bg-transparent"
                            >
                                <div className="user-info text-start me-2">
                                    <span className="user-name d-block fw-semibold">{user?.name}</span>
                                    <small className="text-muted">{t("navbar.home")}</small>
                                </div>
                                <Image
                                    src={avatar}
                                    alt="profile"
                                    roundedCircle
                                    width="42"
                                    height="42"
                                    className="avatar-img"
                                />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow dropdown-menu-modern">
                                <Dropdown.Item as={Link} to="/home" className="d-flex align-items-center">
                                    <AiOutlineUser className="me-2" /> {t("navbar.home")}
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                                    <AiOutlineUser className="me-2" /> {t("navbar.profile")}
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/setting" className="d-flex align-items-center">
                                    <AiOutlineSetting className="me-2" /> {t("navbar.settings")}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    as="button"
                                    onClick={() => confirmLogout(navigate)}
                                    className="d-flex align-items-center text-danger"
                                >
                                    <AiOutlineLogout className="me-2" /> {t("navbar.logout")}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
