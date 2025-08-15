"use client";
import { useState } from "react";
import { Row, Col, Typography, Button, Divider, notification } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useRouter } from 'next/navigation';
import SarcopeniaCard from "./SarcopeniaCard";
import FallsCard from "./FallsCard";
import CognitiveCard from "./CognitiveCard";
import IncontinenceCard from "./IncontinenceCard";
import { AllResponses } from "../../type";
import { actualizarResultado } from "@/app/lib/pacienteService";

const { Title } = Typography;

export default function SyndromesPage() {

    const [loading, setLoading] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { currentPatient, currentResultId } = useGlobalContext();
    const router = useRouter();

    const [responses, setResponses] = useState<AllResponses>({
        sarcopenia: {},
        falls: {},
        cognitive: {},
        incontinence: {
            situations: [],
            situationsScore: 0
        }
    });

    const handleResponseChange = (section: keyof AllResponses, key: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const saveToFirebase = async () => {
        try {
            setLoading(true);

            if (!currentPatient?.dni) {
                throw new Error("No se ha seleccionado un paciente");
            }
            const sarc = Object.values(responses.sarcopenia).reduce((acc, curr) => acc + (curr || 0), 0);

            const sarcopenia = sarc.toString();

            const fallsScore = [
                responses.falls.neededMedicalAssistance,
                responses.falls.couldNotGetUp,
                responses.falls.fearOfFalling
            ].filter(Boolean).length;

            const caida = fallsScore.toString();

            const cognitiveScore = [
                responses.cognitive.rememberQuickly,
                responses.cognitive.rememberSlowly,
                responses.cognitive.affectsDailyActivities
            ].filter(Boolean).length;

            const deterioro = cognitiveScore.toString();

            const incontinenceScore = (responses.incontinence.frequency || 0) +
                (responses.incontinence.amount || 0) +
                (responses.incontinence.impact || 0);

            const incontinencia = incontinenceScore.toString();

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'sarcopenia',
                sarcopenia
            );

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'caida',
                caida
            );

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'deterioro',
                deterioro
            );

            await actualizarResultado(
                currentPatient.dni,
                currentResultId || "",
                'incontinencia',
                incontinencia
            );

            api.success({
                message: 'Éxito',
                description: 'Resultados de ABVD y AIVD guardados correctamente',
                placement: 'topRight'
            });

            router.push('/syndromes/second');
        } catch (err: unknown) {
            console.error("Error al guardar:", err);
            api.error({
                message: 'Error',
                description: err instanceof Error ? err.message : 'Ocurrió un error al guardar',
                placement: 'topRight'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {contextHolder}
            <Title level={3} style={{
                textAlign: 'center',
                marginBottom: '24px',
                color: '#1890ff',
                fontWeight: 500
            }}>
                SÍNDROMES GERIÁTRICOS
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <SarcopeniaCard
                        responses={responses.sarcopenia}
                        onResponseChange={(key, value) => handleResponseChange('sarcopenia', key, value)}
                    />
                </Col>

                <Col xs={24} md={8}>
                    <FallsCard
                        responses={responses.falls}
                        onResponseChange={(key, value) => handleResponseChange('falls', key, value)}
                    />
                    <Divider />
                    <CognitiveCard
                        responses={responses.cognitive}
                        onResponseChange={(key, value) => handleResponseChange('cognitive', key, value)}
                    />
                </Col>

                <Col xs={24} md={8}>
                    <IncontinenceCard
                        responses={responses.incontinence}
                        onResponseChange={(key, value) => handleResponseChange('incontinence', key, value)}
                    />
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
                    loading={loading}
                    onClick={saveToFirebase}
                >
                    Guardar Todos los Resultados
                </Button>
            </div>
        </div>
    );
}