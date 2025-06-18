"use client";

import { Card, Typography, Select, Row, Col } from "antd";
import { actividades } from "../utils/funtional/constants";
import { PuntajesType } from "../type";

const { Text } = Typography;
const { Option } = Select;

interface ABVDFormProps {
  puntajes: PuntajesType;
  setPuntajes: React.Dispatch<React.SetStateAction<PuntajesType>>;
  total: number;
  interpretacion: string;
}

export default function ABVDForm({ 
  puntajes, 
  setPuntajes, 
  total, 
  interpretacion 
}: ABVDFormProps) {
  const handleChangeABVD = (categoria: string, valor: number | null) => {
    setPuntajes((prev: any) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  return (
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
              onChange={(value) => handleChangeABVD(actividad.key, value)}
              value={puntajes[actividad.key]}
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
              <Text className="text-xl font-bold">{total}</Text>
            </Col>
          </Row>
        </Card>

        <Card className="bg-gray-50">
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong className="text-lg">Interpretación:</Text>
            </Col>
            <Col>
              <Text className="text-xl font-bold">{interpretacion}</Text>
            </Col>
          </Row>
        </Card>
      </div>
    </Card>
  );
}