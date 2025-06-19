'use client';
import React from "react";
import { Select, Typography, Card, Row, Col, Alert } from "antd";
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
  
  const getInterpretacion = (): { mensaje: string; tipo: InterpretacionTipo } | null => {
    if (puntajeTotal >= 5 && puntajeTotal <= 9) {
      return { mensaje: 'Buena/Aceptable', tipo: 'success' };
    } else if (puntajeTotal >= 10 && puntajeTotal <= 14) {
      return { mensaje: 'Riesgo Social', tipo: 'warning' };
    } else if (puntajeTotal >= 15) {
      return { mensaje: 'Problema Social', tipo: 'error' };
    }
    return null;
  };

  const interpretacion = getInterpretacion();

  return (
    <Card 
      title="ESCALA DE VALORACIÓN SOCIO FAMILIAR DE GIJON (Adaptada UPCH)"
      className="!ml-4 !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300 h-full w-full"
    >
      <div className="grid gap-4">
        {categories.map((category) => (
          <div key={category.key} className="mb-2 w-full">
            <Text strong className="block mb-1">
              {category.title}
            </Text>
            <Select
              className="w-full truncate"
              placeholder={`Seleccione ${category.title.toLowerCase()}`}
              onChange={(value) => handleChange(category.key, parseInt(value))}
              value={puntajes[category.key] ? puntajes[category.key].toString() : undefined}
            >
              {category.options.map((option, index) => (
                <Option className="w-full truncate" key={`${category.key}-${index}`} value={(index + 1).toString()}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        ))}

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong className="text-lg">Puntaje Total:</Text>
            </Col>
            <Col>
              <Text className="text-xl font-bold">{puntajeTotal}</Text>
            </Col>
          </Row>
        </div>

        {interpretacion && (
          <Alert
            message={
              <div>
                <Text strong>Interpretación:</Text> Puntuación: {puntajeTotal} - {interpretacion.mensaje}
                <div className="mt-1 text-xs">
                  <Text type="secondary">5 - 9: Buena/Aceptable | 10 - 14: Riesgo Social | 15+: Problema Social</Text>
                </div>
              </div>
            }
            type={interpretacion.tipo}
            showIcon
            className="mt-2"
          />
        )}
      </div>
    </Card>
  );
};