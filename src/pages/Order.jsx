import React, { useEffect, useState } from "react";
import { Link,useLocation } from "react-router-dom";
import {FaDownload, FaTrash, FaEdit, FaPlus, FaEye} from "react-icons/fa";
import { FilterMatchMode } from "primereact/api";
import { Modal, Button, Form } from "react-bootstrap";
import {handleDownload, handlePreview, MyAlert, MyLoading, MyLoadingClose} from "../helper/Tools";
import MyTable from "../helper/MyTable";
import Swal from "sweetalert2";
import { apiFetch } from "../auth/api";
import { Dropdown } from "primereact/dropdown";
import {BreadCrumb} from "primereact/breadcrumb";
import OrderDialog from "./dialog/OrderDialog";
import ShowPdfDialog from "./dialog/ShowPdfDialog";

const Order = () => {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'Clients',template: () => <Link to="/clients">Clients</Link> },{ label: 'Bon Commabdes' }];
    const [orders, setOrders] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [enterprise, setEnterprise] = useState([]);
    const [periodeFilter, setPeriodeFilter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [clients, setClients] = useState([]);
    const location = useLocation();
    const { clientOrders } = location.state || {};
    const [formData, setFormData] = useState({
        id: "",
        date: "",
        description: "",
        documentName: "",
        file: null,           // ✅ add this for uploaded file object
        periodeId: "",
        enterpriseId: "",
        clientId: "",
        documentUrl:""
    });

    // -------------------------
    // Fetch orders and periodes
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading orders and periodes...");

            const ordersUrl = clientOrders
                ? `${process.env.REACT_APP_API_BASE_URL}/api/orders/list_orders_client/${clientOrders.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/orders`;

            const [ordersRes, periodesRes, enterpriseRes, clientsRes] = await Promise.all([
                apiFetch(ordersUrl),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/periodes`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/enterprises`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/clients`),
            ]);

            if (!ordersRes.ok || !periodesRes.ok || !enterpriseRes.ok || !clientsRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const ordersData = await ordersRes.json();
            const periodesData = await periodesRes.json();
            const enterpriseData = await enterpriseRes.json();
            const clientsData = await clientsRes.json();

            setOrders(ordersData);
            setPeriodes(periodesData);
            setEnterprise(enterpriseData);
            setClients(clientsData);

            const activePeriode = periodesData.find(p => p.active) || periodesData[periodesData.length - 1];
            if (activePeriode) setPeriodeFilter(activePeriode.id);

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
    // Filter orders by periode
    // -------------------------
    const getFilteredOrders = () => {
        if (!periodeFilter || periodeFilter.value === null) {
            return orders; // Show all orders if no filter
        }
        return orders.filter(order => order.periodeId === periodeFilter);
    };

    // -------------------------
    // Delete order
    // -------------------------
    const handleDeleteOrder = async (order) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete order ID: ${order.id}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/orders/delete/${order.id}`,
                        { method: "DELETE" }
                    );
                    if (!response.ok) throw new Error(await response.text());

                    // Remove the order from the current list
                    setOrders(prev => prev.filter(o => o.id !== order.id));
                    MyAlert("The order has been deleted.", "success", "Deleted!");
                } catch (err) {
                    Swal.fire("Error", "Failed to delete order: " + err.message, "error");
                }
            }
        });
    };
    // -------------------------
    // Modal Add/Edit
    // -------------------------
    const handleShowModal = (order = null) => {
        setEditingOrder(order);
        setFormData(
            order || {
                id: "",
                date: "",
                description: "",
                documentName: "",
                document: "",
                periodeId: "",
                enterpriseId:"",
                clientId:""
            }
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingOrder(null);
    };

    // -------------------------
    // Save (Add / Edit)
    // -------------------------
    const handleSaveOrder = async () => {
        try {
            MyLoading("Saving order...");
            const url = editingOrder
                ? `${process.env.REACT_APP_API_BASE_URL}/api/orders/update/${editingOrder.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/orders/add`;

            const method = editingOrder ? "PUT" : "POST";

            // Use FormData for multipart upload
            const formDataToSend = new FormData();

            // Append JSON as a Blob
            const orderJson = { ...formData };
            delete orderJson.file; // remove file content
            delete orderJson.documentName;
            formDataToSend.append(
                "order",
                new Blob([JSON.stringify(orderJson)], { type: "application/json" })
            );

            // Append the actual file (if exists)
            if (formData.file) {
                formDataToSend.append("file", formData.file);
            }

            const res = await apiFetch(url, {
                method,
                body: formDataToSend,
            });

            if (!res.ok) throw new Error(await res.text());

            const savedOrder = await res.json();

            if (editingOrder) {
                // Update existing order
                setOrders(prev => prev.map(o => o.id === savedOrder.id ? savedOrder : o));
                MyAlert("Order updated successfully", "success", "Updated!");
            } else {
                // Add new order
                setOrders(prev => [...prev, savedOrder]);
                MyAlert("Order added successfully", "success", "Added!");
            }

            handleCloseModal();
        } catch (err) {
            MyAlert("Error saving order: " + err.message, "error", "Error");
        }
    };


    // -------------------------
    // Filters
    // -------------------------
    const initialFilters = {
        date: { value: "", matchMode: FilterMatchMode.CONTAINS },
        description: { value: "", matchMode: FilterMatchMode.CONTAINS },
        documentName: { value: "", matchMode: FilterMatchMode.CONTAINS },
        enterpriseName: { value: "", matchMode: FilterMatchMode.CONTAINS },
        clientName: { value: "", matchMode: FilterMatchMode.CONTAINS },
    };

    // -------------------------
    // Columns
    // -------------------------
    const columnConfig = [
        {
            field: "date",
            header: "Date",
            style: { width: "15%" }
        },
        {
            field: "clientName",
            header: "Client",
            style: { width: "15%" },
            body: (rowData) => {
                const clientObj = clients.find(c => c.id === rowData.clientId);
                return clientObj ? clientObj.name : "Unknown";
            },
            filter: true,
            filterPlaceholder: "Search by Client Name",
        },
        {
            field: "description",
            header: "Description",
            style: { width: "25%" }
        },
        {
            field: "enterpriseName",
            header: "Enterprise",
            style: { width: "15%" },
            body: (rowData) => {
                const ent = enterprise.find(e => e.id === rowData.enterpriseId);

                return ent ? ent.name : "Unknown";
            },
            filter: true,
            filterPlaceholder: "Search by enterprise",
        },

        {
            field: "document",
            header: "Document",
            style: { width: "20%" },
            body: (rowData) => {
                if (!rowData.documentUrl)
                    return <span className="text-muted">No Document</span>;

                return (
                    <>
                        <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleDownload(rowData)}
                            title={"Download"}
                        >
                            <FaDownload  /> {rowData.documentName.split("_")[1] }
                        </button>
                        <button
                            onClick={() => handlePreview(rowData)}
                            className="btn btn-sm btn-warning me-2"
                            title={"Preview"}
                        >
                            <FaEye /> {rowData.documentName.split("_")[1] }
                        </button>
                    </>
                );
            },
        }

        ,
        {
            field: "actions",
            header: "Action",
            style: { width: "15%" },
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleShowModal(rowData)}
                        className="btn btn-sm btn-warning me-2"
                        title={"Edit"}
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteOrder(rowData)}
                        className="btn btn-sm btn-danger"
                        title={"Delete"}
                    >
                        <FaTrash />
                    </button>
                </>
            ),
            filter: false,
            sortable: false,
        },
    ];

    const filteredOrders = getFilteredOrders();
    const enrichedOrders = getFilteredOrders().map(order => {
        const ent = enterprise.find(e => e.id === order.enterpriseId);
        const clientObj = clients.find(c => c.id === order.clientId);
        return {
            ...order,
            enterpriseName: ent ? ent.name : "Unknown",
            clientName: clientObj ? clientObj.name : "Unknown",
        };
    });

    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    {/* Left section: Title + Add button */}
                    <div className="d-flex align-items-center gap-3">
                        <Button
                            variant="success"
                            className="btn btn-success d-flex align-items-center"
                            onClick={() => handleShowModal()}
                        >
                            <FaPlus className="me-2" /> Add Order
                        </Button>
                        <h3 className="mb-2">
                            {clientOrders ? (
                                <>Bon commande to Client: <b>{clientOrders.name}</b></>
                            ) : (
                                "Tous Bon Commandes"
                            )}
                        </h3>

                    </div>

                    {/* Right section: Filter */}
                    <div className="d-flex align-items-center">
                        <label htmlFor="periodeFilter" className="me-2 fw-bold">Filter by Periode:</label>
                        <Dropdown
                            id="periodeFilter"
                            value={periodeFilter}
                            options={[
                                { label: "All", value: null },
                                ...periodes.map(periode => ({
                                    label: ` ${periode.year}`,
                                    value: periode.id
                                }))
                            ]}
                            onChange={(e) => setPeriodeFilter(e.value)}
                            placeholder="Select Periode"
                            style={{ width: '280px' }}
                        />
                    </div>
                </div>
                {/* Show count of filtered orders */}
                <div className="mb-3">
                    <small className="text-muted">
                        Showing: {filteredOrders.length}  orders
                    </small>
                </div>

                <MyTable
                    data={enrichedOrders}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                />
            </div>

            {/* Modal Add/Edit */}
            <OrderDialog
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveOrder}
                formData={formData}
                setFormData={setFormData}
                editingOrder={editingOrder}
                clients={clients}
                enterprise={enterprise}
            />

        </div>
    );
};

export default Order;
