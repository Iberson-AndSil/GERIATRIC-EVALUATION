import React from "react";
import { Card, Switch, Checkbox, Typography, Badge } from "antd";
import { CognitiveResponses } from "../../type";

const { Text } = Typography;

interface Props {
  responses: CognitiveResponses;
  onResponseChange: (key: string, value: boolean) => void;
}

const CognitiveCard: React.FC<Props> = ({ responses, onResponseChange }) => {

  const calculateScore = (responses: CognitiveResponses): number => {
    const {rememberQuickly,rememberSlowly,affectsDailyActivities} = responses;
    if (rememberQuickly && !affectsDailyActivities)  return 1;
    if (rememberSlowly && !affectsDailyActivities)   return 1;
    if (rememberQuickly && affectsDailyActivities)   return 4;
    if (rememberSlowly && affectsDailyActivities)   return 5;
    return 0;
  };

  const score = calculateScore(responses);

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
            <Checkbox
              checked={responses.rememberQuickly}
              onChange={(e) => {
                onResponseChange("rememberQuickly", e.target.checked);
                if (e.target.checked) {
                  onResponseChange("rememberSlowly", false);
                }
              }}
            >
              Tarda poco en acordarse (min)
            </Checkbox>

            <Checkbox
              checked={responses.rememberSlowly}
              onChange={(e) => {
                onResponseChange("rememberSlowly", e.target.checked);
                if (e.target.checked) {
                  onResponseChange("rememberQuickly", false);
                }
              }}
            >
              Tarda mucho en acordarse (hrs)
            </Checkbox>

            <Checkbox checked={responses.affectsDailyActivities} onChange={(e) => onResponseChange("affectsDailyActivities", e.target.checked)}>
              Afecta actividades cotidianas
            </Checkbox>
          </div>
          <div className="mt-3 pt-3 border-t border-purple-200 flex justify-between">
            <Text strong>Severidad:</Text>
            <Badge
              count={`${score} pts`}
              color={score >= 5 ? "red" : score >= 4 ? "orange" : "blue"}
            />

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