"use client";
import { useState } from "react";
import { Form, Row, Col, Typography, Button, Alert, Card, Checkbox, Divider, Select, Slider } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/GlobalContext";
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

type SarcopeniaRespuestas = {
    levantar_peso?: number;
    cruzar_habitacion?: number;
    trasladarse?: number;
    subir_escalones?: number;
    caidas?: number;
};

type CaidasRespuestas = {
    hasFallen?: boolean;
    neededMedicalAssistance?: boolean;
    couldNotGetUp?: boolean;
    fearOfFalling?: boolean;
};

type CognitivoRespuestas = {
    forgetsRecentEvents?: boolean;
    rememberQuickly?: boolean;
    rememberSlowly?: boolean;
    affectsDailyActivities?: boolean;
};

type IncontinenciaRespuestas = {
    icqFrequency?: number;
    icqAmount?: number;
    icqImpact?: number;
    icqSituations?: string[];
};

interface Respuestas {
    sarcopenia: SarcopeniaRespuestas;
    caidas: CaidasRespuestas;
    cognitivo: CognitivoRespuestas;
    incontinencia: IncontinenciaRespuestas;
}

type PreguntaSarcopenia = {
    key: keyof SarcopeniaRespuestas;
    texto: string;
    opciones: { label: string; valor: number }[];
};


