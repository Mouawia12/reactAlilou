import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const MissionDialog = ({
                           show,
                           onClose,
                           onSave,
                           formData,
                           setFormData,
                           editingMission,
                           typeMission = [],

                       }) => {
    return (
        <Modal show={show} onHide={onClose} size="xl"> {/* Extra large modal */}
            <Modal.Header closeButton>
                <Modal.Title>
                    {editingMission ? "Edit Mission" : "Add Mission"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Locale</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.locale}
                                    onChange={(e) =>
                                        setFormData({ ...formData, locale: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={formData.statut || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, statut: e.target.value })
                                    }
                                >
                                    <option value="">-- Select Status --</option>
                                    <option value="EN_ATTENTE">EN_ATTENTE</option>
                                    <option value="EN_COURS">EN_COURS</option>
                                    <option value="TERMINEE">TERMINEE</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Type Mission</Form.Label>
                                <Form.Select
                                    value={formData.typeMissionId || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            typeMissionId: parseInt(e.target.value),
                                        })
                                    }
                                >
                                    <option value="">-- Select Type Mission --</option>
                                    {typeMission.map((tm) => (
                                        <option key={tm.id} value={tm.id}>
                                            {tm.type}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Document</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData({ ...formData, file, documentName: file.name });
                                        }
                                    }}
                                />
                                {formData.documentName && (
                                    <small className="text-muted">📄 Selected: {formData.documentName}</small>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter description..."
                                    value={formData.description || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MissionDialog;
