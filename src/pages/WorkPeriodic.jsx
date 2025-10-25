import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaList } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { MyAlert, MyLoading, MyLoadingClose } from "../helper/Tools";
import { apiFetch } from "../auth/api";
import Swal from "sweetalert2";
import { FilterMatchMode } from "primereact/api";
import MyTable from "../helper/MyTable";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import {BreadCrumb} from "primereact/breadcrumb";

export default function WorkPeriodic() {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'Work Periodics' }];
    const navigate = useNavigate();
    const [workPeriodics, setWorkPeriodics] = useState([]);
    const [clients, setClients] = useState([]);
    const [expiryFilter, setExpiryFilter] = useState(null); // null, "active", "near", "expired"
    const [formData, setFormData] = useState({
        id: "",
        clientId: "",
        locale: "",
        dateStart: "",
        timePeriodic: "",
        dateEnd: "",
        description: "",
        missions: [],
        clientName: ""
    });
    const [show, setShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    // -------------------------
    // Helpers
    // -------------------------
    const resetForm = () =>
        setFormData({
            id: "",
            clientId: "",
            locale: "",
            dateStart: "",
            timePeriodic: "",
            dateEnd: "",
            description: "",
            missions: [],
            clientName: ""
        });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Helper function that returns both status and diffDays
    const getExpiryInfo = (dateEnd) => {
        if (!dateEnd) return { status: "expired", diffDays: -999, isPast: true };

        const endDate = new Date(dateEnd);
        const today = new Date();

        // Reset time parts for accurate day comparison
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isPast = diffDays < 0;

        let status = "active";

        // Handle past dates (negative diffDays)
        if (isPast) {
            status = "expired-past"; // Different status for past dates
        }
        // Handle future dates
        else if (diffDays <= 10) {
            status = "expired";
        } else if (diffDays <= 15) {
            status = "near";
        }

        return { status, diffDays, isPast };
    };

    // Calculate expiry status for a work periodic
    const calculateExpiryStatus = (dateEnd) => {
        return getExpiryInfo(dateEnd).status;
    };

    // Filter work periodics based on expiry status


    const getFilteredWorkPeriodics = () => {
        // Check if data is loaded
        if (workPeriodics.length === 0) {
            return [];
        }

        // Return all if no filter is selected
        if (!expiryFilter || expiryFilter.value === null) {
            return workPeriodics;
        }

        const filtered = workPeriodics.filter(wp => {
            const { status } = getExpiryInfo(wp.dateEnd);
            const match = status === expiryFilter;
            return match;
        });

        return filtered;
    };

    // -------------------------
    // CRUD Handlers
    // -------------------------
    const handleAddShow = () => {
        resetForm();
        setShow(true);
    };

    const handleEditShow = (wp) => {
        setFormData({ ...wp });
        setShowEdit(true);
    };

    const handleGoToMission = (rowData) => {
        navigate("/work_periodic_mission", {
            state: {
                workPeriodicId: rowData.id,
                workPeriodic: rowData
            },
        });
    };

    const handleSaveWorkPeriodic = async () => {
        try {
            MyLoading("Saving WorkPeriodic...");
            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/setting/work-periodic/add`,
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error((await response.text()) || "Failed to add WorkPeriodic");
            }

            const newWP = await response.json();
            const clientName = clients.find(c => c.id === newWP.clientId)?.name || "Unknown";

            // Add expiry status to the new work periodic
            const newWPWithStatus = {
                ...newWP,
                clientName,
                expiryStatus: calculateExpiryStatus(newWP.dateEnd)
            };

            setWorkPeriodics((prev) => [...prev, newWPWithStatus]);
            MyAlert("New WorkPeriodic added successfully", "success", "Success");
            setShow(false);
        } catch (err) {
            MyAlert("Error saving WorkPeriodic: " + err.message, "error", "Error");
        }
    };

    const handleEditWorkPeriodic = async () => {
        if (!formData.id) {
            MyAlert("Invalid data: missing ID", "error", "Error");
            return;
        }
        try {
            MyLoading("Updating WorkPeriodic...");
            const response = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/setting/work-periodic/${formData.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to update WorkPeriodic");
            }

            const updatedWP = await response.json();
            const clientName = clients.find(c => c.id === updatedWP.clientId)?.name || "Unknown";

            // Add expiry status to the updated work periodic
            const updatedWPWithStatus = {
                ...updatedWP,
                clientName,
                expiryStatus: calculateExpiryStatus(updatedWP.dateEnd)
            };

            setWorkPeriodics((prev) =>
                prev.map((wp) => (wp.id === updatedWP.id ? updatedWPWithStatus : wp))
            );

            MyAlert("WorkPeriodic updated successfully", "success", "Success");
            setShowEdit(false);
        } catch (err) {
            MyAlert("Error updating WorkPeriodic: " + err.message, "error", "Error");
        }
    };

    const handleDeleteWorkPeriodic = (wp) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete WorkPeriodic with ID: ${wp.id}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/setting/work-periodic/delete/${wp.id}`,
                        { method: "DELETE" }
                    );
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText || "Failed to delete WorkPeriodic");
                    }
                    setWorkPeriodics((prev) => prev.filter((c) => c.id !== wp.id));
                    MyAlert("The WorkPeriodic has been deleted.", "success", "Deleted!");
                } catch (err) {
                    Swal.fire("Error", "Failed to delete WorkPeriodic: " + err.message, "error");
                }
            }
        });
    };

    // -------------------------
    // Fetch Data
    // -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading WorkPeriodics...");

            const [workPeriodicsRes, clientsRes] = await Promise.all([
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/setting/work-periodic`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/clients`),
            ]);

            if (!workPeriodicsRes.ok || !clientsRes.ok) {
                throw new Error("Failed to fetch data");
            }
            const wpData = await workPeriodicsRes.json();
            const clientsData = await clientsRes.json();
            // Create a map for fast client lookup
            const clientMap = new Map(clientsData.map(c => [c.id, c.name]));

            // Enrich workPeriodics with clientName and expiryStatus
            const enrichedWorkPeriodics = wpData.map(wp => ({
                ...wp,
                clientName: clientMap.get(wp.clientId) || "Unknown",
                expiryStatus: calculateExpiryStatus(wp.dateEnd)
            }));

            setWorkPeriodics(enrichedWorkPeriodics);
            setClients(clientsData);
        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const initialFilters = {
        clientName: { value: "", matchMode: FilterMatchMode.CONTAINS },
        locale: { value: "", matchMode: FilterMatchMode.CONTAINS },
        description: { value: "", matchMode: FilterMatchMode.CONTAINS },
        dateEnd: { value: "", matchMode: FilterMatchMode.CONTAINS },
        expiryStatus: { value: null, matchMode: FilterMatchMode.EQUALS },
    };

    const columnConfig = [
        {
            field: "clientName",
            header: "Client",
            style: { width: "20%" },
            body: (rowData) => rowData.clientName,
            filter: true,
            filterPlaceholder: "Search by client",
        },
        {
            field: "locale",
            header: "Locale",
            style: { width: "10%" },
            filter: true,
            filterPlaceholder: "Search by locale"
        },
        {
            field: "dateStart",
            header: "Date Start",
            style: { width: "15%" }
        },
        {
            field: "timePeriodic",
            header: "Periodicity",
            style: { width: "10%" }
        },
        {
            field: "dateEnd",
            header: "Date End",
            style: { width: "10%" },
            body: (rowData) => {
                if (!rowData.dateEnd) {
                    return <span style={{ color: "red", fontWeight: "bold" }}>N/A</span>;
                }

                const { status, diffDays, isPast } = getExpiryInfo(rowData.dateEnd);
                const dateEnd = new Date(rowData.dateEnd);

                let color = "green";
                let fontWeight = "bold";

                if (status === "expired-past") {
                    color = "darkred"; // Darker red for past dates
                } else if (status === "expired") {
                    color = "red"; // Bright red for future expired dates
                } else if (status === "near") {
                    color = "orange";
                }

                // Display absolute value for past dates, or keep as is for future
                const displayDays = isPast ? Math.abs(diffDays) : diffDays;
                const daysText = isPast ? `Past: ${displayDays}` : `R: ${displayDays}`;

                return (
                    <span style={{ color, fontWeight }}>
                {dateEnd.toLocaleDateString()}, {daysText}
            </span>
                );
            },
            filter: false,
            filterField: "dateEnd"
        },
        {
            field: "description",
            header: "Description",
            style: { width: "25%" },
            filter: false,
            filterPlaceholder: "Search by description"
        },
        {
            field: "actions",
            header: "Action",
            style: { width: "15%" },
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleEditShow(rowData)}
                        className="btn btn-sm btn-warning me-2"
                        title={"Edit"}
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteWorkPeriodic(rowData)}
                        className="btn btn-sm btn-danger me-2"
                        title={"Delete"}
                    >
                        <FaTrash />
                    </button>
                    <button
                        onClick={() => handleGoToMission(rowData)}
                        className="btn btn-sm btn-primary me-2"
                        title={"Lists Missions"}
                    >
                        <FaList />
                    </button>
                </>
            ),
            filter: false,
            sortable: false,
        },
    ];

    // -------------------------
    // Custom Form Modal
    // -------------------------
    const renderForm = (handleSave, title, show) => (
        <Modal
            show={show}
            onHide={() => {
                setShow(false);
                setShowEdit(false);
            }}
            centered
            dialogClassName="custom-modal"
        >
            <Modal.Header closeButton className="custom-modal-header">
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="custom-modal-body">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Client</Form.Label>
                        <Form.Select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            className="form-control-custom"
                        >
                            <option value="">-- Select Client --</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.id})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Locale</Form.Label>
                        <Form.Control
                            type="text"
                            name="locale"
                            value={formData.locale}
                            onChange={handleChange}
                            className="form-control-custom"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Date Start</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateStart"
                            value={formData.dateStart}
                            onChange={handleChange}
                            className="form-control-custom"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Periodicity</Form.Label>
                        <Form.Select
                            name="timePeriodic"
                            value={formData.timePeriodic}
                            onChange={handleChange}
                            className="form-control-custom"
                        >
                            <option value="">-- Select Periodicity --</option>
                            <option value="THREE_MONTHS">3 Months</option>
                            <option value="SIX_MONTHS">6 Months</option>
                            <option value="YEARLY">Yearly</option>
                        </Form.Select>
                    </Form.Group>


                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control-custom"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="custom-modal-footer">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShow(false);
                        setShowEdit(false);
                    }}
                >
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />

            <h3 className="text-center">Liste WorkPeriodic</h3>

            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                        type="button"
                        onClick={handleAddShow}
                        className="btn btn-success d-flex align-items-center"
                    >
                        <FaPlus className="me-2" /> Add WorkPeriodic
                    </button>

                    {/* Filter dropdown for expiry status */}
                    <div className="d-flex align-items-center">
                        <label htmlFor="expiryFilter" className="me-2 fw-bold">Filter by Status:</label>
                        <Dropdown
                            id="expiryFilter"
                            value={expiryFilter}
                            options={[
                                { label: "All Status", value: null },
                                { label: "🟢 Active", value: "active" },
                                { label: "🟠 Near Expiry (10-15 days)", value: "near" },
                                { label: "🔴 Expired (≤10 days)", value: "expired" },
                                { label: "🟣 Expired Past Dates", value: "expired-past" }
                            ]}
                            onChange={(e) => {
                                console.log("Dropdown changed to:", e.value);
                                setExpiryFilter(e.value);
                            }}
                            placeholder="Select Status"
                            style={{ width: '280px' }} // Slightly wider to accommodate new option
                        />

                        {/* Debug info */}
                        <small className="ms-2 text-muted">
                            Showing: {getFilteredWorkPeriodics().length} of {workPeriodics.length} records

                        </small>
                    </div>
                </div>

                <MyTable
                    data={getFilteredWorkPeriodics()}
                    initialFilters={initialFilters}
                    columns={columnConfig}
                />
            </div>
            {renderForm(handleSaveWorkPeriodic, "Add WorkPeriodic", show)}
            {renderForm(handleEditWorkPeriodic, "Edit WorkPeriodic", showEdit)}
        </div>
    );
}