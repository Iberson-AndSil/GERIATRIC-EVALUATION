import React from "react";
import { Card, Form, Switch, Checkbox, Typography, Badge } from "antd";
import { FallsResponses } from "../../type";

const { Text } = Typography;

interface Props {
  responses: FallsResponses;
  onResponseChange: (key: string, value: boolean) => void;
}

const FallsCard: React.FC<Props> = ({ responses, onResponseChange }) => {
  const score = [responses.neededMedicalAssistance, responses.couldNotGetUp, responses.fearOfFalling].filter(Boolean).length;

  return (
    <Card 
        title={<span className="text-blue-600 font-bold">2. CAÍDAS</span>} 
        className="shadow-md rounded-xl h-full border-t-4 border-t-blue-500"
    >
      <div className="flex justify-between items-center mb-4">
        <Text strong>¿Caída en el último año?</Text>
        <Switch 
            checked={responses.hasFallen} 
            onChange={(checked) => onResponseChange("hasFallen", checked)}
            checkedChildren="SÍ" unCheckedChildren="NO"
        />
      </div>

      {responses.hasFallen && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 animate-fade-in">
          <Text type="secondary" className="block mb-2 text-xs uppercase font-bold">Detalles del evento</Text>
          <div className="flex flex-col gap-2">
            <Checkbox checked={responses.neededMedicalAssistance} onChange={(e) => onResponseChange("neededMedicalAssistance", e.target.checked)}>
               Necesitó asistencia médica
            </Checkbox>
            <Checkbox checked={responses.couldNotGetUp} onChange={(e) => onResponseChange("couldNotGetUp", e.target.checked)}>
               No pudo levantarse (15 min)
            </Checkbox>
            <Checkbox checked={responses.fearOfFalling} onChange={(e) => onResponseChange("fearOfFalling", e.target.checked)}>
               Miedo a caer nuevamente
            </Checkbox>
          </div>
          <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between">
             <Text strong>Riesgo acumulado:</Text>
             <Badge count={score} color={score > 0 ? "volcano" : "green"} />
          </div>
        </div>
      )}
      {!responses.hasFallen && (
          <div className="h-32 flex items-center justify-center text-gray-400 italic bg-gray-50 rounded-lg">
              Sin antecedentes recientes
          </div>
      )}
    </Card>
  );
};
export default FallsCard;