import { useState } from 'react';
import { SensoryData } from '../../type';

export const useSensory = () => {
  const [sensoryData, setSensoryData] = useState<SensoryData>({
    visionDifficulty: null,
    wearsGlasses: null,
    hearingDifficulty: null,
    wearsHearingAids: null,
  });

  const [sensoryResult, setSensoryResult] = useState<string[] | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleSensoryChange = (field: keyof SensoryData, value: string) => {
    const newData = { ...sensoryData, [field]: value };
    setSensoryData(newData);
    evaluateSensory(newData);
  };

  const evaluateSensory = (data: SensoryData) => {
    if (Object.values(data).some(v => v === null)) {
      setSensoryResult(null);
      setScore(0);
      return;
    }

    const totalScore = Object.values(data).filter(v => v === 'si').length;
    setScore(totalScore);

    const resultado: string[] = [];

    if (data.visionDifficulty === 'si') {
      if (data.wearsGlasses === 'si') {
        resultado.push('Deterioro visual evaluado');
      } else {
        resultado.push('Deterioro visual no evaluado');
      }
    } else {
      resultado.push('Sin deterioro visual');
    }

    if (data.hearingDifficulty === 'si') {
      if (data.wearsHearingAids === 'si') {
        resultado.push('Deterioro auditivo evaluado');
      } else {
        resultado.push('Deterioro auditivo no evaluado');
      }
    } else {
      resultado.push('Sin deterioro auditivo');
    }

    setSensoryResult(resultado);
  };

  return {
    sensoryData,
    sensoryResult,
    score,
    handleSensoryChange
  };
};
export type { SensoryData };
