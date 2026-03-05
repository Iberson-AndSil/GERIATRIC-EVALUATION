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
    let newData = { ...bristolData, [field]: value };

    if (field === 'bristolType') {
      const v = Number(value);
      newData = {
        ...newData,
        effort: v >= 1,
        hardStool: v >= 2,
        incomplete: v >= 3,
        obstruction: v >= 4,
        manualAid: v >= 5,
        lessThanThree: v >= 6,
      };
    }

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
