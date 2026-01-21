"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Radio, Row, Col, Typography, Card, Select } from "antd";
import {
    UserOutlined,
    IdcardOutlined,
    ManOutlined,
    WomanOutlined,
    HomeOutlined,
    TeamOutlined,
    SolutionOutlined,
    DollarOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import { useGlobalContext } from "@/app/context/GlobalContext";

const { Text } = Typography;

interface BasicInfoSectionProps {
    form: any;
    date:any;
    handleDayChange: () => void;
    handleMonthChange: () => void;
    handleYearChange: () => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({form,date,handleDayChange,handleMonthChange,handleYearChange}) => {
    const [fechaActual, setFechaActual] = useState('');
    const { currentPatient } = useGlobalContext();

    React.useEffect(() => {
        if (currentPatient) {
            let birthDay, birthMonth, birthYear;
            if (currentPatient.fecha_nacimiento) {
                const dateObject = new Date(currentPatient.fecha_nacimiento);
                birthDay = dateObject.getDate();
                birthMonth = dateObject.getMonth() + 1;
                birthYear = dateObject.getFullYear();
            }

            form.setFieldsValue({
                nombre: currentPatient.nombre || '',
                dni: currentPatient.dni || '',
                birth_day: birthDay || undefined,
                birth_month: birthMonth ? String(birthMonth).padStart(2, '0') : undefined,
                birth_year: birthYear || undefined,
                edad: currentPatient.edad || '',
                sexo: currentPatient.sexo || '',
                zona_residencia: currentPatient.zona_residencia || '',
                fecha_nacimiento: currentPatient.fecha_nacimiento || '',
                domicilio: currentPatient.domicilio || '',
                con_quien_vive: currentPatient.con_quien_vive || '',
                ocupacion: currentPatient.ocupacion || '',
                relacion: currentPatient.relacion || '',
                ingreso_economico: currentPatient.ingreso_economico || undefined,
                nivel_educativo: currentPatient.nivel_educativo || [],
                sistema_pension: currentPatient.sistema_pension || []
            });
        }
    }, [currentPatient, form]);

    const isDisabled = !!currentPatient;

    useEffect(() => {
        const today = new Date();
        date=today; 
        setFechaActual(date.toLocaleDateString());
    }, []);


    return (
        <Card
            title="INFORMACIÓN SOCIOECONÓMICA"
            className="!mb-4 !rounded-2xl !shadow-lg !h-full !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300"
            extra={<span className="font-semibold">Evaluación: {fechaActual}</span>}
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
                            disabled={isDisabled}
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
                            disabled={isDisabled}
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
                                    { required: !isDisabled, message: 'Requerido' },
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
                                    disabled={isDisabled}
                                    prefix={<CalendarOutlined />}
                                />
                            </Form.Item>

                            <Form.Item
                                name="birth_month"
                                rules={[{ required: !isDisabled, message: 'Requerido' }]}
                                noStyle
                            >
                                <Select
                                    size="large"
                                    placeholder="Mes"
                                    onChange={handleMonthChange}
                                    style={{ width: '40%' }}
                                    disabled={isDisabled}
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
                                    { required: !isDisabled, message: 'Requerido' },
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
                                    disabled={isDisabled}
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
                        <InputNumber
                            className="!truncate"
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
                        rules={[{ required: !isDisabled, message: 'Por favor seleccione su sexo' }]}
                    >
                        <Radio.Group size="large" className="w-full" disabled={isDisabled}>
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
                        rules={[{ required: !isDisabled, message: 'Por favor seleccione su zona de residencia' }]}
                    >
                        <Select
                            placeholder="Seleccione zona"
                            size="large"
                            disabled={isDisabled}
                            options={[
                                { value: 'rural', label: 'Rural' },
                                { value: 'urbano', label: 'Urbano' }
                            ]}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Form.Item
                        label={<Text strong>Domicilio</Text>}
                        name="domicilio"
                        rules={[{ required: !isDisabled, message: 'Por favor ingrese su domicilio' }]}
                    >
                        <Input
                            placeholder="Ingrese su domicilio"
                            size="large"
                            prefix={<HomeOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={<Text strong>¿Con quién vive?</Text>}
                        name="con_quien_vive"
                        rules={[{ required: !isDisabled, message: 'Por favor especifique con quién vive' }]}
                    >
                        <Input
                            placeholder="Ej: Solo, con familia, etc."
                            size="large"
                            prefix={<TeamOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={<Text strong>Ocupación</Text>}
                        name="ocupacion"
                        rules={[{ required: !isDisabled, message: 'Por favor ingrese su ocupación' }]}
                    >
                        <Input
                            placeholder="Ingrese su ocupación"
                            size="large"
                            prefix={<SolutionOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={<Text strong>Relación</Text>}
                        name="relacion"
                        rules={[{ required: !isDisabled, message: 'Por favor especifique su relación' }]}
                    >
                        <Input
                            placeholder="Ej: Soltero, casado, etc."
                            size="large"
                            prefix={<TeamOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={<Text strong>Ingreso Económico</Text>}
                        name="ingreso_economico"
                        rules={[{ required: !isDisabled, message: 'Por favor ingrese su ingreso económico' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="Ingrese monto"
                            size="large"
                            prefix={<DollarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            disabled={isDisabled}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={<Text strong>Nivel Educativo</Text>}
                        name="nivel_educativo"
                        rules={[{ required: !isDisabled, message: 'Por favor seleccione su nivel educativo' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Seleccione nivel educativo"
                            size="large"
                            disabled={isDisabled}
                            options={[
                                { value: 'p', label: 'Primaria' },
                                { value: 's', label: 'Secundaria' },
                                { value: 't', label: 'Técnico' },
                                { value: 'u', label: 'Universitario' },
                                { value: 'pg', label: 'Postgrado' }
                            ]}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label={<Text strong>Sistema de Pensión</Text>}
                        name="sistema_pension"
                        rules={[{ required: !isDisabled, message: 'Por favor seleccione su sistema de pensión' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Seleccione sistema de pensión"
                            size="large"
                            disabled={isDisabled}
                            options={[
                                { value: 'onp', label: 'ONP' },
                                { value: 'afp', label: 'AFP' },
                                { value: 'ninguno', label: 'Ninguno' }
                            ]}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
}