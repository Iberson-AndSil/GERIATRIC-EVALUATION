'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Card, Button, Radio, Checkbox, Row, Col, notification } from 'antd';
import { FormValues } from "../interfaces";
import Title from 'antd/es/typography/Title';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { actualizarResultado } from '../lib/pacienteService';

const NutritionalAssessment: React.FC = () => {
    const [form] = Form.useForm<FormValues>();
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const { currentPatient, currentResultId } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();

    const allValues = Form.useWatch([], form);

    const calculateScore = useCallback((values: FormValues): number => {
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
    }, []);

    useEffect(() => {
        const { weight, height, brachialPerimeter, calfPerimeter } = form.getFieldsValue();

        // Cálculo IMC y Q1
        if (weight && height) {
            const heightInMeters = Number(height) / 100;
            if (heightInMeters > 0) {
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
        }

        if (brachialPerimeter) {
            let q2Score = 0;
            if (brachialPerimeter < 21.5) q2Score = 0;
            else if (brachialPerimeter >= 21.5 && brachialPerimeter < 22) q2Score = 0.5;
            else if (brachialPerimeter >= 22) q2Score = 1.0;
            form.setFieldsValue({ q2: q2Score });
        }

        if (calfPerimeter) {
            let q3Score = (calfPerimeter < 31) ? 0 : 1;
            form.setFieldsValue({ q3: q3Score });
        }
    }, [allValues?.weight, allValues?.height, allValues?.brachialPerimeter, allValues?.calfPerimeter, form]);

    useEffect(() => {
        if (allValues) {
            const score = calculateScore(allValues);
            setTotalScore(score);
        }
    }, [allValues, calculateScore]);

    const getInterpretation = (score: number): string => {
        if (score >= 24) return 'BIEN NUTRIDO';
        if (score >= 17) return 'RIESGO DE DESNUTRICIÓN';
        return 'DESNUTRIDO';
    };

    const handleSaveData = async () => {
        try {
            setLoading(true);
            if (!currentPatient?.dni) throw new Error("No se ha seleccionado un paciente");

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'nutricional',
                totalScore
            );

            api.success({
                message: 'Éxito',
                description: 'Resultados guardados correctamente',
                placement: 'topRight'
            });

            router.push('/clinic');
        } catch (err: any) {
            console.error("Error al guardar:", err);
            alert(`Error al guardar: ${err.message || "Verifique la consola"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', margin: '0 auto' }}>
            {contextHolder}
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#1890ff', fontWeight: 500 }}>
                VALORACIÓN NUTRICIONAL - VNA - MINSA
            </Title>

            <Form form={form} layout="vertical">
                <Card title="Datos del Paciente" className="shadow-lg rounded-2xl mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <Form.Item name="weight" label="Peso (kg)" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="height" label="Talla (cm)" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="imc" label="IMC">
                            <Input type="number" readOnly className="bg-gray-50" />
                        </Form.Item>
                        <Form.Item name="brachialPerimeter" label="Perímetro braquial" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="calfPerimeter" label="Perímetro pantorrilla" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="abdominalPerimeter" label="Perímetro abdominal" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="heelKneeHeight" label="Altura talón-rodilla" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="biaFat" label="BIA (% grasa)" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="muscleMass" label="Masa muscular (kg)" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                    </div>
                </Card>

                <div className='grid md:grid-cols-2 gap-4 mt-5'>
                    <div className='flex flex-col gap-4'>
                        <Card title="1. Índices antropométricos" className='shadow-lg'>
                            <Form.Item name="q1" label="1. Índice de masa corporal (Calculado)">
                                <Radio.Group disabled>
                                    <Radio value={0}>IMC &lt; 19</Radio>
                                    <Radio value={1}>IMC 19 &lt; 21</Radio>
                                    <Radio value={2}>IMC 21 {'<='} 23</Radio>
                                    <Radio value={3}>IMC &gt; 23</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="q2" label="2. Perímetro braquial (Calculado)">
                                <Radio.Group disabled>
                                    <Radio value={0}>&lt; 21,5</Radio>
                                    <Radio value={0.5}>21,5 &lt; 22</Radio>
                                    <Radio value={1.0}>&ge; 22</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="q3" label="3. Perímetro de pantorrilla (Calculado)">
                                <Radio.Group disabled>
                                    <Radio value={0}>&lt; 31</Radio>
                                    <Radio value={1}>&ge; 31</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="q4" label="4. Pérdida reciente de peso" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>&gt; 3kg</Radio>
                                    <Radio value={1}>no sabe</Radio>
                                    <Radio value={2}>1 a 3 kg</Radio>
                                    <Radio value={3}>no perdió peso</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                        <Card title="3. Parámetros dietéticos" className='shadow-lg'>
                            <Form.Item name="q11" label="11. Comidas completas al día" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>1 comida</Radio>
                                    <Radio value={1}>2 comidas</Radio>
                                    <Radio value={2}>3 comidas</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="12. Consumo de proteínas">
                                <Form.Item name="q12_dairy" valuePropName="checked" noStyle><Checkbox>Lácteos/día</Checkbox></Form.Item><br />
                                <Form.Item name="q12_eggs" valuePropName="checked" noStyle><Checkbox>Huevos/Legumbres 2+ sem</Checkbox></Form.Item><br />
                                <Form.Item name="q12_meat" valuePropName="checked" noStyle><Checkbox>Carne/Pescado diario</Checkbox></Form.Item>
                            </Form.Item>

                            <Form.Item name="q13" label="13. Frutas/Verduras 2+ al día" rules={[{ required: true }]}>
                                <Radio.Group><Radio value={0}>NO</Radio><Radio value={1}>SI</Radio></Radio.Group>
                            </Form.Item>
                            <Form.Item name="q14" label="14. Pérdida apetito/masticación" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>Severa</Radio>
                                    <Radio value={1}>Moderada</Radio>
                                    <Radio value={2}>Sin pérdida</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="q15" label="15. Líquidos al día" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0.0}>&lt; 3 vasos</Radio>
                                    <Radio value={0.5}>3-5 vasos</Radio>
                                    <Radio value={1.0}>&gt; 5 vasos</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="q16" label="16. Forma de alimentarse" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>Ayuda</Radio>
                                    <Radio value={1}>Solo con dificultad</Radio>
                                    <Radio value={2}>Sin dificultad</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Card>

                    </div>
                    <div className="flex flex-col gap-4">
                        <Card title="2. Evaluación global" className='shadow-lg'>
                            <Form.Item name="q5" label="5. ¿Vive independiente?" rules={[{ required: true }]}>
                                <Radio.Group><Radio value={1}>Sí</Radio><Radio value={0}>No</Radio></Radio.Group>
                            </Form.Item>
                            <Form.Item name="q6" label="6. ¿Toma > 3 medicamentos/día?" rules={[{ required: true }]}>
                                <Radio.Group><Radio value={0}>Sí</Radio><Radio value={1}>No</Radio></Radio.Group>
                            </Form.Item>
                            <Form.Item name="q7" label="7. ¿Estrés o enf. aguda (3 meses)?" rules={[{ required: true }]}>
                                <Radio.Group><Radio value={0}>Sí</Radio><Radio value={1}>No</Radio></Radio.Group>
                            </Form.Item>
                            <Form.Item name="q8" label="8. Movilidad" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>Cama/Sillón</Radio>
                                    <Radio value={1}>Interior</Radio>
                                    <Radio value={2}>Exterior</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="q9" label="9. Prob. neuropsicológicos" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>Demencia/Depresión Severa</Radio>
                                    <Radio value={1}>Moderada</Radio>
                                    <Radio value={2}>Sin problemas</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="q10" label="10. Úlceras cutáneas" rules={[{ required: true }]}>
                                <Radio.Group><Radio value={0}>Sí</Radio><Radio value={1}>No</Radio></Radio.Group>
                            </Form.Item>
                        </Card>
                        <Card title="4. Valoración subjetiva" className='shadow-lg'>
                            <Form.Item name="q17" label="17. ¿Considera tener prob. nutricionales?" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>Malnutrición severa</Radio>
                                    <Radio value={1}>Dificultad/Moderada</Radio>
                                    <Radio value={2}>Sin problemas</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="q18" label="18. Estado de salud comparativo" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={0}>Peor</Radio>
                                    <Radio value={0.5}>No sabe</Radio>
                                    <Radio value={1}>Igual</Radio>
                                    <Radio value={2}>Mejor</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                        {totalScore !== null && (
                            <Card className='shadow-lg mt-8 border-blue-400 bg-blue-50'>
                                <Row gutter={16} align="middle" justify="center">
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '15px', margin: 0 }}>PUNTUACIÓN TOTAL</p>
                                        <Title level={1} style={{ margin: '10px 0', color: '#096dd9' }}>{totalScore}</Title>
                                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                            ESTADO: <span style={{ color: totalScore < 17 ? '#f5222d' : (totalScore < 24 ? '#faad14' : '#52c41a') }}>
                                                {getInterpretation(totalScore)}
                                            </span>
                                        </p>
                                    </Col>
                                </Row>
                            </Card>
                        )}
                    </div>
                </div>
            </Form>


            <Row className="m-12 flex justify-center gap-4">
                <Col>
                    <Link href="/nutritional">
                        <Button icon={<ArrowLeftOutlined />} size="large" style={{ minWidth: '150px' }}>Volver</Button>
                    </Link>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleSaveData}
                        style={{ minWidth: '150px' }}
                        disabled={!currentPatient || totalScore === null}
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        {currentPatient ? "Guardar Resultados" : "Seleccione Paciente"}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default NutritionalAssessment;