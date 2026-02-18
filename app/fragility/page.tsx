'use client';
import React, { useState, useEffect } from 'react';
import {
  Form, Radio, Card, Row, Col, Typography,
  Space, Button, notification, Statistic,
  Divider, Tag, Alert
} from 'antd';
import {
  SaveOutlined, ArrowLeftOutlined,
  HeartOutlined, SyncOutlined,
  CheckCircleOutlined, LockOutlined
} from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/context/GlobalContext";
import {
  actualizarResultado,
  obtenerResultadoPorId
} from "../lib/pacienteService";

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
    const cargarDatos = async () => {
      if (!currentPatient?.dni || !currentResultId) {
        setIsSyncing(false);
        return;
      }

      try {
        setIsSyncing(true);
        const resultado: any = await obtenerResultadoPorId(
          currentPatient.dni,
          currentResultId
        );

        // Si el resultado existe y tiene datos (no es el objeto 'inexistente')
        if (resultado && !resultado.inexistente) {
          
          // Seteamos dinamometría (está en la raíz del documento)
          form.setFieldsValue({
            dinamometria: resultado.dynamometry || 0
          });

          // Seteamos evaluación de fragilidad
          if (resultado.evaluacion_fragilidad) {
            const frag = resultado.evaluacion_fragilidad;
            form.setFieldsValue({
              exhausto: frag.exhausto,
              apetito: frag.apetito,
              caminar: frag.caminar,
              escaleras: frag.escaleras,
              actividad: frag.actividad,
            });
            setScore(frag.score_fragilidad || 0);
          }
        } else {
          console.log("📝 Formulario listo para primer registro.");
        }
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    cargarDatos();
  }, [currentPatient?.dni, currentResultId, form]);

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
    if (!currentPatient?.dni || !currentResultId) return;

    try {
      setLoading(true);
      
      // Guardamos específicamente en el campo 'evaluacion_fragilidad'
      await actualizarResultado(
        currentPatient.dni,
        currentResultId,
        'evaluacion_fragilidad',
        {
          ...values,
          score_fragilidad: score,
          categoria: categoria.label,
          fecha: new Date().toISOString()
        }
      );

      api.success({ message: 'Sincronizado correctamente' });
      router.push('/physical');
    } catch (e) {
      api.error({ message: 'Error al guardar en Firebase' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {contextHolder}
      <Card className="max-w-5xl mx-auto shadow-lg rounded-xl">
        <Row justify="space-between" align="middle" className="mb-6">
          <Space>
            <HeartOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
            <Title level={4} style={{ margin: 0 }}>Evaluación de Fragilidad</Title>
          </Space>
          <Tag color={isSyncing ? "processing" : "success"}>
            {isSyncing ? "Cargando..." : "Sincronizado"}
          </Tag>
        </Row>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={(_, all) => calcularCategoria(all)}
        >
          <Row gutter={24}>
            <Col xs={24} md={16}>
              <Card size="small" title="Cuestionario SHARE-FI" className="mb-4">
                <Form.Item name="exhausto" label="¿Se ha sentido exhausto recientemente?">
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="SI">SÍ</Radio.Button>
                    <Radio.Button value="NO">NO</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="apetito" label="¿Cómo ha estado su apetito?">
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="DISMINUYO">Disminuyó</Radio>
                      <Radio value="IGUAL">Se mantiene igual</Radio>
                      <Radio value="AUMENTO">Aumentó</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="caminar" label="¿Tiene dificultad para caminar 100 metros?">
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="SI">SÍ</Radio.Button>
                    <Radio.Button value="NO">NO</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="escaleras" label="¿Tiene dificultad para subir un piso de escaleras?">
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="SI">SÍ</Radio.Button>
                    <Radio.Button value="NO">NO</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="actividad" label="¿Con qué frecuencia realiza actividad física?">
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value="MAS_UNA">Más de una vez por semana</Radio>
                      <Radio value="UNA_VEZ">Una vez por semana</Radio>
                      <Radio value="MES">1 a 3 veces al mes</Radio>
                      <Radio value="CASI_NUNCA">Casi nunca o nunca</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="text-center bg-gray-50">
                <Statistic title="Puntaje" value={score} suffix="/ 5" />
                <Divider />
                <div className="mb-4">
                    <Text strong>Estado:</Text><br/>
                    <Tag color={categoria.color} style={{ fontSize: 16, padding: '5px 15px' }}>
                        {categoria.label}
                    </Tag>
                </div>
                <Form.Item name="dinamometria" label="Fuerza de Prensisón (Kg)">
                   <Statistic value={form.getFieldValue('dinamometria') || 0} precision={1} />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Row justify="end" gutter={12}>
            <Col><Button onClick={() => router.back()}>Cancelar</Button></Col>
            <Col>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Guardar Evaluación
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default FragilidadForm;