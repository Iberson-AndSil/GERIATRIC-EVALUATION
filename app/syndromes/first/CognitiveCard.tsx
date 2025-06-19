'use client';
import React, { useState } from "react";
import { Card, Form, Checkbox, Divider, Typography } from "antd";
import { CognitiveResponses } from "../../type";

const { Text } = Typography;

interface CognitiveCardProps {
  responses: CognitiveResponses;
  onResponseChange: (key: string, value: boolean) => void;
}

const CognitiveCard: React.FC<CognitiveCardProps> = ({ responses, onResponseChange }) => {
  const [showQuestions, setShowQuestions] = useState(false);

  const calculateScore = () => {
    return [
      responses.rememberQuickly,
      responses.rememberSlowly,
      responses.affectsDailyActivities
    ].filter(Boolean).length;
  };

  return (
    <Card title="DETERIORO COGNITIVO" className="!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
      <Form layout="vertical">
        <Form.Item name="forgetsRecentEvents" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              onResponseChange("forgetsRecentEvents", e.target.checked);
              setShowQuestions(e.target.checked);
            }}
            checked={responses.forgetsRecentEvents}
          >
            ¿Se olvida de hechos recientes?
          </Checkbox>
        </Form.Item>

        {showQuestions ? (
          <>
            <Divider orientation="left" plain>Preguntas adicionales</Divider>
            <Form.Item name="rememberQuickly" valuePropName="checked">
              <Checkbox
                onChange={(e) => onResponseChange("rememberQuickly", e.target.checked)}
                checked={responses.rememberQuickly}
              >
                ¿Tarda poco en acordarse? (minutos) (+1)
              </Checkbox>
            </Form.Item>
            <Form.Item name="rememberSlowly" valuePropName="checked">
              <Checkbox
                onChange={(e) => onResponseChange("rememberSlowly", e.target.checked)}
                checked={responses.rememberSlowly}
              >
                ¿Tarda mucho en acordarse? (horas) (+2)
              </Checkbox>
            </Form.Item>
            <Form.Item name="affectsDailyActivities" valuePropName="checked">
              <Checkbox
                onChange={(e) => onResponseChange("affectsDailyActivities", e.target.checked)}
                checked={responses.affectsDailyActivities}
              >
                ¿Afecta sus actividades cotidianas? (+3)
              </Checkbox>
            </Form.Item>
            <Divider />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text strong>Puntaje de Deterioro Cognitivo: </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {calculateScore()} / 3
              </Text>
            </div>
          </>
        ) : <div className="w-full flex justify-center italic"><Text>Selecciona para ver preguntas adicionales.</Text></div>}
      </Form>
    </Card>
  );
};

export default CognitiveCard;