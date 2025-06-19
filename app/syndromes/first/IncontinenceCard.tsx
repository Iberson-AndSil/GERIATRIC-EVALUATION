import React, { useState } from "react";
import { Card, Form, Select, Slider, Checkbox, Button, Typography, Alert } from "antd";
import { IncontinenceResponses } from "../../type";
import { frequencyOptions, amountOptions, situationOptions, interpretICIQ } from "../../utils/syndromes/first";

const { Text, Title } = Typography;

interface IncontinenceCardProps {
  responses: IncontinenceResponses;
  onResponseChange: (key: string, value: any) => void;
}

const IncontinenceCard: React.FC<IncontinenceCardProps> = ({ responses, onResponseChange }) => {
  const [showResult, setShowResult] = useState(false);

  const handleSituationChange = (values: string[]) => {
    onResponseChange("situations", values);
  };

  const handleCalculateScore = () => {
    const situationsScore = responses.situations?.length || 0;
    onResponseChange("situationsScore", situationsScore);
    setShowResult(true);
  };

  const calculateTotalScore = () => {
    return (responses.frequency || 0) + 
           (responses.amount || 0) + 
           (responses.impact || 0) + 
           (responses.situations?.length || 0);
  };

  return (
    <Card title="INCONTINENCIA URINARIA (ICIQ-SF)" className="!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
      <Form layout="vertical">
        <Form.Item label="1. ¿Con qué frecuencia pierde orina?">
          <Select
            placeholder="Seleccione una opción"
            onChange={(value) => onResponseChange("frequency", value)}
            value={responses.frequency}
            options={frequencyOptions}
          />
        </Form.Item>

        <Form.Item label="2. ¿Qué cantidad de orina cree que pierde habitualmente?">
          <Select
            placeholder="Seleccione una opción"
            onChange={(value) => onResponseChange("amount", value)}
            value={responses.amount}
            options={amountOptions}
          />
        </Form.Item>

        <Form.Item label="3. ¿En qué medida estos escapes de orina afectan su vida diaria?">
          <Slider
            min={1}
            max={10}
            marks={{
              1: '1 (Nada)',
              5: '5',
              10: '10 (Mucho)'
            }}
            onChange={(value) => onResponseChange("impact", value)}
            value={responses.impact}
          />
        </Form.Item>

        <Form.Item label="4. ¿Cuándo pierde orina? (Cada selección suma 1 punto)">
          <Checkbox.Group
            options={situationOptions.map(option => ({
              label: option,
              value: option
            }))}
            onChange={handleSituationChange}
            value={responses.situations}
            style={{ display: "flex", flexDirection: "column" }}
          />
          {responses.situations && (
            <Text type="secondary" style={{ marginTop: 8 }}>
              Seleccionadas: {responses.situations.length} (+{responses.situations.length} puntos)
            </Text>
          )}
        </Form.Item>

        <Button
          type="primary"
          onClick={handleCalculateScore}
          block
        >
          Calcular Puntuación
        </Button>

        {showResult && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <Title level={4} className="!mb-2">Resultados ICIQ-SF</Title>
            <Text strong>Puntuación Total: </Text>
            <Text>{calculateTotalScore()} puntos</Text>
            <br />
            <Text strong>Desglose: </Text>
            <ul>
              <li>Frecuencia: {responses.frequency || 0} puntos</li>
              <li>Cantidad: {responses.amount || 0} puntos</li>
              <li>Impacto: {responses.impact || 0} puntos</li>
              <li>Situaciones: {responses.situations?.length || 0} puntos</li>
            </ul>
            <br />
            <Text strong>Interpretación: </Text>
            <Text>{interpretICIQ(calculateTotalScore())}</Text>

            {calculateTotalScore() > 5 && (
              <Alert
                message="Recomendación"
                description="Se sugiere evaluación urológica/geriátrica adicional."
                type="info"
                showIcon
                className="mt-4"
              />
            )}
          </div>
        )}
      </Form>
    </Card>
  );
};

export default IncontinenceCard;