"use client";

import { useState } from "react";
import { Form, Row, Col, Typography, Radio, Button } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/GlobalContext";
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const FAQPfeffer = () => {
  const [respuestas, setRespuestas] = useState<{ [key: string]: number | null }>({});
    const { fileHandle } = useGlobalContext();
    const [form] = Form.useForm();
    const router = useRouter();

  const preguntas = [
    { key: "cheques", texto: "Manejar su propio dinero." },
    { key: "preparacion_comidas", texto: "Calentar agua para café o té y apagar la cocina." },
    { key: "medicamentos", texto: "Manejar sus propios medicamentos."},
    { key: "soledad", texto: "Quedarse solo en la casa sin problemas." },
    { key: "comprension", texto: "Mantenerse al tanto de los acontecimientos y de lo que pasa en el país." },
    { key: "compras", texto: "Hacer compras." },
    { key: "pasear", texto: "andar por el vecindario y encontrar el camino de vuelta a casa." },
  ];

  const opciones = [
    { label: "Si es capaz o podría hacerlo", valor: 0 },
    { label: "Con alguna dificultad", valor: 1 },
    { label: "Necesita ayuda", valor: 2 },
    { label: "No es capaz", valor: 3 },
  ];

  const handleChange = (key: string, valor: number) => {
    setRespuestas((prev) => ({
      ...prev,
      [key]: valor,
    }));
  };

  const puntajeTotal = () => {
    return Object.values(respuestas).reduce((acc:any, curr) => acc + (curr || 0), 0);
  };

  const obtenerInterpretacion = () => {
    const total = puntajeTotal();
    if (total <= 3) return "Función Normal";
    if (total <= 5) return "Disfunción leve";
    return "Disfunción severa";
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
          while (existingData[lastRowIndex].length < 18) {
            existingData[lastRowIndex].push("");
          }
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
        setRespuestas({});
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
    <Form className="p-4 w-full flex flex-col items-center">
      <Title level={3} className="text-center font-bold mb-6">
        CUESTIONARIO DE ACTIVIDAD FUNCIONAL DE PFEFFER (FAQ)
      </Title>

      <div className="w-3/4">
        {preguntas.map((pregunta) => (
          <Col span={24} className="mb-6" key={pregunta.key}>
            <Row>
              <Col span={18}>
                <Text strong className="text-lg">{pregunta.texto}</Text>
              </Col>
              <Col span={6} className="text-right">
                <Text strong className="text-lg">RESPUESTA</Text>
              </Col>
            </Row>

            <Radio.Group
              onChange={(e) => handleChange(pregunta.key, e.target.value)}
              value={respuestas[pregunta.key]}
              className="w-full"
            >
              {opciones.map((opcion, index) => (
                <Row key={`${pregunta.key}-${index}`} className="border-b py-2 items-center">
                  <Col span={18}>
                    <Text className="text-gray-700">{opcion.label}</Text>
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
              {puntajeTotal()}
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

        <div className="flex justify-center gap-4 mt-8">
          <Link href="/">
            <Button type="default" icon={<ArrowLeftOutlined />} size="large">
              Volver
            </Button>
          </Link>

          <Button type="primary" icon={<SaveOutlined />} size="large" onClick={saveFile}>
            Guardar
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default FAQPfeffer;
