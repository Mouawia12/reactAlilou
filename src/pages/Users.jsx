import React, { useEffect, useState } from "react";
import { FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import MyForm from "../helper/MyForm";
import { FilterMatchMode } from 'primereact/api';
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import Swal from "sweetalert2";
import MyTable from "../helper/MyTable";
import {Link} from "react-router-dom";
import {BreadCrumb} from "primereact/breadcrumb";


export default function Users() {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'Utilisateurs' }];
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        id :"",
        roleIds: [],
    });
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // -------------------------
    // Helpers
    // -------------------------
    const resetForm = () =>
        setFormData({ name: "", username: "", email: "", roleIds: [] });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // -------------------------
    // CRUD Handlers
    // -------------------------
    const handleAddShow = () => {
        resetForm();
        setShow(true);
    };

    const handleEditShow = (user) => {
        setFormData({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            roleIds: user.roles ? user.roles.map((r) => r.id) : [],
        });
        setShowEdit(true);
    };

    const handleSaveUser = async () => {
        try {
            MyLoading("Saving user...");
            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/users/add_user`,
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error((await response.text()) || "Failed to add user");
            }

            const newUser = await response.json();
            setUsers((prev) => [...prev, newUser]);
            MyAlert("New user added successfully", "success", "Success");
            resetForm();
            setShow(false);
        } catch (err) {
            MyAlert("Error saving user: " + err.message, "error", "Error");
        }
    };

    const handleEditUser = async () => {
        if (!formData.id) {
            MyAlert("Invalid user data: missing ID", "error", "Error");
            return;
        }
        try {
            MyLoading("Updating user...");
            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/users/update_user/${formData.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update user");
            }

            const updatedUser = await response.json();

            // ✅ Update the users list with the updated user
            setUsers((prev) =>
                prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
            );

            MyAlert("User updated successfully", "success", "Success");
            resetForm();
            setShowEdit(false);
        } catch (err) {
            MyAlert("Error updating user: " + err.message, "error", "Error");
        }
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete user: ${user.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/users/delete_user/${user.id}`,
                        {
                            method: "DELETE",
                        }
                    );
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || "Failed to Delete user");
                    }
                    setUsers((prev) => prev.filter((u) => u.id !== user.id));
                    MyAlert("The user has been deleted.", "success", "Deleted!");
                } catch (err) {
                    Swal.fire("Error", "Failed to delete user: " + err.message, "error");
                }
            }
        });
    };

    // -------------------------
    // Fetch Data
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading users...");
            const [usersRes, rolesRes] = await Promise.all([
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/users`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/roles`),
            ]);

            if (!usersRes.ok || !rolesRes.ok) {
                throw new Error("Failed to fetch data");
            }

            setUsers(await usersRes.json());
            setRoles(await rolesRes.json());
        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };
    // -------------------------
    // Effects
    // -------------------------
    useEffect(() => {
        fetchData();
    }, []);

    // -------------------------
    // Table Configuration
    // -------------------------
    const initialFilters = {
        name: { value: '', matchMode: FilterMatchMode.CONTAINS },
        username: { value: '', matchMode: FilterMatchMode.CONTAINS },
        email: { value: '', matchMode: FilterMatchMode.CONTAINS },
        rolesString: { value: '', matchMode: FilterMatchMode.CONTAINS }, // 👈 Add this

    };

    // Flatten roles into a string for filtering
    const usersWithRoleString = users.map((u) => ({
        ...u,
        rolesString: u.roles?.map((r) => r.name).join(", ") || "No Roles",
    }));

    const columnConfig = [

        { field: 'name', header: 'Name', style: { width: '25%' } },
        { field: 'username', header: 'Username', style: { width: '15%' } },
        { field: 'email', header: 'Email', style: { width: '25%' } },
        {
            field: 'rolesString',
            header: 'Roles',
            style: { width: '10%' }, // Reduced from 15% to 10%
            body: (rowData) =>
                rowData.roles?.length > 0 ? (
                    rowData.roles.map((r) => (
                        <span key={r.id} className="badge bg-primary me-1">
                        {r.name}
                    </span>
                    ))
                ) : (
                    <small className="text-muted">No Roles</small>
                ),
            filter: true,
            sortable: true,
        },
        {
            field: 'actions',
            header: 'Action',
            style: { width: '15%' }, // Adjusted to make total = 100%
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleEditShow(rowData)}
                        className="btn btn-sm btn-warning me-2"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteUser(rowData)}
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

            <h3 className="text-center">Liste Utilisateurs</h3>

            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        type="button"
                        onClick={handleAddShow}
                        className="btn btn-success d-flex align-items-center"
                    >
                        <FaUserPlus className="me-2" /> Add User
                    </button>
                </div>

                {/* ✅ PrimeReact Table Only */}
                <MyTable
                    data={usersWithRoleString}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                />
            </div>

            {/* Modals */}
            <MyForm
                show={show}
                handleClose={() => setShow(false)}
                handleSave={handleSaveUser}
                formData={formData}
                handleChange={handleChange}
                rolesList={roles}
                title="Add User"
            />
            <MyForm
                show={showEdit}
                handleClose={() => setShowEdit(false)}
                handleSave={handleEditUser}
                formData={formData}
                rolesList={roles}
                handleChange={handleChange}
                title="Edit User"
            />
        </div>
    );
}