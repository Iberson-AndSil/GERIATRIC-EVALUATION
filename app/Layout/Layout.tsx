"use client";
import { useState } from "react";
import { Layout as AntLayout, Menu, Button } from "antd";
import { useRouter } from "next/navigation";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  UserOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { GlobalProvider } from "../context/GlobalContext";

const { Header, Sider, Content } = AntLayout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const items = [
    { key: "/family", icon: <UserOutlined />, label: "Socio Familiar", 
      children:[
        { key: "/dashboard/reports", icon: <FormOutlined />, label: "Datos", onClick: () => router.push("/family/personals") },
        { key: "/dashboard/gijon", icon: <BarChartOutlined />, label: "Escala de Gijon", onClick: () => router.push("/family/gijon") },
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
    <GlobalProvider>
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white" }}>
        <Button
          type="primary"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
        <h1 style={{ color: "white", margin: 0 }}>My App</h1>
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
  );
};

export default AppLayout;