"use client";
import { useState } from "react";
import 'antd/dist/reset.css';
import { Layout as AntLayout, Menu, Button,ConfigProvider  } from "antd";
import { StyleProvider } from '@ant-design/cssinjs';
import { useRouter } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  BarChartOutlined,
  LineChartOutlined,
  UserOutlined,
  FormOutlined,
  FileSearchOutlined,
  HomeOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { GlobalProvider } from "../context/GlobalContext";

const { Header, Sider, Content } = AntLayout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const items = [
    { key: "/", icon: <HomeOutlined />, label: "Inicio", onClick: () => router.push("/") },
    {
      key: "/family", icon: <UserOutlined />, label: "Socio Familiar",
      children: [
        { key: "/reports", icon: <FormOutlined />, label: "Datos", onClick: () => router.push("/family/personals") },
        { key: "/gijon", icon: <BarChartOutlined />, label: "Escala de Gijon", onClick: () => router.push("/family/gijon") },
      ],
    },
    {
      key: "/assessment", icon: <AuditOutlined />, label: "Valoración Funcional",
      children: [
        { key: "/abvd", icon: <HeartOutlined />, label: "ABVD", onClick: () => router.push("/funtional/abvd") },
        { key: "/aivd", icon: <MedicineBoxOutlined />, label: "AIVD", onClick: () => router.push("/funtional/aivd") },
      ],
    },
    {
      key: "/syndromes", icon: <FileSearchOutlined />, label: "Síndromes Geriátricos",
      children: [
        { key: "/dependence", icon: <HeartOutlined />, label: "ABVD", onClick: () => router.push("/family/abvd") },
        { key: "/gijon", icon: <MedicineBoxOutlined />, label: "AIVD", onClick: () => router.push("/family/aivd") },
      ],
    },
    { key: "/dashboard", icon: <DesktopOutlined />, label: "Dashboard", onClick: () => router.push("/dashboard") },
    {
      key: "sub-dashboard",
      label: "Reportes",
      icon: <MailOutlined />,
      children: [
        { key: "/dashboard/reports", icon: <BarChartOutlined />, label: "Ver Reportes", onClick: () => router.push("/dashboard/reports") },
        { key: "/dashboard/analytics", icon: <LineChartOutlined />, label: "Análisis de Datos", onClick: () => router.push("/dashboard/analytics") },
      ],
    },
    { key: "/settings", icon: <ContainerOutlined />, label: "Configuración", onClick: () => router.push("/settings") },
  ];

  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
    <GlobalProvider>
      <AntLayout style={{ minHeight: "100vh" }}>
        <Header style={{ background: "#001529", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white" }}>
          <Button
            type="primary"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <h1 style={{ color: "white", margin: 0 }}>Test Geriatric</h1>
        </Header>

        <AntLayout>
          <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
            <Menu
              mode="inline"
              theme="dark"
              items={items}
            />
          </Sider>

          <AntLayout>
            <Content style={{ margin: "20px", padding: "20px", background: "#fff", borderRadius: "8px" }}>
              {children}
            </Content>
          </AntLayout>
        </AntLayout>
      </AntLayout>
    </GlobalProvider>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default AppLayout;