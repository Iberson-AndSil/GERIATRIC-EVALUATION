'use client';
import React, { useState } from 'react';
import { Form, InputNumber, DatePicker, Button, Card, Row, Col, Typography, Space, notification } from 'antd';
import { SaveOutlined, ExperimentOutlined, MedicineBoxOutlined, StockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

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
        router.push('/comorbidity');
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
    <div className="ergonomic-container">
      {contextHolder}

      <div className="page-header">
        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
          MARCADORES BIOQUÍMICOS CLÍNICOS
        </Title>
        <Text type="secondary" className="hidden sm:inline-block ml-4">Registro de valores metabólicos y hematológicos</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        requiredMark={false}
        initialValues={{
          fecha_metabolismo: dayjs(),
          fecha_hematologia: dayjs(),
          fecha_renal: dayjs(),
          fecha_proteico: dayjs(),
          fecha_pcr: dayjs(),
        }}
        className="main-form"
      >
        <div className="content-layout">
          {/* COLUMNA 1: METABOLISMO */}
          <div className="column column-left">
            <Card
              title={<Space><StockOutlined style={{ color: '#fa8c16' }} /> METABOLISMO</Space>}
              className="flex-column-card"
              styles={{ header: { minHeight: '40px', padding: '0 12px' }, body: { padding: '12px', overflowY: 'auto', flex: 1 } }}
            >
              <Row gutter={12}>
                <Col span={12}><Form.Item className="no-margin-item mb-2" name="hba1c" label={<span className="text-xs">HbA1c (%)</span>}><InputNumber className="w-full" precision={2} /></Form.Item></Col>
                <Col span={12}><Form.Item className="no-margin-item mb-2" name="glucosa" label={<span className="text-xs">Glucosa (mg/dL)</span>}><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item className="no-margin-item mb-2" name="colesterol" label={<span className="text-xs">Col. Total (mg/dL)</span>}><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item className="no-margin-item mb-2" name="hdl" label={<span className="text-xs">HDL (mg/dL)</span>}><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item className="no-margin-item mb-2" name="ldl" label={<span className="text-xs">LDL (mg/dL)</span>}><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={12}><Form.Item className="no-margin-item mb-2" name="trigliceridos" label={<span className="text-xs">Triglic. (mg/dL)</span>}><InputNumber className="w-full" /></Form.Item></Col>
                <Col span={24}><Form.Item name="fecha_metabolismo" label={<span className="text-xs">Fecha Análisis</span>} className="no-margin-item mb-2"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item></Col>
              </Row>
            </Card>
          </div>

          {/* COLUMNA 2: HEMATOLOGÍA Y FUNCIÓN RENAL */}
          <div className="column column-center">
            <Space direction="vertical" className="w-full flex-1 flex flex-col" size={16} styles={{ item: { display: 'flex' }}}>
              <Card
                title={<Space><MedicineBoxOutlined style={{ color: '#722ed1' }} /> HEMATOLOGÍA</Space>}
                className="flex-column-card"
                styles={{ header: { minHeight: '40px', padding: '0 12px' }, body: { padding: '12px', overflowY: 'auto' } }}
              >
                <Row gutter={12}>
                  <Col span={12}><Form.Item className="no-margin-item mb-2" name="hemoglobina" label={<span className="text-xs">Hemoglobina (g/dL)</span>}><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                  <Col span={12}><Form.Item className="no-margin-item mb-2" name="hematocrito" label={<span className="text-xs">Hematocrito (%)</span>}><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                  <Col span={24}><Form.Item name="fecha_hematologia" label={<span className="text-xs">Fecha Análisis</span>} className="no-margin-item mb-2"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item></Col>
                </Row>
              </Card>

              <Card
                title={<Space><ExperimentOutlined style={{ color: '#1890ff' }} /> FUNCIÓN RENAL</Space>}
                className="flex-column-card flex-1"
                styles={{ header: { minHeight: '40px', padding: '0 12px' }, body: { padding: '12px', overflowY: 'auto' } }}
              >
                <Row gutter={12}>
                  <Col span={12}><Form.Item className="no-margin-item mb-2" name="creatinina" label={<span className="text-xs">Creatinina (mg/dL)</span>}><InputNumber className="w-full" precision={2}/></Form.Item></Col>
                  <Col span={12}><Form.Item className="no-margin-item mb-2" name="urea_bun" label={<span className="text-xs">Urea / BUN</span>}><InputNumber className="w-full" /></Form.Item></Col>
                  <Col span={24}><Form.Item className="no-margin-item mb-2" name="tfg" label={<span className="text-xs">TFG (CKD-EPI)</span>}><InputNumber className="w-full" /></Form.Item></Col>
                  <Col span={24}><Form.Item name="fecha_renal" label={<span className="text-xs">Fecha Análisis</span>} className="no-margin-item mb-0"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item></Col>
                </Row>
              </Card>
            </Space>
          </div>

          {/* COLUMNA 3: ESTADO NUTRICIONAL E INFLAMATORIO */}
          <div className="column column-right">
            <Space direction="vertical" className="w-full flex-1 flex flex-col" size={16} styles={{ item: { display: 'flex' }}}>
              <Card
                title={<Space><MedicineBoxOutlined style={{ color: '#52c41a' }} /> N. PROTEICO</Space>}
                className="flex-column-card"
                styles={{ header: { minHeight: '40px', padding: '0 12px' }, body: { padding: '12px', overflowY: 'auto' } }}
              >
                <Row gutter={12}>
                  <Col span={12}><Form.Item className="no-margin-item mb-2" name="albumina" label={<span className="text-xs">Albúmina (g/dL)</span>}><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                  <Col span={12}><Form.Item className="no-margin-item mb-2" name="globulinas" label={<span className="text-xs">Globulinas (g/dL)</span>}><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                  <Col span={24}><Form.Item className="no-margin-item mb-2" name="proteinas_totales" label={<span className="text-xs">Prot. Totales (g/dL)</span>}><InputNumber className="w-full" precision={1}/></Form.Item></Col>
                  <Col span={24}><Form.Item name="fecha_proteico" label={<span className="text-xs">Fecha Análisis</span>} className="no-margin-item mb-2"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item></Col>
                </Row>
              </Card>

              <Card
                title={<Space><ExperimentOutlined style={{ color: '#f5222d' }} /> INFLAMACIÓN</Space>}
                className="flex-column-card flex-1"
                styles={{ header: { minHeight: '40px', padding: '0 12px' }, body: { padding: '12px', overflowY: 'auto' } }}
              >
                <Row gutter={12}>
                  <Col span={24}><Form.Item className="no-margin-item mb-2" name="pcr" label={<span className="text-xs">PCR Cuantitativo (mg/L)</span>}><InputNumber className="w-full" precision={2}/></Form.Item></Col>
                  <Col span={24}><Form.Item name="fecha_pcr" label={<span className="text-xs">Fecha Análisis</span>} className="no-margin-item mb-0"><DatePicker className="w-full" format="DD/MM/YYYY" /></Form.Item></Col>
                </Row>
              </Card>
            </Space>
          </div>
        </div>

        <div className="action-footer">
          <Link href="/physical" passHref>
            <Button icon={<ArrowLeftOutlined />} size="large">Atrás</Button>
          </Link>
          <Button
            type="primary"
            size="large"
            onClick={() => form.submit()}
            loading={loading}
            disabled={!currentPatient}
            icon={<SaveOutlined />}
            className="save-button"
          >
            {currentPatient?.dni ? "Guardar Resultados" : "Seleccione un paciente"}
          </Button>
        </div>
      </Form>

      <style jsx global>{`
        /* Ajuste para que quepa en el Content del AppLayout sin scroll principal */
        .ergonomic-container {
          height: calc(100vh - 124px); /* Ajuste basado en Navbar + Padding del Layout */
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-size: 14px;
        }

        .page-header {
          display: flex;
          align-items: center;
          padding-bottom: 16px;
          flex-shrink: 0;
        }

        .main-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .content-layout {
          flex: 1;
          display: flex;
          gap: 16px;
          overflow: hidden;
        }

        .column {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .column-left { flex: 1; }
        .column-center { flex: 1; }
        .column-right { flex: 1; }

        .flex-column-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          flex: 1;
        }
        
        /* Oculta scrollbar en las tarjetas */
        .flex-column-card .ant-card-body::-webkit-scrollbar {
            display: none;
        }
        .flex-column-card .ant-card-body {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .action-footer {
          display: flex;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
          flex-shrink: 0;
          margin-top: 8px;
        }

        .save-button {
          background: #1890ff;
          font-weight: 600;
          padding: 0 40px;
        }

        .no-margin-item { margin-bottom: 0 !important; }
      `}</style>
    </div>
  );
};

export default MarcadoresForm;