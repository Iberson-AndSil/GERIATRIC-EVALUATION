"use client";
import React, { useState } from 'react';
import { Steps, Form, InputNumber, Button, Card, Row, Col, Typography, Result, Radio, Space, Tag, notification } from 'antd';
import { UserOutlined, ClockCircleOutlined, ArrowUpOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useGlobalContext } from '../context/GlobalContext';
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';
import { actualizarResultado } from '../lib/pacienteService';
const { Step } = Steps;
const { Title, Text } = Typography;

const SPPBEvaluation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();
    const [form] = Form.useForm();
    const [totalScore, setTotalScore] = useState(0);
    const [evaluationCompleted, setEvaluationCompleted] = useState(false);
    const [tandemScore, setTandemScore] = useState(0);
    const [chairStandScore, setChairStandScore] = useState(0);
    const [walkScore, setWalkScore] = useState(0);
    const { currentPatient, currentResultId } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [firstMeasure, setFirstMeasure] = useState<number | null>(null);
    const [secondMeasure, setSecondMeasure] = useState<number | null>(null);
    const [averageScore, setAverageScore] = useState<number | null>(null);
    const [strengthCategory, setStrengthCategory] = useState<string>('');
    const [api, contextHolder] = notification.useNotification();

    const steps = [
        {
            title: 'Prueba de Balance',
            icon: <UserOutlined />,
        },
        {
            title: 'Levantarse de la Silla',
            icon: <ArrowUpOutlined />,
        },
        {
            title: 'Velocidad de la Marcha',
            icon: <ClockCircleOutlined />,
        },
        {
            title: 'Resultados',
        },
    ];

    const calculateChairStandScore = (time: any) => {
        if (time <= 11.19) return 4;
        if (time <= 13.69) return 3;
        if (time <= 16.69) return 2;
        if (time <= 60) return 1;
        return 0;
    };

    const calculateWalkScore = (time: any) => {
        if (time > 13.04) return 1;
        if (time >= 9.32) return 2;
        if (time >= 7.24) return 3;
        if (time < 7.24) return 4;
        return 0;
    };

    const calculateResults = (first: number | null, second: number | null) => {
        if (first !== null && second !== null) {
            const avg = (first + second) / 2;
            setAverageScore(avg);

            if (avg >= 40) setStrengthCategory('Excelente');
            else if (avg >= 30) setStrengthCategory('Buena');
            else if (avg >= 20) setStrengthCategory('Normal');
            else setStrengthCategory('Baja');

        } else {
            setAverageScore(null);
            setStrengthCategory('');
        }
    };

    const onFinish = (values: any) => {
        let score = 0;
        if (values.parallelPosition) score += 1;
        if (values.semiTandemPosition) score += 1;
        score += tandemScore;
        score += chairStandScore;
        score += walkScore;

        if (values.standUpTest === 'able') {
            if (values.fiveRepsTime < 8.7) score += 4;
            else if (values.fiveRepsTime < 11.4) score += 3;
            else if (values.fiveRepsTime < 13.6) score += 2;
            else if (values.fiveRepsTime < 16.7) score += 1;
        }


        setTotalScore(score);
        setEvaluationCompleted(true);
        setCurrentStep(3);
    };

    const saveFile = async () => {
        try {

            setLoading(true);

            if (!currentPatient?.dni) {
                throw new Error("No se ha seleccionado un paciente");
            }

            const dynamometry = averageScore!.toString();
            const Balance = totalScore.toString();

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'dynamometry',
                dynamometry
            );

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'Balance',
                Balance
            );

            setAverageScore(0);
            setTotalScore(0);

            api.success({
                message: 'Éxito',
                description: 'Resultados de ABVD y AIVD guardados correctamente',
                placement: 'topRight'
            });


            router.push('/mental');

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

    const calculateTandemScore = (time: any) => {
        if (time >= 10) return 2;
        if (time >= 3) return 1;
        return 0;
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStepContent = (step: any) => {
        switch (step) {
            case 0:
                return (
                    <Card title="Prueba de Balance" className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
                        <Form.Item
                            name="parallelPosition"
                            label="Posición paralela (pies juntos por 10 segundos)"
                        >
                            <Radio.Group>
                                <Radio value={1}>Completado (1 punto)</Radio>
                                <Radio value={0}>No completado (0 puntos)</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="semiTandemPosition"
                            label="Posición semi-tandem (talón de un pie al lado del dedo del otro pie por 10 segundos)"
                        >
                            <Radio.Group>
                                <Radio value={1}>Completado (1 punto)</Radio>
                                <Radio value={0}>No completado (0 puntos)</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="tandemPositionTime"
                            label="Posición tandem (talón directamente frente a dedos del otro pie)"
                            className="w-full"
                        >
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <InputNumber
                                        min={0}
                                        max={30}
                                        step={0.1}
                                        addonAfter="segundos"
                                        style={{ width: '100%' }}
                                        onChange={(value) => {
                                            setTandemScore(calculateTandemScore(value));
                                        }}
                                    />
                                    <Text type="secondary">
                                        ≥10 seg: 2 puntos | 3-9.99 seg: 1 punto | {'<'}3 seg: 0 puntos
                                    </Text>
                                </div>
                                <div className="w-1/2 p-2 text-center">
                                    <Text strong>Puntaje calculado: </Text>
                                    <Tag color={tandemScore === 2 ? 'green' : tandemScore === 1 ? 'orange' : 'red'}>
                                        {tandemScore} punto{tandemScore !== 1 ? 's' : ''}
                                    </Tag>
                                </div>
                            </div>
                        </Form.Item>

                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.parallelPosition !== currentValues.parallelPosition ||
                                prevValues.semiTandemPosition !== currentValues.semiTandemPosition
                            }
                        >
                            {({ getFieldValue }) => {
                                const parallelScore = getFieldValue('parallelPosition') || 0;
                                const semiTandemScore = getFieldValue('semiTandemPosition') || 0;
                                const totalBalanceScore = parallelScore + semiTandemScore + tandemScore;

                                return (
                                    <div style={{ marginTop: 16, padding: '8px 16px', background: '#f6f6f6', borderRadius: 4 }}>
                                        <Text strong>Puntaje total de Balance: </Text>
                                        <Tag color={totalBalanceScore >= 3 ? 'green' : totalBalanceScore >= 1 ? 'orange' : 'red'}>
                                            {totalBalanceScore}/4 puntos
                                        </Tag>
                                    </div>
                                );
                            }}
                        </Form.Item>
                    </Card>
                );
            case 1:
                return (
                    <Card title="Prueba de Levantarse de la Silla" className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
                        <Form.Item
                            name="standUpTest"
                            label="¿Puede el paciente levantarse una vez sin usar los brazos?"
                        >
                            <Radio.Group onChange={() => setChairStandScore(0)}>
                                <Radio value="able">Si pudo (continuar prueba)</Radio>
                                <Radio value="unable">No pudo (0 puntos en esta sección)</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, currentValues) =>
                                prevValues.standUpTest !== currentValues.standUpTest ||
                                prevValues.fiveRepsTime !== currentValues.fiveRepsTime
                            }
                        >
                            {({ getFieldValue }) => {
                                const standUpTest = getFieldValue('standUpTest');
                                const fiveRepsTime = getFieldValue('fiveRepsTime');

                                if (standUpTest === 'able' && fiveRepsTime) {
                                    setChairStandScore(calculateChairStandScore(fiveRepsTime));
                                } else if (standUpTest === 'unable') {
                                    setChairStandScore(0);
                                }

                                return (
                                    <>
                                        {standUpTest === 'able' && (
                                            <Form.Item
                                                name="fiveRepsTime"
                                                label="Tiempo para 5 repeticiones de levantarse (segundos)"
                                                rules={[{ required: true, message: 'Por favor ingrese el tiempo' }]}
                                            >
                                                <div className="flex gap-4">
                                                    <div className="w-1/2">
                                                        <InputNumber
                                                            min={0}
                                                            step={0.1}
                                                            addonAfter="segundos"
                                                            style={{ width: '100%' }}
                                                            onChange={(value) => {
                                                                setChairStandScore(calculateChairStandScore(value));
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="w-1/2 p-2 text-center">
                                                        <Text strong>Puntaje calculado: </Text>
                                                        <Tag color={
                                                            chairStandScore === 4 ? 'green' :
                                                                chairStandScore === 3 ? 'blue' :
                                                                    chairStandScore === 2 ? 'orange' :
                                                                        chairStandScore === 1 ? 'gold' : 'red'
                                                        }>
                                                            {chairStandScore} puntos
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </Form.Item>
                                        )}
                                        <div style={{ marginTop: 16, padding: '8px 16px', background: '#f6f6f6', borderRadius: 4 }}>
                                            <Text type="secondary">Criterios:</Text>
                                            <ul style={{ marginTop: 4, marginBottom: 0 }}>
                                                <li>≤11.19 seg: 4 puntos</li>
                                                <li>11.20-13.69 seg: 3 puntos</li>
                                                <li>13.70-16.69 seg: 2 puntos</li>
                                                <li>16.7-60 seg: 1 punto</li>
                                                <li>{'>'}60 seg o no puede: 0 puntos</li>
                                            </ul>
                                        </div>
                                    </>
                                );
                            }}
                        </Form.Item>
                    </Card>
                );
            case 2:
                return (
                    <Card title="Prueba de Velocidad de la Marcha" className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
                        <Form.Item
                            name="walkTime"
                            label="Tiempo para caminar 4 metros (segundos)"
                            rules={[{ required: true, message: 'Por favor ingrese el tiempo' }]}
                        >
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <InputNumber
                                        min={0}
                                        step={0.1}
                                        addonAfter="segundos"
                                        style={{ width: '100%' }}
                                        onChange={(value) => {
                                            setWalkScore(calculateWalkScore(value));
                                        }}
                                    />
                                </div>
                                <div className="w-1/2 p-2 text-center">
                                    <Text strong>Puntaje calculado: </Text>
                                    <Tag color={
                                        walkScore === 4 ? 'green' :
                                            walkScore === 3 ? 'blue' :
                                                walkScore === 2 ? 'orange' :
                                                    walkScore === 1 ? 'gold' : 'red'
                                    }>
                                        {walkScore} puntos
                                    </Tag>
                                </div>
                            </div>
                        </Form.Item>
                        <div style={{ marginTop: 16, padding: '8px 16px', background: '#f6f6f6', borderRadius: 4 }}>
                            <Text strong>Criterios de puntuación:</Text>
                            <ul style={{ marginTop: 4, marginBottom: 0 }}>
                                <li>{'>'}13.04 seg: 1 punto</li>
                                <li>9.32-13.04 seg: 2 puntos</li>
                                <li>7.24-9.32 seg: 3 puntos</li>
                                <li>{'<'}7.24 seg: 4 puntos</li>
                            </ul>
                        </div>
                    </Card>
                );
            case 3:
                return (
                    <Card className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
                        <Result
                            status="success"
                            title={`Puntaje Total SPPB: ${totalScore}/12`}
                            subTitle={
                                totalScore >= 10 ? "Rendimiento físico normal" :
                                    totalScore >= 7 ? "Limitación física moderada" :
                                        "Limitación física severa"
                            }
                            extra={[
                                <Button type="primary" key="new" onClick={() => {
                                    form.resetFields();
                                    setCurrentStep(0);
                                    setEvaluationCompleted(false);
                                    setTandemScore(0);
                                    setChairStandScore(0);
                                    setWalkScore(0);
                                }}>
                                    Nueva Evaluación
                                </Button>,
                            ]}
                        />

                        <Row gutter={16}>
                            <Col span={8}>
                                <Card title="Balance" bordered={false}>
                                    <Title level={2}>
                                        {form.getFieldValue('parallelPosition') ? 1 : 0} +
                                        {form.getFieldValue('semiTandemPosition') ? 1 : 0} +
                                        {tandemScore}
                                    </Title>
                                    <Text>/4 puntos</Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Levantarse" bordered={false}>
                                    <Title level={2}>
                                        {chairStandScore}
                                    </Title>
                                    <Text>/4 puntos</Text>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card title="Marcha" bordered={false}>
                                    <Title level={2}>
                                        {walkScore}
                                    </Title>
                                    <Text>/4 puntos</Text>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                );
            default:
                return null;
        }
    };

    return (
        <div className='w-full'>
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
                DESEMPEÑO FÍSICO
            </Title>

            <Row>
                <Col xs={24} md={8}>
                    <Card
                        title="Dinamometría Digital de Mano Dominante"
                        className='h-full !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300 !mr-4'
                    >
                        <Form layout="vertical">
                            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <Form.Item
                                        label="Primera Medida (kg)"
                                        style={{ flex: 1 }}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            step={0.1}
                                            addonAfter="kg"
                                            style={{ width: '100%' }}
                                            onChange={(value) => {
                                                setFirstMeasure(value);
                                                calculateResults(value, secondMeasure);
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Segunda Medida (kg)"
                                        style={{ flex: 1 }}
                                    >
                                        <InputNumber
                                            min={0}
                                            max={100}
                                            step={0.1}
                                            addonAfter="kg"
                                            style={{ width: '100%' }}
                                            onChange={(value) => {
                                                setSecondMeasure(value);
                                                calculateResults(firstMeasure, value);
                                            }}
                                        />
                                    </Form.Item>
                                </div>

                                {averageScore && (
                                    <div style={{
                                        padding: 16,
                                        backgroundColor: '#f6f6f6',
                                        borderRadius: 4,
                                        borderLeft: `4px solid ${strengthCategory === 'Excelente' ? '#52c41a' :
                                            strengthCategory === 'Buena' ? '#1890ff' :
                                                strengthCategory === 'Normal' ? '#faad14' : '#ff4d4f'
                                            }`
                                    }}>
                                        <Text strong>Resultados:</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Space size="large">
                                                <div>
                                                    <Text>Promedio: </Text>
                                                    <Tag color="processing">{averageScore} kg</Tag>
                                                </div>
                                                <div>
                                                    <Text>Fuerza: </Text>
                                                    <Tag
                                                        color={
                                                            strengthCategory === 'Excelente' ? 'success' :
                                                                strengthCategory === 'Buena' ? 'blue' :
                                                                    strengthCategory === 'Normal' ? 'warning' : 'error'
                                                        }
                                                    >
                                                        {strengthCategory}
                                                    </Tag>
                                                </div>
                                            </Space>
                                        </div>
                                    </div>
                                )}

                                <div style={{ marginTop: 8 }}>
                                    <Text type="secondary">Instrucciones:</Text>
                                    <ul style={{ marginTop: 4 }}>
                                        <li>Realizar dos mediciones con el dinamómetro digital</li>
                                        <li>El paciente debe estar sentado con el brazo en ángulo de 90°</li>
                                        <li>Registrar ambas medidas en kilogramos</li>
                                        <li>El sistema calculará automáticamente el promedio</li>
                                    </ul>
                                </div>
                            </Space>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Steps current={currentStep} style={{ marginBottom: 40 }} className='!px-4'>
                        {steps.map((item) => (
                            <Step key={item.title} title={item.title} icon={item.icon} />
                        ))}
                    </Steps>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            parallelPosition: false,
                            semiTandemPosition: false,
                            tandemPositionTime: 0,
                            standUpTest: 'able',
                            fiveRepsTime: 0,
                            walkTime: 0,
                        }}
                    >
                        {renderStepContent(currentStep)}

                        {currentStep < 3 && (
                            <Card className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300 !mt-4'>
                                <div style={{ textAlign: 'right' }}>
                                    {currentStep > 0 && !evaluationCompleted && (
                                        <Button style={{ marginRight: 8 }} onClick={prevStep}>
                                            Anterior
                                        </Button>
                                    )}
                                    {currentStep < steps.length - 2 && (
                                        <Button type="primary" onClick={nextStep}>
                                            Siguiente
                                        </Button>
                                    )}
                                    {currentStep === steps.length - 2 && (
                                        <Button type="primary" htmlType="submit">
                                            Calcular Puntaje
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        )}
                    </Form>
                </Col>
                <Row key="actions" justify="center" className="m-12 w-full">
                    <Col>
                        <Link href="" passHref>
                            <Button
                                type="default"
                                icon={<ArrowLeftOutlined />}
                                size="large"
                                style={{ minWidth: '120px' }}
                            >
                                Atrás
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <Button className="!ml-3"
                            type="primary"
                            size="large"
                            onClick={saveFile}
                            style={{ minWidth: '120px' }}
                            disabled={!currentPatient?.dni}
                            loading={loading}
                            icon={<SaveOutlined />}
                        >
                            {currentPatient?.dni ? "Guardar Paciente" : "Seleccione archivo primero"}
                        </Button>
                    </Col>
                </Row>
            </Row>
        </div>
    );
};

export default SPPBEvaluation;