const SARCFTest = () => {
    const [respuestas, setRespuestas] = useState<Respuestas>({
        sarcopenia: {},
        caidas: {},
        cognitivo: {},
        incontinencia: {}
    });

    const { fileHandle } = useGlobalContext();
    const [form] = Form.useForm();
    const router = useRouter();
    const [showFallQuestions, setShowFallQuestions] = useState(false);
    const [showCognitiveQuestions, setShowCognitiveQuestions] = useState(false);
    const [showICIQResult, setShowICIQResult] = useState(false);

    const preguntasSarcopenia: PreguntaSarcopenia[] = [
        {
            key: "levantar_peso",
            texto: "¿Qué dificultad encuentra en levantar 4.5 kg?",
            opciones: [
                { label: "Ninguna", valor: 0 },
                { label: "Alguna", valor: 1 },
                { label: "Mucha o Incapaz", valor: 2 }
            ]
        },
        {
            key: "cruzar_habitacion",
            texto: "¿Qué dificultad encuentra en cruzar una habitación?",
            opciones: [
                { label: "Ninguna", valor: 0 },
                { label: "Alguna", valor: 1 },
                { label: "Mucha o Incapaz", valor: 2 }
            ]
        },
        {
            key: "trasladarse",
            texto: "¿Qué dificultad encuentra para trasladarse desde una silla/cama?",
            opciones: [
                { label: "Ninguna", valor: 0 },
                { label: "Alguna", valor: 1 },
                { label: "Mucha o Incapaz", valor: 2 }
            ]
        },
        {
            key: "subir_escalones",
            texto: "¿Qué dificultad encuentra en subir un tramo de diez escalones?",
            opciones: [
                { label: "Ninguna", valor: 0 },
                { label: "Alguna", valor: 1 },
                { label: "Mucha o Incapaz", valor: 2 }
            ]
        },
        {
            key: "caidas",
            texto: "¿Cuántas veces se ha caído en el pasado año?",
            opciones: [
                { label: "Ninguna", valor: 0 },
                { label: "1 a 3", valor: 1 },
                { label: "≥4", valor: 2 }
            ]
        }
    ];
    const frequencyOptions = [
        { label: "Nunca", value: 0 },
        { label: "Una vez a la semana", value: 1 },
        { label: "2-3 veces a la semana", value: 2 },
        { label: "Una vez al día", value: 3 },
        { label: "Varias veces al día", value: 4 },
        { label: "Continuamente", value: 5 }
    ];

    const amountOptions = [
        { label: "No se me escapa nada", value: 0 },
        { label: "Muy poca cantidad", value: 1 },
        { label: "Una cantidad moderada", value: 2 },
        { label: "Mucha cantidad", value: 3 }
    ];

    const situationOptions = [
        "Antes de llegar al servicio",
        "Al toser o estornudar",
        "Mientras duerme",
        "Al realizar esfuerzos físicos/ejercicios",
        "Cuando termina de orinar y ya se ha vestido",
        "Sin motivo evidente",
        "De forma continua"
    ];

    const calcularPuntuacionCaidas = () => {
        let puntaje = 0;
        if (respuestas.caidas.neededMedicalAssistance) puntaje += 1;
        if (respuestas.caidas.couldNotGetUp) puntaje += 1;
        if (respuestas.caidas.fearOfFalling) puntaje += 1;
        console.log(puntaje);

        return puntaje;
    };

    const calcularPuntuacionCognitivo = () => {
        let puntaje = 0;
        if (respuestas.cognitivo.rememberQuickly) puntaje += 1;
        if (respuestas.cognitivo.rememberSlowly) puntaje += 1;
        if (respuestas.cognitivo.affectsDailyActivities) puntaje += 1;
        console.log(puntaje);
        return puntaje;
    };

    const handleSarcopeniaChange = (key: string, value: number) => {
        setRespuestas(prev => ({
            ...prev,
            sarcopenia: {
                ...prev.sarcopenia,
                [key]: value
            }
        }));
    };

    const handleCaidasChange = (key: string, value: boolean) => {
        setRespuestas(prev => ({
            ...prev,
            caidas: {
                ...prev.caidas,
                [key]: value
            }
        }));
    };

    const handleCognitivoChange = (key: string, value: boolean) => {
        setRespuestas(prev => ({
            ...prev,
            cognitivo: {
                ...prev.cognitivo,
                [key]: value
            }
        }));
    };

    const handleIncontinenciaChange = (key: string, value: any) => {
        setRespuestas(prev => ({
            ...prev,
            incontinencia: {
                ...prev.incontinencia,
                [key]: value
            }
        }));
    };

    const calcularPuntuacionSarcopenia = () => {
        return Object.values(respuestas.sarcopenia).reduce((acc, curr) => acc + (curr || 0), 0);
    };

    const interpretarSarcopenia = (puntaje: number) => {
        return puntaje < 4 ? "Bajo riesgo de sarcopenia" : "Alto riesgo de sarcopenia (≥4 puntos)";
    };

    const calcularPuntuacionICIQ = () => {
        const { icqFrequency = 0, icqAmount = 0, icqImpact = 0 } = respuestas.incontinencia;
        return icqFrequency + icqAmount + icqImpact;
    };

    const interpretarICIQ = (puntaje: number) => {
        if (puntaje <= 5) return "Incontinencia leve";
        if (puntaje <= 12) return "Incontinencia moderada";
        return "Incontinencia severa";
    };

    const saveFile = async () => {
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

            const existingData: string[][] = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                defval: ""
            });

            const lastRowIndex = existingData.length - 1;

            if (lastRowIndex >= 0) {
                while (existingData[lastRowIndex].length < 22) {
                    existingData[lastRowIndex].push("");
                }

                const puntajeSarcopenia = calcularPuntuacionSarcopenia();
                existingData[lastRowIndex][17] = puntajeSarcopenia.toString();

                const puntajeCaida = calcularPuntuacionCaidas();
                existingData[lastRowIndex][18] = puntajeCaida.toString();

                const puntajeDeterioro = calcularPuntuacionCognitivo();
                existingData[lastRowIndex][19] = puntajeDeterioro.toString();

                const puntajeICIQ = calcularPuntuacionICIQ();
                existingData[lastRowIndex][20] = puntajeICIQ.toString();
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

            form.resetFields();
            alert("Resultados guardados exitosamente");
            router.push('/syndromes/second');

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
        <div className="w-full">
            <Title
                level={3}
                style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    color: '#1890ff',
                    fontWeight: 500
                }}
            >
                SÍNDROMES GERIÁTRICOS
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card title="SARCOPENIA (SARC-F)" className="!h-full !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
                        <Form layout="vertical">
                            {preguntasSarcopenia.map((pregunta) => (
                                <Form.Item
                                    key={pregunta.key}
                                    label={pregunta.texto}
                                    className="mb-4"
                                >
                                    <Select
                                        placeholder={`- Seleccione -`}
                                        onChange={(value) => handleSarcopeniaChange(pregunta.key, value)}
                                        value={respuestas.sarcopenia[pregunta.key]}
                                    >
                                        {pregunta.opciones.map((opcion) => (
                                            <Select.Option
                                                key={`${pregunta.key}-${opcion.valor}`}
                                                value={opcion.valor}
                                            >
                                                {opcion.label} ({opcion.valor} puntos)
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            ))}

                            <Divider />

                            <Row gutter={16} className="mb-4">
                                <Col span={12}>
                                    <Text strong>PUNTAJE TOTAL:</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className="font-mono bg-gray-100 px-4 py-2 inline-block">
                                        {calcularPuntuacionSarcopenia()}
                                    </Text>
                                </Col>
                            </Row>

                            <Row gutter={16} className="mb-4">
                                <Col span={12}>
                                    <Text strong>INTERPRETACIÓN:</Text>
                                </Col>
                                <Col span={12} className="text-right">
                                    <Text className="font-mono bg-gray-100 px-4 py-2 inline-block">
                                        {interpretarSarcopenia(calcularPuntuacionSarcopenia())}
                                    </Text>
                                </Col>
                            </Row>

                            {calcularPuntuacionSarcopenia() >= 4 && (
                                <Alert
                                    message="Alto riesgo de sarcopenia detectado"
                                    description="Un puntaje de 4 o más puntos sugiere alto riesgo de sarcopenia. Se recomienda evaluación adicional."
                                    type="warning"
                                    showIcon
                                    className="my-4"
                                />
                            )}
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <div className="h-1/2 pb-4">
                        <Card title="CAÍDAS" className="h-full !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
                            <Form form={form} layout="vertical">
                                <Form.Item name="hasFallen" valuePropName="checked">
                                    <Checkbox
                                        onChange={(e) => {
                                            handleCaidasChange("hasFallen", e.target.checked);
                                            setShowFallQuestions(e.target.checked);
                                        }}
                                        checked={respuestas.caidas.hasFallen}
                                    >
                                        ¿Se ha caído en el último año?
                                    </Checkbox>
                                </Form.Item>

                                {showFallQuestions ? (
                                    <>
                                        <Divider orientation="left" plain>Preguntas adicionales</Divider>
                                        <Form.Item name="neededMedicalAssistance" valuePropName="checked">
                                            <Checkbox
                                                onChange={(e) => handleCaidasChange("neededMedicalAssistance", e.target.checked)}
                                                checked={respuestas.caidas.neededMedicalAssistance}
                                            >
                                                ¿Necesitó asistencia médica? (+1)
                                            </Checkbox>
                                        </Form.Item>
                                        <Form.Item name="couldNotGetUp" valuePropName="checked">
                                            <Checkbox
                                                onChange={(e) => handleCaidasChange("couldNotGetUp", e.target.checked)}
                                                checked={respuestas.caidas.couldNotGetUp}
                                            >
                                                ¿No pudo levantarse después de 15 minutos? (+1)
                                            </Checkbox>
                                        </Form.Item>
                                        <Form.Item name="fearOfFalling" valuePropName="checked">
                                            <Checkbox
                                                onChange={(e) => handleCaidasChange("fearOfFalling", e.target.checked)}
                                                checked={respuestas.caidas.fearOfFalling}
                                            >
                                                ¿Tiene miedo a volverse a caer? (+1)
                                            </Checkbox>
                                        </Form.Item>
                                        <Divider />
                                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                                            <Text strong>Puntaje de Riesgo de Caídas: </Text>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                                {calcularPuntuacionCaidas()} / 3
                                            </Text>
                                        </div>
                                    </>
                                ) : <div className="w-full flex justify-center italic"><Text>Selecciona para ver preguntas adicionales.</Text></div>}
                            </Form>
                        </Card>
                    </div>
                    <Card title="DETERIORO COGNITIVO" className="h-1/2 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
                        <Form form={form} layout="vertical">
                            <Form.Item name="forgetsRecentEvents" valuePropName="checked">
                                <Checkbox
                                    onChange={(e) => {
                                        handleCognitivoChange("forgetsRecentEvents", e.target.checked);
                                        setShowCognitiveQuestions(e.target.checked);
                                    }}
                                    checked={respuestas.cognitivo.forgetsRecentEvents}
                                >
                                    ¿Se olvida de hechos recientes?
                                </Checkbox>
                            </Form.Item>

                            {showCognitiveQuestions ? (
                                <>
                                    <Divider orientation="left" plain>Preguntas adicionales</Divider>
                                    <Form.Item name="rememberQuickly" valuePropName="checked">
                                        <Checkbox
                                            onChange={(e) => handleCognitivoChange("rememberQuickly", e.target.checked)}
                                            checked={respuestas.cognitivo.rememberQuickly}
                                        >
                                            ¿Tarda poco en acordarse? (minutos) (+1)
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item name="rememberSlowly" valuePropName="checked">
                                        <Checkbox
                                            onChange={(e) => handleCognitivoChange("rememberSlowly", e.target.checked)}
                                            checked={respuestas.cognitivo.rememberSlowly}
                                        >
                                            ¿Tarda mucho en acordarse? (horas) (+2)
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item name="affectsDailyActivities" valuePropName="checked">
                                        <Checkbox
                                            onChange={(e) => handleCognitivoChange("affectsDailyActivities", e.target.checked)}
                                            checked={respuestas.cognitivo.affectsDailyActivities}
                                        >
                                            ¿Afecta sus actividades cotidianas? (+3)
                                        </Checkbox>
                                    </Form.Item>
                                    <Divider />
                                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                                        <Text strong>Puntaje de Deterioro Cognitivo: </Text>
                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                            {calcularPuntuacionCognitivo()} / 3
                                        </Text>
                                    </div>
                                </>
                            ) : <div className="w-full flex justify-center italic"><Text>Selecciona para ver preguntas adicionales.</Text></div>}
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="INCONTINENCIA URINARIA (ICIQ-SF)" className="h-full !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="1. ¿Con qué frecuencia pierde orina?"
                                name="icqFrequency"
                            >
                                <Select
                                    placeholder="Seleccione una opción"
                                    onChange={(value) => handleIncontinenciaChange("icqFrequency", value)}
                                    value={respuestas.incontinencia.icqFrequency}
                                >
                                    {frequencyOptions.map((option) => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="2. ¿Qué cantidad de orina cree que pierde habitualmente?"
                                name="icqAmount"
                            >
                                <Select
                                    placeholder="Seleccione una opción"
                                    onChange={(value) => handleIncontinenciaChange("icqAmount", value)}
                                    value={respuestas.incontinencia.icqAmount}
                                >
                                    {amountOptions.map((option) => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="3. ¿En qué medida estos escapes de orina afectan su vida diaria?"
                                name="icqImpact"
                            >
                                <Slider
                                    min={1}
                                    max={10}
                                    marks={{
                                        1: '1 (Nada)',
                                        5: '5',
                                        10: '10 (Mucho)'
                                    }}
                                    onChange={(value) => handleIncontinenciaChange("icqImpact", value)}
                                    value={respuestas.incontinencia.icqImpact}
                                />
                            </Form.Item>

                            <Form.Item
                                label="4. ¿Cuándo pierde orina?"
                                name="icqSituations"
                            >
                                <Checkbox.Group
                                    options={situationOptions}
                                    onChange={(values) => handleIncontinenciaChange("icqSituations", values)}
                                    value={respuestas.incontinencia.icqSituations}
                                    style={{ display: "flex", flexDirection: "column" }}

                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                onClick={() => setShowICIQResult(true)}
                                block
                            >
                                Calcular Puntuación
                            </Button>

                            {showICIQResult && (
                                <div className="mt-6 p-4 bg-gray-50 rounded">
                                    <Title level={4} className="!mb-2">Resultados ICIQ-SF</Title>
                                    <Text strong>Puntuación Total: </Text>
                                    <Text>{calcularPuntuacionICIQ()}</Text>
                                    <br />
                                    <Text strong>Interpretación: </Text>
                                    <Text>{interpretarICIQ(calcularPuntuacionICIQ())}</Text>

                                    {calcularPuntuacionICIQ() > 5 && (
                                        <Alert
                                            message="Recomendación"
                                            description="Se sugiere evaluación urológica/geriátrica adicional."
                                            type="info"
                                            showIcon
                                            className="mt-4"
                                        />
                                    )}
                                </div>
                            )}
                        </Form>
                    </Card>
                </Col>
            </Row>

            <div className="flex justify-center gap-4 mt-8">
                <Link href="/">
                    <Button type="default" icon={<ArrowLeftOutlined />} size="large">
                        Volver
                    </Button>
                </Link>

                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    size="large"
                    onClick={saveFile}
                >
                    Guardar Todos los Resultados
                </Button>
            </div>
        </div>
    );
};

export default SARCFTest;