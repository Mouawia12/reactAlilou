import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {FaDownload, FaTrash, FaEdit, FaPlus, FaEye} from "react-icons/fa";
import { FilterMatchMode } from "primereact/api";
import { Modal, Button, Form } from "react-bootstrap";
import {fileToBase64, handleDownload, handlePreview, MyAlert, MyLoading, MyLoadingClose} from "../helper/Tools";
import MyTable from "../helper/MyTable";
import Swal from "sweetalert2";
import { apiFetch } from "../auth/api";
import {BreadCrumb} from "primereact/breadcrumb";
import MissionDialog from "./dialog/MissionDialog";

const Mission = () => {
    const home = { icon: 'pi pi-home', template: () => <Link to="/home"><i className="pi pi-home"></i></Link> }
    const items = [{ label: 'Missions',template: () => <Link to="/work_periodic">Work Periodic</Link> },{label: 'Clients'}];
    const location = useLocation();
    const { workPeriodic } = location.state || {};

    const [missions, setMissions] = useState([]);
    const [typeMission, setTypeMission] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingMission, setEditingMission] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        date: "",
        locale: "",
        statut: "",
        typeMissionName: "",
        documentUrl: "",
        file: null,
        documentName: "",
        typeMissionId: "",
        description: "",
        workPeriodicId: "" // Add workPeriodicId to form data
    });

    // -------------------------
    // Fetch missions and type missions
    // -------------------------
    // -------------------------
