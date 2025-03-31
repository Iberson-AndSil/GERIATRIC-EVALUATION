"use client";

import { Form, Row, Col, Typography, Radio } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

const EscalaGijon = () => {
  const [puntajes, setPuntajes] = useState({
    familiar: 0,
    economica: 0,
    vivienda: 0,
    sociales: 0,
    apoyo: 0,
  });

  const handleChange = (categoria: keyof typeof puntajes, valor: number) => {
    setPuntajes((prev) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  const obtenerPuntajeTotal = () => {
    return Object.values(puntajes).reduce((acc, curr) => acc + curr, 0);
  };

  const oraciones = [
    "Vive con familia, sin conflicto familiar",
    "Vive con familia y presenta algún tipo de dependencia física/psíquica",
    "Vive con cónyuge de similar edad",
    "Vive solo y tiene hijos próximos",
    "Vive solo y carece de hijos o viven alejados",
  ];

  return (
    <Form className="p-4 w-full flex flex-col items-center">
      <Title level={3} className="text-center font-bold mb-6">
        ESCALA DE GIJÓN
      </Title>

      <div className="w-3/4">
        {/** Sección SITUACIÓN FAMILIAR */}
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
            {oraciones.map((oracion, index) => (
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

        {/** Sección SITUACIÓN ECONÓMICA */}
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
            {oraciones.map((oracion, index) => (
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

        {/** Sección VIVIENDA */}
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
            {oraciones.map((oracion, index) => (
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

        {/** Sección RELACIONES SOCIALES */}
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
            {oraciones.map((oracion, index) => (
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

        {/** Sección APOYO A LA RED SOCIAL */}
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
            {oraciones.map((oracion, index) => (
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

        {/** Puntaje Total */}
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
      </div>
    </Form>
  );
};

export default EscalaGijon;
