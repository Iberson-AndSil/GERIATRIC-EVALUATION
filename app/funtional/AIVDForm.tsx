"use client";
import { Card, Typography, Select, Badge } from "antd";
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
    setRespuestas((prev: any) => ({
      ...prev,
      [key]: valor,
    }));
  };

  return (
    <Card
      title={<span className="text-blue-600 font-bold">DEPENDENCIA FUNCIONAL AIVD (Pfeffer - PFAQ)</span>}
      className="h-full shadow-md rounded-xl border-t-4 border-t-blue-500"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        {preguntas.map((pregunta) => (
          <div key={pregunta.key} className="flex flex-col">
            <Text strong className="mb-2 text-sm text-gray-700">
              {pregunta.texto}
            </Text>
            <Select<number | null>
              className="w-full"
              placeholder="- Seleccione -"
              onChange={(value: number | null) => handleChange(pregunta.key, value)}
              value={respuestas[pregunta.key] ?? null}
            >
              {opciones.map((opcion, index) => (
                <Option key={`${pregunta.key}-${index}`} value={opcion.valor}>
                   <span className="font-bold mr-1">({opcion.valor})</span> {opcion.label}
                </Option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Text type="secondary" className="text-xs uppercase font-bold mb-1">
              Interpretación
            </Text>
            <Text strong className="text-blue-900 text-base">
              {interpretacion || "Pendiente"}
            </Text>
          </div>

          <div className="flex flex-col items-end">
             <Text strong className="mb-1 text-xs text-gray-500">Puntaje Total</Text>
             <Badge 
               count={total} 
               showZero 
               color="blue"
               style={{ boxShadow: '0 0 0 1px #d9d9d9 inset' }} 
             />
          </div>
        </div>
      </div>
    </Card>
  );
}