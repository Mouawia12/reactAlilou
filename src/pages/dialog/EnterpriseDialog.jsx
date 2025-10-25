import React, {useEffect} from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {  FaSave, FaWindowClose} from "react-icons/fa";

const EnterpriseDialog = ({ show, onClose, onSave, formData, setFormData, editingEnterprise }) => {


    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            headerPreview: `${process.env.REACT_APP_API_BASE_URL}/uploads/enterprise/${formData.headerName}`,
            footerPreview: `${process.env.REACT_APP_API_BASE_URL}/uploads/enterprise/${formData.footerName}`,
            cachePreview: `${process.env.REACT_APP_API_BASE_URL}/uploads/enterprise/${formData.cacheName}`,
        }));
    }, [formData.cacheName||formData.headerName||formData.footerName]);


    return (
        <Modal show={show} onHide={onClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingEnterprise ? "Edit Enterprise" : "Add Enterprise"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>RC</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.rc}
                                    onChange={(e) => setFormData({ ...formData, rc: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>NIF</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nif}
                                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>NIS</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nis}
                                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>AI</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.ai}
                                    onChange={(e) => setFormData({ ...formData, ai: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Compte</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.compte}
                                    onChange={(e) => setFormData({ ...formData, compte: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        {/* HEADER FILE */}
                        <Col md={4}>
                            <Form.Group controlId="formHeader">
                                <Form.Label>Header File</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            header: e.target.files[0],
                                            headerPreview: URL.createObjectURL(e.target.files[0]),
                                        })
                                    }
                                />
                                {formData.headerName && (
                                    <small className="text-muted d-block">
                                        {formData.headerName.toString().split('_')[1]}
                                    </small>
                                )}
                                {/* ✅ Preview */}
                                {formData.headerPreview && (
                                    <img
                                        src={formData.headerPreview}
                                        alt="Header Preview"
                                        className="img-thumbnail mt-2"
                                        style={{ width: "100%", maxHeight: "120px", objectFit: "contain" }}
                                    />
                                )}
                            </Form.Group>
                        </Col>

                        {/* FOOTER FILE */}
                        <Col md={4}>
                            <Form.Group controlId="formFooter">
                                <Form.Label>Footer File</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            footer: e.target.files[0],
                                            footerPreview: URL.createObjectURL(e.target.files[0]),
                                        })
                                    }
                                />
                                {formData.footerName && (
                                    <small className="text-muted d-block">
                                        {formData.footerName.toString().split('_')[1]}
                                    </small>
                                )}
                                {formData.footerPreview && (
                                    <img
                                        src={formData.footerPreview}
                                        alt="Footer Preview"
                                        className="img-thumbnail mt-2"
                                        style={{ width: "100%", maxHeight: "120px", objectFit: "contain" }}
                                    />
                                )}
                            </Form.Group>
                        </Col>

                        {/* CACHE FILE */}
                        <Col md={4}>
                            <Form.Group controlId="formCache">
                                <Form.Label>Cache File</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cache: e.target.files[0],
                                            cachePreview: URL.createObjectURL(e.target.files[0]),
                                        })
                                    }
                                />
                                {formData.cacheName && (
                                    <small className="text-muted d-block">
                                        {formData.cacheName.toString().split('_')[1]}
                                    </small>
                                )}
                                {formData.cachePreview && (
                                    <img
                                        src={formData.cachePreview}
                                        alt="Cache Preview"
                                        className="img-thumbnail mt-2"
                                        style={{ width: "100%", maxHeight: "120px", objectFit: "contain" }}
                                    />
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={onClose}>
                    <FaWindowClose className="me-2"/>
                    Cancel


                </Button>
                <Button variant="success"   onClick={onSave}>
                    <FaSave className="me-2"/>
                    Save

                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EnterpriseDialog;
