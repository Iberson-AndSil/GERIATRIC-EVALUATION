'use client';
import React, { useState } from 'react';
import { Form, InputNumber, DatePicker, Button, Card, Row, Col, Typography, Space, notification } from 'antd';
import { SaveOutlined, ExperimentOutlined, MedicineBoxOutlined, StockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGlobalContext } from "@/app/context/GlobalContext";
import { actualizarResultado } from "../lib/pacienteService";

const { Title, Text } = Typography;

const MarcadoresForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  
  const { currentPatient, currentResultId } = useGlobalContext();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      if (!currentPatient?.dni) {
        throw new Error("No se ha seleccionado un paciente");
      }

      const marcadoresData = {
        ...values,
        fecha_metabolismo: values.fecha_metabolismo?.toDate() || null,
        fecha_hematologia: values.fecha_hematologia?.toDate() || null,
        fecha_renal: values.fecha_renal?.toDate() || null,
        fecha_proteico: values.fecha_proteico?.toDate() || null,
        fecha_pcr: values.fecha_pcr?.toDate() || null,
        fecha_registro: new Date(),
      };

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'marcadoresBioquimicos',
        marcadoresData
      );

      api.success({
        message: 'Éxito',
        description: 'Marcadores bioquímicos guardados correctamente',
        placement: 'topRight'
      });

      form.resetFields();
      
      setTimeout(() => {
        router.push('/clinic');
      }, 1000);

    } catch (err: unknown) {
      console.error("Error al guardar:", err);
      api.error({
        message: 'Error',
        description: err instanceof Error ? err.message : 'Ocurrió un error al guardar',
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      {contextHolder}
      <div className="w-full mx-auto">
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Space>
            <div className="bg-blue-50 p-2 rounded-lg">
              <ExperimentOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <Title level={4} className="!m-0">MARCADORES BIOQUÍMICOS CLÍNICOS</Title>
              <Text type="secondary" className="text-xs">Registro de valores metabólicos y hematológicos</Text>
            </div>
          </Space>
          {/* <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
            disabled={!currentPatient}
            className="h-10 px-6 rounded-lg bg-blue-600 shadow-md"
          >
            {currentPatient?.dni ? "Guardar Resultados" : "Seleccione un paciente"}
          </Button> */}
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          requiredMark={false}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Space direction="vertical" className="w-full" size={16}>
                <Card
                  title={<><StockOutlined className="mr-2 text-orange-500" /> METABOLISMO GLÚCIDOS Y LÍPIDOS</>}
                  className="shadow-sm rounded-xl border-t-4 border-t-orange-400"
                  size="small"
                >
                  <Row gutter={12}>
                    <Col span={12}><Form.Item name="hba1c" label="HbA1c (%)"><InputNumber className="w-full" precision={2} /></Form.Item></Col>
                    <Col span={12}><Form.Item name="glucosa" label="Glucosa (mg/dL)"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item name="colesterol" label="Col. Total"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item name="hdl" label="HDL"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item name="ldl" label="LDL"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={6}><Form.Item name="trigliceridos" label="Triglic."><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={24}><Form.Item name="fecha_metabolismo" label="Fecha de Análisis" className="mb-0"><DatePicker className="w-full" /></Form.Item></Col>
                  </Row>
                </Card>

                <Card
                  title={<><MedicineBoxOutlined className="mr-2 text-purple-500" /> HEMATOLOGÍA</>}
                  className="shadow-sm rounded-xl border-t-4 border-t-purple-400"
                  size="small"
                >
                  <Row gutter={12}>
                    <Col span={8}><Form.Item name="hemoglobina" label="Hemoglobina"><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                    <Col span={8}><Form.Item name="hematocrito" label="Hematocrito"><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                    <Col span={8}><Form.Item name="fecha_hematologia" label="Fecha" className="mb-0"><DatePicker className="w-full" /></Form.Item></Col>
                  </Row>
                </Card>
              </Space>
            </Col>

            <Col xs={24} lg={12}>
              <Space direction="vertical" className="w-full" size={16}>
                <Card
                  title={<><ExperimentOutlined className="mr-2 text-blue-500" /> FUNCIÓN RENAL</>}
                  className="shadow-sm rounded-xl border-t-4 border-t-blue-400"
                  size="small"
                >
                  <Row gutter={12}>
                    <Col span={8}><Form.Item name="creatinina" label="Creatinina"><InputNumber className="w-full" precision={2}/></Form.Item></Col>
                    <Col span={8}><Form.Item name="urea_bun" label="Urea / BUN"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={8}><Form.Item name="tfg" label="TFG (CKD-EPI)"><InputNumber className="w-full" /></Form.Item></Col>
                    <Col span={24}><Form.Item name="fecha_renal" label="Fecha de Análisis" className="mb-0"><DatePicker className="w-full" /></Form.Item></Col>
                  </Row>
                </Card>

                <Card
                  title={<><MedicineBoxOutlined className="mr-2 text-emerald-500" /> ESTADO NUTRICIONAL PROTEICO</>}
                  className="shadow-sm rounded-xl border-t-4 border-t-emerald-400"
                  size="small"
                >
                  <Row gutter={12}>
                    <Col span={8}><Form.Item name="albumina" label="Albúmina"><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                    <Col span={8}><Form.Item name="globulinas" label="Globulinas"><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                    <Col span={8}><Form.Item name="proteinas_totales" label="Prot. Totales"><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                    <Col span={24}><Form.Item name="fecha_proteico" label="Fecha de Análisis" className="mb-0"><DatePicker className="w-full" /></Form.Item></Col>
                  </Row>
                </Card>

                <Card
                  title={<><ExperimentOutlined className="mr-2 text-red-500" /> INFLAMACIÓN CRÓNICA</>}
                  className="shadow-sm rounded-xl border-t-4 border-t-red-400"
                  size="small"
                >
                  <Row gutter={12}>
                    <Col span={12}><Form.Item name="pcr" label="PCR Cuantitativo" className="mb-0"><InputNumber className="w-full" precision={2}/></Form.Item></Col>
                    <Col span={12}><Form.Item name="fecha_pcr" label="Fecha" className="mb-0"><DatePicker className="w-full" /></Form.Item></Col>
                  </Row>
                </Card>
              </Space>
            </Col>
          </Row>

          <Row className="flex justify-center mt-12 gap-4">
            <Col>
              <Link href="/physical" passHref>
                <Button
                  type="default"
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  style={{ minWidth: '120px' }}
                >
                  Atrás
                </Button>
              </Link>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                disabled={!currentPatient}
                icon={<SaveOutlined />}
                style={{ minWidth: '150px' }}
              >
                Guardar Resultados
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default MarcadoresForm;