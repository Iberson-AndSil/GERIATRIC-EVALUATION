"use client";
import { useState } from "react";
import { Row, Col, Typography, Button, Divider } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { useRouter } from 'next/navigation';
import SarcopeniaCard from "./SarcopeniaCard";
import FallsCard from "./FallsCard";
import CognitiveCard from "./CognitiveCard";
import IncontinenceCard from "./IncontinenceCard";
import { AllResponses } from "../../type";
import * as XLSX from "xlsx";

const { Title } = Typography;

export default function SyndromesPage() {
    const [responses, setResponses] = useState<AllResponses>({
        sarcopenia: {},
        falls: {},
        cognitive: {},
        incontinence: {
            situations: [],
            situationsScore: 0
        }
    });

    const { fileHandle } = useGlobalContext();
    const router = useRouter();

    const handleResponseChange = (section: keyof AllResponses, key: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
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

                const sarcopeniaScore = Object.values(responses.sarcopenia).reduce((acc, curr) => acc + (curr || 0), 0);
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
                    (responses.incontinence.impact || 0);

                existingData[lastRowIndex][17] = sarcopeniaScore.toString();
                existingData[lastRowIndex][18] = fallsScore.toString();
                existingData[lastRowIndex][19] = cognitiveScore.toString();
                existingData[lastRowIndex][20] = incontinenceScore.toString();
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
                    onClick={saveFile}
                >
                    Guardar Todos los Resultados
                </Button>
            </div>
        </div>
    );
}