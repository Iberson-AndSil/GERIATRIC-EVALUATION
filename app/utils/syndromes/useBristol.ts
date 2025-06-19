import { useState } from 'react';
import { BristolData } from '../../type';

export const useBristol = () => {
  const [bristolData, setBristolData] = useState<BristolData>({
    bristolType: null,
    effort: false,
    hardStool: false,
    incomplete: false,
    obstruction: false,
    manualAid: false,
    lessThanThree: false,
  });
  const [bristolResult, setBristolResult] = useState<string | null>(null);

  const handleBristolChange = (field: keyof BristolData, value: any) => {
    const newData = { ...bristolData, [field]: value };
    setBristolData(newData);
    evaluateBristol(newData);
  };

  const evaluateBristol = (data: BristolData) => {
    if (data.bristolType === null) {
      setBristolResult(null);
      return;
    }

    const bristolType = parseInt(data.bristolType);
    const symptomsCount = [
      data.effort,
      data.hardStool,
      data.incomplete,
      data.obstruction,
      data.manualAid,
      data.lessThanThree
    ].filter(Boolean).length;

    const isConstipation = (bristolType === 1 || bristolType === 2) && symptomsCount >= 2;

    setBristolResult(
      isConstipation
        ? 'Resultado: Probable estreñimiento funcional (cumple criterios Roma IV)'
        : 'Resultado: No se detectan signos claros de estreñimiento.'
    );
  };

  return {
    bristolData,
    bristolResult,
    handleBristolChange
  };
};