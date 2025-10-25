import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaPlus, FaWindowClose } from "react-icons/fa";

export default function ClientDialog({ show, onHide, client, onSave }) {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        tel: "",
        email: "",
        address: "",
        nif: "",
        nis: "",
        rc: "",
        ai: "",
        rip: "",
        locale: "",
    });

    useEffect(() => {
        if (client) setFormData(client);
        else resetForm();
    }, [client, show]);

    const resetForm = () => setFormData({
        id: "", name: "", tel: "", email: "", address: "",
        nif: "", nis: "", rc: "", ai: "", rip: "", locale: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => onSave(formData);

    return (
        <Modal show={show} onHide={onHide} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>{client ? "✏️ Edit Client" : "➕ Add Client"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Tel</Form.Label>
                                <Form.Control type="text" name="tel" value={formData.tel} onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        {["nif", "nis", "rc"].map((f) => (
                            <div key={f} className="col-md-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>{f.toUpperCase()}</Form.Label>
                                    <Form.Control type="text" name={f} value={formData[f]} onChange={handleChange} />
                                </Form.Group>
                            </div>
                        ))}
                    </div>

                    <div className="row">
                        {["ai", "rip", "locale"].map((f) => (
                            <div key={f} className="col-md-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>{f.toUpperCase()}</Form.Label>
                                    <Form.Control type="text" name={f} value={formData[f]} onChange={handleChange} />
                                </Form.Group>
                            </div>
                        ))}
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    <FaWindowClose /> Cancel
                </Button>
                <Button variant="success" onClick={handleSubmit}>
                    <FaPlus /> Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
