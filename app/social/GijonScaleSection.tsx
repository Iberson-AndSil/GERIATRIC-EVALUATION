'use client';
import React from "react";
import { Select, Typography, Card, Badge } from "antd";
import { GijonCategory } from "../interfaces";

const { Option } = Select;
const { Text } = Typography;

type InterpretacionTipo = 'success' | 'warning' | 'error' | 'info';

interface GijonScaleSectionProps {
  categories: GijonCategory[];
  handleChange: (categoria: any, valor: number) => void;
  puntajes: Record<string, any>;
  obtenerPuntajeTotal: () => number;
}

export const GijonScaleSection: React.FC<GijonScaleSectionProps> = ({
  categories,
  handleChange,
  puntajes,
  obtenerPuntajeTotal,
}) => {
  const puntajeTotal = obtenerPuntajeTotal();
  
  const getInterpretacion = (): { mensaje: string; color: string } | null => {
    if (puntajeTotal >= 5 && puntajeTotal <= 9) {
      return { mensaje: 'Buena/Aceptable', color: 'green' };
    } else if (puntajeTotal >= 10 && puntajeTotal <= 14) {
      return { mensaje: 'Riesgo Social', color: 'gold' };
    } else if (puntajeTotal >= 15) {
      return { mensaje: 'Problema Social', color: 'red' };
    }
    return { mensaje: 'Evaluando...', color: 'blue' };
  };

  const interpretacion = getInterpretacion();

  return (
    <Card 
      title={<span className="text-blue-600 font-bold">ESCALA DE VALORACIÓN SOCIO FAMILIAR DE GIJON</span>}
      className="shadow-md rounded-xl h-full border-t-4 border-t-blue-500"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        {categories.map((category) => (
          <div key={category.key} className="flex flex-col">
            <Text strong className="mb-2 text-sm">
              {category.title}
            </Text>
            <Select
              className="w-full"
              placeholder="Seleccione..."
              onChange={(value) => handleChange(category.key, parseInt(value))}
              value={puntajes[category.key] ? puntajes[category.key].toString() : undefined}
            >
              {category.options.map((option, index) => (
                <Option key={`${category.key}-${index}`} value={(index + 1).toString()}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-fade-in">
        <div className="flex justify-between items-center">
           <div className="flex flex-col">
              <Text type="secondary" className="text-xs uppercase font-bold mb-1">
                Diagnóstico Social
              </Text>
              <Text strong style={{ color: interpretacion?.color === 'gold' ? '#faad14' : interpretacion?.color }}>
                 {interpretacion?.mensaje}
              </Text>
           </div>

           <div className="flex flex-col items-end">
              <Text strong className="mb-1 text-xs text-gray-500">Puntaje Total</Text>
              <Badge 
                count={puntajeTotal} 
                showZero 
                color={interpretacion?.color}
                style={{boxShadow: '0 0 0 1px #d9d9d9 inset'}} // Sutil borde para contraste
              />
           </div>
        </div>
        
        {/* Leyenda pequeña opcional */}
        <div className="mt-3 pt-2 border-t border-blue-200">
           <Text type="secondary" style={{ fontSize: '10px' }}>
             Escala: 5-9 (Normal) | 10-14 (Riesgo) | 15+ (Problema)
           </Text>
        </div>
      </div>
    </Card>
  );
};