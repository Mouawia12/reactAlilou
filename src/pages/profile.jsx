import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Row, Col, Image } from "react-bootstrap";
import { MyAlert } from "../helper/Tools";
import avatarPlaceholder from "../assets/img/avatar.png";

const Profile: React.FC = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        username: "",
        email: "",
        avatar: ""
    });

    const [passwordData, setPasswordData] = useState({
        id:"",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // ✅ Load user from sessionStorage
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setFormData({
                id: user.id || "",
                name: user.name || "",
                username: user.username || "",
                email: user.email || "",
                avatar: user.avatar || ""
            });
            setPasswordData({id : user.id || ""})
        }
    }, []);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // ✅ Save personal info
    const handleSaveInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            MyAlert("Personal info updated successfully!", "success", "Success");
        } catch (err) {
            MyAlert("Error updating info: " + err.message, "error", "Error");
        }
    };

    // ✅ Save password
    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            MyAlert("Passwords do not match!", "error", "Error");
            return;
        }

        try {

            MyAlert("Password updated successfully!", "success", "Success");


            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            MyAlert("Error updating password: " + err.message, "error", "Error");
        }
    };

    return (
        <Container >
            <Row className="justify-content-center">
                <Col md={12}>
                    {/* Card 1: Personal Info */}
                    <Card className="shadow-lg mb-4">
                        <Card.Body>
                            <h3 className="text-center mb-4">Personal Information</h3>
                            <div className="text-center mb-4">
                                <Image
                                    src={formData.avatar || avatarPlaceholder}
                                    roundedCircle
                                    width={120}
                                    height={120}
                                    alt="Profile"
                                    style={{ objectFit: "cover", border: "2px solid #ddd" }}
                                />
                            </div>
                            <Form onSubmit={handleSaveInfo}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInfoChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInfoChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInfoChange}
                                        required
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="success" type="submit">
                                        Save Info
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Card 2: Password */}
                    <Card className="shadow-lg">
                        <Card.Body>
                            <h3 className="text-center mb-4">Change Password</h3>
                            <Form onSubmit={handleSavePassword}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="warning" type="submit">
                                        Update Password
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
