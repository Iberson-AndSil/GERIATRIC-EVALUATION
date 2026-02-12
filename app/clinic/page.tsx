'use client';

import React, { useState } from 'react';
import { 
    Form, Input, Checkbox, Card, Row, Col, Typography, 
    Select, InputNumber, Space, Badge, Divider, Button, 
    Radio, notification, 
    Alert
} from 'antd';
import { 
    FileSearchOutlined, 
    MedicineBoxOutlined, 
    CheckSquareOutlined, 
    PlusOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    HeartOutlined,
    HistoryOutlined,
    MedicineBoxFilled,
    SaveOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { actualizarResultado } from '../lib/pacienteService';

const { Title, Text } = Typography;
const { Option } = Select;

// Lista de comorbilidades extraída de la imagen
const COMORBILIDADES_LIST = [
    "ANEMIA CRONICA", "ERC", "DIABETES MELLITUS", "HIPERTENSION ARTERIAL",
    "FIBRILACION AURICULAR", "INSUFICIENCIA CARDIACA (Clase Funcional III-IV y/o MRC)",
    "CARDIOPATIA ISQUEMICA", "VALVULPATIA CARDIACA", "EPOC (ASMA/BRONQUITIS)",
    "FIBROSIS PULMONAR", "ENF. PARKINSON", "DEMENCIA",
    "DELIRIO REPORTADO POR FAMILIARES EN DOMICILIO", "OSTEOPOROSIS", "OSTEOARTROSIS",
    "ARTRITIS REUMATOIDEA", "GASTROPATIA", "HEPATOPATIA",
    "TVP EN ACO", "INSUFICIENCIA VENOSA (DERMATITIS - ULCERA)",
    "HBP", "HIPOTIROIDISMO", "SECUELA ACV",
    "SECUELA FRACTURA", "CANCER REMITIDO", "COVID (RQ OXIGENO)"
];

const ClinicalAssessment: React.FC = () => {
    const [form] = Form.useForm();
    const { currentPatient, currentResultId } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    // Observadores de estado en tiempo real para UI dinámica
    const seleccionadas = Form.useWatch('enfermedades_activas', form) || [];
    const medicamentos = Form.useWatch('medicamentos', form) || [];
    const numMedicamentos = medicamentos.filter((m: any) => m?.nombre).length;

    const getPolifarmaciaColor = () => {
        if (numMedicamentos === 0) return "#d9d9d9";
        if (numMedicamentos < 3) return "#52c41a";
        return "#ff4d4f";
    };

    const transformarValoresAScore = (values: any) => {
        return {
            medicacion_habitual: values.medicamentos
                ? values.medicamentos.map((m: any) => m.nombre).filter(Boolean)
                : [],
            hospitalizaciones_ultimo_anio: values.hospitalizaciones_anio || 0,
            valoracion_oncologica: {
                en_tratamiento: values.cancer_tratamiento === "SI",
                metastasico: values.cancer_metastasico === "SI",
                recurrente: values.cancer_recurrente === "SI",
                dx_reciente: values.cancer_reciente === "SI"
            },
            comorbilidades: (values.enfermedades_activas || []).map((enf: string) => ({
                nombre: enf,
                anio_dx: values.detalles?.[enf]?.anio || null,
                metodo_dx: values.detalles?.[enf]?.metodo || "No especificado",
                tto_actual: values.detalles?.[enf]?.tto || ""
            }))
        };
    };

    const handleSaveData = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            if (!currentPatient?.dni) throw new Error("No se ha seleccionado un paciente");

            const score = transformarValoresAScore(values);

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'clinica', // Identificador de la sección
                score
            );

            api.success({
                message: 'Éxito',
                description: 'Valoración clínica guardada correctamente',
                placement: 'topRight'
            });

            router.push('/');
        } catch (err: any) {
            console.error("Error al guardar:", err);
            api.error({
                message: 'Error',
                description: err.message || "No se pudo guardar la información",
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
            {contextHolder}
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#1890ff', fontWeight: 500 }}>
                VALORACIÓN CLÍNICA - COMORBILIDADES Y MEDICACIÓN
            </Title>

            <Form form={form} layout="vertical" initialValues={{ medicamentos: [{}], enfermedades_activas: [] }}>
                <Row gutter={[20, 20]}>
                    
                    {/* COLUMNA IZQUIERDA: MEDICACIÓN Y HOSPITALIZACIÓN */}
                    <Col xs={24} lg={8}>
                        <Card 
                            title={<Space><MedicineBoxFilled /> MEDICACIÓN HABITUAL</Space>}
                            extra={<Badge count={numMedicamentos >= 3 ? "POLIFARMACIA" : "NORMAL"} color={getPolifarmaciaColor()} />}
                            className="shadow-md rounded-2xl mb-6"
                        >
                            <Form.List name="medicamentos">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} style={{ display: 'flex', marginBottom: 10, gap: 8, alignItems: 'center' }}>
                                                <Form.Item {...restField} name={[name, 'nombre']} style={{ margin: 0, flex: 1 }}>
                                                    <Input placeholder="Producto / Dosificación" />
                                                </Form.Item>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Agregar Medicamento
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>

                        <Card 
                            title={<Space><HistoryOutlined /> HOSPITALIZACIONES</Space>}
                            className="shadow-md rounded-2xl"
                        >
                            <Form.Item name="hospitalizaciones_anio" label="Cantidad en el último año">
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* COLUMNA DERECHA: CHECKLIST COMORBILIDADES */}
                    <Col xs={24} lg={16}>
                        <Card 
                            title={<Space><CheckSquareOutlined /> COMORBILIDADES / ANTECEDENTES</Space>}
                            className="shadow-md rounded-2xl"
                        >
                            {/* VALORACIÓN ONCOLÓGICA */}
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-5">
                                <Text strong className="text-red-600 block mb-3">VALORACIÓN ONCOLÓGICA (CÁNCER)</Text>
                                <Row gutter={16}>
                                    {['cancer_tratamiento', 'cancer_metastasico', 'cancer_recurrente', 'cancer_reciente'].map((name, idx) => (
                                        <Col span={6} key={name}>
                                            <Form.Item name={name} label={<small>{["En Tratamiento", "Metastásico", "Recurrente", "Dx Reciente"][idx]}</small>} className="mb-0">
                                                <Radio.Group size="small">
                                                    <Radio value="SI">SI</Radio>
                                                    <Radio value="NO">NO</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>
                            </div>

                            <Divider style={{ margin: '12px 0' }} />

                            <Form.Item name="enfermedades_activas" noStyle>
                                <Checkbox.Group className="w-full">
                                    <Row gutter={[10, 10]}>
                                        {COMORBILIDADES_LIST.map(enf => (
                                            <Col xs={24} sm={12} key={enf}>
                                                <Checkbox value={enf} style={{ fontSize: '12px' }}>{enf}</Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* SECCIÓN INFERIOR: DETALLES DE CADA ENFERMEDAD */}
                    <Col span={24}>
                        <Card title={<Space><FileSearchOutlined /> DETALLES CLÍNICOS ESPECÍFICOS</Space>} className="shadow-md rounded-2xl">
                            {seleccionadas.length === 0 ? (
                                <Alert message="Información" description="Seleccione comorbilidades arriba para habilitar los campos de Año, Método y Tratamiento." type="info" showIcon />
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="p-3 border-b-2 border-gray-100">Condición</th>
                                                <th className="p-3 border-b-2 border-gray-100 w-32">Año DX</th>
                                                <th className="p-3 border-b-2 border-gray-100 w-48">Método DX</th>
                                                <th className="p-3 border-b-2 border-gray-100">TTO Actual</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {seleccionadas.map((enf: string) => (
                                                <tr key={enf} className="hover:bg-blue-50/30 transition-colors">
                                                    <td className="p-2 border-b border-gray-100"><Text strong className="text-blue-800">{enf}</Text></td>
                                                    <td className="p-2 border-b border-gray-100">
                                                        <Form.Item name={['detalles', enf, 'anio']} className="mb-0">
                                                            <InputNumber placeholder="Año" className="w-full" />
                                                        </Form.Item>
                                                    </td>
                                                    <td className="p-2 border-b border-gray-100">
                                                        <Form.Item name={['detalles', enf, 'metodo']} className="mb-0">
                                                            <Select placeholder="Método" className="w-full">
                                                                <Option value="CLINICO">Clínico</Option>
                                                                <Option value="IMAGEN">Imagen</Option>
                                                                <Option value="LAB">Laboratorio</Option>
                                                                <Option value="BIOPSIA">Biopsia</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </td>
                                                    <td className="p-2 border-b border-gray-100">
                                                        <Form.Item name={['detalles', enf, 'tto']} className="mb-0">
                                                            <Input placeholder="Dosis/Medicamento" prefix={<HeartOutlined className="text-red-400" />} />
                                                        </Form.Item>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Form>

            {/* BOTONES DE ACCIÓN */}
            <Row className="m-12 flex justify-center gap-4">
                <Col>
                    <Link href="/">
                        <Button icon={<ArrowLeftOutlined />} size="large" style={{ minWidth: '150px' }}>Volver</Button>
                    </Link>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSaveData}
                        style={{ minWidth: '180px' }}
                        disabled={!currentPatient}
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        {currentPatient ? "Guardar Valoración" : "Seleccione Paciente"}
                    </Button>
                </Col>
            </Row>

            <style jsx global>{`
                .ant-card-head-title { font-weight: 600 !important; }
                .ant-form-item-label label { font-size: 11px !important; font-weight: 600; text-transform: uppercase; color: #64748b; }
            `}</style>
        </div>
    );
};

export default ClinicalAssessment;