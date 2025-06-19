import React from "react";
import { Card, Form, Select, Divider, Row, Col, Typography, Alert } from "antd";
import { sarcopeniaQuestions, calculateSarcopeniaScore, interpretSarcopenia } from "../../utils/syndromes/first";
import { SarcopeniaResponses } from "../../type";

const { Text } = Typography;

interface SarcopeniaCardProps {
  responses: SarcopeniaResponses;
  onResponseChange: (key: string, value: number) => void;
}

const SarcopeniaCard: React.FC<SarcopeniaCardProps> = ({ responses, onResponseChange }) => {
  const score = calculateSarcopeniaScore(responses);
  
  return (
    <Card title="SARCOPENIA (SARC-F)" className="!h-full !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300">
      <Form layout="vertical">
        {sarcopeniaQuestions.map((question) => (
          <Form.Item key={question.key} label={question.text} className="mb-4">
            <Select
              placeholder={`- Seleccione -`}
              onChange={(value) => onResponseChange(question.key, value)}
              value={responses[question.key]}
            >
              {question.options.map((option) => (
                <Select.Option key={`${question.key}-${option.value}`} value={option.value}>
                  {option.label} ({option.value} puntos)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ))}

        <Divider />

        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Text strong>PUNTAJE TOTAL:</Text>
          </Col>
          <Col span={12} className="text-right">
            <Text className="font-mono bg-gray-100 px-4 py-2 inline-block">
              {score}
            </Text>
          </Col>
        </Row>

        <Row gutter={16} className="mb-4">
          <Col span={12}>
            <Text strong>INTERPRETACIÓN:</Text>
          </Col>
          <Col span={12} className="text-right">
            <Text className="font-mono bg-gray-100 px-4 py-2 inline-block">
              {interpretSarcopenia(score)}
            </Text>
          </Col>
        </Row>

        {score >= 4 && (
          <Alert
            message="Alto riesgo de sarcopenia detectado"
            description="Un puntaje de 4 o más puntos sugiere alto riesgo de sarcopenia. Se recomienda evaluación adicional."
            type="warning"
            showIcon
            className="my-4"
          />
        )}
      </Form>
    </Card>
  );
};

export default SarcopeniaCard;