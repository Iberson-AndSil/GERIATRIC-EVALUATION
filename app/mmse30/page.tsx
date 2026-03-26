"use client";
import React, { useState, useEffect } from "react";
import {
    Form, Input, Button, Card, Row, Col, Checkbox,
    Typography, Radio, notification, Divider, Tag, Space,
    Progress, Image, Modal, Select
} from "antd";
import {
    ArrowLeftOutlined, SaveOutlined, FileTextOutlined,
    EnvironmentOutlined, RetweetOutlined, EditOutlined,
    CheckCircleOutlined, CloseCircleOutlined
} from "@ant-design/icons";
import { useGlobalContext } from "../context/GlobalContext";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { actualizarResultado, crearRegistroResultados } from "../lib/pacienteService";

const { Title, Text } = Typography;
const { Option } = Select;

// Utilitarios para fechas
const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const WEEKDAYS = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const MMSEForm = () => {
    const router = useRouter();
    const { currentPatient, currentResultId, setCurrentResultId } = useGlobalContext();
    const [score, setScore] = useState(0);
    const [interpretation, setInterpretation] = useState("Pendiente de evaluación");
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [openImage, setOpenImage] = useState(false);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    const handleValuesChange = (_: any, allValues: any) => {
        let total = 0;
        [
            'date_day', 'date_month', 'date_year', 'date_weekday', 'date_season',
            'place_floor', 'place_location', 'place_city', 'place_department', 'place_country'
        ].forEach(field => {
            if (allValues[field] === true) total += 1;
        });

        if (allValues.memory_words?.length) total += allValues.memory_words.length;
        if (allValues.recall_words?.length) total += allValues.recall_words.length;

        const atencionScore = allValues.calc_mode === 'deletreo'
            ? (allValues.spelling?.length || 0)
            : (allValues.calculation?.length || 0);
        total += atencionScore;

        if (allValues.name_pencil === true) total += 1;
        if (allValues.name_clock === true) total += 1;
        if (allValues.repeat_phrase === true) total += 1;
        if (allValues.command_right_hand === true) total += 1;
        if (allValues.command_fold_paper === true) total += 1;
        if (allValues.command_floor === true) total += 1;
        if (allValues.command_close_eyes === true) total += 1;
        if (allValues.copy_drawing === true) total += 4;

        if (allValues.write_sentence === true) total += 1;

        setScore(total);

        if (total >= 24) setInterpretation("Normal (sin deterioro cognitivo)");
        else if (total >= 19) setInterpretation("Deterioro cognitivo leve");
        else if (total >= 10) setInterpretation("Deterioro moderado");
        else setInterpretation("Deterioro grave (posible demencia)");
    };

    const handleSaveData = async () => {
        try {
            setLoading(true);
            if (!currentPatient) throw new Error("Seleccione un paciente primero");

            let resId = currentResultId;
            if (!resId) {
                resId = await crearRegistroResultados(currentPatient.dni, { mmse30: score });
                setCurrentResultId(resId);
            } else {
                await actualizarResultado(
                    currentPatient.dni,
                    resId,
                    'mmse30',
                    score
                );
            }

            api.success({
                message: 'Éxito',
                description: 'Resultados de MMSE-30 guardados correctamente',
                placement: 'topRight'
            });

            router.push('/moca');
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
                    MMSE-30
                </Title>
                <Text type="secondary" className="text-2xl">Mini-Mental State Examination de Folstein</Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                initialValues={{ memory_words: [], recall_words: [], calc_mode: 'resta' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                        <Card
                            title={<span className="text-blue-600"><EnvironmentOutlined /> ORIENTACIÓN</span>}
                            className="shadow-sm rounded-xl border-t-4 border-t-blue-500 !mb-4"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Divider orientation="left" className="!border-gray-200 !mt-0" plain><Text>¿Qué día es hoy? (5 pts)</Text></Divider>
                                    <div className="flex flex-col gap-2 bg-gray-50/50 p-2 rounded-lg">
                                        {[
                                            { name: 'date_day', label: 'Día' },
                                            { name: 'date_month', label: 'Mes' },
                                            { name: 'date_year', label: 'Año' },
                                            { name: 'date_weekday', label: 'Día de la semana' },
                                            { name: 'date_season', label: 'Estación' },
                                        ].map(item => (
                                            <div key={item.name} className="flex justify-between items-center bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                                                <Text>{item.label}</Text>
                                                <Form.Item name={item.name} noStyle>
                                                    <Radio.Group size="middle" buttonStyle="solid">
                                                        <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                                        <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <Divider orientation="left" className="!border-gray-200 !mt-0" plain><Text>¿Dónde estamos? (5 pts)</Text></Divider>
                                    <div className="flex flex-col gap-2 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                                        {[
                                            { name: 'place_floor', label: 'Piso' },
                                            { name: 'place_location', label: 'Lugar' },
                                            { name: 'place_city', label: 'Ciudad' },
                                            { name: 'place_department', label: 'Departamento' },
                                            { name: 'place_country', label: 'País' },
                                        ].map(item => (
                                            <div key={item.name} className="flex justify-between items-center bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200">
                                                <Text>{item.label}</Text>
                                                <Form.Item name={item.name} noStyle>
                                                    <Radio.Group size="middle" buttonStyle="solid">
                                                        <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                                        <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title={<span className="text-orange-600"><EditOutlined /> LENGUAJE Y CONSTRUCCIÓN</span>}
                            className="shadow-sm rounded-xl border-t-4 border-t-orange-500"
                        >
                            <Row gutter={8}>
                                <Col span={11}>
                                    <Divider plain className="!border-gray-200 !mt-0"><Text>Nombrar un lápiz y un reloj mostrados</Text></Divider>
                                    <Row gutter={8}>
                                        <Col span={12} className="!flex !justify-center">
                                            <Form.Item name="name_pencil" label="Lápiz" className="mb-0">
                                                <Radio.Group size="large" buttonStyle="solid">
                                                    <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                                    <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} className="!flex !justify-center">
                                            <Form.Item name="name_clock" label="Reloj" className="mb-0">
                                                <Radio.Group size="large" buttonStyle="solid">
                                                    <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                                    <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={2} className="!flex !justify-center">
                                    <Divider type="vertical" className="!h-full !border-gray-200 !mt-0" />
                                </Col>
                                <Col span={11}>
                                    <Divider plain className="!border-gray-200 !mt-0"><Text>Repetir la frase “Ni si, ni no, ni peros”</Text></Divider>
                                    <Form.Item name="repeat_phrase" className="flex justify-center items-center" label="Opciones">
                                        <Radio.Group size="large" buttonStyle="solid">
                                            <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                            <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider plain className="my-2 !border-gray-200">Realizar correctamente las tres órdenes siguientes: "Coja este papel con..."</Divider>
                            <div className="p-2 rounded mb-4 text-xs">
                                <Row gutter={16}>
                                    <Col span={8} className="!flex !justify-center">
                                        <Form.Item name="command_right_hand" label="1. Mano derecha" className="mb-1"><Radio.Group size="large" buttonStyle="solid"><Radio.Button value={true}><CheckCircleOutlined /></Radio.Button><Radio.Button value={false}><CloseCircleOutlined /></Radio.Button></Radio.Group></Form.Item>
                                    </Col>
                                    <Col span={8} className="!flex !justify-center">
                                        <Form.Item name="command_fold_paper" label="2. Dobla mitad" className="mb-1"><Radio.Group size="large" buttonStyle="solid"><Radio.Button value={true}><CheckCircleOutlined /></Radio.Button><Radio.Button value={false}><CloseCircleOutlined /></Radio.Button></Radio.Group></Form.Item>
                                    </Col>
                                    <Col span={8} className="!flex !justify-center">
                                        <Form.Item name="command_floor" label="3. Al suelo" className="mb-1"><Radio.Group size="large" buttonStyle="solid"><Radio.Button value={true}><CheckCircleOutlined /></Radio.Button><Radio.Button value={false}><CloseCircleOutlined /></Radio.Button ></Radio.Group></Form.Item>
                                    </Col>
                                </Row>
                            </div>
                            <Divider plain className="my-2 !border-gray-200">Leer y ejecutar: "CIERRE LOS OJOS"</Divider>
                            <Form.Item name="command_close_eyes" className="flex justify-center mb-4">
                                <Radio.Group size="large" buttonStyle="solid">
                                    <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                    <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Row gutter={8}>
                                <Col span={11} >
                                    <Divider plain className="!border-gray-200 !mt-0"><Text>Escribir frase (Sujeto+Predicado)</Text></Divider>
                                    <Form.Item name="write_sentence" className="flex justify-center mb-0 mt-2">
                                        <Radio.Group size="large" buttonStyle="solid">
                                            <Radio.Button value={true}><CheckCircleOutlined /></Radio.Button>
                                            <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={2} className="!flex !justify-center !mt-0">
                                    <Divider type="vertical" className="!h-full !border-gray-200" />
                                </Col>
                                <Col span={11}>
                                    <Divider plain className="!border-gray-200 !mt-0"><Text>Copia de Pentágonos</Text></Divider>
                                    <Row gutter={8} align="middle" className="flex justify-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Form.Item
                                                name="copy_drawing"
                                                className="!mb-0"
                                            >
                                                <Radio.Group size="large" buttonStyle="solid">
                                                    <Radio.Button value={true}>
                                                        <CheckCircleOutlined />
                                                    </Radio.Button>
                                                    <Radio.Button value={false}><CloseCircleOutlined /></Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Button
                                                type="primary"
                                                onClick={() => setOpenImage(true)}
                                            >
                                                Imagen
                                            </Button>
                                        </div>

                                        <Modal
                                            open={openImage}
                                            footer={null}
                                            onCancel={() => setOpenImage(false)}
                                            centered
                                        >
                                            <Image
                                                src="/figura-mmse30.jpg"
                                                alt="Escala de Bristol"
                                                preview={false}
                                                width="100%"
                                            />
                                        </Modal>
                                    </Row>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card
                            title={<span className="text-purple-600"><RetweetOutlined /> PROCESOS COGNITIVOS</span>}
                            className="shadow-sm rounded-xl border-t-4 border-t-purple-500"
                        >
                            <Divider orientation="left" plain className="!border-gray-200 !mt-0"><Text>Memoria Inmediata</Text></Divider>
                            <Form.Item name="memory_words" className="flex justify-center">
                                <Checkbox.Group className="w-full">
                                    <div className="flex gap-2">
                                        {["Árbol", "Puente", "Farol"].map(w => <Checkbox key={w} value={w}>{w}</Checkbox>)}
                                    </div>
                                </Checkbox.Group>
                            </Form.Item>

                            <Divider orientation="left" plain className="!border-gray-200 !mt-12"><Text>Atención y Cálculo</Text></Divider>
                            <Form.Item name="calc_mode" className="flex justify-center mb-2">
                                <Radio.Group buttonStyle="solid" size="small">
                                    <Radio.Button value="resta">Resta</Radio.Button>
                                    <Radio.Button value="deletreo">Deletreo</Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.calc_mode !== currentValues.calc_mode}
                            >
                                {({ getFieldValue }) => {
                                    const mode = getFieldValue('calc_mode');
                                    if (mode === 'deletreo') {
                                        return (
                                            <>
                                                <div className="text-center text-xs text-gray-500 mb-2">Deletrear "MUNDO" al revés</div>
                                                <Form.Item name="spelling" className="w-full flex justify-center">
                                                    <Checkbox.Group className="w-full">
                                                        <div className="flex gap-2 flex-wrap justify-center">
                                                            {["O", "D", "N", "U", "M"].map(l => <Checkbox key={l} value={l}>{l}</Checkbox>)}
                                                        </div>
                                                    </Checkbox.Group>
                                                </Form.Item>
                                            </>
                                        );
                                    }
                                    return (
                                        <>
                                            <div className="text-center text-xs text-gray-500 mb-2">Restar 7 a partir de 100, 5 veces</div>
                                            <Form.Item name="calculation" className="w-full flex justify-center">
                                                <Checkbox.Group className="w-full">
                                                    <div className="flex gap-2 flex-wrap justify-center">
                                                        {["93", "86", "79", "72", "65"].map(n => <Checkbox key={n} value={n}>{n}</Checkbox>)}
                                                    </div>
                                                </Checkbox.Group>
                                            </Form.Item>
                                        </>
                                    );
                                }}
                            </Form.Item>

                            <Divider orientation="left" plain className="!border-gray-200 !mt-12"><Text>Recuerdo Diferido</Text></Divider>
                            <Form.Item name="recall_words" className="flex justify-center">
                                <Checkbox.Group className="w-full">
                                    <div className="flex gap-2">
                                        {["Árbol", "Puente", "Farol"].map(w => <Checkbox key={w} value={w}>{w}</Checkbox>)}
                                    </div>
                                </Checkbox.Group>
                            </Form.Item>
                        </Card>
                        <Card
                            className="!mt-4 shadow-sm rounded-xl border border-blue-100"
                            bodyStyle={{ padding: 24 }}
                        >
                            <div className="flex flex-col items-center justify-between mb-4">
                                <Title level={4} className="m-0 text-blue-700 uppercase tracking-wide">
                                    Resultado de la Evaluación
                                </Title>

                                <div className="mt-7">

                                    <Progress
                                        className=""
                                        type="circle"
                                        percent={(score / 30) * 100}
                                        width={160}
                                        strokeWidth={10}
                                        strokeColor={
                                            score >= 24
                                                ? "#52c41a"
                                                : score >= 19
                                                    ? "#faad14"
                                                    : "#ff4d4f"
                                        }
                                        format={() => (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-800">
                                                    {score}
                                                </div>
                                                <div className="text-xs text-gray-400">/ 30</div>
                                            </div>
                                        )}
                                    />
                                </div>

                                <Tag
                                    color={score >= 24 ? "green" : score >= 19 ? "orange" : "red"}
                                    className="uppercase font-bold !mt-8 !text-sm"
                                >
                                    {interpretation || "—"}
                                </Tag>
                            </div>

                        </Card>


                    </Col>
                </Row>

                <div className="flex justify-center gap-4 mt-8 pb-12">
                    <Link href="/cognitive">
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

export default MMSEForm;