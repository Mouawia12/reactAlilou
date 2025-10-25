import React, { useEffect, useState } from "react";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyAlert } from "../helper/Tools";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import "../pages/Layout/login.css";

const Login = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({ username: "", password: "" });

    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            navigate("/home", { replace: true });
        }
    }, [navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/auth/signin`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        usernameOrEmail: formData.username,
                        password: formData.password,
                    }),
                }
            );

            if (!response.ok) {
                MyAlert(t("alerts.invalidCreds"), "error", t("common.status.error"));
                return;
            }

            const data = await response.json();
            sessionStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("token", data.token);

            MyAlert(t("alerts.loginSuccess"), "success", t("common.status.success"));
            navigate("/home");
        } catch (error) {
            if (error.message === "Failed to fetch" || error.name === "TypeError") {
                MyAlert(t("alerts.serverDown"), "error", t("common.status.error"));
            } else {
                MyAlert(t("alerts.loginError"), "error", t("common.status.error"));
            }
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
                            <span className="auth-badge mb-3">{t("auth.welcome")}</span>
                            <h1 className="brand-title mb-3">{t("common.brand")}</h1>
                            <p className="brand-tagline text-light opacity-75">
                                {t("common.tagline")}
                            </p>
                        </div>
                    </Col>
                    <Col md={9} lg={5}>
                        <Card className="auth-card shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <span className="auth-badge text-uppercase">{t("auth.welcome")}</span>
                                    <h2 className="auth-title mt-3">{t("auth.loginTitle")}</h2>
                                    <p className="auth-subtitle text-muted mb-0">
                                        {t("auth.loginSubtitle")}
                                    </p>
                                </div>
                                <Form onSubmit={handleSubmit} className="auth-form">
                                    <Form.Group className="mb-3" controlId="formUsername">
                                        <Form.Label>{t("auth.username")}</Form.Label>
                                        <div className="input-with-icon">
                                            <AiOutlineUser className="input-icon" />
                                            <Form.Control
                                                type="text"
                                                placeholder={t("auth.username")}
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label>{t("auth.password")}</Form.Label>
                                        <div className="input-with-icon">
                                            <AiOutlineLock className="input-icon" />
                                            <Form.Control
                                                type="password"
                                                placeholder={t("auth.password")}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" className="w-100 auth-submit-btn">
                                        {t("auth.submitLogin")}
                                    </Button>
                                </Form>
                                <div className="text-center mt-4">
                                    <span className="text-muted">{t("auth.noAccount")}</span>{" "}
                                    <Link to="/register" className="auth-link">
                                        {t("auth.registerNow")}
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

export default Login;

