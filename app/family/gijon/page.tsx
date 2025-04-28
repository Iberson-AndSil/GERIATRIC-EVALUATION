"use client";

import { useGlobalContext } from "@/app/context/GlobalContext";
import { Form, Row, Col, Typography, Radio, Button } from "antd";
import { ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

const EscalaGijon = () => {
  const [puntajes, setPuntajes] = useState({
    familiar: 0,
    economica: 0,
    vivienda: 0,
    sociales: 0,
    apoyo: 0,
  });
  const router = useRouter();
  const [form] = Form.useForm();
  const { fileHandle } = useGlobalContext();

  const handleChange = (categoria: keyof typeof puntajes, valor: number) => {
    setPuntajes((prev) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce((acc, curr) => acc + curr, 0);
  };

  const family = [
    "Vive con familia, sin conflicto familiar",
    "Vive con familia y presenta algún tipo de dependencia física/psíquica",
    "Vive con cónyuge de similar edad",
    "Vive solo y tiene hijos próximos",
    "Vive solo y carece de hijos o viven alejados",
  ];

  const economic = [
    "Dos veces el salario mínimo vital",
    "1 + 1/2 veces el salario mínimo vital",
    "Un salario mínimo vital",
    "Sin pensión",
    "Sin otros ingresos"
  ];

  const dwelling = [
    "Adecuada a necesidades",
    "Barreras arquitectónicas: peldaños, puertas estrechas, daños.",
    "Mala higiene, baño incompleto, ausencia de agua caliente, calefacción.",
    "Ausencia de ascensor, teléfono",
    "Vivienda inadecuada (esteras, ruinas, no equipos mínimos)"
  ];

  const socials = [
    "Buenas relaciones sociales",
    "Relación social solo con familia y vecinos",
    "Relación social solo con familia",
    "No sale del domicilio, recibe familia",
    "No sale y no recibe visitas"
  ];

  const socialsNetwork = [
    "No necesita apoyo",
    "Con apoyo familiar o vecinal",
    "Voluntariado social, ayuda domiciliaria",
    "Pendiente de ingreso a residencia geriátrica",
    "Necesita cuidados permanentes"
  ]

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

      const existingData: any[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: ""
      });

      const lastRowIndex = existingData.length - 1;

      if (lastRowIndex >= 0) {
        while (existingData[lastRowIndex].length < 16) {
          existingData[lastRowIndex].push("");
        }

        const score = obtenerPuntajeTotal();
        existingData[lastRowIndex][14] = score;
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
      alert("Paciente guardado exitosamente y última fila actualizada");
      router.push('/funtional/abvd');

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
        ESCALA DE GIJON
      </Title>

      <div className="w-3/4">
        <Col span={24} className="mb-6">
          <Row>
            <Col span={18}>
              <Text strong className="text-lg">SITUACIÓN FAMILIAR</Text>
            </Col>
            <Col span={6} className="text-right">
              <Text strong className="text-lg">PUNTAJE</Text>
            </Col>
          </Row>
          <Radio.Group
            onChange={(e) => handleChange("familiar", e.target.value)}
            value={puntajes.familiar}
            className="w-full"
          >
            {family.map((oracion, index) => (
              <Row key={`fam-${index}`} className="border-b py-2 items-center">
                <Col span={18}>
                  <Text className="text-gray-700">{oracion}</Text>
                </Col>
                <Col span={6} className="text-right">
                  <Radio value={index + 1}>{index + 1}</Radio>
                </Col>
              </Row>
            ))}
          </Radio.Group>
        </Col>
        <Col span={24} className="mb-6">
          <Row>
            <Col span={18}>
              <Text strong className="text-lg">SITUACIÓN ECONÓMICA</Text>
            </Col>
            <Col span={6} className="text-right">
              <Text strong className="text-lg">PUNTAJE</Text>
            </Col>
          </Row>
          <Radio.Group
            onChange={(e) => handleChange("economica", e.target.value)}
            value={puntajes.economica}
            className="w-full"
          >
            {economic.map((oracion, index) => (
              <Row key={`eco-${index}`} className="border-b py-2 items-center">
                <Col span={18}>
                  <Text className="text-gray-700">{oracion}</Text>
                </Col>
                <Col span={6} className="text-right">
                  <Radio value={index + 1}>{index + 1}</Radio>
                </Col>
              </Row>
            ))}
          </Radio.Group>
        </Col>
        <Col span={24} className="mb-6">
          <Row>
            <Col span={18}>
              <Text strong className="text-lg">VIVIENDA</Text>
            </Col>
            <Col span={6} className="text-right">
              <Text strong className="text-lg">PUNTAJE</Text>
            </Col>
          </Row>
          <Radio.Group
            onChange={(e) => handleChange("vivienda", e.target.value)}
            value={puntajes.vivienda}
            className="w-full"
          >
            {dwelling.map((oracion, index) => (
              <Row key={`viv-${index}`} className="border-b py-2 items-center">
                <Col span={18}>
                  <Text className="text-gray-700">{oracion}</Text>
                </Col>
                <Col span={6} className="text-right">
                  <Radio value={index + 1}>{index + 1}</Radio>
                </Col>
              </Row>
            ))}
          </Radio.Group>
        </Col>
        <Col span={24} className="mb-6">
          <Row>
            <Col span={18}>
              <Text strong className="text-lg">RELACIONES SOCIALES</Text>
            </Col>
            <Col span={6} className="text-right">
              <Text strong className="text-lg">PUNTAJE</Text>
            </Col>
          </Row>
          <Radio.Group
            onChange={(e) => handleChange("sociales", e.target.value)}
            value={puntajes.sociales}
            className="w-full"
          >
            {socials.map((oracion, index) => (
              <Row key={`soc-${index}`} className="border-b py-2 items-center">
                <Col span={18}>
                  <Text className="text-gray-700">{oracion}</Text>
                </Col>
                <Col span={6} className="text-right">
                  <Radio value={index + 1}>{index + 1}</Radio>
                </Col>
              </Row>
            ))}
          </Radio.Group>
        </Col>
        <Col span={24} className="mb-6">
          <Row>
            <Col span={18}>
              <Text strong className="text-lg">APOYO A LA RED SOCIAL</Text>
            </Col>
            <Col span={6} className="text-right">
              <Text strong className="text-lg">PUNTAJE</Text>
            </Col>
          </Row>
          <Radio.Group
            onChange={(e) => handleChange("apoyo", e.target.value)}
            value={puntajes.apoyo}
            className="w-full"
          >
            {socialsNetwork.map((oracion, index) => (
              <Row key={`apo-${index}`} className="border-b py-2 items-center">
                <Col span={18}>
                  <Text className="text-gray-700">{oracion}</Text>
                </Col>
                <Col span={6} className="text-right">
                  <Radio value={index + 1}>{index + 1}</Radio>
                </Col>
              </Row>
            ))}
          </Radio.Group>
        </Col>
        <Row gutter={16} className="mt-6">
          <Col span={18} className="text-right pr-4">
            <Text strong className="text-lg">PUNTAJE TOTAL</Text>
          </Col>
          <Col span={6} className="text-right">
            <Text className="text-lg font-mono bg-gray-100 px-4 py-2">
              {obtenerPuntajeTotal()}
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

export default EscalaGijon;
