"use client";

import { useGlobalContext } from "@/app/context/GlobalContext";
import { Form, Row, Col, Typography, Radio, Button } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;

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
  const { fileHandle } = useGlobalContext();

  const handleChange = (categoria: keyof typeof puntajes, valor: number) => {
    setPuntajes((prev) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce((acc, curr) => acc + (curr || 0), 0);
  };

  const obtenerInterpretacion = () => {
    const total = obtenerPuntajeTotal();
    if (total >= 90) return "Dependencia leve";
    if (total >= 60) return "Dependencia moderada";
    if (total >= 40) return "Dependencia grave";
    return "Dependencia total";
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
        while (existingData[lastRowIndex].length < 15) {
          existingData[lastRowIndex].push("");
        }

        existingData[lastRowIndex][15] = obtenerPuntajeTotal().toString();
        existingData[lastRowIndex][16] = obtenerInterpretacion();
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
    <Form className="p-4 w-full flex flex-col items-center">
      <Title level={3} className="text-center font-bold mb-6">
        ÍNDICE DE BARTHEL
      </Title>

      <div className="w-3/4">
        {actividades.map((actividad) => (
          <Col span={24} className="mb-6" key={actividad.key}>
            <Row>
              <Col span={18}>
                <Text strong className="text-lg">{actividad.nombre.toUpperCase()}</Text>
              </Col>
              <Col span={6} className="text-right">
                <Text strong className="text-lg">PUNTAJE</Text>
              </Col>
            </Row>
            <Radio.Group
              onChange={(e) => handleChange(actividad.key as keyof typeof puntajes, e.target.value)}
              value={puntajes[actividad.key as keyof typeof puntajes]}
              className="w-full"
            >
              {actividad.opciones.map((opcion, index) => (
                <Row key={`${actividad.key}-${index}`} className="border-b py-2 items-center">
                  <Col span={18}>
                    <Text className="text-gray-700">{opcion.descripcion}</Text>
                  </Col>
                  <Col span={6} className="text-right">
                    <Radio value={opcion.valor}>{opcion.valor}</Radio>
                  </Col>
                </Row>
              ))}
            </Radio.Group>
          </Col>
        ))}

        <Row gutter={16} className="mt-6">
          <Col span={18} className="text-right pr-4">
            <Text strong className="text-lg">PUNTAJE TOTAL:</Text>
          </Col>
          <Col span={6} className="text-right">
            <Text className="text-lg font-mono bg-gray-100 px-4 py-2">
              {obtenerPuntajeTotal()}
            </Text>
          </Col>
        </Row>

        <Row gutter={16} className="mt-4">
          <Col span={18} className="text-right pr-4">
            <Text strong className="text-lg">INTERPRETACIÓN:</Text>
          </Col>
          <Col span={6} className="text-right">
            <Text className="text-lg font-mono bg-gray-100 px-4 py-2">
              {obtenerInterpretacion()}
            </Text>
          </Col>
        </Row>

        <Row className="flex justify-end gap-4 mt-6">
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
            <Button
              type="primary"
              size="large"
              onClick={saveFile}
              style={{ minWidth: '120px' }}
              disabled={!fileHandle}
            >
              {fileHandle ? (
                <>
                  Guardar Paciente
                  <SaveOutlined style={{ marginLeft: 8 }} />
                </>
              ) : (
                "Seleccione archivo primero"
              )}
            </Button>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default IndiceBarthel;