// Fetch missions and type missions (Optimized version)
// -------------------------
    const fetchData = async () => {
        try {
            MyLoading("Loading data...");

            // Base URLs
            const BASE_URL = process.env.REACT_APP_API_BASE_URL;
            const API_BASE = `${BASE_URL}/api`;

            // Determine missions endpoint
            const missionsEndpoint = workPeriodic?.id
                ? `/missions/list_mission_work/${workPeriodic.id}`
                : '/missions';

            // Fetch initial data
            const [typeMissionRes, missionsRes] = await Promise.all([
                apiFetch(`${API_BASE}/setting/type-mission`),
                apiFetch(`${API_BASE}${missionsEndpoint}`)
            ]);

            // Validate responses
            if (!typeMissionRes.ok) throw new Error("Failed to fetch type missions");
            if (!missionsRes.ok) throw new Error("Failed to fetch missions");

            // Parse responses
            const [typeMissionData, missionsData] = await Promise.all([
                typeMissionRes.json(),
                missionsRes.json()
            ]);

            setTypeMission(typeMissionData);

            // Enrich missions data
            const enrichedMissions = workPeriodic?.id
                ? await enrichMissionsWithWorkPeriodic(missionsData, workPeriodic)
                : await enrichMissionsWithClients(missionsData, API_BASE);

            setMissions(enrichedMissions);

        } catch (err) {
            MyAlert(`Error fetching data: ${err.message}`, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };
    // Helper functions for data enrichment
    const enrichMissionsWithWorkPeriodic = async (missions, workPeriodic) => {
        return missions.map(mission => ({
            ...mission,
            clientName: workPeriodic.clientName
        }));
    };

    const enrichMissionsWithClients = async (missions, apiBase) => {
        try {
            const [clientsRes, workPeriodicsRes] = await Promise.all([
                apiFetch(`${apiBase}/clients`),
                apiFetch(`${apiBase}/setting/work-periodic`)
            ]);

            if (!clientsRes.ok || !workPeriodicsRes.ok) {
                return missions.map(mission => ({
                    ...mission,
                    clientName: "Unknown Client"
                }));
            }

            const [clientsData, workPeriodicsData] = await Promise.all([
                clientsRes.json(),
                workPeriodicsRes.json()
            ]);

            // Create lookup maps
            const clientMap = new Map(clientsData.map(client => [client.id, client.name]));
            const workPeriodicMap = new Map(workPeriodicsData.map(wp => [wp.id, wp.clientId]));

            return missions.map(mission => {
                const clientId = workPeriodicMap.get(mission.workPeriodicId);
                const clientName = clientId ? clientMap.get(clientId) : null;

                return {
                    ...mission,
                    clientName: clientName || "Unknown Client"
                };
            });

        } catch (error) {
            // Return missions with fallback client names
            return missions.map(mission => ({
                ...mission,
                clientName: "Unknown Client"
            }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [workPeriodic]); // Re-fetch when workPeriodic changes

    // -------------------------
    // Delete mission
    // -------------------------
    const handleDeleteMission = async (mission) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete mission ID: ${mission.id}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await apiFetch(
                        `${process.env.REACT_APP_API_BASE_URL}/api/missions/delete/${mission.id}`,
                        { method: "DELETE" }
                    );

                    if (!response.ok) throw new Error(await response.text());

                    setMissions((prev) => prev.filter((m) => m.id !== mission.id));
                    MyAlert("The mission has been deleted.", "success", "Deleted!");
                } catch (err) {
                    Swal.fire("Error", "Failed to delete mission: " + err.message, "error");
                }
            }
        });
    };

    // -------------------------
    // Modal Add/Edit
    // -------------------------
    const handleShowModal = (mission = null) => {
        setEditingMission(mission);
        setFormData(
            mission || {
                date: "",
                locale: "",
                statut: "",
                typeMissionName: "",
                document: "",
                documentName: "",
                typeMissionId: "",
                description: "",
                workPeriodicId: workPeriodic?.id || "" // Pre-fill workPeriodicId if available
            }
        );
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingMission(null);
    };

    // -------------------------
    // Save (Add / Edit)
    // -------------------------
    const handleSaveMission = async () => {
        try {
            MyLoading("Saving mission...");
            const url = editingMission
                ? `${process.env.REACT_APP_API_BASE_URL}/api/missions/update/${editingMission.id}`
                : `${process.env.REACT_APP_API_BASE_URL}/api/missions/add`;

            const method = editingMission ? "PUT" : "POST";

            // Use FormData for multipart upload
            const formDataToSend = new FormData();
            // Prepare payload - include workPeriodicId only if we're in a specific workPeriodic context
            const payload = {
                ...formData,
                workPeriodicId: workPeriodic?.id || formData.workPeriodicId,
            };
            delete payload.file; // remove file content
            delete payload.documentName;
            formDataToSend.append(
                "mission",
                new Blob([JSON.stringify(payload)], { type: "application/json" })
            );
            if (formData.file) {
                formDataToSend.append("file", formData.file);
            }

            const res = await apiFetch(url, {
                method,
                body: formDataToSend,
            });

            if (!res.ok) throw new Error(await res.text());

            const savedMission = await res.json();

            if (editingMission) {
                setMissions((prev) =>
                    prev.map((m) => (m.id === savedMission.id ? savedMission : m))
                );
                MyAlert("Mission updated successfully", "success", "Updated!");
            } else {
                setMissions((prev) => [...prev, savedMission]);
                MyAlert("Mission added successfully", "success", "Added!");
            }
            handleCloseModal();
        } catch (err) {
            MyAlert("Error saving mission: " + err.message, "error", "Error");
        }
    };
    // -------------------------
    // Filters
    // -------------------------
    const initialFilters = {
        date: { value: "", matchMode: FilterMatchMode.CONTAINS },
        locale: { value: "", matchMode: FilterMatchMode.CONTAINS },
        statut: { value: "", matchMode: FilterMatchMode.CONTAINS },
        description: { value: "", matchMode: FilterMatchMode.CONTAINS },
        typeMissionName: { value: "", matchMode: FilterMatchMode.CONTAINS },
        clientName: { value: "", matchMode: FilterMatchMode.CONTAINS }, // Add client filter for all missions
    };

    // -------------------------
    // Columns - enhanced for all missions view
    // -------------------------
    const columnConfig = [
        { field: "date", header: "Date", style: { width: "10%" } },
        { field: "locale", header: "Locale", style: { width: "10%" } },
        {
            field: "statut",
            header: "Status",
            style: { width: "10%" },
            body: (rowData) => {
                let color = "black";
                let label = rowData.statut;
                switch (rowData.statut) {
                    case "EN_ATTENTE":
                        color = "darkred";
                        break;
                    case "EN_COURS":
                        color = "ORANGE";
                        break;
                    case "TERMINEE":
                        color = "green";
                        break;
                }

                return <span style={{ color, fontWeight: "bold" }}>{label}</span>;
            },
        }
        ,
        { field: "typeMissionName", header: "Type Mission", style: { width: "15%" } },
        ...(workPeriodic ? [] : [
            {
                field: "clientName",
                header: "Client",
                style: { width: "10%" },
                body: (rowData) => rowData.clientName || "N/A"
            }
        ]),
        { field: "description", header: "Description", style: { width: workPeriodic ? "22%" : "15%" } },
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
                            <FaDownload  /> {rowData.documentName.split("_")[1]}
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
        },
        {
            field: "actions",
            header: "Action",
            style: { width: "15%" },
            body: (rowData) => (
                <>
                    <button
                        onClick={() => handleShowModal(rowData)}
                        className="btn btn-sm btn-warning me-2"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDeleteMission(rowData)}
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

    return (
        <div>
            <BreadCrumb model={items} home={home} className="breadcrumb-sm" />
            <div className="m-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>
                    {workPeriodic ? (
                        <>Missions for Client: <b>{workPeriodic.clientName}</b></>
                    ) : ( "All Missions")}
                </h3>
                <Button variant="success" onClick={() => handleShowModal()}>
                    <FaPlus className="me-2" /> Add Mission
                </Button>
            </div>

            <MyTable
                data={missions}
                initialFilters={initialFilters}
                columns={columnConfig}
            />
            </div>
            {/* Modal Add/Edit */}
            <MissionDialog
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveMission}
                formData={formData}
                setFormData={setFormData}
                editingMission={editingMission}
                typeMission={typeMission}

            />
        </div>
    );
};

export default Mission;