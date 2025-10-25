import React, { useEffect, useState } from "react";
import { FaUserPlus, FaEdit, FaTrash, FaList, FaClipboardList } from "react-icons/fa";
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import Swal from "sweetalert2";
import MyTable from "../helper/MyTable";
import { Link, useNavigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import { Button } from "react-bootstrap";
import ClientDialog from "./dialog/ClientDialog";

export default function Client() {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> };
    const items = [{ label: 'Clients' }];
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    // -------------------------
    // Fetch Data
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading clients...");
            const res = await apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/clients`);
            if (!res.ok) throw new Error("Failed to fetch clients");
            const data = await res.json();
            setClients(data);
        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    useEffect(() => { fetchData(); }, []);

    // -------------------------
    // Handlers
    // -------------------------
    const handleShowDialog = (client = null) => {
        setEditingClient(client);
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingClient(null);
    };

    const handleSaveClient = async (formData) => {
        try {
            MyLoading("Saving client...");
            const url = editingClient
                ? `${process.env.REACT_APP_API_BASE_URL}/api/clients/update/${formData.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/clients/add`;

            const method = editingClient ? "PUT" : "POST";
            const response = await apiFetch(url, { method, body: JSON.stringify(formData) });
            if (!response.ok) throw new Error(await response.text());

            const saved = await response.json();
            setClients(prev =>
                editingClient
                    ? prev.map(c => (c.id === saved.id ? saved : c))
                    : [...prev, saved]
            );

            MyAlert(editingClient ? "Client updated successfully" : "New client added successfully", "success");
            handleCloseDialog();
        } catch (err) {
            MyAlert("Error saving client: " + err.message, "error", "Error");
        }
    };

    const handleDeleteClient = (client) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete client: ${client.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/clients/delete/${client.id}`, { method: "DELETE" });
                    if (!response.ok) throw new Error(await response.text());
                    setClients((prev) => prev.filter((c) => c.id !== client.id));
                    MyAlert("Client deleted successfully", "success");
                } catch (err) {
                    Swal.fire("Error", "Failed to delete client: " + err.message, "error");
                }
            }
        });
    };

    const handleGoToFacture = (rowData) => navigate("/factures", { state: { clientFactures: rowData } });
    const handleGoToOrder = (rowData) =>  navigate("/orders", { state: { clientOrders: rowData } });


    // -------------------------
    // Table Config
    // -------------------------
    const columnConfig = [
        { field: "name", header: "Name", style: { width: "15%" } },
        { field: "tel", header: "Tel", style: { width: "10%" } },
        { field: "email", header: "Email", style: { width: "15%" } },
        { field: "address", header: "Address", style: { width: "20%" } },
        { field: "nif", header: "NIF", style: { width: "10%" } },
        { field: "nis", header: "NIS", style: { width: "10%" } },
        { field: "locale", header: "Locale", style: { width: "10%" } },
        {
            field: "actions",
            header: "Actions",
            style: { width: "15%", textAlign: "center" },
            body: (rowData) => (
                <div className="d-flex justify-content-center gap-2">
                    <button className="btn btn-sm btn-warning" onClick={() => handleShowDialog(rowData)}><FaEdit /></button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClient(rowData)}><FaTrash /></button>
                    <button className="btn btn-sm btn-primary" onClick={() => handleGoToOrder(rowData)} title="List Bon Commandes"><FaList /></button>
                    <button className="btn btn-sm btn-success" onClick={() => handleGoToFacture(rowData)} title="List Factures"><FaClipboardList /></button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />
            <h3 className="text-center">Liste Clients</h3>

            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button variant="success" onClick={() => handleShowDialog()}>
                        <FaUserPlus className="me-2" /> Add Client
                    </Button>
                </div>

                <MyTable data={clients} columns={columnConfig} />
            </div>

            <ClientDialog
                show={showDialog}
                onHide={handleCloseDialog}
                client={editingClient}
                onSave={handleSaveClient}
            />
        </div>
    );
}
