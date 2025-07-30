"use client";
import { useState } from "react";
import 'antd/dist/reset.css';
import { Layout as AntLayout, Menu, Button,ConfigProvider  } from "antd";
import { StyleProvider } from '@ant-design/cssinjs';
import { useRouter } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  BarChartOutlined,
  LineChartOutlined,
  FileSearchOutlined,
  HomeOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  AuditOutlined,
  TeamOutlined,
  ExperimentOutlined,
  ReadOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  DeploymentUnitOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { GlobalProvider } from "../context/GlobalContext";

const { Header, Sider, Content } = AntLayout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const items = [
    { key: "/", icon: <HomeOutlined />, label: "Inicio", onClick: () => router.push("/") },
    {
      key: "/family", icon: <TeamOutlined />, label: "Socio Familiar", onClick: () => router.push("/family")
    },
    {
      key: "/assessment", icon: <AuditOutlined />, label: "Valoración Funcional", onClick: () => router.push("/funtional")
    },
    {
      key: "/syndromes", icon: <FileSearchOutlined />, label: "Síndromes Geriátricos",
      children: [
        { key: "/first", icon: <HeartOutlined />, label: "Primera Parte", onClick: () => router.push("/syndromes/first") },
        { key: "/second", icon: <MedicineBoxOutlined />, label: "Segunda Parte", onClick: () => router.push("/syndromes/second") },
      ],
    },
    {
      key: "/physical", icon: <ExperimentOutlined />, label: "Valoración Física", onClick: () => router.push("/physical")
    },
    {
      key: "/mental", icon: <MailOutlined />, label: "Valoración Mental", onClick: () => router.push("/mental")
    },
    {
      key: "/cognitive", icon: <ReadOutlined />, label: "Valoración Cognitiva", onClick: () => router.push("/cognitive")
    },
    {
      key: "/mmse30", icon: <CheckCircleOutlined />, label: "MMSE 30", onClick: () => router.push("/mmse30")
    },
    {
      key: "/moca", icon: <DeploymentUnitOutlined />, label: "MOCA", onClick: () => router.push("/moca")
    },
    {
      key: "/affective", icon: <SmileOutlined />, label: "Afectividad", onClick: () => router.push("/affective")
    },
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard", onClick: () => router.push("/dashboard") },
    {
      key: "sub-dashboard",
      label: "Reportes",
      icon: <FileDoneOutlined />,
      children: [
        { key: "/dashboard/reports", icon: <BarChartOutlined />, label: "Ver Reportes", onClick: () => router.push("/dashboard/reports") },
        { key: "/dashboard/analytics", icon: <LineChartOutlined />, label: "Análisis de Datos", onClick: () => router.push("/dashboard/analytics") },
      ],
    },
    { key: "/settings", icon: <SettingOutlined />, label: "Configuración", onClick: () => router.push("/settings") },
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
          <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" width={240} collapsedWidth={80}>
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