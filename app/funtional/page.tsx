"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Form, Typography, Button, Row, Col, notification } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";

import ABVDForm from "./ABVDForm";
import AIVDForm from "./AIVDForm";
import { PuntajesType, RespuestasType } from "../type";
import { useGlobalContext } from "@/app/context/GlobalContext";
import { actualizarResultado } from "../lib/pacienteService";

const { Title } = Typography;

export default function FunctionalAssessmentPage() {
  const [puntajes, setPuntajes] = useState<PuntajesType>({
    comer: null,
    trasladarse: null,
    aseo: null,
    retrete: null,
    banarse: null,
    desplazarse: null,
    escaleras: null,
    vestirse: null,
    heces: null,
    orina: null,
  });

  const [respuestas, setRespuestas] = useState<RespuestasType>({});
  const { currentPatient, currentResultId } = useGlobalContext();
  const router = useRouter();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const saveToFirebase = async () => {
    try {
      setLoading(true);

      if (!currentPatient?.dni) {
        throw new Error("No se ha seleccionado un paciente");
      }

      const abvdScore = obtenerPuntajeTotal();
      const aivdScore = puntajeTotal();

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'abvdScore',
        abvdScore
      );

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'aivdScore',
        aivdScore
      );

      api.success({
        message: 'Éxito',
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      form.resetFields();
      setPuntajes({
        comer: null,
        trasladarse: null,
        aseo: null,
        retrete: null,
        banarse: null,
        desplazarse: null,
        escaleras: null,
        vestirse: null,
        heces: null,
        orina: null,
      });

      router.push('/syndromes/first');
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

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce(
      (acc: any, curr: any) => acc + (curr || 0),
      0
    );
  };

  const obtenerInterpretacion = () => {
    const total = obtenerPuntajeTotal();
    if (total >= 100) return "Independiente";
    if (total >= 60) return "Dependencia leve";
    if (total >= 40 && total <= 55) return "Dependencia moderada";
    if (total >= 20 && total <= 35) return "Dependencia grave";
    return "Dependencia total";
  };

  const puntajeTotal = () => {
    return Object.values(respuestas).reduce((acc: any, curr: any) => acc + (curr || 0), 0);
  };

  const interpretacionAIVD = () => {
    const total = puntajeTotal();
    if (total <= 3) return "Función Normal";
    if (total >= 4) return "Dependencia Funcional";
    return "Disfunción severa";
  };

  return (
    <div className="p-4 w-full flex flex-col items-center">
      {contextHolder}
      <Title
        level={3}
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#1890ff',
          fontWeight: 500
        }}
      >
        VALORACIÓN FUNCIONAL
      </Title>

      <div className="flex w-full">
        <Col xs={24} md={12}>
          <ABVDForm
            puntajes={puntajes}
            setPuntajes={setPuntajes}
            total={obtenerPuntajeTotal()}
            interpretacion={obtenerInterpretacion()}
          />
        </Col>

        <Col xs={24} md={12}>
          <AIVDForm
            respuestas={respuestas}
            setRespuestas={setRespuestas}
            total={puntajeTotal()}
            interpretacion={interpretacionAIVD()}
          />
        </Col>
      </div>

      <Row key="actions" justify="space-between" className="m-12">
        <Col>
          <Link href="/family/personals" passHref>
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
            onClick={saveToFirebase}
            style={{ minWidth: '120px' }}
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