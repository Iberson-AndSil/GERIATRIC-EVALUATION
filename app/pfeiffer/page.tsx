"use client";
import React, { useState } from "react";
import {
    Form, Button, Card, Row, Col, Typography, Radio, notification, Divider, Tag, Progress
} from "antd";
import {
    ArrowLeftOutlined, SaveOutlined, FileTextOutlined,
    CheckCircleOutlined, CloseCircleOutlined
} from "@ant-design/icons";
import { useGlobalContext } from "../context/GlobalContext";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { actualizarResultado, crearRegistroResultados } from "../lib/pacienteService";

const { Title, Text } = Typography;

const PFEIFFER_QUESTIONS = [
    { key: "q1", text: "¿Qué día es hoy? (Día – Mes – Año)" },
    { key: "q2", text: "¿Qué día de la semana es hoy?" },
    { key: "q3", text: "¿Dónde estamos ahora?" },
    { key: "q4", text: "¿Cuál es el número de su teléfono o cuál es su dirección?" },
    { key: "q5", text: "¿Cuántos años tiene?" },
    { key: "q6", text: "¿Cuál es su fecha de nacimiento? (Día – Mes – Año)" },
    { key: "q7", text: "¿Quién es ahora el presidente del Gobierno?" },
    { key: "q8", text: "¿Quién fue el anterior presidente del Gobierno?" },
    { key: "q9", text: "¿Cuáles son los dos apellidos de su madre?" },
    { key: "q10", text: "Restar de 3 en 3 al número 20 hasta llegar a 0" },
];

