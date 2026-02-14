"use client";
import React, { useState } from 'react';
import { Form, InputNumber, DatePicker, Button, Card, Row, Col, Typography, notification, Divider } from 'antd';
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  ExperimentOutlined, 
  DashboardOutlined 
} from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

const MarcadoresBioquimicosPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      console.log('Valores recibidos:', values);
      
      // Simulación de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      api.success({
        message: 'Registro Exitoso',
        description: 'Los marcadores bioquímicos han sido guardados correctamente.',
        placement: 'topRight',
      });
    } catch (error) {
      api.error({
        message: 'Error',
        description: 'No se pudieron guardar los datos.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50/50 p-6">
      {contextHolder}
      <div className="max-w-[1100px] mx-auto">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-8">
          <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
            <ExperimentOutlined className="mr-2" />
            MARCADORES BIOQUÍMICOS CLÍNICOS
          </Title>
          <Text type="secondary" className="text-lg">Registro de Control Metabólico y Renal</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. FUNCIÓN RENAL */}
            <Card 
              title={<span className="text-blue-600 font-bold"><DashboardOutlined className="mr-2"/> FUNCIÓN RENAL</span>}
              className="shadow-sm rounded-xl border-t-4 border-t-blue-500"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="creatinina" label="Creatinina (mg/dL)">
                    <InputNumber className="w-full" placeholder="0.00" step={0.1} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="urea" label="Urea / BUN">
                    <InputNumber className="w-full" placeholder="0.00" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="tfg" label="TFG (CKD-EPI)">
                    <InputNumber className="w-full" placeholder="ml/min/1.73m²" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 2. ESTADO NUTRICIONAL PROTEICO */}
            <Card 
              title={<span className="text-emerald-600 font-bold">ESTADO NUTRICIONAL</span>}
              className="shadow-sm rounded-xl border-t-4 border-t-emerald-500"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="albumina" label="Albúmina">
                    <InputNumber className="w-full" placeholder="g/dL" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="globulinas" label="Globulinas">
                    <InputNumber className="w-full" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="proteinas_totales" label="Proteínas Totales">
                    <InputNumber className="w-full" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* 3. METABOLISMO (FULL WIDTH) */}
            <Col span={24} className="p-0">
              <Card 
                title={<span className="text-orange-600 font-bold">METABOLISMO GLÚCIDOS Y LÍPIDOS</span>}
                className="shadow-sm rounded-xl border-t-4 border-t-orange-500"
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item name="hba1c" label="Hemoglobina Glicosilada (%)">
                      <InputNumber className="w-full" min={0} max={20} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="glucosa" label="Glucosa (mg/dL)">
                      <InputNumber className="w-full" />
                    </Form.Item>
                  </Col>
                  <Divider orientation="left" plain>Perfil Lipídico</Divider>
                  <Col xs={12} md={6}>
                    <Form.Item name="col_total" label="Col. Total"><InputNumber className="w-full" /></Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item name="hdl" label="HDL"><InputNumber className="w-full" /></Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item name="ldl" label="LDL"><InputNumber className="w-full" /></Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item name="trigliceridos" label="Triglicéridos"><InputNumber className="w-full" /></Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 4. INFLAMACIÓN Y HEMATOLOGÍA */}
            <Card title="INFLAMACIÓN CRÓNICA" className="shadow-sm rounded-xl border-l-4 border-l-red-400">
              <Form.Item name="pcr" label="PCR Cuantitativo">
                <InputNumber className="w-full" />
              </Form.Item>
            </Card>

            <Card title="HEMATOLOGÍA" className="shadow-sm rounded-xl border-l-4 border-l-purple-400">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="hemoglobina" label="Hemoglobina"><InputNumber className="w-full" /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hematocrito" label="Hematocrito"><InputNumber className="w-full" /></Form.Item>
                </Col>
              </Row>
            </Card>
          </div>

          {/* FECHA DE LA TOMA (Global) */}
          <div className="mt-6 flex justify-center">
             <Card size="small" className="bg-blue-50 border-blue-200">
                <Form.Item name="fecha_general" label="Fecha de la Toma de Muestra" className="m-0" rules={[{required: true, message: 'Requerido'}]}>
                   <DatePicker className="w-full" />
                </Form.Item>
             </Card>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex justify-center gap-4 mt-10 pb-10">
            <Link href="/dashboard">
              <Button icon={<ArrowLeftOutlined />} size="large">Volver</Button>
            </Link>
            
            <Button 
              type="primary" 
              icon={<SaveOutlined />} 
              size="large"
              htmlType="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-500 shadow-md min-w-[200px]"
            >
              Guardar Marcadores
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MarcadoresBioquimicosPage;