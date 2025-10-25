import React from "react";

import {
    AiOutlineHome,

    AiOutlineFile,
    AiOutlineTeam,
    AiOutlineUser,
    AiOutlineUnorderedList,
    AiOutlineLogout,
    AiOutlineFieldTime,
    AiFillProduct,
    AiOutlineSetting,
    AiOutlineKey,

} from "react-icons/ai";
import { Menu, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import avatar from "../../assets/img/logo.PNG";
import { confirmLogout } from "../../helper/Tools";

const { SubMenu } = Menu;

const Myside: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
        >
            {/* Top profile */}
            <div className="sidebar-profile">
                <Link to="/profile"> <img src={avatar} alt="Profile" /></Link>
                <h4>Ali</h4>
            </div>

            {/* Menu */}
            <div style={{ flex: 1, overflowY: "auto" }}>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname.replace("/", "") || "home"]}
                >
                    <Menu.Item key="home" icon={<AiOutlineHome />}>
                        <Link to="/home">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="clients" icon={<AiOutlineTeam />}>
                        <Link to="/clients">Clients</Link>
                    </Menu.Item>
                    <Menu.Item key="work_periodic" icon={<AiOutlineFieldTime />}>
                        <Link to="/work_periodic">Work Periodic</Link>
                    </Menu.Item>
                    <Menu.Item key="work_periodic_mission" icon={<AiFillProduct />}>
                        <Link to="/work_periodic_mission">Missions</Link>
                    </Menu.Item>

                    <SubMenu key="Services" icon={<AiOutlineUnorderedList />} title="Services">
                        <Menu.Item key="orders" icon={<AiOutlineUnorderedList  />}>
                            <Link to="/orders">Bon Commande</Link>
                        </Menu.Item>
                        <Menu.Item key="factures" icon={<AiOutlineFile />}>
                            <Link to="/factures">Facture</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu key="users" icon={<AiOutlineSetting />} title="Gestion Setting">
                        <Menu.Item key="setting " icon={<AiOutlineSetting />}>
                            <Link to="/setting">General Settings</Link>
                        </Menu.Item>
                        <Menu.Item key="users-settings" icon={<AiOutlineUser />}>
                            <Link to="/users" >Users Settings</Link>
                        </Menu.Item>
                        <Menu.Item key="roles " icon={<AiOutlineKey />}>
                            <Link to="/roles">Roles Settings</Link>
                        </Menu.Item>
                    </SubMenu>

                </Menu>
            </div>

            {/* Footer Logout Button */}
            <div className="sidebar-logout">
                <Button
                    type="primary"
                    shape="circle"
                    icon={<AiOutlineLogout />}
                    size="large"
                    danger
                    onClick={() => confirmLogout(navigate)}
                />
            </div>
        </div>
    );
};

export default Myside;
