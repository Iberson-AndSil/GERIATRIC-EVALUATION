"use client";
import { Card, Typography, Select, Row, Col } from "antd";
import { preguntas, opciones } from "../utils/funtional/constants";

const { Text } = Typography;
const { Option } = Select;

interface AIVDFormProps {
  respuestas: Record<string, number | null>;
  setRespuestas: (respuestas: Record<string, number | any>) => void;
  total: number;
  interpretacion: string;
}

export default function AIVDForm({ 
  respuestas, 
  setRespuestas, 
  total, 
  interpretacion 
}: AIVDFormProps) {
  const handleChange = (key: string, valor: number | any) => {
    setRespuestas((prev:any) => ({
      ...prev,
      [key]: valor,
    }));
  };

  return (
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
              <Text className="text-lg font-bold">{total}</Text>
            </Col>
          </Row>
        </Card>

        <Card className="bg-gray-50">
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong className="text-base">Interpretación:</Text>
            </Col>
            <Col>
              <Text className="text-lg font-bold">{interpretacion}</Text>
            </Col>
          </Row>
        </Card>
      </div>
    </Card>
  );
}