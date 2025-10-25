import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import Swal from "sweetalert2";
import { FilterMatchMode } from "primereact/api";
import MyTable from "../helper/MyTable";
import { Modal, Button, Form } from "react-bootstrap";
import TypeMission from "./TypeMission";
import ProtectedRoute from "../helper/ProtectedRoute";
import WorkPeriodic from "./WorkPeriodic";
import {Link} from "react-router-dom";
import {BreadCrumb} from "primereact/breadcrumb";
import Enterprise from "./Enterprise";

export default function Setting() {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'General Settings' }];
    const [periodes, setPeriodes] = useState([]);
    const [formData, setFormData] = useState({ id: "", year: "", active: false });
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    // -------------------------
    // Fetch periodes
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading periodes...");
            const res = await apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/periodes`);
            if (!res.ok) throw new Error("Failed to fetch periodes");
            const data = await res.json();
            setPeriodes(data);
        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // -------------------------
    // Handlers
    // -------------------------
    const resetForm = () => setFormData({ id: "", year: "", active: false });

    const handleAddShow = () => {
        resetForm();
        setIsEdit(false);
        setShow(true);
    };

    const handleEditShow = (periode) => {
        setFormData({ id: periode.id, year: periode.year, active: periode.active });
        setIsEdit(true);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        resetForm();
    };



    const handleSubmit = async () => {
        try {
            MyLoading(isEdit ? "Updating periode..." : "Saving periode...");
            const url = isEdit
                ? `${process.env.REACT_APP_API_BASE_URL}/api/periodes/update/${formData.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/periodes/add`;
            const method = isEdit ? "PUT" : "POST";

            const response = await apiFetch(url, {
                method,
                body: JSON.stringify({
                    year: formData.year,
                    active: formData.active,
                }),
            });

            if (!response.ok) throw new Error(await response.text());
            const result = await response.json();

            setPeriodes((prev) =>
                isEdit
                    ? prev.map((p) => (p.id === result.id ? result : p))
                    : [...prev, result]
            );

            MyAlert(
                isEdit ? "Setting updated successfully" : "Setting added successfully",
                "success",
                "Success"
            );
            handleClose();
        } catch (err) {
            MyAlert(
                `Error ${isEdit ? "updating" : "saving"} periode: ` + err.message,
                "error",
                "Error"
            );
        }
    };

    const handleDelete = (periode) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete periode: ${periode.year}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    MyLoading("Deleting periode...");
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/periodes/delete/${periode.id}`,
                        { method: "DELETE" }
                    );
                    if (!response.ok) throw new Error(await response.text());
                    setPeriodes((prev) => prev.filter((p) => p.id !== periode.id));
                    MyAlert("The periode has been deleted.", "success", "Deleted!");
                } catch (err) {
                    MyAlert("Error deleting periode: " + err.message, "error", "Error");
                }
            }
        });
    };

    // -------------------------
    // Table Config
    // -------------------------
    const initialFilters = {
        id: { value: "", matchMode: FilterMatchMode.EQUALS },
        year: { value: "", matchMode: FilterMatchMode.CONTAINS },
        active: { value: "", matchMode: FilterMatchMode.CONTAINS },
    };

    const columnConfig = [
        { field: "id", header: "ID", style: { width: "10%" } },
        { field: "year", header: "Year", style: { width: "30%" } },
        {
            field: "active",
            header: "Active",
            style: { width: "20%" },
            body: (rowData) =>
                rowData.active ? (
                    <span className="badge bg-success">Active</span>
                ) : (
                    <span className="badge bg-secondary">Inactive</span>
                ),
            filter: true,
            sortable: true,
        },
        {
            field: "actions",
            header: "Action",
            style: { width: "40%" },
            filter: false,
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleEditShow(rowData)}
                        className="btn btn-sm btn-warning me-2"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(rowData)}
                        className="btn btn-sm btn-danger"
                    >
                        <FaTrash />
                    </button>
                </>
            ),
        },
    ];

    // -------------------------
    // Render
    // -------------------------
    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />
            <div className="row">
                    <div className="col-6">

                        <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button
                                type="button"
                                onClick={handleAddShow}
                                className="btn btn-success d-flex align-items-center">
                                <FaPlus className="me-2" /> Add Periode
                            </button>
                        </div>

                        <MyTable
                            data={periodes}
                            initialFilters={initialFilters}
                            columns={columnConfig}
                        />
                            {/* ✅ Single Modal for Add & Edit */}
                            <Modal show={show} onHide={handleClose} centered size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        {isEdit ? "Edit Periode" : "Add Periode"}
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Year</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="year"
                                                value={formData.year}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, year: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">

                                            <Form.Check
                                                inline
                                                type="checkbox"
                                                id="isActive"
                                                label="Active"
                                                className="custom-check"
                                                checked={formData.active || false}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, active: e.target.checked })
                                                }
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant={isEdit ? "warning" : "success"}
                                        onClick={handleSubmit}
                                    >
                                        {isEdit ? "Update" : "Save"}
                                    </Button>
                                </Modal.Footer>
                            </Modal></div>
                    </div>

                    <div className="col-6">
                        <ProtectedRoute><TypeMission/></ProtectedRoute>
                    </div>
                    <div className="col-12">
                        <ProtectedRoute><Enterprise/></ProtectedRoute>

                    </div>
                    <div className="col-6">

                    </div>
                </div>
        </div>
    );
}
