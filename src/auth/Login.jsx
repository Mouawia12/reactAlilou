import React, { useState } from "react";
import { AiOutlineLock, AiOutlineUser, AiOutlineUserAdd } from "react-icons/ai";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyAlert } from "../helper/Tools";
import "../pages/Layout/login.css"
const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(
                process.env.REACT_APP_API_BASE_URL + "/api/auth/signin",
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
                MyAlert("Invalid credentials", "error", "Error");
                return;
            }
            const data = await response.json();
            sessionStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("token", data.token);
            MyAlert("Login successful!", "success", "Success");
            navigate("/home");
        } catch (err) {
            if (err.message === "Failed to fetch" || err.name === "TypeError") {
                MyAlert("Server is not reachable. Please check if it is running.", "error", "Server Down");
            } else {
                MyAlert("Login failed. Please try again.", "error", "Error");
            }
        }
    };


    return (
        <div className="login-container d-flex align-items-center justify-content-center " >
            <div className="login-card p-4 shadow rounded" style={{ width: "400px" }}>
                <h2 className="login-title text-center mb-4"> Easy Facturation</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <div className="d-flex align-items-center border rounded px-2">
                            <AiOutlineUser className="me-2 text-muted" />
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="d-flex align-items-center border rounded px-2">
                            <AiOutlineLock className="me-2 text-muted" />
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Log in
                    </Button>

                    <div className="text-center mt-3">
                        <Link to="/Register" className="text-decoration-none">
                            <AiOutlineUserAdd /> Register Now
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;
