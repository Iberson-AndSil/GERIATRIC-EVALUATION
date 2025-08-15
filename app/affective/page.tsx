'use client';
import { useState } from 'react';
import * as XLSX from "xlsx";
import { Typography, Select, Row, Col, Card, Result, Button, notification } from 'antd';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { actualizarResultado } from '../lib/pacienteService';

const { Title } = Typography;
const { Option } = Select;
type Respuesta = 'si' | 'no';
type Respuestas = { [key: number]: Respuesta };

const preguntas: { texto: string; sumaSiEs: Respuesta }[] = [
  { texto: "¿Está satisfecho/a con su vida?", sumaSiEs: 'no' },
  { texto: "¿Ha abandonado tareas habituales y aficiones?", sumaSiEs: 'si' },
  { texto: "¿Siente que su vida está vacía?", sumaSiEs: 'si' },
  { texto: "¿Se siente frecuentemente aburrido/a?", sumaSiEs: 'si' },
  { texto: "¿Está de buen humor la mayor parte del tiempo?", sumaSiEs: 'no' },
  { texto: "¿Teme que algo malo ocurra?", sumaSiEs: 'si' },
  { texto: "¿Se siente feliz la mayor parte del tiempo?", sumaSiEs: 'no' },
  { texto: "¿Se siente desamparado/a, desprotegido/a?", sumaSiEs: 'si' },
  { texto: "¿Prefiere quedarse en casa más que salir?", sumaSiEs: 'si' },
  { texto: "¿Tiene más problemas de memoria que otros?", sumaSiEs: 'si' },
  { texto: "¿Piensa que es estupendo estar vivo?", sumaSiEs: 'no' },
  { texto: "¿Se siente inútil?", sumaSiEs: 'si' },
  { texto: "¿Se siente lleno/a de energía?", sumaSiEs: 'no' },
  { texto: "¿Se siente sin esperanza?", sumaSiEs: 'si' },
  { texto: "¿Cree que otros están en mejor situación?", sumaSiEs: 'si' },
];

export default function Cuestionario() {
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const { currentPatient, currentResultId } = useGlobalContext();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: Respuesta) => {
    setRespuestas(prev => ({ ...prev, [index]: value }));
  };

  const contarPuntos = () =>
    preguntas.reduce((acum, { sumaSiEs }, index) => {
      const resp = respuestas[index];
      return resp === sumaSiEs ? acum + 1 : acum;
    }, 0);

  const interpretacion = () => {
    const total = contarPuntos();
    if (total <= 4) return "Normal";
    if (total <= 8) return "Depresión leve";
    if (total <= 11) return "Depresión moderada";
    return "Depresión severa";
  };

  const handleSaveData = async () => {
    try {
      setLoading(true);

      if (!currentPatient?.dni) {
        throw new Error("No se ha seleccionado un paciente");
      }

      const afectiva = contarPuntos();
      await actualizarResultado(
        currentPatient!.dni,
        currentResultId || "",
        'afectiva',
        afectiva
      );

      api.success({
        message: 'Éxito',
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      router.push('/nutritional');

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

  const todasRespondidas = Object.keys(respuestas).length === preguntas.length;

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 24 }}>
      <Title level={3}>Escala GDS-15 (Yesavage)</Title>
      {contextHolder}
      <Row gutter={[16, 16]}>
        {preguntas.map((pregunta, index) => (
          <Col key={index} xs={24} sm={12}>
            <Card size="small">
              <div style={{ marginBottom: 8 }}>
                <strong>{index + 1}.</strong> {pregunta.texto}
              </div>
              <Select
                placeholder="Seleccione"
                value={respuestas[index]}
                onChange={(value) => handleChange(index, value as Respuesta)}
                style={{ width: '100%' }}
              >
                <Option value="si">Sí</Option>
                <Option value="no">No</Option>
              </Select>
            </Card>
          </Col>
        ))}
      </Row>

      {todasRespondidas && (
        <Card style={{ marginTop: 32 }}>
          <Result
            status="success"
            title={`Puntaje total: ${contarPuntos()} / 15`}
            subTitle={`Interpretación: ${interpretacion()}`}
          />
        </Card>
      )}

      <Row key="actions" className="m-12 flex justify-center">
        <Col>
          <Link href="/moca" passHref>
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
            onClick={handleSaveData}
            style={{ minWidth: '120px' }}
            disabled={!currentPatient}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {currentPatient ? "Guardar Paciente" : "Seleccione archivo primero"}
          </Button>
        </Col>
      </Row>
    </div>
  );
}
