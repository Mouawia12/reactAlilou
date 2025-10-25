import React, { useEffect, useState } from "react";

import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { FilterMatchMode } from "primereact/api";

import Swal from "sweetalert2";

import MyTable from "../helper/MyTable";
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import EnterpriseDialog from "./dialog/EnterpriseDialog";

const Enterprise = () => {
    const [enterprises, setEnterprises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEnterprise, setEditingEnterprise] = useState(null);

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        rc: "",
        nif: "",
        nis: "",
        ai: "",
        compte: "",
        header: null,
        footer: null,
        cache: null,
        headerName: "",
        footerName: "",
        cacheName: "",
    });

    // -------------------------
    // Fetch enterprises
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading enterprises...");
            const res = await apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/enterprises`);
            if (!res.ok) throw new Error("Failed to fetch enterprises");
            const data = await res.json();
            setEnterprises(data);
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
    // Modal
    // -------------------------
    const handleShowModal = (enterprise = null) => {
        setEditingEnterprise(enterprise);
        setFormData(

            enterprise || {
                id: "",
                name: "",
                rc: "",
                nif: "",
                nis: "",
                ai: "",
                compte: "",
                headerName: "",
                footerName: "",
                cacheName: "",
            }

        );



        setShowModal(true);


    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEnterprise(null);
    };

    // -------------------------
    // Save Enterprise
    // -------------------------
    const handleSaveEnterprise = async () => {
        try {
            MyLoading(editingEnterprise ? "Updating enterprise..." : "Saving enterprise...");

            const url = editingEnterprise
                ? `${process.env.REACT_APP_API_BASE_URL}/api/enterprises/update/${editingEnterprise.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/enterprises/add`;
            const method = editingEnterprise ? "PUT" : "POST";

            const formDataToSend = new FormData();

            // Append JSON enterprise as blob
            const enterpriseJson = { ...formData };
            delete enterpriseJson.header;
            delete enterpriseJson.footer;
            delete enterpriseJson.cache;

            formDataToSend.append(
                "enterprise",
                new Blob([JSON.stringify(enterpriseJson)], { type: "application/json" })
            );

            // Append files if provided
            if (formData.header) formDataToSend.append("header", formData.header);
            if (formData.footer) formDataToSend.append("footer", formData.footer);
            if (formData.cache) formDataToSend.append("cache", formData.cache);

            const res = await apiFetch(url, { method, body: formDataToSend });
            if (!res.ok) throw new Error(await res.text());

            const savedEnterprise = await res.json();

            if (editingEnterprise) {
                setEnterprises((prev) =>
                    prev.map((e) => (e.id === savedEnterprise.id ? savedEnterprise : e))
                );
                MyAlert("Enterprise updated successfully", "success", "Updated!");
            } else {
                setEnterprises((prev) => [...prev, savedEnterprise]);
                MyAlert("Enterprise added successfully", "success", "Added!");
            }

            handleCloseModal();
        } catch (err) {
            MyAlert("Error saving enterprise: " + err.message, "error", "Error");
        }
    };
    // -------------------------
    // Delete enterprise
    // -------------------------
    const handleDeleteEnterprise = (enterprise) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete enterprise: ${enterprise.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    MyLoading("Deleting enterprise...");
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/enterprises/delete/${enterprise.id}`,
                        { method: "DELETE" }
                    );
                    if (!response.ok) throw new Error(await response.text());
                    setEnterprises((prev) => prev.filter((p) => p.id !== enterprise.id));
                    MyAlert("Enterprise deleted successfully", "success", "Deleted!");
                } catch (err) {
                    MyAlert("Error deleting enterprise: " + err.message, "error", "Error");
                } finally {
                    MyLoadingClose();
                }
            }
        });
    };

    // -------------------------
    // Table Config
    // -------------------------
    const initialFilters = {
        name: { value: "", matchMode: FilterMatchMode.CONTAINS },
        rc: { value: "", matchMode: FilterMatchMode.CONTAINS },
        nif: { value: "", matchMode: FilterMatchMode.CONTAINS },
        nis: { value: "", matchMode: FilterMatchMode.CONTAINS },
        ai: { value: "", matchMode: FilterMatchMode.CONTAINS },
        compte: { value: "", matchMode: FilterMatchMode.CONTAINS },
    };

    const columnConfig = [
        { field: "name", header: "Name", style: { width: "10%" } },
        { field: "rc", header: "RC", style: { width: "7%" } },
        { field: "nif", header: "NIF", style: { width: "10%" } },
        { field: "nis", header: "NIS", style: { width: "10%" } },
        { field: "ai", header: "AI", style: { width: "10%" } },
        { field: "compte", header: "Compte", style: { width: "10%" } },
        {
            field: "actions",
            header: "Actions",
            style: { width: "10%" },
            filter: false,
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleShowModal(rowData)}
                        className="btn btn-sm btn-warning me-2"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteEnterprise(rowData)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </>
            ),
        },
    ];

    return (
        <div>
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button
                        variant="success"
                        className="btn btn-success d-flex align-items-center"
                        onClick={() => handleShowModal()}
                    >
                        <FaPlus className="me-2" /> Add Enterprise
                    </Button>

                </div>

                <MyTable
                    data={enterprises}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                />
            </div>

            <EnterpriseDialog
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveEnterprise}
                formData={formData}
                setFormData={setFormData}
                editingEnterprise={editingEnterprise}
            />
        </div>
    );
};

export default Enterprise;
