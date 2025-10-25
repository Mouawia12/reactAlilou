import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyAlert } from "../helper/Tools";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import "../pages/Layout/login.css";

const Register = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false,
    });

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.agreeTerms) {
            MyAlert(t("alerts.termsRequired"), "info", t("common.status.info"));
            return;
        }

        if (form.password !== form.confirmPassword) {
            MyAlert(t("alerts.passwordMismatch"), "info", t("common.status.info"));
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.fullName,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to register");
            }

            const data = await response.json();
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            MyAlert(t("alerts.registerSuccess"), "success", t("common.status.success"));
            navigate("/home");
        } catch (error) {
            MyAlert(error.message || t("alerts.registerError"), "error", t("common.status.error"));
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__overlay" />
            <Container className="py-5">
                <div className="d-flex justify-content-end mb-4">
                    <LanguageSwitcher variant="outline-light" />
                </div>
                <Row className="align-items-center justify-content-center gy-5">
                    <Col lg={6} className="d-none d-lg-block">
                        <div className="auth-illustration text-lg-start text-center">
                            <span className="auth-badge mb-3">{t("common.brand")}</span>
                            <h1 className="brand-title mb-3">{t("auth.registerTitle")}</h1>
                            <p className="brand-tagline text-light opacity-75">
                                {t("auth.registerSubtitle")}
                            </p>
                        </div>
                    </Col>
                    <Col md={9} lg={5}>
                        <Card className="auth-card shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <span className="auth-badge text-uppercase">{t("auth.registerNow")}</span>
                                    <h2 className="auth-title mt-3">{t("auth.registerTitle")}</h2>
                                    <p className="auth-subtitle text-muted mb-0">
                                        {t("auth.registerSubtitle")}
                                    </p>
                                </div>
                                <Form onSubmit={handleSubmit} className="auth-form">
                                    <Form.Group className="mb-3" controlId="registerFullName">
                                        <Form.Label>{t("auth.fullName")}</Form.Label>
                                        <InputGroup className="input-with-icon">
                                            <Form.Control
                                                type="text"
                                                placeholder={t("auth.fullName")}
                                                name="fullName"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputGroup.Text>
                                                <FaUser />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="registerUserName">
                                        <Form.Label>{t("auth.username")}</Form.Label>
                                        <InputGroup className="input-with-icon">
                                            <Form.Control
                                                type="text"
                                                placeholder={t("auth.username")}
                                                name="username"
                                                value={form.username}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputGroup.Text>
                                                <FaUser />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="registerEmail">
                                        <Form.Label>{t("auth.email")}</Form.Label>
                                        <InputGroup className="input-with-icon">
                                            <Form.Control
                                                type="email"
                                                placeholder={t("auth.email")}
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputGroup.Text>
                                                <FaEnvelope />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="registerPassword">
                                        <Form.Label>{t("auth.password")}</Form.Label>
                                        <InputGroup className="input-with-icon">
                                            <Form.Control
                                                type="password"
                                                placeholder={t("auth.password")}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputGroup.Text>
                                                <FaLock />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="registerConfirmPassword">
                                        <Form.Label>{t("auth.confirmPassword")}</Form.Label>
                                        <InputGroup className="input-with-icon">
                                            <Form.Control
                                                type="password"
                                                placeholder={t("auth.confirmPassword")}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                            <InputGroup.Text>
                                                <FaLock />
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group className="mb-4 d-flex align-items-center">
                                        <Form.Check
                                            type="checkbox"
                                            id="agreeTerms"
                                            name="agreeTerms"
                                            checked={form.agreeTerms}
                                            onChange={handleChange}
                                            className="me-2"
                                        />
                                        <Form.Label htmlFor="agreeTerms" className="mb-0">
                                            {t("auth.agreeTerms")}
                                        </Form.Label>
                                    </Form.Group>

                                    <Button type="submit" variant="primary" className="w-100 auth-submit-btn">
                                        {t("auth.submitRegister")}
                                    </Button>
                                </Form>
                                <div className="text-center mt-4">
                                    <span className="text-muted">{t("auth.alreadyHave")}</span>{" "}
                                    <Link to="/login" className="auth-link">
                                        {t("auth.submitLogin")}
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;

