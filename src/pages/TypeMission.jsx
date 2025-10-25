import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import Swal from "sweetalert2";
import { FilterMatchMode } from "primereact/api";
import MyTable from "../helper/MyTable";
import MyForm from "../helper/MyForm";

export default function TypeMission() {
    const [typeMissions, setTypeMissions] = useState([]);
    const [formData, setFormData] = useState({ id: "", type: "" });
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // -------------------------
    // Fetch type missions
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading type missions...");
            const res = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/setting/type-mission`
            );
            if (!res.ok) throw new Error("Failed to fetch type missions");
            const data = await res.json();
            setTypeMissions(data);
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
    const resetForm = () => setFormData({ id: "", type: "" });

    const handleAddShow = () => {
        resetForm();
        setShow(true);
    };

    const handleEditShow = (tm) => {
        setFormData({ id: tm.id, type: tm.type });
        setShowEdit(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        try {
            MyLoading("Saving type mission...");
            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/setting/type-mission/add`,
                {
                    method: "POST",
                    body: JSON.stringify({ type: formData.type }),
                }
            );
            if (!response.ok) throw new Error(await response.text());
            const saved = await response.json();
            setTypeMissions((prev) => [...prev, saved]);
            MyAlert("Type mission added successfully", "success", "Success");
            setShow(false);
            resetForm();
        } catch (err) {
            MyAlert("Error saving type mission: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    const handleEdit = async () => {
        try {
            MyLoading("Updating type mission...");
            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/setting/type-mission/update/${formData.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({ type: formData.type }),
                }
            );
            if (!response.ok) throw new Error(await response.text());
            const updated = await response.json();
            setTypeMissions((prev) =>
                prev.map((tm) => (tm.id === updated.id ? updated : tm))
            );
            MyAlert("Type mission updated successfully", "success", "Success");
            setShowEdit(false);
            resetForm();
        } catch (err) {
            MyAlert("Error updating type mission: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    const handleDelete = (tm) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete type mission: ${tm.type}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    MyLoading("Deleting type mission...");
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/setting/type-mission/delete/${tm.id}`,
                        { method: "DELETE" }
                    );
                    if (!response.ok) throw new Error(await response.text());
                    setTypeMissions((prev) => prev.filter((p) => p.id !== tm.id));
                    MyAlert("The type mission has been deleted.", "success", "Deleted!");
                } catch (err) {
                    MyAlert("Error deleting type mission: " + err.message, "error", "Error");
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
        id: { value: "", matchMode: FilterMatchMode.EQUALS },
        type: { value: "", matchMode: FilterMatchMode.CONTAINS },
    };

    const columnConfig = [
        { field: "id", header: "ID", style: { width: "10%" } },
        { field: "type", header: "Type", style: { width: "60%" } },
        {
            field: "actions",
            header: "Action",
            style: { width: "30%" },
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


            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        type="button"
                        onClick={handleAddShow}
                        className="btn btn-success d-flex align-items-center"
                    >
                        <FaPlus className="me-2" /> Add Type Mission
                    </button>
                </div>

                {/* ✅ Table */}
                <MyTable
                    data={typeMissions}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                />
            </div>

            {/* ✅ Add Modal */}
            <MyForm
                show={show}
                handleClose={() => setShow(false)}
                handleSave={handleSave}
                formData={formData}
                handleChange={handleChange}
                title="Add Type Mission"
                fields={[
                    { name: "type", label: "Type", type: "text", required: true },
                ]}
            />

            {/* ✅ Edit Modal */}
            <MyForm
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                handleSave={handleEdit}
                formData={formData}
                handleChange={handleChange}
                title="Edit Type Mission"
                fields={[
                    { name: "type", label: "Type", type: "text", required: true },
                ]}
            />
        </div>
    );
}
