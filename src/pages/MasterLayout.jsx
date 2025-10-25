import React, { useState } from 'react';
import { Layout } from 'antd';
import { Route, Routes } from "react-router-dom";
import MyNavbar from "./Layout/Navbar";
import Myside from "./Layout/Sidebar";
import MyFooter from "./Layout/Footer";
import Home from "./Home";
import ProtectedRoute from "../helper/ProtectedRoute";
import Users from "./Users";
import Roles from "./Roles";
import Profile from "./profile";
import Client from "./Client";
import Setting from "./Setting";
import WorkPeriodic from "./WorkPeriodic";
import Mission from "./Mission";
import Order from "./Order";
import Facture from "./Facture";

const { Content, Footer, Sider } = Layout;

const MasterLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className="main-layout">
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={260}
                className="sidebar-sider"
            >
                <Myside />
            </Sider>
            <Layout className="content-layout">
                <MyNavbar />
                <Content className="content-area">
                    <main className="app-main">
                        <Routes>
                            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                            <Route path="/clients" element={<ProtectedRoute><Client /></ProtectedRoute>} />
                            <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
                            <Route path="/roles" element={<ProtectedRoute><Roles /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/work_periodic" element={<ProtectedRoute><WorkPeriodic /></ProtectedRoute>} />
                            <Route path="/work_periodic_mission" element={<ProtectedRoute><Mission /></ProtectedRoute>} />
                            <Route path="/orders" element={<ProtectedRoute><Order /></ProtectedRoute>} />
                            <Route path="/factures" element={<ProtectedRoute><Facture /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </Content>
                <Footer className="app-footer">
                    <MyFooter />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
