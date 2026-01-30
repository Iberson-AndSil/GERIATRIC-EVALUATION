import React from "react";
import { Card, Switch, Checkbox, Typography, Badge } from "antd";
import { CognitiveResponses } from "../../type";

const { Text } = Typography;

interface Props {
  responses: CognitiveResponses;
  onResponseChange: (key: string, value: boolean) => void;
}

const CognitiveCard: React.FC<Props> = ({ responses, onResponseChange }) => {
  // Nota: Ajusta la lógica de cálculo si tus requisitos de puntaje son diferentes (1+2+3 vs conteo simple)
  // Aquí asumo conteo simple para visualización, ajusta según tu lógica de negocio
  const score = [responses.rememberQuickly, responses.rememberSlowly, responses.affectsDailyActivities].filter(Boolean).length;

  return (
    <Card 
        title={<span className="text-blue-600 font-bold">3. DETERIORO COGNITIVO</span>} 
        className="shadow-md rounded-xl h-full border-t-4 border-t-blue-500"
    >
      <div className="flex justify-between items-center mb-4">
        <Text strong>¿Olvida hechos recientes?</Text>
        <Switch 
            checked={responses.forgetsRecentEvents} 
            onChange={(checked) => onResponseChange("forgetsRecentEvents", checked)}
            checkedChildren="SÍ" unCheckedChildren="NO"
        />
      </div>

      {responses.forgetsRecentEvents && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 animate-fade-in">
           <Text type="secondary" className="block mb-2 text-xs uppercase font-bold">Evaluación de memoria</Text>
           <div className="flex flex-col gap-2">
            <Checkbox checked={responses.rememberQuickly} onChange={(e) => onResponseChange("rememberQuickly", e.target.checked)}>
               Tarda poco en acordarse (min)
            </Checkbox>
            <Checkbox checked={responses.rememberSlowly} onChange={(e) => onResponseChange("rememberSlowly", e.target.checked)}>
               Tarda mucho en acordarse (hrs)
            </Checkbox>
            <Checkbox checked={responses.affectsDailyActivities} onChange={(e) => onResponseChange("affectsDailyActivities", e.target.checked)}>
               Afecta actividades cotidianas
            </Checkbox>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-200 flex justify-between">
             <Text strong>Severidad:</Text>
             <Badge count={score} color={score > 1 ? "purple" : "blue"} />
          </div>
        </div>
      )}
       {!responses.forgetsRecentEvents && (
          <div className="h-32 flex items-center justify-center text-gray-400 italic bg-gray-50 rounded-lg">
              Sin quejas subjetivas
          </div>
      )}
    </Card>
  );
};
export default CognitiveCard;