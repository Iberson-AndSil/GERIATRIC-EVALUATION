"use client";
import React, { useEffect, useState, useCallback } from "react";
import { NivelEducativoOption } from "@/app/type"
import { Form, Input, InputNumber, Radio, Row, Col, Typography, Card, Select, Divider, Space, Cascader, Button } from "antd";
import {
    UserOutlined,
    IdcardOutlined,
    ManOutlined,
    WomanOutlined,
    HomeOutlined,
    SolutionOutlined,
    DollarOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    BankOutlined,
    PhoneOutlined,
    MailOutlined,
    EditOutlined,
    CloseOutlined,
    CheckOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useRouter, useSearchParams } from 'next/navigation';

const { Text } = Typography;
const { Option } = Select

interface BasicInfoSectionProps {
    form: any;
    onValuesChange?: (changedValues: any, allValues: any) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form, onValuesChange }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMember = searchParams?.get('isMember') === 'true';
    const [age, setAge] = useState<number | null>(null);
    const { currentPatient } = useGlobalContext();
    const [isEditing, setIsEditing] = useState(false);
    
    const [departments, setDepartments] = useState<string[]>([])
    const [provinces, setProvinces] = useState<string[]>([])
    const [districts, setDistricts] = useState<string[]>([])
    const [department, setDepartment] = useState<string | null>(currentPatient?.department || null)
    const [province, setProvince] = useState<string | null>(currentPatient?.province || null)

    const [loadingDept, setLoadingDept] = useState(false)
    const [loadingProv, setLoadingProv] = useState(false)
    const [loadingDist, setLoadingDist] = useState(false)

    useEffect(() => {
        setLoadingDept(true)

        fetch('/api/cities/departments')
            .then(res => res.json())
            .then(data => setDepartments(data))
            .catch(err => console.error('Error fetching departments:', err))
            .finally(() => setLoadingDept(false))
    }, [])


    useEffect(() => {
        if (!department) return
        
        setProvince(null)
        setDistricts([])
        setLoadingProv(true)

        fetch(`/api/cities/provinces?department=${department}`)
            .then(res => res.json())
            .then(setProvinces)
            .finally(() => setLoadingProv(false))
    }, [department])

    useEffect(() => {
        if (!department || !province) return

        setLoadingDist(true)

        fetch(
            `/api/cities/districts?department=${department}&province=${province}`
        )
            .then(res => res.json())
            .then(setDistricts)
            .finally(() => setLoadingDist(false))
    }, [province, department])

    const calculateAge = useCallback((day?: number, month?: string, year?: number) => {
        if (day && month && year) {
            const birthDate = new Date(year, parseInt(month) - 1, day);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge);
            form.setFieldsValue({ edad: calculatedAge });
            const fechaNacimiento = dayjs(birthDate).format('YYYY-MM-DD');
            form.setFieldsValue({ fecha_nacimiento: fechaNacimiento });
            return calculatedAge;
        }
        return null;
    }, [form]);

    const handleDateChange = useCallback(() => {
        const day = form.getFieldValue('birth_day');
        const month = form.getFieldValue('birth_month');
        const year = form.getFieldValue('birth_year');

        if (day && month && year) {
            calculateAge(day, month, year);
        } else {
            setAge(null);
            form.setFieldsValue({ edad: undefined, fecha_nacimiento: '' });
        }
    }, [form, calculateAge]);

    const generateGrades = (count: number) =>
        Array.from({ length: count }, (_, i) => ({
            value: String(i + 1),
            label: `${i + 1}°`
        }));

    const nivelEducativoOptions: NivelEducativoOption[] = [
        {
            value: 'sin_nivel',
            label: 'Sin nivel/Inicial',
            children: [{ value: '0', label: '0°' }]
        },
        {
            value: 'primaria',
            label: 'Primaria',
            children: generateGrades(6)
        },
        {
            value: 'secundaria',
            label: 'Secundaria',
            children: generateGrades(5)
        },
        {
            value: 'tecnica',
            label: 'Técnica (SNU)',
            children: generateGrades(3)
        },
        {
            value: 'universitaria',
            label: 'Universitaria',
            children: generateGrades(7)
        },
        {
            value: 'postgrado',
            label: 'Postgrado',
            children: generateGrades(5)
        }
    ];

    useEffect(() => {
        if (currentPatient) {
            console.log("el paciente existe");
            let birthDay, birthMonth, birthYear;
            if (currentPatient.fecha_nacimiento) {
                const dateObject = new Date(currentPatient.fecha_nacimiento);
                birthDay = dateObject.getDate();
                birthMonth = String(dateObject.getMonth() + 1).padStart(2, '0');
                birthYear = dateObject.getFullYear();
            }

            const formData = {
                nombre: currentPatient.nombre || '',
                dni: currentPatient.dni || '',
                birth_day: currentPatient.birth_day || undefined,
                birth_month: currentPatient.birth_month || undefined,
                birth_year: currentPatient.birth_year || undefined,
                edad: currentPatient.edad || '',
                economic_activity: currentPatient.economic_activity || [],
                sexo: currentPatient.sexo || '',
                zona_residencia: currentPatient.zona_residencia || '',
                fecha_nacimiento: currentPatient.fecha_nacimiento || '',
                domicilio: currentPatient.domicilio || '',
                department: currentPatient.department || '',
                province: currentPatient.province || '',
                district: currentPatient.district || '',
                con_quien_vive: Array.isArray(currentPatient.con_quien_vive)
                    ? currentPatient.con_quien_vive
                    : (currentPatient.con_quien_vive ? [currentPatient.con_quien_vive] : []),
                ocupacion: currentPatient.ocupacion || '',
                ingreso_economico: currentPatient.ingreso_economico || undefined,
                nivel_educativo: currentPatient.nivel_educativo || [],
                sistema_pension: currentPatient.sistema_pension || [],
                ipress: currentPatient.ipress || '',
                telefono: currentPatient.phone || '',
                email: currentPatient.email || '',
                numero_historia: currentPatient.numero_historia || '',
                nameDoctor: currentPatient.nameDoctor || "POVES REQUENA, LORENZO SEGUNDO",
                nameLicensed: currentPatient.nameLicensed || "",
                dateEvaluation: currentPatient.dateEvaluation || dayjs().format('DD/MM/YYYY')
            };
            form.setFieldsValue(formData);
            if (birthDay && birthMonth && birthYear) calculateAge(birthDay, birthMonth, birthYear);
        } else {
            form.resetFields();
            setAge(null);
            form.setFieldsValue({
                dateEvaluation: dayjs().format('DD/MM/YYYY'),
                nameDoctor: "POVES REQUENA, LORENZO SEGUNDO",
                zona_residencia: 'urbano',
                con_quien_vive: []
            });
        }
    }, [currentPatient, form]);

    const monthOptions = [
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
    ];

    const zonaResidenciaOptions = [
        { value: 'rural', label: 'Rural' },
        { value: 'urbano', label: 'Urbano' }
    ];

    const sistemaPensionOptions = [
        { value: 'onp', label: 'ONP' },
        { value: 'afp', label: 'AFP' },
        { value: 'pension65', label: 'PENSION 65' },
        { value: 'derechohabbiente', label: 'DERECHOHABIENTE' },
        { value: 'cedula', label: 'CEDULA VIVA (DL: 20530)' },
        { value: 'cpmp', label: 'CPMP (DL: 1133)' },
        { value: 'reja', label: 'REJA (LEY: 30425)' },
        { value: 'notiene', label: 'NO TIENE' }
    ];

    const relacionOptions = [
        { value: 'soltero', label: 'Soltero(a)' },
        { value: 'casado', label: 'Casado(a)' },
        { value: 'divorciado', label: 'Divorciado(a)' },
        { value: 'viudo', label: 'Viudo(a)' },
        { value: 'conviviente', label: 'Conviviente' }
    ];

    const conQuienViveOptions = [
        { value: 'Conyugue', label: 'Conyugue' },
        { value: 'Hijos', label: 'Hijos' },
        { value: 'Hermanos', label: 'Hermanos' },
        { value: 'Otros familiares', label: 'Otros familiares' },
        { value: 'Amigos', label: 'Amigos' },
        { value: 'Solo (a)', label: 'Solo (a)' },
    ];

    const economicActivityOptions = [
        { value: 'dependient', label: 'Dependiente' },
        { value: 'independient', label: 'Independiente' },
        { value: 'ninguno', label: 'Ninguno' }
    ];

    useEffect(() => {
        setIsEditing(isMember);
    }, [isMember]);

    const editModal = () => {
        setIsEditing(true);
    }

    const handleClose = () => {
        router.push('/');
    }

    return (
        <Card className="!mb-4 !rounded-2xl !shadow-lg !h-full !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
            <div className="flex justify-end gap-2">
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => editModal()}
                />
                <Button
                    color="danger" variant="solid"
                    icon={<CloseOutlined />}
                    onClick={() => handleClose()}
                    style={{ color: '#ffffff' }}
                />
            </div>
            <Divider orientation="left" orientationMargin="0" className="!mt-0">
                <Text strong>Evaluadores</Text>
            </Divider>
            <Row gutter={[16, 0]} className="!m-0">
                <Col xs={24} md={8} >
                    <Form.Item
                        name="nameDoctor"
                        label={<Text strong>Médico Tratante</Text>}
                        rules={[{ required: true, message: 'Requerido' }]}
                        className="!mb-0 !pb-0 block"
                    >
                        <Input
                            size="large"
                            placeholder="Dr. Nombre Apellido"
                            prefix={<span className="text-gray-400 font-semibold text-sm mr-1 select-none">Dr.</span>}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        name="nameLicensed"
                        label={<Text strong>Licenciado</Text>}
                    >
                        <Input
                            placeholder="Ingrese su nombre completo"
                            size="large"
                            prefix={<span className="text-gray-400 font-semibold text-sm mr-1 select-none">Lic.</span>}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        name="dateEvaluation"
                        label={<Text strong>Fecha de Evaluación</Text>}
                        rules={[{ required: true, message: 'Requerido' }]}
                    >
                        <Input
                            size="large"
                            prefix={<CalendarOutlined className="text-gray-400" />}
                            disabled
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Divider orientation="left" orientationMargin="0" className="!mt-0">
                <Text strong>Identificación del Paciente</Text>
            </Divider>
            <Row gutter={[16, 0]}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>Apellidos y Nombres</Text>}
                        name="nombre"
                        rules={[{ required: true, message: 'Por favor ingrese su nombre completo' }]}
                    >
                        <Input
                            placeholder="Ingrese su nombre completo"
                            size="large"
                            prefix={<UserOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={4}>
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
                            prefix={<IdcardOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                    <Form.Item
                        label={<Text strong>Fecha de Nacimiento</Text>}
                        required
                    >
                        <Space.Compact block>
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
                                    onChange={handleDateChange}
                                    placeholder="Día"
                                    disabled={!isEditing}
                                    className="!rounded-r-none"
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
                                    onChange={handleDateChange}
                                    style={{ width: '40%' }}
                                    disabled={!isEditing}
                                    className="!rounded-none"
                                    options={monthOptions}
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
                                    onChange={handleDateChange}
                                    placeholder="Año"
                                    disabled={!isEditing}
                                    className="!rounded-l-none"
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
                <Col xs={24} md={2}>
                    <Form.Item
                        label={<Text strong>Edad</Text>}
                        name="edad"
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            size="large"
                            disabled
                            value={age || undefined}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={4}>
                    <Form.Item
                        label={<Text strong>Sexo</Text>}
                        name="sexo"
                        rules={[{ required: true, message: 'Por favor seleccione su sexo' }]}
                    >
                        <Radio.Group
                            size="large"
                            className="w-full"
                            disabled={!isEditing}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="F" className="w-1/2 text-center">
                                <WomanOutlined /> F
                            </Radio.Button>
                            <Radio.Button value="M" className="w-1/2 text-center">
                                <ManOutlined /> M
                            </Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>
            </Row>
            <Divider orientation="left" orientationMargin="0" className="!mt-0">
                <Text strong>Información Demográfica</Text>
            </Divider>
            <Row gutter={[16, 0]}>
                <Form.Item name="fecha_nacimiento" hidden>
                    <Input />
                </Form.Item>
                <Col xs={24} md={6}>
                    <Form.Item
                        label={<Text strong>Zona Residencia</Text>}
                        name="zona_residencia"
                        rules={[{ required: true, message: 'Por favor seleccione su zona de residencia' }]}
                    >
                        <Select
                            placeholder="Seleccione zona"
                            size="large"
                            disabled={!isEditing}
                            options={zonaResidenciaOptions}
                            suffixIcon={<EnvironmentOutlined />}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                    <Form.Item
                        label={<Text strong>Teléfono</Text>}
                        name="telefono"
                        rules={[{ pattern: /^\d{9}$/, message: 'Ingrese 9 dígitos' }]}
                    >
                        <Input
                            placeholder="Ingrese su teléfono"
                            size="large"
                            prefix={<PhoneOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                    <Form.Item
                        label={<Text strong>Email</Text>}
                        name="email"
                        rules={[{ type: 'email', message: 'Email inválido' }]}
                    >
                        <Input
                            placeholder="Ingrese su email"
                            size="large"
                            prefix={<MailOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                    <Form.Item
                        label={<Text strong>¿Con quién vive?</Text>}
                        name="con_quien_vive"
                        rules={[{ required: true, message: 'Por favor especifique con quién vive' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Seleccione opciones"
                            size="large"
                            disabled={!isEditing}
                            options={conQuienViveOptions}
                            maxTagCount="responsive"
                            allowClear
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 0]}>
                <Col xs={24} md={5}>
                    <Form.Item
                        label={<Text strong>Departamento</Text>}
                        name="department"
                    >
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            placeholder="Seleccione departamento"
                            loading={loadingDept}
                            style={{ width: '100%', marginBottom: 16 }}
                            options={departments.map(dep => ({
                                label: dep,
                                value: dep
                            }))}
                            filterOption={(input, option) =>
                                (option?.label as string)
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            onChange={value => setDepartment(value)}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                    <Form.Item
                        label={<Text strong>Provincia</Text>}
                        name="province"
                    >
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            placeholder="Seleccione provincia"
                            loading={loadingProv}
                            disabled={!department && !isEditing}
                            style={{ width: '100%', marginBottom: 16 }}
                            onChange={value => setProvince(value)}
                            filterOption={(input: any, option: any) =>
                                option?.children
                                    ?.toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {provinces.map(prov => (
                                <Option key={prov} value={prov}>
                                    {prov}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={5}>
                    <Form.Item
                        label={<Text strong>Distrito</Text>}
                        name="district"
                    >
                        <Select
                            showSearch
                            allowClear
                            size="large"
                            placeholder="Seleccione distrito"
                            loading={loadingDist}
                            disabled={!province && !isEditing}
                            style={{ width: '100%' }}
                            filterOption={(input: any, option: any) =>
                                option?.children
                                    ?.toString()
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        >
                            {districts.map(dist => (
                                <Option key={dist} value={dist}>
                                    {dist}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col xs={24} md={9}>
                    <Form.Item
                        label={<Text strong>Domicilio</Text>}
                        name="domicilio"
                        rules={[{ required: true, message: 'Por favor ingrese su domicilio' }]}
                    >
                        <Input
                            placeholder="Ingrese su domicilio completo"
                            size="large"
                            prefix={<HomeOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Divider orientation="left" orientationMargin="0" className="!mt-0">
                <Text strong>Información Socioeconómica</Text>
            </Divider>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>Actividad Económica</Text>}
                        name="economic_activity"
                        rules={[{ required: true, message: 'Por favor seleccione su sistema de pensión' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Seleccione sistema de pensión"
                            size="large"
                            disabled={!isEditing}
                            options={economicActivityOptions}
                            maxTagCount={2}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>Ocupación Económica</Text>}
                        name="ocupacion"
                        rules={[{ required: true, message: 'Por favor ingrese su ocupación' }]}
                    >
                        <Input
                            placeholder="Ingrese su ocupación"
                            size="large"
                            prefix={<SolutionOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>IPRESS</Text>}
                        name="ipress"
                        rules={[{ required: true, message: 'Ingrese IPRESS' }]}
                    >
                        <Input
                            placeholder="Nombre de la IPRESS"
                            size="large"
                            prefix={<BankOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>Ingreso Económico (S/.)</Text>}
                        name="ingreso_economico"
                        rules={[{ required: true, message: 'Por favor ingrese su ingreso económico' }]}
                    >
                        <InputNumber<number>
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            size="large"
                            min={0}
                            formatter={(value) => `S/. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => Number(value?.replace(/\D/g, '') || 0)}
                            prefix={<DollarOutlined className="text-gray-400" />}
                            disabled={!isEditing}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>Nivel Educativo</Text>}
                        name="nivel_educativo"
                        rules={[{ required: true, message: 'Por favor seleccione nivel y grado' }]}
                    >
                        <Cascader
                            options={nivelEducativoOptions}
                            placeholder="Seleccione nivel y grado"
                            size="large"
                            disabled={!isEditing}
                            expandTrigger="hover"
                            showSearch
                            changeOnSelect={false}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                    <Form.Item
                        label={<Text strong>Sistema de Pensión</Text>}
                        name="sistema_pension"
                        rules={[{ required: true, message: 'Por favor seleccione su sistema de pensión' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Seleccione sistema de pensión"
                            size="large"
                            disabled={!isEditing}
                            options={sistemaPensionOptions}
                            maxTagCount={2}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};