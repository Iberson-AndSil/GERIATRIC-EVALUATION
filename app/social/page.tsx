"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Col, Divider, Row, Typography } from "antd";
import { ArrowLeftOutlined, MedicineBoxOutlined, SaveOutlined } from "@ant-design/icons";
import { GijonScaleSection } from "./GijonScaleSection";
import { usePatientForm } from "@/app/utils/family/usePatientForm";
import { crearRegistroResultados, actualizarResultado } from "@/app/lib/pacienteService";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useState } from "react";

const { Title, Text } = Typography;

export default function SocialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { puntajes, handleScoreChange, obtenerPuntajeTotal, gijonCategories } = usePatientForm();

    const { currentResultId, setCurrentResultId, setCurrentPatient, currentPatient, } = useGlobalContext();

    const savePatientToFirebase = async () => {
        setLoading(true);
        const score = obtenerPuntajeTotal();
        let resultadoId = currentResultId;

        if (!resultadoId) {
            if (!currentPatient) return;
            setCurrentPatient(currentPatient);
            resultadoId = await crearRegistroResultados(currentPatient.dni, score);
            setCurrentResultId(resultadoId);
            router.push("/funtional/");
        } else {
            if (!currentPatient) return;
            await actualizarResultado(currentPatient.dni, resultadoId, "gijon", score);
            router.push("/funtional/");
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
                puntajes={puntajes}
                obtenerPuntajeTotal={obtenerPuntajeTotal}
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
