import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { FaCoins, FaClipboardList, FaFileInvoiceDollar, FaTasks, FaUsers } from "react-icons/fa";
import { apiFetch } from "../auth/api";
import { MyAlert, MyLoading, MyLoadingClose, NumberFormat } from "../helper/Tools";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
    const { t } = useLanguage();
    const [dashboard, setDashboard] = useState({});
    const [periodes, setPeriodes] = useState([]);
    const [enterprise, setEnterprise] = useState([]);
    const [periodeFilter, setPeriodeFilter] = useState(null);
    const [enterpriseFilter, setEnterpriseFilter] = useState(null);

    const fetchData = useCallback(async () => {
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

            const activePeriode = periodesData.find((p) => p.active) || periodesData[periodesData.length - 1];
            if (activePeriode) setPeriodeFilter(activePeriode.id);
        } catch (err) {
            MyAlert(`${t("common.status.error")}: ${err.message}`, "error", t("common.status.error"));
        } finally {
            MyLoadingClose();
        }
    }, [t]);

    const fetchDashboard = useCallback(async (periodeId, enterpriseId) => {
        try {
            const safePeriodeId = typeof periodeId === "object" ? periodeId?.value : periodeId;
            const safeEnterpriseId = typeof enterpriseId === "object" ? enterpriseId?.value : enterpriseId;

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
            MyAlert(`${t("common.status.error")}: ${err.message}`, "error", t("common.status.error"));
        }
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (periodeFilter !== null || enterpriseFilter !== null) {
            fetchDashboard(periodeFilter, enterpriseFilter);
        }
    }, [periodeFilter, enterpriseFilter, fetchDashboard]);

    const numberFormatter = useMemo(() => new Intl.NumberFormat("fr-FR"), []);

    const cards = useMemo(
        () => [
            {
                key: "sumPayed",
                title: t("dashboard.cards.sumPayed"),
                value: NumberFormat(dashboard.sumPayed || 0),
                tone: "success",
                icon: <FaFileInvoiceDollar />,
                link: "/factures",
            },
            {
                key: "countPayed",
                title: t("dashboard.cards.countPayed"),
                value: numberFormatter.format(dashboard.countPayed || 0),
                tone: "success",
                icon: <FaCoins />,
                link: "/factures",
            },
            {
                key: "sumNotPayed",
                title: t("dashboard.cards.sumNotPayed"),
                value: NumberFormat(dashboard.sumNotPayed || 0),
                tone: "danger",
                icon: <FaFileInvoiceDollar />,
                link: "/factures",
            },
            {
                key: "countNotPayed",
                title: t("dashboard.cards.countNotPayed"),
                value: numberFormatter.format(dashboard.countNotPayed || 0),
                tone: "danger",
                icon: <FaClipboardList />,
                link: "/factures",
            },
            {
                key: "nbrClient",
                title: t("dashboard.cards.nbrClient"),
                value: numberFormatter.format(dashboard.nbrClient || 0),
                tone: "info",
                icon: <FaUsers />,
                link: "/clients",
            },
            {
                key: "nbrOrder",
                title: t("dashboard.cards.nbrOrder"),
                value: numberFormatter.format(dashboard.nbrOrder || 0),
                tone: "warning",
                icon: <FaClipboardList />,
                link: "/orders",
            },
            {
                key: "nbrWorkPeriodic",
                title: t("dashboard.cards.nbrWorkPeriodic"),
                value: numberFormatter.format(dashboard.nbrWorkPeriodic || 0),
                tone: "info",
                icon: <FaTasks />,
                link: "/work_periodic",
            },
            {
                key: "nbrMission",
                title: t("dashboard.cards.nbrMission"),
                value: numberFormatter.format(dashboard.nbrMission || 0),
                tone: "info",
                icon: <FaTasks />,
                link: "/work_periodic_mission",
            },
        ],
        [dashboard, numberFormatter, t]
    );

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-hero">
                <div>
                    <h1 className="dashboard-title">{t("common.brand")}</h1>
                    <p className="dashboard-subtitle">{t("dashboard.title")}</p>
                </div>
            </div>

            <div className="dashboard-filters">
                <div className="filter-group">
                    <label htmlFor="periodeFilter" className="filter-label">
                        {t("dashboard.filters.period")}
                    </label>
                    <Dropdown
                        id="periodeFilter"
                        value={periodeFilter}
                        options={[
                            { label: t("dashboard.filters.all"), value: null },
                            ...periodes.map((p) => ({ label: p.year, value: p.id })),
                        ]}
                        onChange={(e) => setPeriodeFilter(e.value)}
                        placeholder={t("dashboard.filters.period")}
                        className="dashboard-dropdown"
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="enterpriseFilter" className="filter-label">
                        {t("dashboard.filters.enterprise")}
                    </label>
                    <Dropdown
                        id="enterpriseFilter"
                        value={enterpriseFilter}
                        options={[
                            { label: t("dashboard.filters.all"), value: null },
                            ...enterprise.map((ent) => ({ label: ent.name, value: ent.id })),
                        ]}
                        onChange={(e) => setEnterpriseFilter(e.value)}
                        placeholder={t("dashboard.filters.enterprise")}
                        className="dashboard-dropdown"
                    />
                </div>
            </div>

            <div className="dashboard-grid">
                {cards.map((card) => (
                    <Link to={card.link} className={`dashboard-card ${card.tone}`} key={card.key}>
                        <div className="card-icon">{card.icon}</div>
                        <div className="card-content">
                            <span className="card-title">{card.title}</span>
                            <span className="card-value">{card.value}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
