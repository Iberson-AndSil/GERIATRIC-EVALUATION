"use client";
import { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { Layout as AntLayout, Menu, Button, ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import { useRouter, usePathname } from "next/navigation"; // Importamos usePathname
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
  ExperimentOutlined,
  ReadOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  DeploymentUnitOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useGlobalContext } from "@/app/context/GlobalContext";
import MedicalSpinner from "../components/MedicalSpinner";

const { Header, Sider, Content } = AntLayout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentPatient } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname(); // <--- Detecta la ruta actual
  const [isReady, setIsReady] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    if (pathname) {
      // Buscamos si la ruta actual pertenece a un sub-menú
      // Por ejemplo, si la ruta es /syndromes/first, queremos abrir /syndromes
      const pathParts = pathname.split('/');
      if (pathParts.length > 2) {
        const parentKey = `/${pathParts[1]}`;
        setOpenKeys([parentKey]);
      }
    }
  }, [pathname]);

  // Definición de ítems (Asegúrate de que 'key' sea igual al path del router.push)
  const items = [
    { key: "/", icon: <HomeOutlined />, label: "Inicio", onClick: () => router.push("/") },
    {
      key: "/syndromes",
      icon: <FileSearchOutlined />,
      label: "Síndromes Geriátricos",
      children: [
        { key: "/syndromes/first", icon: <HeartOutlined />, label: "Primera Parte", onClick: () => router.push("/syndromes/first") },
        { key: "/syndromes/second", icon: <MedicineBoxOutlined />, label: "Segunda Parte", onClick: () => router.push("/syndromes/second") },
      ],
    },
    { key: "/social", icon: <AuditOutlined />, label: "Valoración Social", onClick: () => router.push("/social") },
    { key: "/funtional", icon: <AuditOutlined />, label: "Valoración Funcional", onClick: () => router.push("/funtional") },
    { key: "/physical", icon: <ExperimentOutlined />, label: "Valoración Física", onClick: () => router.push("/physical") },
    { key: "/mental", icon: <MailOutlined />, label: "Valoración Mental", onClick: () => router.push("/mental") },
    { key: "/cognitive", icon: <ReadOutlined />, label: "Valoración Cognitiva", onClick: () => router.push("/cognitive") },
    { key: "/mmse30", icon: <CheckCircleOutlined />, label: "MMSE 30", onClick: () => router.push("/mmse30") },
    { key: "/moca", icon: <DeploymentUnitOutlined />, label: "MOCA", onClick: () => router.push("/moca") },
    { key: "/affective", icon: <SmileOutlined />, label: "Afectividad", onClick: () => router.push("/affective") },
    { key: "/nutritional", icon: <MedicineBoxOutlined />, label: "Valoración Nutricional", onClick: () => router.push("/nutritional") },
    { key: "/clinic", icon: <CheckCircleOutlined />, label: "Valoración Clínica", onClick: () => router.push("/clinic") },
    { key: "/markers", icon: <ReadOutlined />, label: "Marcadores Bioquímicos", onClick: () => router.push("/markers") },
    {
      key: "/results",
      icon: <FileSearchOutlined />,
      label: "Resultados",
      children: [
        { key: "/comorbidity", icon: <HeartOutlined />, label: "Comorbilidades", onClick: () => router.push("/comorbidity") },
        { key: "/fragility", icon: <MedicineBoxOutlined />, label: "Fragilidad", onClick: () => router.push("/fragility") },
      ],
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
  ];

  return (
    <StyleProvider hashPriority="high">
      <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
        <AntLayout style={{ minHeight: "100vh" }}>
          <Header style={{ background: "#001529", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "white" }}>
            <div className="flex items-center">
              <Button
                type="primary"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
              />
              <h1 className="!ml-6" style={{ color: "white", margin: 0 }}>Test Geriatric</h1>
            </div>
            <h1 style={{ color: "white", margin: 0 }}>
              {currentPatient?.nombre ?? "Sin paciente"}
            </h1>
          </Header>

          <AntLayout>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark" width={240} collapsedWidth={80}>
              <Menu
                mode="inline"
                theme="dark"
                items={items}
                selectedKeys={[pathname]}
                openKeys={openKeys} // Controlamos cuáles están abiertos
                onOpenChange={(keys) => setOpenKeys(keys)} // Permite al usuario abrir/cerrar otros
              />
            </Sider>

            <AntLayout>
              <Content style={{ margin: "0px", padding: "20px", background: "#fff", borderRadius: "8px" }}>
                {children}
              </Content>
            </AntLayout>
          </AntLayout>
        </AntLayout>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default AppLayout;