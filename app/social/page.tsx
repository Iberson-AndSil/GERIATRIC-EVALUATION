"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Col, Row, Typography } from "antd";
import { ArrowLeftOutlined, MedicineBoxOutlined, SaveOutlined } from "@ant-design/icons";
import { GijonScaleSection } from "./GijonScaleSection";
import { usePatientForm } from "@/app/utils/family/usePatientForm";
import { createResultsRecord, updateResult } from "@/app/lib/pacienteService";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useState } from "react";

const { Title, Text } = Typography;

export default function SocialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { scores, handleScoreChange, getTotalScore, gijonCategories } = usePatientForm();
    const { currentResultId, setCurrentResultId, setCurrentPatient, currentPatient } = useGlobalContext();

    const savePatientToFirebase = async () => {
        setLoading(true);
        try {
            const score = getTotalScore();
            let resultadoId = currentResultId;

            if (!resultadoId) {
                if (!currentPatient) return;
                setCurrentPatient(currentPatient);
                resultadoId = await createResultsRecord(currentPatient.dni, { gijon: score });
                setCurrentResultId(resultadoId);
                router.push("/funtional/");
            } else {
                if (!currentPatient) return;
                await updateResult(currentPatient.dni, resultadoId, "gijon", score);
                router.push("/funtional/");
            }
        } catch (error) {
            console.error("Error saving social assessment:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="text-center mb-8">
                <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
                    <MedicineBoxOutlined className="mr-2" />
                    VALORACION SOCIAL
                </Title>
                <Text type="secondary" className="text-lg">Evaluación de síndromes clínicos</Text>
            </div>
            <GijonScaleSection
                categories={gijonCategories}
                handleChange={handleScoreChange}
                scores={scores}
                getTotalScore={getTotalScore}
            />

            <Row className="flex justify-center mt-12 gap-4">
                <Col>
                    <Link href="/syndromes/second" passHref>
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
                    <Button
                        type="primary"
                        size="large"
                        onClick={savePatientToFirebase}
                        style={{ minWidth: '120px' }}
                        loading={loading}
                        icon={<SaveOutlined />}
                    >
                        Guardar Paciente
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
