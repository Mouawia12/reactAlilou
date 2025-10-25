import React, { useState } from 'react';
import MyNavbar from "./Layout/Navbar";
import Myside from "./Layout/Sidebar";
import MyFooter from "./Layout/Footer";
import {  Layout, theme } from 'antd';
import { Route, Routes} from "react-router-dom";
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


const { Header, Content, Footer, Sider } = Layout;


const MasterLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    /*const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();*/

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Myside />
            </Sider>
            <Layout>
                <MyNavbar />
                <Content >
                    <main className="app-main" >
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
                <Footer style={{ textAlign: 'center' }}>
                    <MyFooter />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MasterLayout;
