"use client";
import React, { useState } from 'react';
import { Steps, Form, InputNumber, Button, Card, Typography, Result, Radio, Tag, notification, Badge, Divider } from 'antd';
import { UserOutlined, ClockCircleOutlined, ArrowUpOutlined, ArrowLeftOutlined, SaveOutlined, ThunderboltOutlined, CheckCircleOutlined, InfoCircleOutlined, CheckOutlined, CloseOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useGlobalContext } from '../context/GlobalContext';
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
        { title: 'Balance', icon: <UserOutlined /> },
        { title: 'Silla', icon: <ArrowUpOutlined /> },
        { title: 'Marcha', icon: <ClockCircleOutlined /> },
        { title: 'Fin', icon: <CheckCircleOutlined /> },
    ];

    // --- LÓGICA DE CÁLCULO (Sin cambios) ---
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
            if (!currentPatient?.dni) throw new Error("No se ha seleccionado un paciente");
            const dynamometry = averageScore?.toString() || "0";
            const Balance = totalScore.toString();
            await actualizarResultado(currentPatient.dni, currentResultId || "", 'dynamometry', dynamometry);
            await actualizarResultado(currentPatient.dni, currentResultId || "", 'Balance', Balance);
            api.success({ message: 'Éxito', description: 'Datos guardados correctamente' });
            router.push('/mental');
        } catch (err: any) {
            api.error({ message: 'Error', description: err.message || 'Error desconocido' });
        } finally {
            setLoading(false);
        }
    };

    const calculateTandemScore = (time: any) => {
        if (time >= 10) return 2;
        if (time >= 3) return 1;
        return 0;
    };

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    // --- RENDERIZADO DE PASOS ---
    const renderStepContent = (step: number) => {
        switch (step) {
            case 0: // BALANCE
                return (
                    <div className="animate-fadeIn flex flex-col h-full space-y-5">
                        <Title level={5} className="text-blue-700 uppercase tracking-wide text-xs border-gray-300 border-b pb-2 mb-0">Prueba de Equilibrio</Title>

                        {/* Preguntas compactas */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                                <Text strong className="text-gray-700 text-sm">1. Pies paralelos (10s)</Text>
                                <Form.Item name="parallelPosition" className="mb-0">
                                    <Radio.Group buttonStyle="solid" size="middle">
                                        <Radio.Button value={1} className="text-green-600 font-medium">
                                            Logrado (+1)
                                        </Radio.Button>
                                        <Radio.Button value={0} className="text-red-500">
                                            Falló (0)
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between">
                                <Text strong className="text-gray-700 text-sm">2. Semi-Tandem (10s)</Text>
                                <Form.Item name="semiTandemPosition" className="mb-0">
                                    <Radio.Group buttonStyle="solid" size="middle">
                                        <Radio.Button value={1} className="text-green-600 font-medium">Logrado (+1)</Radio.Button>
                                        <Radio.Button value={0} className="text-red-500">Falló (0)</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </div>

                            <div className="flex justify-between items-center border border-gray-200 rounded-lg p-3">
                                <Text strong className="block mb-2 text-sm">3. Posición Tandem</Text>
                                <Form.Item name="tandemPositionTime" className="mb-0">
                                    <div className="flex items-center gap-3">
                                        <InputNumber
                                            min={0} max={30} step={0.1}
                                            placeholder="0.0"
                                            className="w-32"
                                            onChange={(val) => setTandemScore(calculateTandemScore(val))}
                                            addonAfter="seg"
                                        />
                                        <Tag color={tandemScore === 2 ? 'success' : tandemScore === 1 ? 'warning' : 'error'}>
                                            {tandemScore} Puntos
                                        </Tag>
                                    </div>
                                    <Text type="secondary" className="text-xs mt-2 block">
                                        ≥10s: 2pts | 3-9.9s: 1pt | &lt;3s: 0pts
                                    </Text>
                                </Form.Item>
                            </div>
                        </div>
                    </div>
                );
            case 1: // SILLA
                return (
                    <div className="animate-fadeIn flex flex-col h-full space-y-5">
                        <Title level={5} className="text-blue-700 uppercase tracking-wide text-xs border-gray-100 border-b pb-2 mb-0">Levantarse de la Silla</Title>

                        <div className="space-y-5">
                            <div>
                                <Text className="block mb-2 font-medium text-sm">¿Capaz de levantarse sin brazos?</Text>
                                <Form.Item name="standUpTest" className="mb-0">
                                    <Radio.Group onChange={() => setChairStandScore(0)} buttonStyle="solid" className="w-full flex">
                                        <Radio.Button value="able" className="flex-1 text-center font-medium">SÍ PUEDE</Radio.Button>
                                        <Radio.Button value="unable" className="flex-1 text-center">NO PUEDE</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </div>

                            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.standUpTest !== curr.standUpTest}>
                                {({ getFieldValue }) => getFieldValue('standUpTest') === 'able' && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-slideDown">
                                        <Form.Item
                                            name="fiveRepsTime"
                                            label="Tiempo 5 repeticiones (seg)"
                                            className="mb-0"
                                            rules={[{ required: true, message: 'Requerido' }]}
                                        >
                                            <div className="flex items-center gap-3">
                                                <InputNumber
                                                    min={0} step={0.1}
                                                    className="w-full"
                                                    onChange={(val) => setChairStandScore(calculateChairStandScore(val))}
                                                    addonAfter="seg"
                                                />
                                                <Badge count={chairStandScore} showZero color="blue" title="Puntos" />
                                            </div>
                                        </Form.Item>
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 bg-white p-2 rounded border border-blue-100">
                                            <span>≤11.19: <b>4pts</b></span>
                                            <span>11.2-13.69: <b>3pts</b></span>
                                            <span>13.7-16.69: <b>2pts</b></span>
                                            <span>&gt;16.7: <b>1pt</b></span>
                                        </div>
                                    </div>
                                )}
                            </Form.Item>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fadeIn flex flex-col h-full space-y-5">
                        <Title level={5} className="text-blue-700 uppercase tracking-wide text-xs border-gray-100 border-b pb-2 mb-0">Velocidad de Marcha (4m)</Title>

                        <div className="space-y-4">
                            <Form.Item
                                name="walkTime"
                                label="Tiempo registrado"
                                className="mb-0"
                                rules={[{ required: true, message: 'Requerido' }]}
                            >
                                <div className="flex items-center gap-3">
                                    <InputNumber
                                        min={0} step={0.1}
                                        className="w-full"
                                        placeholder="0.0"
                                        onChange={(val) => setWalkScore(calculateWalkScore(val))}
                                        addonAfter="seg"
                                    />
                                    <div className="flex flex-col items-center px-2 bg-gray-50 rounded border border-gray-200">
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Puntos</span>
                                        <span className={`text-lg font-bold ${walkScore >= 3 ? 'text-green-600' : 'text-orange-500'}`}>{walkScore}</span>
                                    </div>
                                </div>
                            </Form.Item>

                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden text-xs">
                                <div className="bg-gray-50 px-3 py-1 border-b border-gray-200 font-semibold text-gray-500">Referencia</div>
                                <div className={`flex justify-between p-2 border-b border-gray-100 ${walkScore === 4 ? 'bg-green-50' : ''}`}>
                                    <span>&lt; 7.24 s</span> <b>4 pts</b>
                                </div>
                                <div className={`flex justify-between p-2 border-b border-gray-100 ${walkScore === 3 ? 'bg-blue-50' : ''}`}>
                                    <span>7.24 - 9.32 s</span> <b>3 pts</b>
                                </div>
                                <div className={`flex justify-between p-2 border-b border-gray-100 ${walkScore === 2 ? 'bg-orange-50' : ''}`}>
                                    <span>9.32 - 13.04 s</span> <b>2 pts</b>
                                </div>
                                <div className={`flex justify-between p-2 ${walkScore === 1 ? 'bg-red-50' : ''}`}>
                                    <span>&gt; 13.04 s</span> <b>1 pt</b>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="animate-fadeIn h-full flex flex-col justify-center items-center">
                        <Result
                            status={totalScore >= 10 ? "success" : "warning"}
                            title={<span className="text-xl font-bold">Evaluación Completada</span>}
                            subTitle={
                                <div className="mt-2">
                                    <div className="text-4xl font-bold text-gray-800 mb-1">{totalScore} <span className="text-xl text-gray-400 font-light">/ 12</span></div>
                                    <Tag color={totalScore >= 10 ? 'green' : totalScore >= 7 ? 'orange' : 'red'}>
                                        {totalScore >= 10 ? 'Normal' : totalScore >= 7 ? 'Moderado' : 'Severo'}
                                    </Tag>
                                </div>
                            }
                            className="p-0"
                        />
                        <Button type="dashed" size="small" className="mt-6" onClick={() => {
                            form.resetFields(); setCurrentStep(0); setEvaluationCompleted(false);
                            setTandemScore(0); setChairStandScore(0); setWalkScore(0);
                        }}>
                            Nueva Evaluación
                        </Button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50/50 p-6">
            {contextHolder}
            <div className="max-w-[1200px] mx-auto">

                <div className="text-center mb-8">
                    <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
                        <MedicineBoxOutlined className="mr-2" />
                        DESEMPEÑO FÍSICO
                    </Title>
                    <Text type="secondary" className="text-lg">Batería Corta de Desempeño Físico (SPPB)</Text>
                    <Divider />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

                    {/* COLUMNA IZQUIERDA: SPPB */}
                    <div className="md:col-span-2 flex flex-col">
                        <Card
                            title={<span className="text-blue-600 font-bold text-base"><ClockCircleOutlined className="mr-2" /> Batería SPPB</span>}
                            className="shadow-sm rounded-xl border-t-4 border-t-blue-500 h-full flex flex-col"
                            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}
                            size="small"
                        >
                            <Steps current={currentStep} size="small" className="mb-6" items={steps} />

                            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ parallelPosition: false, semiTandemPosition: false, standUpTest: 'able' }} className="flex-1 flex flex-col">
                                {/* Altura mínima controlada pero razonable */}
                                <div className="flex-1 min-h-[320px]">
                                    {renderStepContent(currentStep)}
                                </div>

                                {currentStep < 3 && (
                                    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                                        <Button disabled={currentStep === 0} onClick={prevStep} icon={<ArrowLeftOutlined />}>
                                            Atrás
                                        </Button>
                                        {currentStep < steps.length - 2 ? (
                                            <Button type="primary" onClick={nextStep}>
                                                Siguiente
                                            </Button>
                                        ) : (
                                            <Button type="primary" htmlType="submit">
                                                Calcular
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </Form>
                        </Card>
                    </div>

                    {/* COLUMNA DERECHA: Dinamometría */}
                    <div className="md:col-span-1 flex flex-col">
                        <Card
                            title={<span className="text-purple-600 font-bold text-base"><ThunderboltOutlined className="mr-2" /> Dinamometría</span>}
                            className="shadow-sm rounded-xl border-t-4 border-t-purple-500 h-full flex flex-col"
                            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}
                            size="small"
                        >
                            <Form layout="vertical" className="flex-1 flex flex-col space-y-4">
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <Text type="secondary" className="text-xs uppercase font-bold block mb-3 text-purple-800">Mano Dominante</Text>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">1ª Medida</span>
                                            <InputNumber min={0} max={100} step={0.1} placeholder="0.0" className="w-24" size="middle"
                                                onChange={(val) => { setFirstMeasure(val); calculateResults(val, secondMeasure); }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">2ª Medida</span>
                                            <InputNumber min={0} max={100} step={0.1} placeholder="0.0" className="w-24" size="middle"
                                                onChange={(val) => { setSecondMeasure(val); calculateResults(firstMeasure, val); }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Resultado Promedio */}
                                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center flex-1 flex flex-col justify-center items-center">
                                    <div className="text-xs text-gray-400 uppercase font-bold mb-1">Promedio</div>
                                    <div className="text-3xl font-bold text-gray-700 mb-2">{averageScore ? averageScore.toFixed(1) : '--'} <span className="text-sm font-normal text-gray-400">kg</span></div>

                                    {strengthCategory ? (
                                        <Tag color={strengthCategory === 'Excelente' ? 'success' : strengthCategory === 'Buena' ? 'blue' : strengthCategory === 'Normal' ? 'warning' : 'error'}>
                                            {strengthCategory}
                                        </Tag>
                                    ) : (
                                        <span className="text-xs text-gray-300">-</span>
                                    )}
                                </div>

                                {/* Protocolo Compacto */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1 mb-2 text-purple-700">
                                        <InfoCircleOutlined className="text-xs" /> <span className="font-bold text-xs">Protocolo</span>
                                    </div>
                                    <ul className="text-xs text-gray-500 space-y-1 pl-1 list-none">
                                        <li>• Codo a 90°, muñeca neutral.</li>
                                        <li>• 3 intentos, usar mejores.</li>
                                    </ul>
                                </div>
                            </Form>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pb-8 mt-10">
                    <Link href="/funtional">
                        <Button icon={<ArrowLeftOutlined />}>Volver</Button>
                    </Link>
                    <Button
                        type="primary" icon={<SaveOutlined />}
                        onClick={saveFile} loading={loading} disabled={!currentPatient?.dni}
                        className="bg-blue-600 hover:bg-blue-500 shadow-md"

                    >
                        {currentPatient?.dni ? "Guardar Todo" : "Seleccione Paciente"}
                    </Button>
                </div>
                <div className="h-8" />
            </div>
        </div>
    );
};

export default SPPBEvaluation;