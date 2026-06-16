import { useState } from 'react';
import { DepressionData } from '../../type';

export const useDepression = () => {
  const [depressionData, setDepressionData] = useState<DepressionData>({
    satisfiedLife: null,
    helpless: null,
    memoryProblems: null,
    bored: null,
  });

  const [depressionResult, setDepressionResult] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleDepressionChange = (field: keyof DepressionData, value: string) => {
    const newData = { ...depressionData, [field]: value };
    setDepressionData(newData);
    evaluateDepression(newData);
  };

  const evaluateDepression = (data: DepressionData) => {
    if (Object.values(data).some(v => v === null)) {
      setDepressionResult(null);
      setScore(0);
      return;
    }

    let total = 0;

    if (data.satisfiedLife === 'no') total += 1;
    if (data.helpless === 'si') total += 1;
    if (data.memoryProblems === 'si') total += 1;
    if (data.bored === 'si') total += 1;

    setScore(total);

    if (total >= 2) {
      setDepressionResult('Síntomas depresivos. Sugiere la necesidad de realizar una evaluación geriátrica más completa o un diagnóstico clínico de depresión.');
    } else {
      setDepressionResult('Ausencia de síntomas depresivos clínicamente significativos.');
    }
  };

  return {
    depressionData,
    depressionResult,
    score,
    handleDepressionChange,
    // Aliases for backward compatibility during refactoring
    depresionData: depressionData,
    depresionResult: depressionResult,
    handleDepresionChange: handleDepressionChange
  };
};
export type { DepressionData };
