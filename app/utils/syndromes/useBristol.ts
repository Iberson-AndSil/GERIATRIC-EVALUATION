import { useState } from 'react';
import { BristolData } from '../../type';

export const useBristol = () => {
  const [bristolData, setBristolData] = useState<BristolData>({
    bristolType: '1',
    effort: false,
    hardStool: false,
    incomplete: false,
    obstruction: false,
    manualAid: false,
    lessThanThree: false,
  });

  const [bristolResult, setBristolResult] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleBristolChange = (field: keyof BristolData, value: any) => {
    const newData = { ...bristolData, [field]: value };
    setBristolData(newData);
    evaluateBristol(newData);
  };

  const evaluateBristol = (data: BristolData) => {
    const symptomsScore = [
      data.effort,
      data.hardStool,
      data.incomplete,
      data.obstruction,
      data.manualAid,
      data.lessThanThree
    ].filter(Boolean).length;

    setScore(symptomsScore);

    const isConstipation = symptomsScore >= 2;

    setBristolResult(
      isConstipation
        ? 'Resultado: Estreñimiento funcional (cumple criterios Roma IV)'
        : 'Resultado: No cumple criterios Roma IV para estreñimiento'
    );
  };

  return {
    bristolData,
    bristolResult,
    score,
    handleBristolChange
  };
};
