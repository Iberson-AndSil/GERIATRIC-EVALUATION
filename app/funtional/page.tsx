"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Form, Typography, Button, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import * as XLSX from "xlsx";

import ABVDForm from "./ABVDForm";
import AIVDForm from "./AIVDForm";
import { PuntajesType, RespuestasType } from "../type";
import { useGlobalContext } from "@/app/context/GlobalContext";

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
  const { fileHandle } = useGlobalContext();
  const router = useRouter();
  const [form] = Form.useForm();

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
        while (existingData[lastRowIndex].length < 18) {
          existingData[lastRowIndex].push("");
        }

        existingData[lastRowIndex][15] = obtenerPuntajeTotal().toString();
        existingData[lastRowIndex][16] = puntajeTotal().toString();
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
      alert("Paciente guardado exitosamente y última fila actualizada");
      router.push('/syndromes/first');

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

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce(
      (acc:any, curr:any) => acc + (curr || 0),
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
            onClick={saveFile}
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
}