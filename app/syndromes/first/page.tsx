"use client";
import { useState } from "react";
import { Row, Col, Typography, Button, notification, Space, Divider } from "antd";
import { ArrowLeftOutlined, SaveOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useRouter } from 'next/navigation';
import { actualizarResultado } from "@/app/lib/pacienteService";
import { AllResponses } from "../../type";

import SarcopeniaCard from "./SarcopeniaCard";
import FallsCard from "./FallsCard";
import CognitiveCard from "./CognitiveCard";
import IncontinenceCard from "./IncontinenceCard";

const { Title, Text } = Typography;

export default function SyndromesPage() {
    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { currentPatient, currentResultId } = useGlobalContext();
    const router = useRouter();

    const [responses, setResponses] = useState<AllResponses>({
        sarcopenia: {},
        falls: { hasFallen: false },
        cognitive: { forgetsRecentEvents: false },
        incontinence: { situations: [] }
    });

    const handleResponseChange = (section: keyof AllResponses, key: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [section]: { ...prev[section], [key]: value }
        }));
    };

    const saveToFirebase = async () => {
        if (!currentPatient?.dni) return api.error({ message: "Error", description: "No hay paciente seleccionado" });

        setLoading(true);
        try {
            // Cálculos
            const sarcScore = Object.values(responses.sarcopenia).reduce((acc, curr) => acc + (curr || 0), 0);

            const fallsScore = [
                responses.falls.neededMedicalAssistance,
                responses.falls.couldNotGetUp,
                responses.falls.fearOfFalling
            ].filter(Boolean).length;

            const cognitiveScore = [
                responses.cognitive.rememberQuickly,
                responses.cognitive.rememberSlowly,
                responses.cognitive.affectsDailyActivities
            ].filter(Boolean).length;

            const incontinenceScore = (responses.incontinence.frequency || 0) +
                (responses.incontinence.amount || 0) +
                (responses.incontinence.impact || 0) +
                (responses.incontinence.situations?.length || 0);

            await Promise.all([
                actualizarResultado(currentPatient.dni, currentResultId || "", 'sarcopenia', sarcScore.toString()),
                actualizarResultado(currentPatient.dni, currentResultId || "", 'caida', fallsScore.toString()),
                actualizarResultado(currentPatient.dni, currentResultId || "", 'deterioro', cognitiveScore.toString()),
                actualizarResultado(currentPatient.dni, currentResultId || "", 'incontinencia', incontinenceScore.toString())
            ]);

            api.success({ message: 'Guardado exitoso', description: 'Evaluación registrada correctamente.' });
            router.push('/syndromes/second');

        } catch (err: any) {
            console.error(err);
            api.error({ message: 'Error', description: err.message || 'Intente nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 bg-gray-50">
            {contextHolder}
            <div className="text-center mb-8">
                <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
                    <MedicineBoxOutlined className="mr-2" />
                    Valoración de Síndromes Geriátricos
                </Title>
                <Text type="secondary" className="text-lg">Evaluación de síndromes clínicos</Text>
                <Divider />
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={8} className="flex flex-col h-full">
                    <div className="h-full">
                        <SarcopeniaCard
                            responses={responses.sarcopenia}
                            onResponseChange={(k, v) => handleResponseChange('sarcopenia', k, v)}
                        />
                    </div>
                </Col>
                <Col xs={24} lg={8}>
                    <div className="flex flex-col gap-6 h-full">
                        <div className="flex-1">
                            <FallsCard
                                responses={responses.falls}
                                onResponseChange={(k, v) => handleResponseChange('falls', k, v)}
                            />
                        </div>
                        <div className="flex-1">
                            <CognitiveCard
                                responses={responses.cognitive}
                                onResponseChange={(k, v) => handleResponseChange('cognitive', k, v)}
                            />
                        </div>
                    </div>
                </Col>
                <Col xs={24} lg={8} className="flex flex-col">
                    <div className="h-full">
                        <IncontinenceCard
                            responses={responses.incontinence}
                            onResponseChange={(k, v) => handleResponseChange('incontinence', k, v)}
                        />
                    </div>
                </Col>
            </Row>
            <Divider className="my-8" />
            <div className="flex justify-center gap-4 pb-8">
                <Link href="/">
                    <Button size="large" icon={<ArrowLeftOutlined />}>Volver</Button>
                </Link>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={loading}
                    onClick={saveToFirebase}
                    className="bg-blue-600 hover:bg-blue-500 shadow-md"
                >
                    Guardar Resultados
                </Button>
            </div>
        </div>
    );
}