import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function MyForm({
                                   show,
                                   handleClose,
                                   handleSave,
                                   formData,
                                   handleChange,
                                   rolesList,
                                   title,
                                   privileges,
                               }) {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            className="custom-modal"
        >
            <Modal.Header closeButton className="bg-light border-bottom">
                <Modal.Title className="fw-bold text-primary">{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {Object.keys(formData).map((fieldKey) => {
                        if (["roleIds", "id", "privileges"].includes(fieldKey)) return null;

                        return (
                            <Form.Group as={Row} className="mb-3 align-items-center" key={fieldKey}>
                                <Form.Label column sm={3} className="fw-semibold text-secondary text-end">
                                    {fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)}
                                </Form.Label>
                                <Col sm={9}>
                                    <Form.Control
                                        type={
                                            fieldKey === "password"
                                                ? "password"
                                                : fieldKey === "email"
                                                    ? "email"
                                                    : "text"
                                        }
                                        placeholder={`Enter ${fieldKey}`}
                                        name={fieldKey}
                                        value={formData[fieldKey]}
                                        onChange={handleChange}
                                        className="custom-input shadow-sm"
                                    />
                                </Col>
                            </Form.Group>
                        );
                    })}

                    {/* Roles multi-select */}
                    {rolesList && rolesList.length > 0 && (
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={3} className="fw-semibold text-secondary text-end">
                                Roles
                            </Form.Label>
                            <Col sm={9}>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={rolesList.map((role) => ({
                                        value: role.id,
                                        label: role.name,
                                    }))}
                                    value={rolesList
                                        .filter((role) => formData.roleIds?.includes(role.id))
                                        .map((role) => ({
                                            value: role.id,
                                            label: role.name,
                                        }))}
                                    onChange={(selectedOptions) => {
                                        const selectedIds = selectedOptions
                                            ? selectedOptions.map((opt) => opt.value)
                                            : [];
                                        handleChange({
                                            target: {
                                                name: "roleIds",
                                                value: selectedIds,
                                            },
                                        });
                                    }}
                                    className="custom-select shadow-sm"
                                />
                            </Col>
                        </Form.Group>
                    )}

                    {/* Privileges multi-select */}
                    {privileges && privileges.length > 0 && (
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Form.Label column sm={3} className="fw-semibold text-secondary text-end">
                                Privileges
                            </Form.Label>
                            <Col sm={9}>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={privileges.map((priv) => ({
                                        value: priv.id,
                                        label: priv.name,
                                    }))}
                                    value={(formData.privileges || []).map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                    }))}
                                    onChange={(selectedOptions) => {
                                        const selectedPrivileges = (selectedOptions || []).map(
                                            (opt) => ({
                                                id: opt.value,
                                                name: opt.label,
                                            })
                                        );
                                        handleChange({
                                            target: {
                                                name: "privileges",
                                                value: selectedPrivileges,
                                            },
                                        });
                                    }}
                                    className="custom-select shadow-sm"
                                />
                            </Col>
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleSave}>
                    {title}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
