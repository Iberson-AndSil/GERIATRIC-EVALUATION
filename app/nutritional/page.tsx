'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Card, Button, Radio, Checkbox, Row, Col, notification } from 'antd';
import { FormValues } from "../interfaces";
import Title from 'antd/es/typography/Title';
import { useGlobalContext } from '../context/GlobalContext';
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { actualizarResultado } from '../lib/pacienteService';

const NutritionalAssessment: React.FC = () => {
    const [form] = Form.useForm<FormValues>();
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const { currentPatient, currentResultId } = useGlobalContext();
    const weight = Form.useWatch('weight', form);
    const height = Form.useWatch('height', form);
    const brachialPerimeter = Form.useWatch('brachialPerimeter', form);
    const calfPerimeter = Form.useWatch('calfPerimeter', form);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (weight && height) {
            const heightInMeters = Number(height) / 100;
            if (heightInMeters === 0) return;
            const imc = Number(weight) / (heightInMeters * heightInMeters);

            let q1Score = 0;
            if (imc < 19) q1Score = 0;
            else if (imc >= 19 && imc < 21) q1Score = 1;
            else if (imc >= 21 && imc <= 23) q1Score = 2;
            else if (imc > 23) q1Score = 3;

            form.setFieldsValue({
                imc: parseFloat(imc.toFixed(2)),
                q1: q1Score,
            });
        }
    }, [form, weight, height]);

    useEffect(() => {
        if (brachialPerimeter) {
            let q2Score = 0;
            if (brachialPerimeter < 21.5) q2Score = 0;
            else if (brachialPerimeter >= 21.5 && brachialPerimeter < 22) q2Score = 0.5;
            else if (brachialPerimeter >= 22) q2Score = 1.0;

            form.setFieldsValue({ q2: q2Score });
        }
    }, [form, brachialPerimeter]);

    useEffect(() => {
        if (calfPerimeter) {
            let q3Score = 0;
            if (calfPerimeter < 31) q3Score = 0;
            else if (calfPerimeter >= 31) q3Score = 1;

            form.setFieldsValue({ q3: q3Score });
        }
    }, [form, calfPerimeter]);

    const onFinish = (values: FormValues) => {
        const score = calculateScore(values);
        setTotalScore(score);
    };

    const calculateScore = (values: FormValues): number => {
        let score = 0;

        score += values.q1 ?? 0;
        score += values.q2 ?? 0;
        score += values.q3 ?? 0;
        score += values.q4 ?? 0;

        score += (values.q5 === 0) ? 0 : 1;
        score += (values.q6 === 0) ? 0 : 1;
        score += (values.q7 === 0) ? 0 : 1;
        score += values.q8 ?? 0;
        score += values.q9 ?? 0;
        score += (values.q10 === 0) ? 0 : 1;

        score += values.q11 ?? 0;

        const productCount = [values.q12_dairy, values.q12_eggs, values.q12_meat].filter(Boolean).length;
        if (productCount === 2) score += 0.5;
        else if (productCount === 3) score += 1.0;

        score += values.q13 ?? 0;
        score += values.q14 ?? 0;
        score += values.q15 ?? 0;
        score += values.q16 ?? 0;

        score += values.q17 ?? 0;
        score += values.q18 ?? 0;

        return score;
    };

    const getInterpretation = (score: number): string => {
        if (score >= 24) return 'BIEN NUTRIDO';
        if (score >= 17) return 'RIESGO DE DESNUTRICIÓN';
        return 'DESNUTRIDO';
    };

    const handleSaveData = async () => {
        try {
            setLoading(true);

            if (!currentPatient?.dni) {
                throw new Error("No se ha seleccionado un paciente");
            }

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'nutricional',
                totalScore
            );

            api.success({
                message: 'Éxito',
                description: 'Resultados de ABVD y AIVD guardados correctamente',
                placement: 'topRight'
            });


            router.push('/');

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error detallado:", err);
                alert(`Error al guardar: ${err.message}`);
            } else {
                console.error("Error desconocido:", err);
                alert("Error al guardar: Verifique la consola para más detalles");
            }
        }
    };

    return (
        <div style={{ padding: '24px', margin: '0 auto' }}>
            {contextHolder}
            <Title
                level={3}
                style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#1890ff',
                    fontWeight: 500
                }}
            >
                VALORACIÓN NUTRICIONAL
            </Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Card title="Datos del Paciente" style={{ marginBottom: '24px' }} className='shadow-lg'>
                    <div className='grid md:grid-cols-3 gap-3'>
                        <Form.Item name="weight" label="Peso (kg)" rules={[{ required: true, message: 'Ingrese el peso' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="height" label="Talla (cm)" rules={[{ required: true, message: 'Ingrese la talla' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="imc" label="IMC">
                            <Input type="number" readOnly />
                        </Form.Item>
                        <Form.Item name="brachialPerimeter" label="Perímetro braquial (cm)" rules={[{ required: true, message: 'Ingrese el perímetro braquial' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="calfPerimeter" label="Perímetro pantorrilla (cm)" rules={[{ required: true, message: 'Ingrese el perímetro de pantorrilla' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="abdominalPerimeter" label="Perímetro abdominal (cm)" rules={[{ required: true, message: 'Ingrese el perímetro abdominal' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="heelKneeHeight" label="Altura talón rodilla (cm)" rules={[{ required: true, message: 'Ingrese la altura talón rodilla' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="biaFat" label="BIA (%grasa)" rules={[{ required: true, message: 'Ingrese el % de grasa' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="muscleMass" label="Masa muscular (kg)" rules={[{ required: true, message: 'Ingrese la masa muscular' }]}>
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </Card>

                <Title
                    level={3}
                    style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        color: '#1890ff',
                        fontWeight: 500
                    }}
                >
                    Test VNA - MINSA
                </Title>

                <div className='grid md:grid-cols-2 gap-4'>
                    <Card title="1. Índices antropométricos" className='shadow-lg'>
                        <Form.Item name="q1" label="1. Índice de masa corporal" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>IMC &lt; 19</Radio>
                                <Radio value={1}>IMC 19 &lt; 21</Radio>
                                <Radio value={2}>IMC 21 {'<='} 23</Radio>
                                <Radio value={3}>IMC &gt; 23</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q2" label="2. Perímetro braquial" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>&lt; 21,5</Radio>
                                <Radio value={0.5}>21,5 &lt; 22</Radio>
                                <Radio value={1.0}>&ge; 22</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q3" label="3. Perímetro de pantorrilla (cm)" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>&lt; 31</Radio>
                                <Radio value={1}>&ge; 31</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q4" label="4. Pérdida reciente de peso (últimos 3 meses)" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>&gt; 3kg</Radio>
                                <Radio value={1}>no sabe</Radio>
                                <Radio value={2}>1 a 3 kg</Radio>
                                <Radio value={3}>no perdió peso</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Card>

                    <Card title="2. Evaluación global" className='shadow-lg'>
                        <Form.Item name="q5" label="5. ¿Paciente vive independiente en su domicilio?" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={1}>Sí</Radio>
                                <Radio value={0}>No</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q6" label="6. ¿Toma más de tres medicamentos por día?" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>Sí</Radio>
                                <Radio value={1}>No</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q7" label="7. ¿Presentó alguna enfermedad aguda o situación de estrés psicológico en los últimos 3 meses?" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>Sí</Radio>
                                <Radio value={1}>No</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q8" label="8. Movilidad" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>de la cama al sillón</Radio>
                                <Radio value={1}>autonomía en el interior</Radio>
                                <Radio value={2}>sale de su domicilio</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q9" label="9. Problemas neuropsicológicos" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>demencia o depresión severa</Radio>
                                <Radio value={1}>demencia o depresión moderada</Radio>
                                <Radio value={2}>sin problemas psicológicos</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q10" label="10. Úlceras o lesiones cutáneas" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>Sí</Radio>
                                <Radio value={1}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Card>

                    <Card title="3. Parámetros dietéticos" className='shadow-lg'>
                        <Form.Item name="q11" label="11. Número de comidas completas que consume al día (equivalente a dos platos y postre)." rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>1 comida</Radio>
                                <Radio value={1}>2 comidas</Radio>
                                <Radio value={2}>3 comidas</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="12. Consume lácteos, carnes, huevos y legumbres" >
                            <p>Califica: Si 0 o 1 califica = 0.0, Si 2 califica = 0.5, Si 3 califica = 1.0</p>
                            <Form.Item name="q12_dairy" valuePropName="checked" noStyle>
                                <Checkbox>Productos lácteos al menos una vez al día</Checkbox>
                            </Form.Item>
                            <br />
                            <Form.Item name="q12_eggs" valuePropName="checked" noStyle>
                                <Checkbox>Huevos/legumbres dos a más veces/semana</Checkbox>
                            </Form.Item>
                            <br />
                            <Form.Item name="q12_meat" valuePropName="checked" noStyle>
                                <Checkbox>Carne, pescado o aves diariamente</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item name="q13" label="13. Consume frutas y verduras al menos dos veces por día" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>NO</Radio>
                                <Radio value={1}>SI</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q14" label="14. ¿Ha comido menos: por pérdida de apetito, problemas digestivos, dificultades para de deglutir o masticar en los últimos 3 meses?" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>pérdida severa del apetito</Radio>
                                <Radio value={1}>pérdida moderada del apetito</Radio>
                                <Radio value={2}>Sin pérdida del apetito</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q15" label="15. Consumo de agua u otros liquidos al dia" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0.0}>&lt; de 3 vasos</Radio>
                                <Radio value={0.5}>de 3 a 5 vasos</Radio>
                                <Radio value={1.0}>más de 5 vasos</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q16" label="16. forma de alimentarse" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>necesita ayuda</Radio>
                                <Radio value={1}>se alimenta solo con dificultad</Radio>
                                <Radio value={2}>se alimenta sin dificultad</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Card>

                    <Card title="4. Valoración subjetiva" className='shadow-lg'>
                        <Form.Item name="q17" label="17. El paciente considera que tiene problemas nutricionales" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0}>malnutrición severa</Radio>
                                <Radio value={1}>se alimenta solo con dificultad</Radio>
                                <Radio value={2}>sin problemas de nutrición moderada</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item name="q18" label="18. En comparación con personas de su edad, ¿cómo se encuentra su estado de salud?" rules={[{ required: true, message: 'Seleccione una opción' }]}>
                            <Radio.Group>
                                <Radio value={0.0}>peor</Radio>
                                <Radio value={0.5}>no lo sabe</Radio>
                                <Radio value={1.0}>igual</Radio>
                                <Radio value={2.0}>mejor</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Card>
                </div>

                <Form.Item>
                    <Button className='!my-5' type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Calcular Puntuación
                    </Button>
                </Form.Item>
            </Form>

            {totalScore !== null && (
                <Card title="Resultados" className='shadow-lg'>
                    <p>Puntuación Total: <strong>{totalScore}</strong></p>
                    <p>Interpretación: <strong>{getInterpretation(totalScore)}</strong></p>
                </Card>
            )}

            <Row key="actions" className="m-12 flex justify-center">
                <Col>
                    <Link href="/nutritional" passHref>
                        <Button
                            type="default"
                            icon={<ArrowLeftOutlined />}
                            size="large"
                            style={{ minWidth: '120px' }}
                        >
                            Volver
                        </Button>
                    </Link>
                </Col>
                <Col>
                    <Button className="!ml-3"
                        type="primary"
                        size="large"
                        onClick={handleSaveData}
                        style={{ minWidth: '120px' }}
                        disabled={!currentPatient}
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        {currentPatient ? "Guardar Paciente" : "Seleccione archivo primero"}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default NutritionalAssessment;