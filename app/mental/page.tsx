"use client";

import { useState } from 'react';
import { Form, Radio, Button, Card, Typography, Progress, Divider, Row, Col, Statistic } from 'antd';
import { CheckOutlined, SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons';
import { useGlobalContext } from '../context/GlobalContext';
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

type DimensionKey = 'PHYSICAL' | 'MENTAL';

interface DimensionConfig {
    name: string;
    description: string;
    questionIndexes: number[];
    maxScore: number;
    icon: React.ReactNode;
}

type DimensionsConfig = {
    [key in DimensionKey]: DimensionConfig;
};

interface SurveyResults {
    dimensions: {
        [key in DimensionKey]: {
            score: number;
        } & DimensionConfig;
    };
    totalScore: number;
    answers: Record<string, string>;
}

const HealthSurvey = () => {
    const [form] = Form.useForm();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState<SurveyResults | null>(null);
    const { fileHandle } = useGlobalContext();
    const router = useRouter();

    const dimensionsConfig: DimensionsConfig = {
        PHYSICAL: {
            name: "DIMENSIÓN FÍSICA",
            description: "Evalúa el estado de salud física y limitaciones funcionales",
            questionIndexes: [0, 1, 2, 3, 4, 7],
            maxScore: 100,
            icon: <MehOutlined />
        },
        MENTAL: {
            name: "DIMENSIÓN MENTAL",
            description: "Evalúa el estado emocional y bienestar psicológico",
            questionIndexes: [5, 6, 8, 9, 10, 11],
            maxScore: 100,
            icon: <SmileOutlined />
        }
    };

    const questionGroups = [
        {
            title: "Estado de salud general",
            description: "Esta sección evalúa su percepción general sobre su salud.",
            questions: [
                {
                    question: "1. En general, usted diría que su salud es:",
                    options: ["Excelente", "Muy buena", "Buena", "Regular", "Mala"],
                    type: "radio",
                    scores: [100, 75, 50, 25, 0]
                }
            ]
        },
        {
            title: "Limitaciones físicas",
            description: "Las siguientes preguntas se refieren a actividades o cosas que usted podría hacer en un día normal. Su salud actual, ¿Le limita para hacer esas actividades o cosas? Si es así, ¿Cuánto?",
            questions: [
                {
                    question: "2. Esfuerzos moderados, como mover una mesa, pasar la aspiradora, jugar a los bolos o caminar más de una hora.",
                    options: ["Sí, me limita mucho", "Sí, me limita un poco", "No, no me limita nada"],
                    type: "radio",
                    scores: [0, 50, 100]
                },
                {
                    question: "3. Subir varios pisos por la escalera.",
                    options: ["Sí, me limita mucho", "Sí, me limita un poco", "No, no me limita nada"],
                    type: "radio",
                    scores: [0, 50, 100]
                }
            ]
        },
        {
            title: "Impacto en actividades (salud física)",
            description: "Durante las 4 últimas semanas, ¿Ha tenido alguno de los siguientes problemas en su trabajo o en sus actividades cotidianas, a causa de su salud física?",
            questions: [
                {
                    question: "4. ¿Hizo menos de lo que hubiera querido hacer?",
                    options: ["Sí", "No"],
                    type: "radio",
                    scores: [100, 0]
                },
                {
                    question: "5. ¿Tuvo que dejar de hacer algunas tareas en su trabajo o en sus actividades cotidianas?",
                    options: ["Sí", "No"],
                    type: "radio",
                    scores: [100, 0]
                }
            ]
        },
        {
            title: "Impacto emocional",
            description: "Durante las 4 últimas semanas, ¿Ha tenido algunos de los siguientes problemas en su trabajo o en sus actividades cotidianas, a causa de algún problema emocional (como estar triste, deprimido o nervioso)?",
            questions: [
                {
                    question: "6. ¿Hizo menos de lo que hubiera querido hacer, a causa de algún problema emocional?",
                    options: ["Sí", "No"],
                    type: "radio",
                    scores: [100, 0]
                },
                {
                    question: "7. ¿No hizo su trabajo o sus actividades cotidianas tan cuidadosamente como de costumbre, a causa de algún problema emocional?",
                    options: ["Sí", "No"],
                    type: "radio",
                    scores: [100, 0]
                },
                {
                    question: "8. ¿Hasta qué punto el dolor le ha dificultado su trabajo habitual (incluido el trabajo fuera de casa y las tareas domésticas)?",
                    options: ["Nada", "Un poco", "Regular", "Bastante", "Mucho"],
                    type: "radio",
                    scores: [0, 25, 50, 75, 100]
                }
            ]
        },
        {
            title: "Bienestar emocional",
            description: "Las preguntas que siguen se refieren a cómo se ha sentido y cómo le han ido las cosas durante las 4 últimas semanas. En cada pregunta responda lo que se parezca más a cómo se ha sentido usted. Durante las 4 últimas semanas ¿Cuánto tiempo...?",
            questions: [
                {
                    question: "9. ¿Cuánto tiempo se sintió calmado y tranquilo?",
                    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
                    type: "radio",
                    scores: [100, 80, 60, 40, 20, 0]
                },
                {
                    question: "10. ¿Cuánto tiempo tuvo mucha energía?",
                    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
                    type: "radio",
                    scores: [100, 80, 60, 40, 20, 0]
                },
                {
                    question: "11. ¿Cuánto tiempo se sintió desanimado y triste?",
                    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
                    type: "radio",
                    scores: [0, 20, 40, 60, 80, 100]
                }
            ]
        },
        {
            title: "Vida social",
            description: "Indique cómo su salud ha afectado sus relaciones sociales.",
            questions: [
                {
                    question: "12. Durante las 4 últimas semanas, ¿con qué frecuencia la salud física o los problemas emocionales le han dificultado sus actividades sociales (como visitar a los amigos o familiares)?",
                    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
                    type: "radio",
                    scores: [0, 20, 40, 60, 80, 100]
                }
            ]
        }
    ];

    const allQuestions = questionGroups.flatMap(group => group.questions);
    const totalQuestions = allQuestions.length;

    const calculateResults = (answers: Record<string, string>): SurveyResults => {
        const dimensionScores: {
            [key in DimensionKey]: {
                score: number;
            } & DimensionConfig;
        } = {} as any;

        (Object.keys(dimensionsConfig) as DimensionKey[]).forEach(dimKey => {
            dimensionScores[dimKey] = {
                score: 0,
                ...dimensionsConfig[dimKey]
            };
        });

        (Object.keys(dimensionsConfig) as DimensionKey[]).forEach(dimKey => {
            const dimension = dimensionsConfig[dimKey];
            let totalScore = 0;
            let totalPossible = 0;

            dimension.questionIndexes.forEach(qIndex => {
                const question = allQuestions[qIndex];
                const answer = answers[`q${qIndex}`];

                if (answer !== undefined) {
                    const optionIndex = question.options.indexOf(answer);
                    if (optionIndex !== -1) {
                        totalScore += question.scores[optionIndex];
                        totalPossible += 100;
                    }
                }
            });

            dimensionScores[dimKey] = {
                ...dimensionScores[dimKey],
                score: totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
            };
        });

        const totalScore = (Object.keys(dimensionScores) as DimensionKey[]).reduce(
            (sum, dimKey) => sum + dimensionScores[dimKey].score, 0
        ) / (Object.keys(dimensionScores) as DimensionKey[]).length;

        return {
            dimensions: dimensionScores,
            totalScore: Math.round(totalScore),
            answers: answers
        };
    };

    const handleNext = async () => {
        form.validateFields().then(async values => {
            const newAnswers = { ...answers, [`q${currentQuestion}`]: values.answer };
            setAnswers(newAnswers);

            if (currentQuestion < totalQuestions - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                const calculatedResults = calculateResults(newAnswers);
                setResults(calculatedResults);
                setSubmitted(true);
            }
            form.resetFields();
        });
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const resetEvaluation = () => {
        setCurrentQuestion(0);
        setSubmitted(false);
        setAnswers({});
        setResults(null);
        form.resetFields();
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
                while (existingData[lastRowIndex].length < 18) {
                    existingData[lastRowIndex].push(0);
                }

                existingData[lastRowIndex][27] = results!.totalScore;
                existingData[lastRowIndex][28] = results!.dimensions.PHYSICAL.score;
                existingData[lastRowIndex][29] = results!.dimensions.MENTAL.score;
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
            router.push('');

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

    if (submitted && results) {
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
                    VALORACIÓN MENTAL
                </Title>
                <Card>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <CheckOutlined style={{ fontSize: 48, color: "#52c41a" }} />
                        <Title level={3}>¡Evaluación completada!</Title>
                        <Text type="secondary">A continuación se muestran sus resultados</Text>
                    </div>

                    <Divider orientation="left">RESULTADOS</Divider>

                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        {Object.values(results.dimensions).map((dimension: any, index) => (
                            <Col span={12} key={index} style={{ marginBottom: 16 }}>
                                <Card>
                                    <Statistic
                                        title={dimension.name}
                                        value={dimension.score}
                                        suffix="/ 100"
                                        prefix={dimension.icon}
                                    />
                                    <Text type="secondary" style={{ fontSize: 12 }}>{dimension.description}</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <Progress
                                            percent={dimension.score}
                                            status={dimension.score >= 70 ? 'success' : dimension.score >= 40 ? 'normal' : 'exception'}
                                            showInfo={false}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Divider />

                    <div style={{ textAlign: 'center' }}>
                        <Statistic
                            title="PUNTAJE TOTAL"
                            value={results.totalScore}
                            suffix="/ 100"
                            prefix={<FrownOutlined />}
                            style={{ marginBottom: 8 }}
                        />
                        <Progress
                            percent={results.totalScore}
                            status={results.totalScore >= 70 ? 'success' : results.totalScore >= 40 ? 'normal' : 'exception'}
                            style={{ maxWidth: 400, margin: '0 auto' }}
                        />
                    </div>

                    <Divider />

                    <div className='w-full flex justify-end items-center'>
                        <Button
                            onClick={resetEvaluation}
                        >
                            Realizar nueva evaluación
                        </Button>
                        <Button type="primary"
                            className='!ml-2'
                            onClick={handleSaveData}
                        >
                            Guardar Datos
                        </Button>
                    </div>

                </Card>
            </div>
        );
    }

    const getCurrentGroup = () => {
        let accumulated = 0;
        for (const group of questionGroups) {
            if (currentQuestion < accumulated + group.questions.length) {
                return {
                    group,
                    isFirstInGroup: currentQuestion === accumulated,
                    groupStartIndex: accumulated
                };
            }
            accumulated += group.questions.length;
        }
        return { group: questionGroups[0], isFirstInGroup: true, groupStartIndex: 0 };
    };

    const { group, isFirstInGroup } = getCurrentGroup();

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
                VALORACIÓN MENTAL
            </Title>

            <Card title="CALIDAD DE VIDA RELACIONADA A LA SALUD SF-12">
                <div style={{ marginBottom: 16 }}>
                    <Progress
                        percent={Math.round((currentQuestion / totalQuestions) * 100)}
                        showInfo={false}
                    />
                    <div style={{ textAlign: "right" }}>
                        Pregunta {currentQuestion + 1} de {totalQuestions}
                    </div>
                </div>

                {isFirstInGroup && (
                    <>
                        <Title level={4} style={{ marginBottom: 8 }}>{group.title}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>{group.description}</Text>
                        <Divider style={{ margin: '16px 0' }} />
                    </>
                )}

                <Form form={form} layout="vertical">
                    <Title level={4} style={{ marginBottom: 24 }}>
                        {allQuestions[currentQuestion].question}
                    </Title>

                    <Form.Item
                        name="answer"
                        rules={[{ required: true, message: 'Por favor seleccione una opción' }]}
                    >
                        <Radio.Group>
                            {allQuestions[currentQuestion].options.map((option, index) => (
                                <Radio key={index} value={option} style={{ display: "block", marginBottom: 8 }}>
                                    {option}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </Form.Item>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                        <Button
                            onClick={handlePrev}
                            disabled={currentQuestion === 0}
                        >
                            Anterior
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleNext}
                        >
                            {currentQuestion === totalQuestions - 1 ? "Finalizar evaluación" : "Siguiente"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default HealthSurvey;