const PfeifferForm = () => {
    const router = useRouter();
    const { currentPatient, currentResultId, setCurrentResultId } = useGlobalContext();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    // States for calculating the result
    const [totalErrors, setTotalErrors] = useState(0);
    const [adjustedErrors, setAdjustedErrors] = useState(0);
    const [interpretation, setInterpretation] = useState("Pendiente de evaluación");

    const handleValuesChange = (_: any, allValues: any) => {
        let errors = 0;
        PFEIFFER_QUESTIONS.forEach(q => {
            if (allValues[q.key] === false) {
                errors += 1;
            }
        });

        // Adjustment based on education
        let adjErrors = errors;
        const education = currentPatient?.nivel_educativo?.[0]; // ["secundaria", "1"]

        if (education === 'sin_nivel') {
            adjErrors = Math.max(0, errors - 1); // Permite +1 error
        } else if (education === 'universitaria' || education === 'postgrado') {
            adjErrors = errors + 1; // Permite -1 error
        }

        setTotalErrors(errors);
        setAdjustedErrors(adjErrors);

        if (adjErrors <= 2) {
            setInterpretation("Normal");
        } else if (adjErrors <= 4) {
            setInterpretation("Leve deterioro cognitivo");
        } else if (adjErrors <= 7) {
            setInterpretation("Moderado deterioro cognitivo (patológico)");
        } else {
            setInterpretation("Importante deterioro cognitivo");
        }
    };

    const handleSaveData = async () => {
        try {
            setLoading(true);
            if (!currentPatient) throw new Error("Seleccione un paciente primero");

            let resId = currentResultId;
            if (!resId) {
                resId = await crearRegistroResultados(currentPatient.dni, { pfeiffer: adjustedErrors });
                setCurrentResultId(resId);
            } else {
                await actualizarResultado(
                    currentPatient.dni,
                    resId,
                    'pfeiffer',
                    String(adjustedErrors)
                );
            }

            api.success({
                message: 'Éxito',
                description: 'Resultados de PFEIFFER guardados correctamente',
                placement: 'topRight'
            });

            router.push('/affective');
        } catch (err: any) {
            api.error({
                message: 'Error al guardar',
                description: err.message || "Verifique la conexión"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-4 md:pt-0">
            {contextHolder}

            <div className="text-center mb-6">
                <Title level={2} style={{ color: '#0050b3', margin: 0 }}>
                    <FileTextOutlined className="mr-2" />
                    Cuestionario de Pfeiffer
                </Title>
                <Text type="secondary" className="text-2xl">Short Portable Mental Status Questionnaire (SPMSQ)</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Card
                            title={<span className="text-blue-600">PREGUNTAS DEL CUESTIONARIO</span>}
                            className="shadow-sm rounded-xl border-t-4 border-t-blue-500 !mb-4"
                            bodyStyle={{ padding: '16px 24px' }}
                        >
                            <Row gutter={[24, 16]}>
                                {PFEIFFER_QUESTIONS.map((item, index) => (
                                    <Col xs={24} md={12} xl={8} key={item.key}>
                                        <div className="flex flex-col border p-3 !pb-0 rounded-lg bg-white h-full justify-between">
                                            <Text className="text-sm font-medium mb-3">
                                                {index + 1}. {item.text}
                                            </Text>
                                            <Form.Item name={item.key} className="mb-0 w-full mt-auto">
                                                <Radio.Group size="middle" buttonStyle="solid" className="flex w-full">
                                                    <Radio.Button value={true} className="flex-1 text-center">
                                                        <CheckCircleOutlined className={form.getFieldValue(item.key) === true ? "" : "text-green-500"} /> Correcto
                                                    </Radio.Button>
                                                    <Radio.Button value={false} className="flex-1 text-center">
                                                        <CloseCircleOutlined className={form.getFieldValue(item.key) === false ? "" : "text-red-500"} /> Incorrecto
                                                    </Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>

                    <Col xs={24}>
                        <Card
                            className="shadow-sm rounded-xl border border-blue-100 bg-gray-50/50"
                            bodyStyle={{ padding: '20px 24px' }}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex flex-col items-center md:items-start w-full md:w-1/3 text-center md:text-left">
                                    <Title level={5} className="m-0 text-blue-700 uppercase tracking-wide">
                                        Resultado Final
                                    </Title>
                                    <div className="text-gray-500 text-sm mt-1">
                                        Errores Iniciales: <span className="font-bold text-gray-700">{totalErrors}</span>
                                    </div>
                                    {currentPatient?.nivel_educativo?.[0] && (
                                        <div className="mt-2 text-xs text-blue-600 font-medium bg-blue-100/50 px-2 py-1 rounded inline-block">
                                            Ajuste: {currentPatient.nivel_educativo[0] === 'sin_nivel' ? '-1 (Sin Nivel/Inicial)' :
                                            (currentPatient.nivel_educativo[0] === 'universitaria' || currentPatient.nivel_educativo[0] === 'postgrado') ? '+1 (Educ. Superior)' :
                                            'Sin Ajuste (Ed. Media)'}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full md:w-2/5 flex flex-col items-center">
                                    <div className="text-3xl font-bold text-gray-800 mb-1">
                                        {adjustedErrors} <span className="text-lg text-gray-400 font-normal">Errores</span>
                                    </div>
                                    <Progress
                                        percent={Math.min((adjustedErrors / 10) * 100, 100)}
                                        showInfo={false}
                                        strokeColor={
                                            adjustedErrors <= 2 ? "#52c41a" :
                                            adjustedErrors <= 4 ? "#faad14" :
                                            adjustedErrors <= 7 ? "#ff4d4f" : "#820014"
                                        }
                                        strokeWidth={14}
                                        className="w-full"
                                    />
                                </div>

                                <div className="w-full md:w-1/4 flex justify-center md:justify-end">
                                    <Tag
                                        color={
                                            adjustedErrors <= 2 ? "green" :
                                            adjustedErrors <= 4 ? "orange" :
                                            adjustedErrors <= 7 ? "red" : "purple"
                                        }
                                        className="uppercase font-bold !m-0 !text-sm px-4 py-2 text-center rounded-lg shadow-sm border-0"
                                        style={{ whiteSpace: 'normal', height: 'auto' }}
                                    >
                                        {interpretation}
                                    </Tag>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <div className="flex justify-center gap-4 mt-8 pb-12">
                    <Link href="/moca">
                        <Button size="large" icon={<ArrowLeftOutlined />}>Atrás</Button>
                    </Link>
                    <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        onClick={handleSaveData}
                        loading={loading}
                        disabled={!currentPatient}
                        className="bg-blue-600 min-w-[180px]"
                    >
                        {currentPatient ? "Guardar y Continuar" : "Seleccione Paciente"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default PfeifferForm;
