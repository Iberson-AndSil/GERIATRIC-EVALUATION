'use client';
import React, { useState, useEffect } from 'react';
import { Form, Radio, Card, Row, Col, Typography, Space, Button, notification, Statistic, Divider, Tag, Alert } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, HeartOutlined, SyncOutlined, CheckCircleOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { actualizarResultado } from "../lib/pacienteService";

const { Title, Text } = Typography;

const FragilidadForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  
  const { currentPatient, currentResultId } = useGlobalContext();

  useEffect(() => {
    if (currentPatient) {
      setIsSyncing(true);
      const p = currentPatient as any;

      // Sincronización automática de la dinamometría desde la BD
      const valorDinamometria = p.dynamometry || 0;

      form.setFieldsValue({
        dinamometria: valorDinamometria
      });
      
      setTimeout(() => setIsSyncing(false), 800);
    }
  }, [currentPatient, form]);

  const calcularCategoria = (values: any) => {
    let puntos = 0;
    if (values.exhausto === 'SI') puntos += 1;
    if (values.apetito === 'DISMINUYO') puntos += 1;
    if (values.caminar === 'SI') puntos += 1;
    if (values.escaleras === 'SI') puntos += 1;
    if (values.actividad === 'CASI_NUNCA') puntos += 1;
    setScore(puntos);
  };

  const getFragilidadTag = (s: number) => {
    if (s >= 3) return { label: "FRÁGIL", color: "red" };
    if (s >= 1) return { label: "PRE-FRÁGIL", color: "orange" };
    return { label: "NO FRÁGIL", color: "green" };
  };

  const categoria = getFragilidadTag(score);

  const onFinish = async (values: any) => {
    if (!currentPatient?.dni) return;
    try {
      setLoading(true);
      await actualizarResultado(currentPatient.dni, currentResultId || "", 'evaluacion_fragilidad', {
        ...values,
        score_fragilidad: score,
        categoria: categoria.label,
        fecha: new Date()
      });
      api.success({ message: 'Éxito', description: 'Evaluación sincronizada correctamente.' });
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
            <HeartOutlined className="text-3xl text-red-500" />
            <div>
              <Title level={3} className="!m-0">Fragilidad (SHARE-FI)</Title>
              <Text type="secondary">Paciente: {currentPatient?.nombre || '---'}</Text>
            </div>
          </Space>
          {isSyncing ? (
            <Tag color="processing" icon={<SyncOutlined spin />}>Sincronizando...</Tag>
          ) : (
            <Tag color="success" icon={<CheckCircleOutlined />}>Datos sincronizados</Tag>
          )}
        </Row>

        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={(_, all) => calcularCategoria(all)}>
          <Row gutter={32}>
            <Col xs={24} lg={16}>
              <Space direction="vertical" className="w-full" size={16}>
                
                <Card size="small" title="1. SENTIRSE EXHAUSTO" className="border-l-4 border-l-blue-400">
                  <Text type="secondary">¿Ha sentido que no tenía suficiente energía para hacer las cosas que quería?</Text>
                  <Form.Item name="exhausto" className="mt-4 mb-0">
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="SI">SÍ</Radio.Button>
                      <Radio.Button value="NO">NO</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Card>

                <Card size="small" title="2. PÉRDIDA DE APETITO" className="border-l-4 border-l-orange-400">
                  <Form.Item name="apetito" className="mb-0">
                    <Radio.Group>
                      <Space direction="vertical">
                        <Radio value="DISMINUYO">Disminuyó / Come menos de lo habitual</Radio>
                        <Radio value="IGUAL">Igual / Ni más ni menos</Radio>
                        <Radio value="AUMENTO">Aumentó / Come más de lo habitual</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Card>

                <Card size="small" title={<span><LockOutlined /> 3. FUERZA DE PRENSIÓN (Sincronizado)</span>} className="bg-gray-50">
                  <Statistic 
                    title="Dato detectado en BD (Dinamometría)" 
                    value={form.getFieldValue('dinamometria')} 
                    suffix="kg" 
                    valueStyle={{ color: '#096dd9' }}
                  />
                </Card>

                <Card size="small" title="4. DIFICULTADES FUNCIONALES" className="border-l-4 border-l-purple-400">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item name="caminar" label="Caminar 100 metros con dificultad">
                        <Radio.Group size="small">
                          <Radio.Button value="SI">SÍ</Radio.Button>
                          <Radio.Button value="NO">NO</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="escaleras" label="Subir escaleras sin descansar">
                        <Radio.Group size="small">
                          <Radio.Button value="SI">SÍ</Radio.Button>
                          <Radio.Button value="NO">NO</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card size="small" title="5. ACTIVIDAD FÍSICA" className="border-l-4 border-l-green-400">
                  <Form.Item name="actividad" className="mb-0">
                    <Radio.Group>
                      <Space direction="vertical">
                        <Radio value="MAS_UNA">Más de una vez a la semana</Radio>
                        <Radio value="UNA_VEZ">Una vez a la semana</Radio>
                        <Radio value="MES">De una a tres veces al mes</Radio>
                        <Radio value="CASI_NUNCA">Casi nunca, o nunca</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </Card>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Card className="text-center sticky top-4 border-2 border-dashed border-gray-200">
                <Statistic title="Puntuación" value={score} suffix="/ 5" />
                <Divider />
                <Title level={4} style={{ color: categoria.color }}>{categoria.label}</Title>
                <Alert message="Interpretación SHARE-FI" type="info" showIcon className="mt-4" />
              </Card>
            </Col>
          </Row>

          <Row justify="end" className="mt-10 gap-4">
            <Button size="large" onClick={() => router.back()} icon={<ArrowLeftOutlined />}>Volver</Button>
            <Button type="primary" size="large" htmlType="submit" loading={loading} icon={<SaveOutlined />} className="bg-red-600 px-12">
              Guardar en BD
            </Button>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default FragilidadForm;