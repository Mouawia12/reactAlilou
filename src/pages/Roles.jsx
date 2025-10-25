import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import MyForm from "../helper/MyForm";
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import Swal from "sweetalert2";
import { FilterMatchMode } from "primereact/api";
import MyTable from "../helper/MyTable";
import {Link} from "react-router-dom";
import {BreadCrumb} from "primereact/breadcrumb";

export default function Roles() {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'Permissions' }];
    const [roles, setRoles] = useState([]);
    const [privileges, setPrivileges] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        privileges: [],
    });
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // -------------------------
    // Fetch roles + privileges
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading Roles & Privileges...");
            const [rolesRes, privilegesRes] = await Promise.all([
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/roles`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/roles/privileges`),
            ]);
            if (!rolesRes.ok || !privilegesRes.ok) {
                throw new Error("Failed to fetch data");
            }
            const rolesData = await rolesRes.json();
            const privilegesData = await privilegesRes.json();

            // Normalize roles + flatten privileges into string
            setRoles(
                rolesData.map((r) => ({
                    ...r,
                    privileges: r.privileges || [],
                    privilegesString: r.privileges?.map((p) => p.name).join(", ") || "No Privileges",
                }))
            );
            setPrivileges(privilegesData);
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

    const resetForm = () =>
        setFormData({ id: "", name: "", privileges: [] });
    const handleAddShow = () => {
        resetForm();
        setShow(true);
    };
    const handleEditShow = (role) => {
        setFormData({
            id: role.id,
            name: role.name,
            privileges: role.privileges || [], // keep only array
        });
        setShowEdit(true);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveRole = async () => {
        try {
            MyLoading("Saving role...");

            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/roles/add_role`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: formData.name,
                        privileges: formData.privileges.map((p) => p.id), // send only privilege IDs
                    }),
                }
            );
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to save role");
            }

            const savedRole = await response.json();
            // ✅ Refresh table after adding role
            setRoles((prev) => [...prev, savedRole]);
            MyAlert("Role added successfully", "success", "Success");
            setShow(false);
            resetForm();
        } catch (err) {
            MyAlert("Error saving role: " + err.message, "error", "Error");
        }
    };

    const handleEditRole = async () => {
        try {
            MyLoading("Updating role...");

            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/roles/update_role/${formData.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        name: formData.name,
                        privileges: formData.privileges.map((p) => p.id), // send only IDs
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update role");
            }

            const updatedRole = await response.json();

            // ✅ Update roles state
            setRoles((prev) =>
                prev.map((role) =>
                    role.id === updatedRole.id
                        ? {
                            ...updatedRole,
                            privilegesString:
                                updatedRole.privileges?.map((p) => p.name).join(", ") ||
                                "No Privileges",
                        }
                        : role
                )
            );

            MyAlert("Role updated successfully", "success", "Success");
            setShowEdit(false);
            resetForm();
        } catch (err) {
            MyAlert("Error updating role: " + err.message, "error", "Error");
        }
    };

    const handleDeleteRole = (role) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Delete role: ${role.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    MyLoading("Deleting role...");

                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/roles/delete_role/${role.id}`,
                        { method: "DELETE" }
                    );

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || "Failed to delete role");
                    }

                    // ✅ Update state without full reload
                    setRoles((prev) => prev.filter((r) => r.id !== role.id));

                    MyAlert("The role has been deleted.", "success", "Deleted!");
                } catch (err) {
                    MyAlert("Error deleting role: " + err.message, "error", "Error");
                }
            }
        });
    };


    // -------------------------
    // Table Config
    // -------------------------
    const initialFilters = {
        id: { value: "", matchMode: FilterMatchMode.EQUALS },
        name: { value: "", matchMode: FilterMatchMode.CONTAINS },
        privilegesString: { value: "", matchMode: FilterMatchMode.CONTAINS }, // ✅ filtering works here
    };

    const rolesWithPrivilegesString = roles.map((r) => ({
        ...r,
        privilegesString: r.privileges?.map((p) => p.name).join(", ") || "No Privileges",
    }));

    const columnConfig = [
        { field: "id", header: "ID", style: { width: "10%" } },
        { field: "name", header: "Role Name", style: { width: "25%" } },
        {
            field: "privilegesString", // ✅ use flattened string for filter/sort
            header: "Privileges",
            style: { width: "40%" },
            body: (rowData) =>
                rowData.privileges?.length > 0 ? (
                    rowData.privileges.map((p) => (
                        <span key={p.id} className="badge bg-info me-1">
                            {p.name}
                        </span>
                    ))
                ) : (
                    <small className="text-muted">No Privileges</small>
                ),
            filter: true,
            sortable: true,
        },
        {
            field: "actions",
            header: "Action",
            style: { width: "25%" },
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleEditShow(rowData)}
                        className="btn btn-sm btn-warning me-2"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteRole(rowData)}
                        className="btn btn-sm btn-danger"
                    >
                        <FaTrash />
                    </button>
                </>
            ),
            filter: false,
            sortable: false,
        },
    ];

    // -------------------------
    // Render
    // -------------------------
    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />

            <h3 className="text-center">Liste Roles</h3>

            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        type="button"
                        onClick={handleAddShow}
                        className="btn btn-success d-flex align-items-center"
                    >
                        <FaPlus className="me-2" /> Add Role
                    </button>
                </div>

                {/* ✅ PrimeReact Table */}
                <MyTable
                    data={rolesWithPrivilegesString}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                />
            </div>

            {/* Modals */}
            <MyForm
                show={show}
                handleClose={() => setShow(false)}
                handleSave={handleSaveRole}
                formData={formData}
                handleChange={handleChange}
                privileges={privileges}
                title="Add Role"
            />
            <MyForm
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                handleSave={handleEditRole}
                formData={formData}
                handleChange={handleChange}
                privileges={privileges}
                title="Edit Role"
            />
        </div>
    );
}
