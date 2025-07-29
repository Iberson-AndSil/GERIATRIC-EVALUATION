"use client";
import React, { useState } from "react";
import { Image } from 'antd';
import { Form, Input, Button, Card, Row, Col, Checkbox, Typography, Radio } from "antd";
import * as XLSX from "xlsx";
import { useGlobalContext } from "../context/GlobalContext";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

const MMSEForm = () => {
    const { Title, Text } = Typography;
    const router = useRouter();
    const { fileHandle } = useGlobalContext();
    const [score, setScore] = useState(0);
    const [interpretation, setInterpretation] = useState("");
    const [form] = Form.useForm();

    const calculateScore = (values: any) => {
        let total = 0;

        if (values.date_day) total += 1;
        if (values.date_month) total += 1;
        if (values.date_year) total += 1;
        if (values.date_weekday) total += 1;
        if (values.date_season) total += 1;

        if (values.place_floor) total += 1;
        if (values.place_location) total += 1;
        if (values.place_city) total += 1;
        if (values.place_department) total += 1;
        if (values.place_country) total += 1;

        if (values.memory_words?.length === 3) total += 3;

        if (values.calculation === "93-86-79-72-65") total += 5;

        if (values.recall_words?.length === 3) total += 3;

        if (values.name_pencil) total += 1;
        if (values.name_clock) total += 1;

        if (values.repeat_phrase) total += 1;

        if (values.command_right_hand) total += 1;
        if (values.command_fold_paper) total += 1;
        if (values.command_floor) total += 1;

        if (values.command_close_eyes) total += 1;

        if (values.write_sentence) total += 1;

        if (values.copy_drawing) total += 1;

        setScore(total);

        if (total >= 26) setInterpretation("Normal (sin deterioro cognitivo)");
        else if (total >= 20) setInterpretation("Deterioro cognitivo leve");
        else setInterpretation("Deterioro moderado/grave (posible demencia)");
    };

    const handleSaveData = async () => {
        try {
            if (!fileHandle) {
                alert("Por favor seleccione un archivo primero");
                return;
            }

            const file = await fileHandle.getFile();
            const arrayBuffer = await file.arrayBuffer();
            const existingWb = XLSX.read(arrayBuffer, { type: "array" });
            const wsName = existingWb.SheetNames[0];
            const ws = existingWb.Sheets[wsName];

            const existingData: number[][] = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                defval: ""
            });
            const lastRowIndex = existingData.length - 1;

            if (lastRowIndex >= 0) {
                while (existingData[lastRowIndex].length < 31) {
                    existingData[lastRowIndex].push(0);
                }

                existingData[lastRowIndex][31] = score;
            }

            const updatedWs = XLSX.utils.aoa_to_sheet(existingData);
            const updatedWb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(updatedWb, updatedWs, wsName);

            const writable = await fileHandle.createWritable();
            await writable.write(XLSX.write(updatedWb, {
                bookType: "xlsx",
                type: "buffer",
                bookSST: true
            }));
            await writable.close();

            alert("Resultados guardados exitosamente");
            router.push('/moca');

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
        <div>
            <Title
                level={3}
                style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#1890ff',
                    fontWeight: 500
                }}
            >
                MMSE-30 - MINIMENTAL DE FOLSTEIN
            </Title>
            <Form form={form} onFinish={calculateScore} layout="vertical">
                <div className="flex flex-col md:flex-row">
                    <Col span={8}>
                        <Card title="ORIENTACIÓN" className="h-full md:!mx-2">
                            <Text strong>¿Qué día es hoy?</Text>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="date_day" label="Día">
                                        <Input placeholder="Ej: 20" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="date_month" label="Mes">
                                        <Input placeholder="Ej: Mayo" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="date_year" label="Año">
                                        <Input placeholder="Ej: 2025" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="date_weekday" label="Día de la semana">
                                <Input placeholder="Ej: Martes" />
                            </Form.Item>
                            <Form.Item name="date_season" label="Estación del año">
                                <Input placeholder="Ej: Primavera" />
                            </Form.Item>

                            <Text strong>¿Dónde estamos?</Text>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="place_floor" label="Piso">
                                        <Input placeholder="Ej: Planta baja" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="place_location" label="Lugar">
                                        <Input placeholder="Ej: Posta Médica Tocache" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="place_city" label="Ciudad">
                                        <Input placeholder="Ej: Tocache" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="place_department" label="Departamento">
                                        <Input placeholder="Ej: Tocache" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="place_country" label="País">
                                        <Input placeholder="Ej: Perú" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card title="MEMORIA INMEDIATA - ATENCIÓN Y CÁLCULO - RECUERDO DIFERIDO" className="h-full md:!mx-2">
                            <Title level={5}>Memoria Inmediata</Title>
                            <Form.Item name="memory_words" label="Repetir 3 palabras:">
                                <Checkbox.Group options={["Árbol", "Puente", "Farol"]} />
                            </Form.Item>
                            <Title level={5}>Atención y Cálculo</Title>
                            <Form.Item name="calculation" label="Restar 7 desde 100 (5 veces):">
                                <Input placeholder="Ej: 93, 86, 79, 72, 65" />
                            </Form.Item>
                            <Title level={5}>Recuerdo Diferido</Title>
                            <Form.Item name="recall_words" label="Repetir las 3 palabras anteriores:">
                                <Checkbox.Group options={["Árbol", "Puente", "Farol"]} />
                            </Form.Item>
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card title="LENGUAJE Y CONSTRUCCIÓN" className="md:!mx-2">
                            <Text strong>Nombrar objetos:</Text>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="name_pencil" label="Lápiz">
                                        <Radio.Group>
                                            <Radio value={true}>Correcto</Radio>
                                            <Radio value={false}>Incorrecto</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="name_clock" label="Reloj">
                                        <Radio.Group>
                                            <Radio value={true}>Correcto</Radio>
                                            <Radio value={false}>Incorrecto</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="repeat_phrase" label='Repetir frase: "Ni sí, ni no, ni peros"'>
                                <Radio.Group>
                                    <Radio value={true}>Correcto</Radio>
                                    <Radio value={false}>Incorrecto</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Text strong>Tres órdenes:</Text>
                            <div className="md:flex gap-18">
                                <Form.Item name="command_right_hand" label="1. Tomar papel con mano derecha">
                                    <Radio.Group>
                                        <Radio value={true}>Correcto</Radio>
                                        <Radio value={false}>Incorrecto</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name="command_fold_paper" label="2. Doblar papel por la mitad">
                                    <Radio.Group>
                                        <Radio value={true}>Correcto</Radio>
                                        <Radio value={false}>Incorrecto</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item name="command_floor" label="3. Poner papel en el suelo">
                                    <Radio.Group>
                                        <Radio value={true}>Correcto</Radio>
                                        <Radio value={false}>Incorrecto</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>

                            <Form.Item name="command_close_eyes" label='Leer y ejecutar la frase: "Cierre los ojos"'>
                                <Radio.Group>
                                    <Radio value={true}>Correcto</Radio>
                                    <Radio value={false}>Incorrecto</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="write_sentence" label="Escribir una frase (con sujeto y predicado):">
                                <Input.TextArea placeholder="Ej: El niño juega en el parque." />
                            </Form.Item>
                            <div className="md:flex md:gap-6">
                                <Form.Item name="copy_drawing" label="Copiar dibujo (pentágonos superpuestos):">
                                    <Radio.Group>
                                        <Radio value={true}>Correcto</Radio>
                                        <Radio value={false}>Incorrecto</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Image
                                    width={100}
                                    src="/figura-mmse30.jpg"
                                    alt="Dibujo MMSE"
                                />
                            </div>
                        </Card>
                    </Col>
                </div>
                <Button type="primary" htmlType="submit" block style={{ marginTop: 20 }}>
                    Calcular Puntaje
                </Button>
            </Form>

            {score > 0 && (
                <Card style={{ marginTop: 20 }}>
                    <Title level={4}>Resultado</Title>
                    <Text strong>Puntaje Total: {score}/30</Text>
                    <br />
                    <Text>Interpretación: {interpretation}</Text>
                </Card>
            )}
            <Row key="actions" className="m-12 flex justify-center">
                <Col>
                    <Link href="/cognitive" passHref>
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
                        onClick={handleSaveData}
                        style={{ minWidth: '120px' }}
                        disabled={!fileHandle}
                        icon={<SaveOutlined />}
                    >
                        {fileHandle ? "Guardar Paciente" : "Seleccione archivo primero"}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default MMSEForm;