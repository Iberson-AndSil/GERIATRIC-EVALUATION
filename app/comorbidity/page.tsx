"use client";
import { useState, useEffect, useCallback } from "react";
import { Form, Checkbox, Card, Row, Col, Typography, Space, Button, notification, Statistic, Divider, Alert } from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { actualizarResultado, obtenerResultadoPorId } from "../lib/pacienteService";
import Link from "next/link";

const { Title, Text } = Typography;

const ProfundIndexForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { currentPatient, currentResultId } = useGlobalContext();
  const [bdValues, setBdValues] = useState<any>({});

  const recalcular = useCallback((values: any) => {
    const baremo: Record<string, number> = {
      edad85: 3,
      neoplasia: 6,
      demencia: 3,
      claseFuncional: 3,
      delirium: 3,
      hemoglobina: 3,
      barthel60: 4,
      cuidador: 2,
      hospitalizaciones: 3,
    };

    let total = 0;
    Object.entries(baremo).forEach(([key, puntos]) => {
      if (values[key] === true) total += puntos;
    });
    setTotalPoints(total);
  }, []);

  const getRisk = (s: number) => {
    if (s <= 2) return { l: "Bajo", c: "#52c41a", p: "12% - 14%", bg: "#f6ffed", border: "#b7eb8f" };
    if (s <= 6) return { l: "Intermedio - Bajo", c: "#d48806", p: "~25%", bg: "#fffbe6", border: "#ffe58f" };
    if (s <= 10) return { l: "Intermedio - Alto", c: "#cf1322", p: "45% - 50%", bg: "#fff1f0", border: "#ffa39e" };
    return { l: "Alto", c: "#722ed1", p: "61% - 68%", bg: "#f9f0ff", border: "#d3adf7" };
  };

  const risk = getRisk(totalPoints);

  useEffect(() => {
    const cargarYCalcular = async () => {
      if (!currentPatient?.dni || !currentResultId) {
        setIsSyncing(false);
        return;
      }

      try {
        setIsSyncing(true);
        const p = currentPatient as any;
        const resPrevio: any = await obtenerResultadoPorId(p.dni, currentResultId);

        const clinica = resPrevio?.clinica || {};
        const marcadores = p.marcadoresBioquimicos || {};
        const comorbilidades = (clinica.comorbilidades || []).map((c: any) => c.nombre?.toUpperCase() || "");

        const infoBD = {
          edad: p.edad || 0,
          hb: marcadores.hemoglobina || 0,
          barthel: resPrevio?.abvdScore || 0,
          hosp: clinica.hospitalizaciones_ultimo_anio || 0,
        };
        setBdValues(infoBD);

        const autoChecks = {
          edad85: infoBD.edad >= 85,
          neoplasia:
            clinica.valoracion_oncologica?.en_tratamiento ||
            comorbilidades.some((n: string) => n.includes("CANCER") || n.includes("NEOPLASIA")),
          demencia: comorbilidades.some((n: string) => n.includes("DEMENCIA") || n.includes("ALZHEIMER")),
          delirium: comorbilidades.some((n: string) => n.includes("DELIRIO") || n.includes("DELIRIUM")),
          hemoglobina: infoBD.hb > 0 && infoBD.hb < 10,
          barthel60: infoBD.barthel > 0 && infoBD.barthel < 60,
          hospitalizaciones: infoBD.hosp >= 4,
          cuidador: p.con_quien_vive && !p.con_quien_vive.includes("Cónyuge"),
          claseFuncional: resPrevio?.indice_profund?.claseFuncional || false,
        };

        form.setFieldsValue(autoChecks);
        recalcular(autoChecks);
      } catch (error) {
        console.error("Error al cargar PROFUND:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    cargarYCalcular();
  }, [currentPatient, currentResultId, form, recalcular]);

  const saveToFirebase = async () => {
    if (!currentPatient?.dni || !currentResultId) {
      api.warning({ message: "Atención", description: "No hay paciente seleccionado." });
      return;
    }

    try {
      setLoading(true);
      const values = await form.validateFields();

      await actualizarResultado(currentPatient.dni, currentResultId, "indice_profund", {
        ...values,
        score: totalPoints,
        riesgo: risk.l,
        mortalidad: risk.p,
        fecha: new Date().toISOString(),
      });

      api.success({ message: "Evaluación guardada exitosamente" });
      router.push("/fragility");
    } catch (e: any) {
      if (!e.errorFields) {
        api.error({ message: "Error al guardar en la base de datos" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans">
      {contextHolder}
      <div className="text-center mb-8">
        <Title level={3} style={{ color: "#0050b3", margin: 0 }}>
          <DashboardOutlined className="mr-2" />
          ÍNDICE PROFUND
        </Title>
        <Text type="secondary" className="text-lg italic">
          Variables pronósticas en pacientes pluripatológicos
        </Text>
      </div>

      <Card className="max-w-6xl mx-auto shadow-md rounded-xl overflow-hidden border-none">
        <Form 
          form={form} 
          layout="vertical" 
          onValuesChange={(_, all) => recalcular(all)}
        >
          <Row gutter={32}>
            <Col xs={24} lg={15}>
              <Space direction="vertical" size="large" className="w-full">
                <section className="bg-white p-4 rounded-xl">
                  <Title level={5} className="mb-6 mt-0 text-slate-600">
                    <UserOutlined /> Criterios Clínicos
                  </Title>
                  <Row gutter={[16, 24]}>
                    <Col span={12}>
                      <Form.Item name="edad85" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Edad ≥ 85 años (3 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="neoplasia" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Neoplasia activa (6 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="demencia" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Demencia (3 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="delirium" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Delirium previo (3 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="hemoglobina" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Hb &lt; 10 g/dL (3 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="barthel60" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Barthel &lt; 60 (4 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </section>

                <section className="bg-white p-4 rounded-xl">
                  <Title level={5} className="mb-6 mt-0 text-slate-600">
                    <MedicineBoxOutlined /> Soporte y Asistencia
                  </Title>
                  <Row gutter={[16, 24]}>
                    <Col span={12}>
                      <Form.Item name="hospitalizaciones" valuePropName="checked" className="m-0">
                        <Checkbox disabled>≥ 4 Hosp. / 12 meses (3 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="cuidador" valuePropName="checked" className="m-0">
                        <Checkbox disabled>Cuidador ≠ Cónyuge (2 pts)</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </section>

                <Alert
                  className="rounded-xl border-blue-200 bg-blue-50"
                  message={<Text strong className="text-blue-800">Valoración Clínica Manual</Text>}
                  description={
                    <Form.Item name="claseFuncional" valuePropName="checked" className="!m-0">
                      <Checkbox className="text-blue-900 font-medium">Clase Funcional III-IV (NYHA) y/o MRC (3 pts)</Checkbox>
                    </Form.Item>
                  }
                  icon={<WarningOutlined className="text-blue-600" />}
                  showIcon
                />
              </Space>
            </Col>

            <Col xs={24} lg={9}>
              <div className="rounded-2xl transition-all duration-500 shadow-lg bg p-3 bg-white">
                <div className="text-center">
                  <Statistic
                    title={<Text strong className="text-slate-400 uppercase tracking-widest text-xs">Puntaje Total</Text>}
                    value={totalPoints}
                    suffix="/ 30"
                    valueStyle={{ color: risk.c, fontSize: 64, fontWeight: "800" }}
                  />
                </div>
                <Divider />
                <div className="mb-8 p-4 rounded-xl text-center" style={{ backgroundColor: risk.bg, border: `1px solid ${risk.border}` }}>
                  <Text className="text-slate-500 text-xs uppercase block mb-1">Riesgo Estimado</Text>
                  <Title level={3} style={{ color: risk.c, margin: 0 }} className="font-bold">{risk.l}</Title>
                  <div className="mt-3">
                    <Text type="secondary" className="text-xs">Mortalidad anual:</Text>
                    <div className="text-2xl font-bold" style={{ color: risk.c }}>{risk.p}</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row justify="center" className="mt-6" gutter={16}>
        <Col>
          <Link href="/physical" passHref>
            <Button type="default" icon={<ArrowLeftOutlined />} size="large" className="rounded-xl px-10 h-14 font-semibold">
              Atrás
            </Button>
          </Link>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            onClick={saveToFirebase}
            disabled={!currentPatient}
            loading={loading}
            icon={<SaveOutlined />}
            className="rounded-xl px-10 h-14 font-semibold shadow-lg shadow-blue-200"
          >
            {currentPatient?.dni ? "Guardar Resultados" : "Seleccione un paciente"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProfundIndexForm;