import React from "react";
import { Card, Form, Select, Slider, Checkbox, Typography, Divider, Alert, Badge } from "antd";
import { IncontinenceResponses } from "../../type";
import { frequencyOptions, amountOptions, situationOptions, interpretICIQ } from "../../utils/syndromes/first";

const { Text } = Typography;

interface Props {
  responses: IncontinenceResponses;
  onResponseChange: (key: string, value: any) => void;
}

const IncontinenceCard: React.FC<Props> = ({ responses, onResponseChange }) => {
  // Cálculo derivado (no necesita estado)
  const totalScore = (responses.frequency || 0) + 
                     (responses.amount || 0) + 
                     (responses.impact || 0) + 
                     (responses.situations?.length || 0);

  return (
    <Card 
        title={<span className="text-blue-600 font-bold">4. INCONTINENCIA (ICIQ-SF)</span>} 
        className="shadow-md rounded-xl border-t-4 border-t-blue-500"
    >
      <Form layout="vertical">
        <Form.Item label="Frecuencia de pérdida">
          <Select 
            options={frequencyOptions} 
            value={responses.frequency} 
            onChange={(v) => onResponseChange("frequency", v)} 
            placeholder="Seleccione..."
          />
        </Form.Item>
        
        <Form.Item label="Cantidad habitual">
          <Select 
            options={amountOptions} 
            value={responses.amount} 
            onChange={(v) => onResponseChange("amount", v)} 
            placeholder="Seleccione..."
          />
        </Form.Item>

        <Form.Item label={`Impacto en vida diaria (0-10): ${responses.impact || 0}`}>
          <Slider 
            min={0} max={10} 
            value={responses.impact} 
            onChange={(v) => onResponseChange("impact", v)} 
            trackStyle={{ backgroundColor: '#1890ff' }}
          />
        </Form.Item>

        <Form.Item label="Momentos de pérdida (Marque todas las que apliquen)">
          <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 rounded border border-gray-200">
            <Checkbox.Group 
                className="flex flex-col gap-2"
                options={situationOptions}
                value={responses.situations}
                onChange={(v) => onResponseChange("situations", v)}
            />
          </div>
        </Form.Item>

        <Divider className="my-3" />
        
        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
            <div>
                <Text type="secondary" className="block text-xs">PUNTAJE TOTAL</Text>
                <Badge count={totalScore} color={totalScore > 0 ? "blue" : "danger"} />
            </div>
            <div className="text-right">
                <Text strong className="block">{interpretICIQ(totalScore)}</Text>
                {totalScore > 0 && <Text type="warning" className="text-xs">Requiere evaluación</Text>}
            </div>
        </div>
      </Form>
    </Card>
  );
};
export default IncontinenceCard;