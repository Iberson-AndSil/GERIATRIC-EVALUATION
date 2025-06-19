'use client';
import React, { useState } from "react";
import { Card, Form, Checkbox, Divider, Typography } from "antd";
import { FallsResponses } from "../../type";

const { Text } = Typography;

interface FallsCardProps {
  responses: FallsResponses;
  onResponseChange: (key: string, value: boolean) => void;
}

const FallsCard: React.FC<FallsCardProps> = ({ responses, onResponseChange }) => {
  const [showQuestions, setShowQuestions] = useState(false);

  const calculateScore = () => {
    return [
      responses.neededMedicalAssistance,
      responses.couldNotGetUp,
      responses.fearOfFalling
    ].filter(Boolean).length;
  };

  return (
    <Card title="CAÍDAS" className="!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
      <Form layout="vertical">
        <Form.Item name="hasFallen" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              onResponseChange("hasFallen", e.target.checked);
              setShowQuestions(e.target.checked);
            }}
            checked={responses.hasFallen}
          >
            ¿Se ha caído en el último año?
          </Checkbox>
        </Form.Item>

        {showQuestions ? (
          <>
            <Divider orientation="left" plain>Preguntas adicionales</Divider>
            <Form.Item name="neededMedicalAssistance" valuePropName="checked">
              <Checkbox
                onChange={(e) => onResponseChange("neededMedicalAssistance", e.target.checked)}
                checked={responses.neededMedicalAssistance}
              >
                ¿Necesitó asistencia médica? (+1)
              </Checkbox>
            </Form.Item>
            <Form.Item name="couldNotGetUp" valuePropName="checked">
              <Checkbox
                onChange={(e) => onResponseChange("couldNotGetUp", e.target.checked)}
                checked={responses.couldNotGetUp}
              >
                ¿No pudo levantarse después de 15 minutos? (+1)
              </Checkbox>
            </Form.Item>
            <Form.Item name="fearOfFalling" valuePropName="checked">
              <Checkbox
                onChange={(e) => onResponseChange("fearOfFalling", e.target.checked)}
                checked={responses.fearOfFalling}
              >
                ¿Tiene miedo a volverse a caer? (+1)
              </Checkbox>
            </Form.Item>
            <Divider />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text strong>Puntaje de Riesgo de Caídas: </Text>
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

export default FallsCard;