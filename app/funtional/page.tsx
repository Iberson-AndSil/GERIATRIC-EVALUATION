"use client";

import { useGlobalContext } from "@/app/context/GlobalContext";
import { Form, Card, Typography, Button, Select, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { Option } = Select;

type PuntajesType = {
  comer: number | null;
  trasladarse: number | null;
  aseo: number | null;
  retrete: number | null;
  banarse: number | null;
  desplazarse: number | null;
  vestirse: number | null;
  heces: number | null;
  orina: number | null;
};

type RespuestasType = {
  [key: string]: number | null;
};

const IndiceBarthel = () => {
  const [puntajes, setPuntajes] = useState({
    comer: null,
    trasladarse: null,
    aseo: null,
    retrete: null,
    banarse: null,
    desplazarse: null,
    vestirse: null,
    heces: null,
    orina: null,
  });

  const [form] = Form.useForm();

  const [respuestas, setRespuestas] = useState<RespuestasType>({});
  const { fileHandle } = useGlobalContext();
  const router = useRouter();

  const preguntas = [
    { key: "cheques", texto: "Manejar su propio dinero" },
    { key: "preparacion_comidas", texto: "Calentar agua para café o té y apagar la cocina" },
    { key: "medicamentos", texto: "Manejar sus propios medicamentos" },
    { key: "soledad", texto: "Quedarse solo en la casa sin problemas" },
    { key: "comprension", texto: "Mantenerse al tanto de los acontecimientos y de lo que pasa en el país" },
    { key: "compras", texto: "Hacer compras" },
    { key: "pasear", texto: "Andar por el vecindario y encontrar el camino de vuelta a casa" },
  ];

  const opciones = [
    { label: "Si es capaz o podría hacerlo", valor: 0 },
    { label: "Con alguna dificultad", valor: 1 },
    { label: "Necesita ayuda", valor: 2 },
    { label: "No es capaz", valor: 3 },
  ];

  const handleChange = (key: string, valor: number | null) => {
    setRespuestas((prev) => ({
      ...prev,
      [key]: valor,
    }));
  };

  const handleChangeABVD = (categoria: keyof PuntajesType, valor: number | null) => {
    setPuntajes((prev) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce(
      (acc, curr) => acc + (curr || 0),
      0
    );
  };

  const obtenerInterpretacion = () => {
    const total = obtenerPuntajeTotal();
    if (total >= 90) return "Dependencia leve";
    if (total >= 60) return "Dependencia moderada";
    if (total >= 40) return "Dependencia grave";
    return "Dependencia total";
  };

  const puntajeTotal = () => {
    return Object.values(respuestas).reduce((acc: any, curr: any) => acc + (curr || 0), 0);
  };

  const interpretacionAIVD = () => {
    const total = puntajeTotal();
    if (total <= 3) return "Función Normal";
    if (total <= 5) return "Disfunción leve";
    return "Disfunción severa";
  };

  const actividades = [
    {
      nombre: "Comer",
      key: "comer",
      opciones: [
        { descripcion: "Incapaz", valor: 0 },
        { descripcion: "Necesita ayuda para contar, extender mantequilla, usar condimentos, etc.", valor: 5 },
        { descripcion: "Independiente (la comida está al alcance de la mano)", valor: 10 }
      ]
    },
    {
      nombre: "Trasladarse entre la silla y la cama",
      key: "trasladarse",
      opciones: [
        { descripcion: "Incapaz, no se mantiene sentado", valor: 0 },
        { descripcion: "Necesita ayuda importante (1 persona entrenada o dos)", valor: 5 },
        { descripcion: "Necesita algo de ayuda (pequeña ayuda física o verbal)", valor: 10 },
        { descripcion: "Independiente", valor: 15 }
      ]
    },
    {
      nombre: "Aseo personal",
      key: "aseo",
      opciones: [
        { descripcion: "Necesita ayuda con el aseo personal", valor: 0 },
        { descripcion: "Independiente para lavarse la cara, las manos, dientes, peinarse y afeitarse", valor: 5 }
      ]
    },
    {
      nombre: "Uso del retrete",
      key: "retrete",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita alguna ayuda, pero puede hacer algo solo", valor: 5 },
        { descripcion: "Independiente (entrar, salir, limpiarse y vestirse)", valor: 10 }
      ]
    },
    {
      nombre: "Bañarse o Ducharse",
      key: "banarse",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Independiente para bañarse o ducharse", valor: 5 }
      ]
    },
    {
      nombre: "Desplazarse",
      key: "desplazarse",
      opciones: [
        { descripcion: "Inmóvil", valor: 0 },
        { descripcion: "Independiente en silla de ruedas en 50 m", valor: 5 },
        { descripcion: "Anda con pequeña ayuda de una persona (física o verbal)", valor: 10 },
        { descripcion: "Independiente al menos 50 m, con cualquier tipo de muleta (excepto andador)", valor: 15 }
      ]
    },
    {
      nombre: "Vestirse y desvestirse",
      key: "vestirse",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita ayuda, pero puede hacer la mitad aproximadamente sin ayuda", valor: 5 },
        { descripcion: "Independiente (incluyendo botones, cremalleras, cordones, etc.)", valor: 10 }
      ]
    },
    {
      nombre: "Control de heces",
      key: "heces",
      opciones: [
        { descripcion: "Incontinente (o necesita que le suministren enema)", valor: 0 },
        { descripcion: "Accidente excepcional (uno/semana)", valor: 5 },
        { descripcion: "Continente", valor: 10 }
      ]
    },
    {
      nombre: "Control de orina",
      key: "orina",
      opciones: [
        { descripcion: "Incontinente, o sondado incapaz de cambiarse la bolsa", valor: 0 },
        { descripcion: "Accidente excepcional (máximo uno/24 horas)", valor: 5 },
        { descripcion: "Continente, durante al menos 7 días", valor: 10 }
      ]
    }
  ];

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
          <Card
            title="DEPENDENCIA FUNCIONAL ABVD (Índice de Barthel)"
            className="!mr-2 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actividades.map((actividad) => (
                <div key={actividad.key} className="mb-4">
                  <Text strong className="block mb-2">
                    {actividad.nombre}
                  </Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder={`- Seleccione -`}
                    onChange={(value) => handleChangeABVD(actividad.key as keyof typeof puntajes, value)}
                    value={puntajes[actividad.key as keyof typeof puntajes]}
                  >
                    {actividad.opciones.map((opcion, index) => (
                      <Option key={`${actividad.key}-${index}`} value={opcion.valor}>
                        {opcion.valor} - {opcion.descripcion}
                      </Option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-50">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong className="text-lg">Puntaje Total:</Text>
                  </Col>
                  <Col>
                    <Text className="text-xl font-bold">{obtenerPuntajeTotal()}</Text>
                  </Col>
                </Row>
              </Card>

              <Card className="bg-gray-50">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong className="text-lg">Interpretación:</Text>
                  </Col>
                  <Col>
                    <Text className="text-xl font-bold">{obtenerInterpretacion()}</Text>
                  </Col>
                </Row>
              </Card>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="DEPENDENCIA FUNCIONAL AIVD (Actividad Funcional de PFEFFER - PFAQ 7 Ch)"
            className="h-full !ml-2 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300"
          >
            <div className="grid grid-cols-2 gap-6">
              {preguntas.map((pregunta) => (
                <div key={pregunta.key} className="mb-2">
                  <Text strong className="block mb-2 text-base">
                    {pregunta.texto}
                  </Text>
                  <Select<number | null>
                    style={{ width: '100%' }}
                    placeholder="- Seleccione -"
                    onChange={(value: number | null) => handleChange(pregunta.key, value)}
                    value={respuestas[pregunta.key] ?? null}
                  >
                    {opciones.map((opcion, index) => (
                      <Option key={`${pregunta.key}-${index}`} value={opcion.valor}>
                        {opcion.valor} - {opcion.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-50">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong className="text-base">Puntaje Total:</Text>
                  </Col>
                  <Col>
                    <Text className="text-lg font-bold">{puntajeTotal()}</Text>
                  </Col>
                </Row>
              </Card>

              <Card className="bg-gray-50">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong className="text-base">Interpretación:</Text>
                  </Col>
                  <Col>
                    <Text className="text-lg font-bold">{interpretacionAIVD()}</Text>
                  </Col>
                </Row>
              </Card>
            </div>
          </Card>
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
};

export default IndiceBarthel;