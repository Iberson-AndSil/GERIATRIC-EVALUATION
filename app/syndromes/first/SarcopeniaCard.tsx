import React from "react";
import { Card, Form, Select, Typography, Tag, Progress } from "antd";
import { sarcopeniaQuestions, calculateSarcopeniaScore, interpretSarcopenia } from "../../utils/syndromes/first";
import { SarcopeniaResponses } from "../../type";

const { Text } = Typography;

interface Props {
  responses: SarcopeniaResponses;
  onResponseChange: (key: string, value: number) => void;
}

const SarcopeniaCard: React.FC<Props> = ({ responses, onResponseChange }) => {
  const score = calculateSarcopeniaScore(responses);
  const isHighRisk = score >= 4;

  return (
    <Card 
        title={<span className="text-blue-600 font-bold">1. SARCOPENIA (SARC-F)</span>} 
        className="shadow-md rounded-xl border-t-4 border-t-blue-500 !h-full"
        extra={<Tag color={isHighRisk ? "error" : "success"}>{score} pts</Tag>}
    >
      <Form layout="vertical">
        {sarcopeniaQuestions.map((q) => (
          <Form.Item key={q.key} label={<Text strong>{q.text}</Text>} className="mb-3">
            <Select
              placeholder="Seleccione..."
              onChange={(val) => onResponseChange(q.key, val)}
              value={responses[q.key]}
              options={q.options.map(opt => ({ label: `${opt.label} (${opt.value} pts)`, value: opt.value }))}
            />
          </Form.Item>
        ))}
      </Form>

      <div className={`mt-10 p-3 rounded-lg ${isHighRisk ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
        <div className="flex justify-between items-center mb-1">
            <Text type={isHighRisk ? "danger" : "success"} strong>Interpretación:</Text>
            <Text strong>{interpretSarcopenia(score)}</Text>
        </div>
        <Progress 
            percent={(score / 10) * 100} 
            showInfo={false} 
            status={isHighRisk ? "exception" : "success"} 
            size="small" 
        />
      </div>
    </Card>
  );
};
export default SarcopeniaCard;