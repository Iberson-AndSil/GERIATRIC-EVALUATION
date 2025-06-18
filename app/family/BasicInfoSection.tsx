"use client";
import React from "react";
import { Form, Input, InputNumber, Radio, Row, Col, Typography, Card, Select } from "antd";
import { UserOutlined, IdcardOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface BasicInfoSectionProps {
    form: any;
    handleDayChange: () => void;
    handleMonthChange: () => void;
    handleYearChange: () => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    handleDayChange,
    handleMonthChange,
    handleYearChange,
}) => (
    <Card
        title="INFORMACIÓN BÁSICA"
        className="!mb-4 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300"
    >
        <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
                <Form.Item
                    label={<Text strong>Apellidos y Nombres</Text>}
                    name="nombre"
                    rules={[{ required: true, message: 'Por favor ingrese su nombre completo' }]}
                >
                    <Input
                        placeholder="Ingrese su nombre completo"
                        size="large"
                        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                    label={<Text strong>DNI</Text>}
                    name="dni"
                    rules={[
                        { required: true, message: 'Por favor ingrese su DNI' },
                        { pattern: /^\d{8}$/, message: 'El DNI debe tener 8 dígitos' }
                    ]}
                >
                    <Input
                        placeholder="Ingrese su DNI"
                        size="large"
                        prefix={<IdcardOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={[16, 16]}>
            <Form.Item name="fecha_nacimiento" hidden>
                <Input />
            </Form.Item>

            <Col xs={24} sm={12} md={10}>

                <Form.Item
                    label={<Text strong className="!truncate">Fecha de nacimiento</Text>}
                    required
                >
                    <Input.Group compact>
                        <Form.Item
                            name="birth_day"
                            rules={[
                                { required: true, message: 'Requerido' },
                                { type: 'number', min: 1, max: 31, message: 'Día inválido' },
                            ]}
                            noStyle
                        >
                            <InputNumber
                                min={1}
                                max={31}
                                style={{ width: '30%' }}
                                size="large"
                                onChange={handleDayChange}
                                placeholder="Día"
                            />
                        </Form.Item>

                        <Form.Item
                            name="birth_month"
                            rules={[{ required: true, message: 'Requerido' }]}
                            noStyle
                        >
                            <Select
                                size="large"
                                placeholder="Mes"
                                onChange={handleMonthChange}
                                style={{ width: '40%' }}
                                options={[
                                    { value: '01', label: 'Enero' },
                                    { value: '02', label: 'Febrero' },
                                    { value: '03', label: 'Marzo' },
                                    { value: '04', label: 'Abril' },
                                    { value: '05', label: 'Mayo' },
                                    { value: '06', label: 'Junio' },
                                    { value: '07', label: 'Julio' },
                                    { value: '08', label: 'Agosto' },
                                    { value: '09', label: 'Setiembre' },
                                    { value: '10', label: 'Octubre' },
                                    { value: '11', label: 'Noviembre' },
                                    { value: '12', label: 'Diciembre' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item
                            name="birth_year"
                            rules={[
                                { required: true, message: 'Requerido' },
                                { type: 'number', min: 1900, max: new Date().getFullYear(), message: 'Año inválido' },
                            ]}
                            noStyle
                        >
                            <InputNumber
                                min={1900}
                                max={new Date().getFullYear()}
                                style={{ width: '30%' }}
                                size="large"
                                onChange={handleYearChange}
                                placeholder="Año"
                            />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={2}>
                <Form.Item
                    label={<Text strong className="!truncate">Edad</Text>}
                    name="edad"
                >
                    <InputNumber className="!truncate"
                        style={{ width: "100%" }}
                        size="large"
                        disabled
                    />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Form.Item
                    label={<Text strong className="!truncate">Sexo</Text>}
                    name="sexo"
                    rules={[{ required: true, message: 'Por favor seleccione su sexo' }]}
                >
                    <Radio.Group size="large" className="w-full">
                        <Radio.Button value="F" className="!truncate w-1/2">
                            <WomanOutlined /> F
                        </Radio.Button>
                        <Radio.Button value="M" className="!truncate w-1/2">
                            <ManOutlined /> M
                        </Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Form.Item
                    label={<Text strong>Zona Residencia</Text>}
                    name="zona_residencia"
                    rules={[{ required: true, message: 'Por favor seleccione su zona de residencia' }]}
                >
                    <Select
                        placeholder="Seleccione zona"
                        size="large"
                        options={[
                            { value: 'rural', label: 'Rural' },
                            { value: 'urbano', label: 'Urbano' }
                        ]}
                    />
                </Form.Item>
            </Col>
        </Row>
    </Card>
);