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
import { useLanguage } from "../../context/LanguageContext";

const { SubMenu } = Menu;

const Myside = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    return (
        <div className="sidebar-wrapper">
            <div className="sidebar-profile">
                <Link to="/profile">
                    <img src={avatar} alt="Profile" />
                </Link>
                <h4>{user?.name || ""}</h4>
            </div>

            <div className="sidebar-menu">
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname.replace("/", "") || "home"]}
                >
                    <Menu.Item key="home" icon={<AiOutlineHome />}>
                        <Link to="/home">{t("sidebar.home")}</Link>
                    </Menu.Item>
                    <Menu.Item key="clients" icon={<AiOutlineTeam />}>
                        <Link to="/clients">{t("sidebar.clients")}</Link>
                    </Menu.Item>
                    <Menu.Item key="work_periodic" icon={<AiOutlineFieldTime />}>
                        <Link to="/work_periodic">{t("sidebar.workPeriodic")}</Link>
                    </Menu.Item>
                    <Menu.Item key="work_periodic_mission" icon={<AiFillProduct />}>
                        <Link to="/work_periodic_mission">{t("sidebar.missions")}</Link>
                    </Menu.Item>

                    <SubMenu key="services" icon={<AiOutlineUnorderedList />} title={t("sidebar.services")}>
                        <Menu.Item key="orders" icon={<AiOutlineUnorderedList />}>
                            <Link to="/orders">{t("sidebar.orders")}</Link>
                        </Menu.Item>
                        <Menu.Item key="factures" icon={<AiOutlineFile />}>
                            <Link to="/factures">{t("sidebar.factures")}</Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu key="settings" icon={<AiOutlineSetting />} title={t("sidebar.settings")}>
                        <Menu.Item key="setting" icon={<AiOutlineSetting />}>
                            <Link to="/setting">{t("sidebar.general")}</Link>
                        </Menu.Item>
                        <Menu.Item key="users-settings" icon={<AiOutlineUser />}>
                            <Link to="/users">{t("sidebar.users")}</Link>
                        </Menu.Item>
                        <Menu.Item key="roles" icon={<AiOutlineKey />}>
                            <Link to="/roles">{t("sidebar.roles")}</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>

            <div className="sidebar-logout">
                <Button
                    type="primary"
                    shape="circle"
                    icon={<AiOutlineLogout />}
                    size="large"
                    danger
                    onClick={() => confirmLogout(navigate)}
                    aria-label={t("sidebar.quickLogout")}
                />
            </div>
        </div>
    );
};

export default Myside;
