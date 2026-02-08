"use client";

import { Card, Typography, Select, Badge } from "antd";
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
      title={<span className="text-blue-600 font-bold">DEPENDENCIA FUNCIONAL ABVD (Índice de Barthel)</span>}
      className="h-full shadow-md rounded-xl border-t-4 border-t-blue-500"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        {actividades.map((actividad) => (
          <div key={actividad.key} className="flex flex-col">
            <Text strong className="mb-2 text-sm text-gray-700">
              {actividad.nombre}
            </Text>
            <Select
              className="w-full"
              placeholder="- Seleccione -"
              onChange={(value) => handleChangeABVD(actividad.key, value)}
              value={puntajes[actividad.key]}
              status={puntajes[actividad.key] !== undefined && puntajes[actividad.key] !== null ? "" : ""}
            >
              {actividad.opciones.map((opcion, index) => (
                <Option key={`${actividad.key}-${index}`} value={opcion.valor}>
                  <span className="font-bold mr-1">({opcion.valor})</span> {opcion.descripcion}
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