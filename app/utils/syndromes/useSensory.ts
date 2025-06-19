import { useState } from 'react';
import { SensoryData } from '../../type';

export const useSensory = () => {
  const [sensoryData, setSensoryData] = useState<SensoryData>({
    dificultadVista: null,
    usaAnteojos: null,
    dificultadEscucha: null,
    usaAudifonos: null,
  });
  const [sensoryResult, setSensoryResult] = useState<string | null>(null);

  const handleSensoryChange = (field: keyof SensoryData, value: string) => {
    const newData = { ...sensoryData, [field]: value };
    setSensoryData(newData);
    evaluateSensory(newData);
  };

  const evaluateSensory = (data: SensoryData) => {
    if (Object.values(data).some(v => v === null)) {
      setSensoryResult(null);
      return;
    }

    const problemasVista = data.dificultadVista === 'si';
    const problemasOido = data.dificultadEscucha === 'si';

    let resultado = 'Resultado: ';
    if (problemasVista && problemasOido) {
      resultado += 'Deterioro visual y auditivo significativo';
    } else if (problemasVista) {
      resultado += 'Deterioro visual significativo';
    } else if (problemasOido) {
      resultado += 'Deterioro auditivo significativo';
    } else {
      resultado += 'Sin deterioro sensorial significativo';
    }

    setSensoryResult(resultado);
  };

  return {
    sensoryData,
    sensoryResult,
    handleSensoryChange
  };
};