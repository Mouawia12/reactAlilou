import React, { useEffect, useState } from "react";
import { apiFetch } from "../auth/api";
import { MyAlert, MyLoading, MyLoadingClose, NumberFormat } from "../helper/Tools";
import { Card } from "primereact/card";
import { FaCoins } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";

const Home = () => {
    const [dashboard, setDashboard] = useState([]);
    const [periodes, setPeriodes] = useState([]);
    const [enterprise, setEnterprise] = useState([]);
    const [periodeFilter, setPeriodeFilter] = useState(null);
    const [enterpriseFilter, setEnterpriseFilter] = useState(null);

    // ✅ Load periodes & enterprises
    const fetchData = async () => {
        try {
            MyLoading("Loading ...");
            const [periodesRes, enterpriseRes] = await Promise.all([
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/periodes`),
                apiFetch(`${process.env.REACT_APP_API_BASE_URL}/api/enterprises`),
            ]);

            if (!periodesRes.ok || !enterpriseRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const periodesData = await periodesRes.json();
            const enterpriseData = await enterpriseRes.json();

            setPeriodes(periodesData);
            setEnterprise(enterpriseData);

            // ✅ Automatically select active periode
            const activePeriode = periodesData.find(p => p.active) || periodesData[periodesData.length - 1];
            if (activePeriode) setPeriodeFilter(activePeriode.id);

        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } finally {
            MyLoadingClose();
        }
    };

    // ✅ Fetch dashboard stats dynamically
    const fetchdash = async (periodeId, enterpriseId) => {
        try {


            const safePeriodeId = periodeId && typeof periodeId === "object" ? periodeId.value : periodeId;
            const safeEnterpriseId = enterpriseId && typeof enterpriseId === "object" ? enterpriseId.value : enterpriseId;


            const params = new URLSearchParams();
            if (safePeriodeId) params.append("periodeId", safePeriodeId);
            if (safeEnterpriseId) params.append("enterpriseId", safeEnterpriseId);

            const dashboardRes = await apiFetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/factures/dashbord?${params.toString()}`
            );

            if (!dashboardRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const dashboardData = await dashboardRes.json();
            setDashboard(dashboardData);

        } catch (err) {
            MyAlert("Error fetching data: " + err.message, "error", "Error");
        } 
    };

    // ✅ Run initial load
    useEffect(() => {
        fetchData();
    }, []);

    // ✅ Refetch when filters change
    useEffect(() => {
        if (periodeFilter !== null || enterpriseFilter !== null) {
            fetchdash(periodeFilter, enterpriseFilter);
        }
    }, [periodeFilter, enterpriseFilter]);

    const stats = [
        {
            title: "Sum Facture Payed (DZD)",
            value: NumberFormat(dashboard.sumPayed),
            color: "#3f8600",
            icon: <FaCoins />,
        },
        {
            title: "N° Facture Payed",
            value: dashboard.countPayed,
            color: "#3f8600",
            icon: "",
        },
        {
            title: "Sum Facture Not Payed (DZD)",
            value: NumberFormat(dashboard.sumNotPayed),
            color: "#cf1322",
            icon: <FaCoins />,
        },
        {
            title: "N° Facture Not Payed",
            value: dashboard.countNotPayed,
            color: "#cf1322",
            icon: "",
        },
        {
            title: "N° Client",
            value: dashboard.nbrClient,
            color: "#cf1322",
            icon: "",
        },
        {
            title: "N° Bon de Commandes",
            value: dashboard.nbrOrder,
            color: "#cf1322",
            icon: "",
        },
        {
            title: "N° Work Periodics",
            value: dashboard.nbrWorkPeriodic,
            color: "#cf1322",
            icon: "",
        },
        {
            title: "N° Missions",
            value: dashboard.nbrMission,
            color: "#cf1322",
            icon: "",
        },
    ];

    return (
        <div className="container mt-3">
            {/* 🔹 Filters */}
            <div className="d-flex align-items-center mb-3">
                <label htmlFor="periodeFilter" className="me-2 fw-bold">Filter by Periode:</label>
                <Dropdown
                    id="periodeFilter"
                    value={periodeFilter}
                    options={[
                        { label: "All", value: null },
                        ...periodes.map(p => ({ label: p.year, value: p.id })),
                    ]}
                    onChange={(e) => setPeriodeFilter(e.value)}
                    placeholder="Select Periode"
                    style={{ width: '280px' }}
                />
            </div>

            <div className="d-flex align-items-center mb-4">
                <label htmlFor="enterpriseFilter" className="me-2 fw-bold">Filter by Enterprise:</label>
                <Dropdown
                    id="enterpriseFilter"
                    value={enterpriseFilter}
                    options={[
                        { label: "All", value: null },
                        ...enterprise.map(ent => ({ label: ent.name, value: ent.id })),
                    ]}
                    onChange={(e) => setEnterpriseFilter(e.value)}
                    placeholder="Select Enterprise"
                    style={{ width: '280px' }}
                />
            </div>

            {/* 🔹 Dashboard Cards */}
            <div className="row">
                {stats.map((stat, i) => (
                    <div key={i} className="col-md-3 col-sm-6 p-2">
                        <Link to="/facture" style={{ textDecoration: "none" }}>
                            <Card
                                className="shadow-3 border-round-xl"
                                style={{
                                    border: "none",
                                    textAlign: "center",
                                    backgroundColor:
                                        stat.color === "#3f8600"
                                            ? "rgba(63, 134, 0, 0.1)"
                                            : "rgba(207, 19, 34, 0.1)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "1rem",
                                        color: "#444",
                                        fontWeight: "500",
                                        marginBottom: "8px",
                                    }}
                                >
                                    {stat.title}
                                </div>

                                <div>
                  <span
                      style={{
                          color: stat.color,
                          fontSize: "1.8rem",
                          fontWeight: "700",
                      }}
                  >
                    {stat.icon} {stat.value}
                  </span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
