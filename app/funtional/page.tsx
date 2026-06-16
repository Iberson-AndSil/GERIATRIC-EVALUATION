"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Typography, Button, Row, Col, notification } from "antd";
import { ArrowLeftOutlined, MedicineBoxOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";

import ABVDForm from "./ABVDForm";
import AIVDForm from "./AIVDForm";
import { ScoresType, ResponsesType } from "../type";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { saveOrUpdateMultipleResults } from "../lib/pacienteService";

const { Title, Text } = Typography;

export default function FunctionalAssessmentPage() {
  const [abvdScores, setAbvdScores] = useState<ScoresType>({
    eat: null,
    transfer: null,
    grooming: null,
    toilet: null,
    bathing: null,
    walking: null,
    stairs: null,
    dressing: null,
    bowels: null,
    bladder: null,
  });

  const [aivdResponses, setAivdResponses] = useState<ResponsesType>({});
  const { currentPatient, currentResultId, setCurrentResultId } = useGlobalContext();
  const router = useRouter();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const saveToFirebase = async () => {
    try {
      setLoading(true);

      if (!currentPatient?.dni) {
        throw new Error("No patient has been selected");
      }

      const abvdScore = getAbvdTotalScore();
      const aivdScore = getAivdTotalScore();

      const newId = await saveOrUpdateMultipleResults(currentPatient.dni, currentResultId, {
        abvdScore: abvdScore,
        aivdScore: aivdScore
      });
      setCurrentResultId(newId);

      api.success({
        message: "Success",
        description: "ABVD and AIVD results saved successfully",
        placement: "topRight",
      });

      form.resetFields();
      setAbvdScores({
        eat: null,
        transfer: null,
        grooming: null,
        toilet: null,
        bathing: null,
        walking: null,
        stairs: null,
        dressing: null,
        bowels: null,
        bladder: null,
      });

      router.push("/mental");
    } catch (err: unknown) {
      console.error("Error saving functional assessment:", err);
      api.error({
        message: "Error",
        description: err instanceof Error ? err.message : "An error occurred while saving",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAbvdTotalScore = () => {
    return Object.values(abvdScores).reduce((acc: any, curr: any) => acc + (curr || 0), 0);
  };

  const getAbvdInterpretation = () => {
    const total = getAbvdTotalScore();
    if (total === 100) return "Independencia";
    if (total >= 91) return "Dependencia leve";
    if (total >= 61) return "Dependencia moderada";
    if (total >= 21) return "Dependencia severa";
    return "Dependencia total";
  };

  const getAivdTotalScore = () => {
    return Object.values(aivdResponses).reduce((acc: any, curr: any) => acc + (curr || 0), 0);
  };

  const getAivdInterpretation = () => {
    const total = getAivdTotalScore();
    if (total <= 3) return "Función Normal";
    if (total >= 4) return "Deterioro Funcional";
    return "Disfunción severa";
  };

  return (
    <div className="p-4 w-full flex flex-col items-center">
      {contextHolder}
      <div className="text-center mb-8">
        <Title level={3} style={{ color: "#0050b3", margin: 0 }}>
          <MedicineBoxOutlined className="mr-2" />
          Valoración Funcional
        </Title>
        <Text type="secondary" className="text-lg">
          Evaluación de síndromes clínicos
        </Text>
      </div>

      <Row gutter={[32, 32]} align="stretch">
        <Col xs={24} xl={12}>
          <div className="h-full">
            <ABVDForm
              scores={abvdScores}
              setScores={setAbvdScores}
              total={getAbvdTotalScore()}
              interpretation={getAbvdInterpretation()}
            />
          </div>
        </Col>

        <Col xs={24} xl={12}>
          <div className="h-full">
            <AIVDForm 
              responses={aivdResponses} 
              setResponses={setAivdResponses} 
              total={getAivdTotalScore()} 
              interpretation={getAivdInterpretation()} 
            />
          </div>
        </Col>
      </Row>

      <Row key="actions" justify="space-between" className="m-12">
        <Col>
          <Link href="/social" passHref>
            <Button type="default" icon={<ArrowLeftOutlined />} size="large" style={{ minWidth: "120px" }}>
              Atrás
            </Button>
          </Link>
        </Col>
        <Col>
          <Button
            className="!ml-3"
            type="primary"
            size="large"
            onClick={saveToFirebase}
            style={{ minWidth: "120px" }}
            disabled={!currentPatient}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {currentPatient?.dni ? "Guardar Resultados" : "Seleccione un paciente"}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
