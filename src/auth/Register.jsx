import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MyAlert } from "../helper/Tools";
import { Form, Button, InputGroup, Container, Card } from "react-bootstrap";

const Register: React.FC = () => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreeTerms) {
            MyAlert("You must agree to the terms before registering.", "info", "Information!");
            return;
        }

        if (password !== confirmPassword) {
            MyAlert("Passwords do not match!", "info", "Information!");
            return;
        }

        try {
            const response = await fetch(
                process.env.REACT_APP_API_BASE_URL + "/api/auth/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: fullName,
                        username,
                        email,
                        password,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            MyAlert("Registration successful!", "success", "Welcome!");
            navigate("/home");
        } catch (err) {
            MyAlert(err.message || err, "error", "Error");
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center ">
            <Card className="shadow " style={{ width: "600px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4">Register a new membership</h2>
                    <Form onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <Form.Group className="mb-3" controlId="registerFullName">
                            <Form.Label>Full Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <InputGroup.Text><FaUser /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Username */}
                        <Form.Group className="mb-3" controlId="registerUserName">
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <InputGroup.Text><FaUser /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Email */}
                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Password */}
                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <InputGroup.Text><FaLock /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Confirm Password */}
                        <Form.Group className="mb-3" controlId="registerConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <InputGroup.Text><FaLock /></InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Terms + Button */}
                        <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                            <Form.Check
                                type="checkbox"
                                label={<>I agree to the <a href="#">terms</a></>}
                                checked={agreeTerms}
                                onChange={() => setAgreeTerms(!agreeTerms)}
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">
                            Sign Up
                        </Button>
                    </Form>

                    <div className="text-center mt-3">
                        <Link to="/Login">I already have a membership</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
