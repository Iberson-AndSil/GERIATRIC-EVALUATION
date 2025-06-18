'use client';
import React from "react";
import { Form, Input, InputNumber, Row, Col, Typography, Card, Select } from "antd";
import { RiseOutlined, TeamOutlined, HeartOutlined, HomeOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const AdditionalInfoSection: React.FC = () => (
  <Card 
    title="INFORMACIÓN ADICIONAL"
    className="!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300"
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Form.Item
          label={<Text strong>Domicilio</Text>}
          name="domicilio"
          rules={[{ required: true, message: 'Por favor ingrese su domicilio' }]}
        >
          <Input
            placeholder="Ingrese su domicilio completo"
            size="large"
            prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Form.Item
          label={<Text strong>Nivel Educativo</Text>}
          name="nivel_educativo"
          rules={[{ required: true, message: 'Por favor seleccione su nivel educativo' }]}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="Seleccione su nivel educativo"
            style={{ width: '100%' }}
            options={[
              { value: 'sin_np', label: 'Sin Nivel/Incial' },
              { value: 'p', label: 'Primaria' },
              { value: 's', label: 'Secundaria' },
              { value: 'tecnica', label: 'Técnica (SNU)' },
              { value: 'universitaria', label: 'Universitaria' }
            ]}
          />
        </Form.Item>
      </Col>
      <Col md={12}>
        <Form.Item
          label={<Text strong>Sistema de Pensión</Text>}
          name="sistema_pension"
          rules={[{ required: true, message: 'Por favor seleccione su sistema de pensión' }]}
        >
          <Select
            mode="multiple"
            size="large"
            placeholder="Seleccione sistema de pensión"
            style={{ width: '100%' }}
            options={[
              { value: 'onp', label: 'ONP' },
              { value: 'afp', label: 'AFP' },
              { value: 'cedula_viva', label: 'Cédula Viva (20530)' },
              { value: 'reja', label: 'REJA (30425)' },
              { value: 'dependiente', label: 'Dependiente' }
            ]}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Form.Item
          label={<Text strong>Ocupación Actual</Text>}
          name="ocupacion"
          rules={[{ required: true, message: 'Por favor ingrese su ocupación' }]}
        >
          <Input
            placeholder="Ingrese su ocupación actual"
            size="large"
            prefix={<RiseOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label={<Text strong>Ingreso Económico (S/.)</Text>}
          name="ingreso_economico"
          rules={[{ required: true, message: 'Por favor ingrese su ingreso económico' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            size="large"
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={12}>
        <Form.Item
          label={<Text strong>Con quién vive</Text>}
          name="con_quien_vive"
          rules={[{ required: true, message: 'Por favor ingrese con quién vive' }]}
        >
          <Input
            placeholder="Ej: Familia, solo, etc."
            size="large"
            prefix={<TeamOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12} md={12}>
        <Form.Item
          label={<Text strong>Relación</Text>}
          name="relacion"
          rules={[{ required: true, message: 'Por favor ingrese la relación' }]}
        >
          <Input
            placeholder="Ej: Hijos, cónyuge, etc."
            size="large"
            prefix={<HeartOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Form.Item>
      </Col>
    </Row>
  </Card>
);