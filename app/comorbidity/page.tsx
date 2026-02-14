'use client';
import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Card, Row, Col, Typography, Space, Button, notification, Statistic, Alert, Divider, Tag, Tooltip } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, DashboardOutlined, SyncOutlined, CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { actualizarResultado } from "../lib/pacienteService";

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

  useEffect(() => {
    if (currentPatient) {
      setIsSyncing(true);
      const p = currentPatient as any;
      const comorbilidades = p.comorbilidades || [];
      
      const infoBD = {
        edad: p.edad || 0,
        hb: p.marcadoresBioquimicos?.hemoglobina || 0,
        barthel: p.abvdScore || 0,
        hosp: comorbilidades.reduce((max: number, c: any) => 
          Math.max(max, c.hospitalizaciones_ultimo_anio || 0), 0),
        cancer: p.valoracion_oncologica?.en_tratamiento ? "Si" : "No",
        viveSolo: p.con_quien_vive?.includes("Solo (a)") ? "Si" : "No"
      };
      setBdValues(infoBD);

      const autoChecks = {
        edad85: infoBD.edad >= 85,
        neoplasia: p.valoracion_oncologica?.en_tratamiento || 
                   comorbilidades.some((c: any) => c.nombre?.toUpperCase().includes("CANCER")),
        demencia: comorbilidades.some((c: any) => c.nombre?.toUpperCase().includes("DEMENCIA")),
        delirium: comorbilidades.some((c: any) => c.nombre?.toUpperCase().includes("DELIRIO")),
        hemoglobina: infoBD.hb < 10,
        barthel60: infoBD.barthel < 60,
        hospitalizaciones: infoBD.hosp >= 4,
        cuidador: p.con_quien_vive && !p.con_quien_vive.includes("Cónyuge"),
        claseFuncional: false // Este se mantiene manual
      };

      form.setFieldsValue(autoChecks);
      recalcular(autoChecks);
      
      setTimeout(() => setIsSyncing(false), 800);
    }
  }, [currentPatient, form]);

  const recalcular = (v: any) => {
    const puntos: Record<string, number> = {
      edad85: 3, neoplasia: 6, demencia: 3, claseFuncional: 3,
      delirium: 3, hemoglobina: 3, barthel60: 4, cuidador: 2, hospitalizaciones: 3
    };
    let total = 0;
    Object.keys(puntos).forEach(k => { if (v[k]) total += puntos[k]; });
    setTotalPoints(total);
  };

  const getRisk = (s: number) => {
    if (s <= 2) return { l: "Bajo", c: "#52c41a", p: "12% - 14%" };
    if (s <= 6) return { l: "Intermedio - Bajo", c: "#faad14", p: "~25%" };
    if (s <= 10) return { l: "Intermedio - Alto", c: "#f5222d", p: "45% - 50%" };
    return { l: "Alto", c: "#722ed1", p: "61% - 68%" };
  };

  const risk = getRisk(totalPoints);

  const onFinish = async (values: any) => {
    if (!currentPatient?.dni) return;
    try {
      setLoading(true);
      await actualizarResultado(currentPatient.dni, currentResultId || "", 'indice_profund', {
        ...values,
        score: totalPoints,
        riesgo: risk.l,
        mortalidad: risk.p,
        fecha: new Date()
      });
      api.success({ message: 'Evaluación Guardada' });
      router.push('/physical');
    } catch (e) {
      api.error({ message: 'Error al guardar' });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {contextHolder}
      <Card className="max-w-6xl mx-auto shadow-lg rounded-2xl">
        <Row justify="space-between" className="mb-8">
          <Space>
            <DashboardOutlined className="text-3xl text-purple-600" />
            <div>
              <Title level={3} className="!m-0">PROFUND (Modo Lectura)</Title>
              <Text type="secondary">Los valores se bloquean según la historia clínica</Text>
            </div>
          </Space>
          
          {isSyncing ? (
            <Tag color="processing" icon={<SyncOutlined spin />}>Sincronizando...</Tag>
          ) : (
            <Tag color="success" icon={<CheckCircleOutlined />}>Datos sincronizados</Tag>
          )}
        </Row>

        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={(_, all) => recalcular(all)}>
          <Row gutter={32}>
            <Col xs={24} lg={15}>
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <Title level={5} className="mb-6"><LockOutlined /> Criterios Bloqueados por Sistema</Title>
                
                <Row gutter={[16, 16]}>
                  {/* EDAD BLOQUEADA */}
                  <Col span={24}>
                    <Space size="middle">
                      <Form.Item name="edad85" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Edad ≥ 85 años (3 pts)</Checkbox>
                      </Form.Item>
                      <Tag color="blue">{bdValues.edad} años</Tag>
                    </Space>
                  </Col>

                  <Col span={12}>
                    <Space direction="vertical" size={16}>
                      <Space>
                        <Form.Item name="neoplasia" valuePropName="checked" className="!m-0">
                          <Checkbox disabled>Neoplasia activa (6 pts)</Checkbox>
                        </Form.Item>
                        <Tag color="volcano">Onco: {bdValues.cancer}</Tag>
                      </Space>
                      <Form.Item name="demencia" valuePropName="checked" className="!m-0"><Checkbox disabled>Demencia (3 pts)</Checkbox></Form.Item>
                      <Form.Item name="delirium" valuePropName="checked" className="!m-0"><Checkbox disabled>Delirium previo (3 pts)</Checkbox></Form.Item>
                    </Space>
                  </Col>

                  <Col span={12}>
                    <Space direction="vertical" size={16}>
                      <Space>
                        <Form.Item name="hemoglobina" valuePropName="checked" className="!m-0">
                          <Checkbox disabled>Hb &lt; 10 g/dL (3 pts)</Checkbox>
                        </Form.Item>
                        <Tag color={bdValues.hb < 10 ? "red" : "green"}>{bdValues.hb} g/dL</Tag>
                      </Space>
                      <Space>
                        <Form.Item name="barthel60" valuePropName="checked" className="!m-0">
                          <Checkbox disabled>Barthel &lt; 60 (4 pts)</Checkbox>
                        </Form.Item>
                        <Tag color={bdValues.barthel < 60 ? "red" : "blue"}>Barthel: {bdValues.barthel}</Tag>
                      </Space>
                    </Space>
                  </Col>

                  <Col span={24}><Divider className="!my-2" /></Col>

                  <Col span={12}>
                    <Space>
                      <Form.Item name="hospitalizaciones" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>≥ 4 Hosp. (3 pts)</Checkbox>
                      </Form.Item>
                      <Tag color="orange">Hosp: {bdValues.hosp}</Tag>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space>
                      <Form.Item name="cuidador" valuePropName="checked" className="!m-0">
                        <Checkbox disabled>Cuidador ≠ Cónyuge (2 pts)</Checkbox>
                      </Form.Item>
                      <Tag color="purple">Vive: {bdValues.viveSolo === "Si" ? "Solo" : "Acompañado"}</Tag>
                    </Space>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="claseFuncional" valuePropName="checked" className="!m-0">
                      <Checkbox className="text-blue-600">Clase Funcional III-IV y/o MRC (3 pts)</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={24} lg={9}>
              <div className="p-8 bg-gray-50 rounded-2xl text-center border-2 border-dashed border-gray-200">
                <Statistic title="Puntaje PROFUND" value={totalPoints} suffix="/ 30" valueStyle={{ color: risk.c, fontSize: 54, fontWeight: 'bold' }} />
                <Divider />
                <Title level={4} style={{ color: risk.c }}>{risk.l.toUpperCase()}</Title>
                <Alert message={`Mortalidad: ${risk.p}`} type={totalPoints > 6 ? "error" : "success"} showIcon />
              </div>
            </Col>
          </Row>

          <Row justify="end" className="mt-12 gap-4">
            <Button size="large" onClick={() => router.back()} icon={<ArrowLeftOutlined />}>Volver</Button>
            <Button type="primary" size="large" htmlType="submit" loading={loading} icon={<SaveOutlined />} className="bg-purple-600 px-12">
              Confirmar y Guardar
            </Button>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default ProfundIndexForm;