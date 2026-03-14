'use client';

import React, { useState } from 'react';
import { 
    Form, Input, Checkbox, Card, Row, Col, Typography, 
    Select, InputNumber, Space, Badge, Button, 
    Radio, notification, Empty, Tag
} from 'antd';
import { 
    FileSearchOutlined, 
    CheckSquareOutlined, 
    PlusOutlined,
    DeleteOutlined,
    HeartOutlined,
    HistoryOutlined,
    MedicineBoxFilled,
    SaveOutlined,
    ArrowLeftOutlined,
    IdcardOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { actualizarResultado } from '../lib/pacienteService';

const { Title, Text } = Typography;
const { Option } = Select;

const COMORBILIDADES_LIST = [
    "ANEMIA CRONICA",
    "ERC",
    "DIABETES MELLITUS",
    "HIPERTENSION ARTERIAL",
    "FIBRILACION AURICULAR",
    "INSUFICIENCIA CARDIACA (Clase Funcional III-IV y/o MRC)",
    "CARDIOPATIA ISQUEMICA",
    "VALVULPATIA CARDIACA",
    "EPOC (ASMA/BRONQUITIS)",
    "FIBROSIS PULMONAR",
    "ENF. PARKINSON",
    "DEMENCIA",
    "DELIRIO REPORTADO POR FAMILIARES EN DOMICILIO",
    "OSTEOPOROSIS",
    "OSTEOARTROSIS",
    "ARTRITIS REUMATOIDEA",
    "GASTROPATIA",
    "HEPATOPATIA",
    "TVP EN ACO",
    "INSUFICIENCIA VENOSA (DERMATITIS - ULCERA)",
    "HBP",
    "HIPOTIROIDISMO",
    "SECUELA ACV",
    "SECUELA FRACTURA",
    "CANCER REMITIDO",
    "COVID (RQ OXIGENO)"
];

const ErgonomicClinicAssessment: React.FC = () => {
    const [form] = Form.useForm();
    const { currentPatient, currentResultId } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

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
                'clinica', 
                score
            );

            api.success({
                message: 'Éxito',
                description: 'Valoración clínica guardada correctamente',
                placement: 'topRight'
            });

            router.push('/markers');
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
        <div className="ergonomic-container">
            {contextHolder}

            {/* HEADER LOCAL DE LA PÁGINA */}
            <div className="page-header">
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                    VALORACIÓN CLÍNICA Y COMORBILIDADES
                </Title>
                {currentPatient && (
                    <Space size="large" className="patient-banner">
                        <Text strong><IdcardOutlined /> {currentPatient.nombre}</Text>
                        <Text><CalendarOutlined /> {currentPatient.edad} años</Text>
                        <Tag color="cyan">{currentPatient.dni}</Tag>
                    </Space>
                )}
            </div>

            <Form 
                form={form} 
                layout="vertical" 
                initialValues={{ medicamentos: [{}], enfermedades_activas: [] }}
                className="main-form"
            >
                <div className="content-layout">
                    {/* COLUMNA 1: Medicación y Antecedentes */}
                    <div className="column column-left">
                        <Card 
                            title={<Space><MedicineBoxFilled /> Medicación</Space>}
                            extra={<Badge count={numMedicamentos} color={getPolifarmaciaColor()} />}
                            className="flex-column-card"
                            styles={{ body: { padding: '12px', overflowY: 'auto', flex: 1 } }}
                        >
                            <Form.List name="medicamentos">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <div key={key} className="item-row">
                                                <Form.Item {...restField} name={[name, 'nombre']} className="no-margin-item flex-1">
                                                    <Input placeholder="Producto / Dosis" />
                                                </Form.Item>
                                                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                                            </div>
                                        ))}
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} className="mt-2">
                                            Añadir Medicamento
                                        </Button>
                                    </>
                                )}
                            </Form.List>
                        </Card>

                        <Card 
                            title={<Space><HistoryOutlined /> Antecedentes</Space>}
                            className="mt-4"
                            styles={{ body: { padding: '12px' } }}
                        >
                            <Form.Item name="hospitalizaciones_anio" label="Hospitalizaciones (año)" className="no-margin-item">
                                <InputNumber min={0} className="w-full" placeholder="0" />
                            </Form.Item>
                        </Card>
                    </div>

                    {/* COLUMNA 2: Comorbilidades Grid */}
                    <div className="column column-center">
                        <Card 
                            title={<Space><CheckSquareOutlined /> Comorbilidades / Antecedentes</Space>}
                            className="flex-column-card"
                            styles={{ body: { padding: '12px', overflowY: 'auto', flex: 1 } }}
                        >
                            <Form.Item name="enfermedades_activas" noStyle>
                                <Checkbox.Group className="w-full">
                                    <div className="responsive-grid">
                                        {COMORBILIDADES_LIST.map(enf => (
                                            <div key={enf} className={`grid-item ${seleccionadas.includes(enf) ? 'active' : ''}`}>
                                                <Checkbox value={enf}>{enf}</Checkbox>
                                            </div>
                                        ))}
                                    </div>
                                </Checkbox.Group>
                            </Form.Item>
                        </Card>
                    </div>

                    {/* COLUMNA 3: Oncología y Detalles */}
                    <div className="column column-right">
                        <Card 
                            title={<Text strong style={{ color: '#cf1322' }}>VALORACIÓN ONCOLÓGICA</Text>} 
                            styles={{ header: { background: '#fff1f0', padding: '0 12px', minHeight: '40px' }, body: { padding: '12px' } }}
                            className="mb-4"
                        >
                            <Row gutter={[12, 12]}>
                                {[
                                    { name: 'cancer_tratamiento', label: "Tratamiento" },
                                    { name: 'cancer_metastasico', label: "Metastásico" },
                                    { name: 'cancer_recurrente', label: "Recurrente" },
                                    { name: 'cancer_reciente', label: "Dx Reciente" }
                                ].map((item) => (
                                    <Col span={12} key={item.name}>
                                        <Form.Item name={item.name} label={<small>{item.label}</small>} className="no-margin-item">
                                            <Radio.Group size="small" buttonStyle="solid" className="w-full flex">
                                                <Radio.Button value="SI" className="flex-1 text-center">SÍ</Radio.Button>
                                                <Radio.Button value="NO" className="flex-1 text-center">NO</Radio.Button>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                ))}
                            </Row>
                        </Card>

                        <Card 
                            title={<Space><FileSearchOutlined /> Detalles Específicos</Space>}
                            className="flex-column-card"
                            styles={{ body: { padding: 0, overflowY: 'auto', flex: 1 } }}
                        >
                            {seleccionadas.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Sin selecciones" />
                                </div>
                            ) : (
                                <table className="compact-table">
                                    <thead>
                                        <tr>
                                            <th>Condición</th>
                                            <th style={{ width: '70px' }}>Año</th>
                                            <th>Método / TTO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seleccionadas.map((enf: string) => (
                                            <tr key={enf}>
                                                <td><Text strong style={{ fontSize: '13px' }}>{enf}</Text></td>
                                                <td>
                                                    <Form.Item name={['detalles', enf, 'anio']} className="no-margin-item">
                                                        <InputNumber size="small" className="w-full" variant="borderless" />
                                                    </Form.Item>
                                                </td>
                                                <td>
                                                    <Form.Item name={['detalles', enf, 'metodo']} className="mb-1">
                                                        <Select size="small" variant="borderless" className="w-full" placeholder="M">
                                                            <Option value="CLINICO">Clínico</Option>
                                                            <Option value="IMAGEN">Imagen</Option>
                                                            <Option value="LAB">Lab</Option>
                                                            <Option value="BIOPSIA">Biopsia</Option>
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item name={['detalles', enf, 'tto']} className="no-margin-item">
                                                        <Input size="small" variant="borderless" className="w-full" placeholder="Tratamiento" prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />} />
                                                    </Form.Item>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </Card>
                    </div>
                </div>
            </Form>

            {/* FOOTER LOCAL (Encima del navbar si es necesario) */}
            <div className="action-footer">
                <Link href="/">
                    <Button icon={<ArrowLeftOutlined />} size="large">Volver</Button>
                </Link>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleSaveData}
                    disabled={!currentPatient}
                    loading={loading}
                    icon={<SaveOutlined />}
                    className="save-button"
                >
                    {currentPatient ? "Finalizar y Guardar Valoración" : "Seleccione Paciente"}
                </Button>
            </div>

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
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 16px;
                    flex-shrink: 0;
                }

                .patient-banner {
                    background: #f0f5ff;
                    padding: 4px 12px;
                    border-radius: 8px;
                    border: 1px solid #adc6ff;
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

                .column-left { flex: 0 0 260px; }
                .column-center { flex: 1; }
                .column-right { flex: 0 0 400px; }

                .flex-column-card {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex: 1;
                }

                .item-row {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                    background: #fbfbfb;
                    padding: 4px;
                    border-radius: 4px;
                }

                .responsive-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 8px;
                }

                .grid-item {
                    padding: 8px 12px;
                    background: #fff;
                    border: 1px solid #f0f0f0;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .grid-item:hover { border-color: #40a9ff; }
                .grid-item.active { background: #e6f7ff; border-color: #1890ff; }

                .compact-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .compact-table th {
                    position: sticky;
                    top: 0;
                    background: #fafafa;
                    padding: 8px 12px;
                    font-size: 11px;
                    text-transform: uppercase;
                    color: #8c8c8c;
                    border-bottom: 1px solid #f0f0f0;
                    z-index: 10;
                }
                .compact-table td {
                    padding: 8px 12px;
                    border-bottom: 1px solid #f0f0f0;
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
                
                /* Custom scrollbar */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; }
                ::-webkit-scrollbar-thumb { background: #d9d9d9; border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default ErgonomicClinicAssessment;