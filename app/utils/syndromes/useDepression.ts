import { useState } from 'react';
import { DepressionData } from '../../type';

export const useDepression = () => {
  const [depresionData, setDepresionData] = useState<DepressionData>({
    vidaSatisfecha: null,
    impotente: null,
    problemasMemoria: null,
    aburrido: null,
  });

  const [depresionResult, setDepresionResult] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleDepresionChange = (field: keyof DepressionData, value: string) => {
    const newData = { ...depresionData, [field]: value };
    setDepresionData(newData);
    evaluateDepresion(newData);
  };

  const evaluateDepresion = (data: DepressionData) => {
    if (Object.values(data).some(v => v === null)) {
      setDepresionResult(null);
      setScore(0);
      return;
    }

    let total = 0;

    if (data.vidaSatisfecha === 'no') total += 1;
    if (data.impotente === 'si') total += 1;
    if (data.problemasMemoria === 'si') total += 1;
    if (data.aburrido === 'si') total += 1;

    setScore(total);

    if (total >= 2) {
      setDepresionResult('Resultado: Posible depresión (recomendable evaluación adicional)');
    } else {
      setDepresionResult('Resultado: Sin indicios significativos de depresión');
    }
  };

  return {
    depresionData,
    depresionResult,
    score,
    handleDepresionChange
  };
};
export type { DepressionData };

