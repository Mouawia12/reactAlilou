import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {FaTrash, FaEdit, FaPlus, FaCheck, FaRegTimesCircle, FaPlusCircle, FaPrint} from "react-icons/fa";
import { FilterMatchMode } from "primereact/api";
import {  Button } from "react-bootstrap";

import {handlePrintFile, MyAlert, MyLoading, MyLoadingClose, NumberFormat} from "../helper/Tools";
import MyTable from "../helper/MyTable";
import Swal from "sweetalert2";
import { apiFetch } from "../auth/api";
import { Dropdown } from "primereact/dropdown";
import { BreadCrumb } from "primereact/breadcrumb";
import FactureDialog from "./dialog/FactureDialog";
import ShowPdfDialog from "./dialog/ShowPdfDialog";

const Facture = () => {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'Clients',template: () => <Link to="/clients">Clients</Link> },{ label: 'Factures' }];
    const [somme_Total, setSomme_Total] = useState(0);

    const [factures, setFactures] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [enterprise, setEnterprise] = useState([]);
    const [clients, setClients] = useState([]);
    const [orders, setOrders] = useState([]);
    const [periodeFilter, setPeriodeFilter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingFacture, setEditingFacture] = useState(null);
    const location = useLocation();
    const { clientFactures } = location.state || {};
    const [pdfUrl, setPdfUrl] = useState(null);
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({id: "",numFacture: "",titre: "",dateCreation: "",modeReglement: "",convNumberLetter: "",tva: 19,enterpriseId: "",clientId: "",
        orderId: "",periodeId :"",proformat : "",total : "",lignes: [],payed:"",rest:"", });


    // -------------------------
    // Fetch factures + meta
    // -------------------------
    const fetchData = async () => {

        try {
            MyLoading("Loading factures...");

            const facturesUrl = clientFactures
                ? `${process.env.REACT_APP_API_BASE_URL}/api/factures/list_factures_client/${clientFactures.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/factures`;

            const [factRes, periodesRes, enterpriseRes, clientsRes,ordersRes] = await Promise.all([
                apiFetch(facturesUrl),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/periodes`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/enterprises`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/clients`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`),
            ]);

            if (!factRes.ok || !periodesRes.ok || !enterpriseRes.ok || !clientsRes.ok|| !ordersRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const facturesData = await factRes.json();
            const periodesData = await periodesRes.json();
            const enterpriseData = await enterpriseRes.json();
            const clientsData = await clientsRes.json();
            const ordersData = await ordersRes.json();
            setFactures(facturesData);
            setPeriodes(periodesData);
            setEnterprise(enterpriseData);
            setClients(clientsData);
            setOrders(ordersData);

            const activePeriode = periodesData.find(p => p.active) || periodesData[periodesData.length - 1];
            if (activePeriode) setPeriodeFilter(activePeriode.id);
        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    useEffect(() => { fetchData()}, []);

    const handleUpdatedRest = async (facture) => {
        Swal.fire({
            title: "Enter Rest (DZD)",
            input: "number",
            inputAttributes: {
                min: 0,
                step: "0.01", // allows decimals
            },
            inputPlaceholder: "Enter Rest (DZD)",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#28a745", // Green confirm
            cancelButtonColor: "#dc3545",  // Red cancel
        }).then(async (result) => {
            try {
            if (result.isConfirmed && result.value) {
                const amount = parseFloat(result.value).toFixed(2);
                const url = `${process.env.REACT_APP_API_BASE_URL}/api/factures/update/${facture.id}`;
                const method = "PUT";
                const updatedFacture = { ...facture, rest: amount };
                setFormData(updatedFacture);
                const res = await apiFetch(url, {
                    method,
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updatedFacture),
                });
                if (!res.ok) throw new Error(await res.text());
                const saved = await res.json();
                setFactures(prev => prev.map(f => f.id === saved.id ? saved : f));
                MyAlert("Facture updated successfully", "success", "Updated!");
            }
            } catch (err) {
                MyAlert("Error saving facture: " + err.message, "error", "Error");
            }
        });
    };
    // -------------------------
    // Filter by periode
    // -------------------------
    const getFilteredFactures = () => {
        if (!periodeFilter || periodeFilter.value === null) {
            return factures; // Show all orders if no filter
        }
        return factures.filter(f => f.periodeId === periodeFilter);
    };
    // -------------------------
    // Delete facture
    // -------------------------
    const handleDeleteFacture = async (facture) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete facture: ${facture.numFacture}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/factures/delete/${facture.id}`,
                        { method: "DELETE" }
                    );
                    if (!res.ok) throw new Error(await res.text());
                    setFactures(prev => prev.filter(f => f.id !== facture.id));
                    MyAlert("Facture deleted.", "success", "Deleted!");
                } catch (err) {
                    Swal.fire("Error", "Failed to delete facture: " + err.message, "error");
                }
            }
        });
    };
    // -------------------------
    // Modal Add/Edit
    // -------------------------
    const handleShowModal = (facture = null) => {
        setEditingFacture(facture);
        setSomme_Total(facture ? facture.total : 0);
        setFormData(
            facture || {id: "",numFacture: `${factures.length+1}-2025`,titre: "",dateCreation: new Date().toISOString().split("T")[0],
                modeReglement: "",convNumberLetter: "",tva: 19,enterpriseId: "",clientId: "",total: "",
                orderId: "",periodeId :"",proformat : "",lignes: [],description:""}
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingFacture(null);
    };
    // -------------------------
    // Manage lignes
    // -------------------------
    const handleAddLigne = () => {
        const newLigne = { numero: formData.lignes.length + 1, designation: "", quantity: 0, puht: 0, montant: 0 };
        setFormData({ ...formData, lignes: [...formData.lignes, newLigne] });

    };

    const handleLigneChange = (index, field, value) => {
        const newLignes = [...formData.lignes];
        newLignes[index][field] = value;

        if (field === "quantity" || field === "puht") {
            const q = parseFloat(newLignes[index].quantity) || 0;
            const puht = parseFloat(newLignes[index].puht) || 0;
            newLignes[index].montant = q * puht;
        }
        setSomme_Total(newLignes.reduce((sum, l) => sum + (parseFloat(l.montant) || 0), 0));

        setFormData({ ...formData, lignes: newLignes });
    };

    const handleRemoveLigne = (index) => {
        const newLignes = formData.lignes.filter((_, i) => i !== index);
        setSomme_Total(newLignes.reduce((sum, l) => sum + (parseFloat(l.montant) || 0), 0));
        setFormData({ ...formData, lignes: newLignes });
    };
    // -------------------------
    // Save facture
    // -------------------------
    const handleSaveFacture = async () => {
        try {
            MyLoading("Saving facture...");
            const url = editingFacture
                ? `${process.env.REACT_APP_API_BASE_URL}/api/factures/update/${editingFacture.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/factures/add`;
            const method = editingFacture ? "PUT" : "POST";

            const res = await apiFetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error(await res.text());
            const saved = await res.json();
         if (editingFacture) {
               setFactures(prev => prev.map(f => f.id === saved.id ? saved : f));
               MyAlert("Facture updated successfully", "success", "Updated!");
           } else {
             fetchData()
               //setFactures(prev => [...prev, saved]);
               MyAlert("Facture added successfully", "success", "Added!");
           }
            handleCloseModal();
        } catch (err) {
            MyAlert("Error saving facture: " + err.message, "error", "Error");
        }
    };
    // -------------------------
    // Filters & columns
    // -------------------------
    const initialFilters = {
        numFacture: { value: "", matchMode: FilterMatchMode.CONTAINS },
        titre: { value: "", matchMode: FilterMatchMode.CONTAINS },
        dateCreation: { value: "", matchMode: FilterMatchMode.CONTAINS },
        clientName: { value: "", matchMode: FilterMatchMode.CONTAINS },
        enterpriseName: { value: "", matchMode: FilterMatchMode.CONTAINS },

    };

    const columnConfig = [
        { field: "numFacture", header: "Numéro", style: { width: "5%" } },
        { field: "titre", header: "Titre", style: { width: "15%" } },
        { field: "dateCreation", header: "Date", style: { width: "10%" } },
        {
            field: "clientName",
            header: "Client",
            style: { width: "10%" },
            body: (rowData) => {
                const clientObj = clients.find(c => c.id === rowData.clientId);
                return clientObj ? clientObj.name : "Unknown";
            }
        },
        {
            field: "enterpriseName",
            header: "Enterprise",
            style: { width: "10%" },
            body: (rowData) => {
                const ent = enterprise.find(e => e.id === rowData.enterpriseId);
                return ent ? ent.name : "Unknown";
            }
        },
        { field: "total", header: "Total (DZD)", style: { width: "10%" } ,   body: (rowData) =>
                (  <span className="fw-bold text-success ">
                {NumberFormat(rowData.total)}
                </span>)  },
        { field: "totalTTC", header: "Total TTC (DZD)",filter: false, style: { width: "10%" } ,   body: (rowData) =>
                (  <span className="fw-bold text-success ">{NumberFormat(rowData.total * (formData.tva / 100) + rowData.total)}</span>)},
        { field: "rest", header: "Rest (DZD) ", style: { width: "10%" },filter: false, body: (rowData) =>
                (<span className="fw-bold text-success ">  {NumberFormat(rowData.rest)}</span>) },
        {
            field: "payed",
            header: "Payé",
            style: { width: "5%", textAlign: "center" },
            filter: false,
            body: (rowData) =>
                rowData.payed ? (
                    <FaCheck style={{ color: "green", fontSize: "1.5rem" }} />
                ) : (
                    <FaRegTimesCircle style={{ color: "red", fontSize: "1.5rem" }} />
                ),
        },

        {
            field: "actions",
            header: "Action",
            style: { width: "20%" },
            filter:false,
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleShowModal(rowData)}
                        className="btn btn-sm btn-warning me-2"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteFacture(rowData)}
                        className="btn btn-sm btn-danger me-2"
                    >
                        <FaTrash />
                    </button>
                    <button
                        onClick={() => handlePrintFile(rowData, setVisible, setPdfUrl, "/api/reports/facture")}
                        className="btn btn-sm btn-success me-2"
                        title={"Print"}
                    >
                        <FaPrint  />
                    </button>
                    <button
                        onClick={() => handleUpdatedRest(rowData)}
                        className="btn btn-sm btn-primary me-2"
                        title={"ADD REST"}
                    >
                        <FaPlusCircle  />
                    </button>

                </>
            )
        }
    ];

    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="success"
                            className="btn btn-success d-flex align-items-center"
                            onClick={() => handleShowModal()}
                        >
                            <FaPlus className="me-2" /> Add Facture
                        </Button>
                        <h3 className="mb-2">
                            {clientFactures
                                ? <>Factures of Client: <b>{clientFactures.name}</b></>
                                : "Toutes les Factures"}
                        </h3>
                    </div>

                    <div className="d-flex align-items-center">
                        <label htmlFor="periodeFilter" className="me-2 fw-bold">Filter by Periode:</label>
                        <Dropdown
                            id="periodeFilter"
                            value={periodeFilter}
                            options={[
                                { label: "All", value: null },
                                ...periodes.map(p => ({ label: p.year, value: p.id }))
                            ]}
                            onChange={(e) => {
                                setPeriodeFilter(e.value);
                            }}
                            placeholder="Select Periode"
                            style={{ width: '280px' }}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <small className="text-muted">Showing: {getFilteredFactures().length} factures</small>
                </div>
                <MyTable
                    data={getFilteredFactures()}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                    className="my-table"
                />
            </div>
            {/* Modal Add/Edit */}
            <FactureDialog
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveFacture}
                formData={formData}
                setFormData={setFormData}
                handleAddLigne={handleAddLigne}
                handleRemoveLigne={handleRemoveLigne}
                handleLigneChange={handleLigneChange}
                editingFacture={editingFacture}
                enterprise={enterprise}
                clients={clients}
                orders={orders}
                somme_Total={somme_Total}
            />
            <ShowPdfDialog
                visible={visible}
                setVisible={setVisible}
                pdfUrl={pdfUrl}
                setPdfUrl={setPdfUrl}
            />

        </div>
    );
};

export default Facture;
