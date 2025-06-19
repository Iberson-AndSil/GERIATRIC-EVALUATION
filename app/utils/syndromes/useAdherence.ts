import { useState } from 'react';
import { AdherenceData } from '../../type';

export const useAdherence = () => {
  const [adherenciaData, setAdherenciaData] = useState<AdherenceData>({
    olvido: null,
    tomarMedicamento: null,
    dejarMedicacion: null,
    sientaMal: null,
  });
  const [adherenciaResult, setAdherenciaResult] = useState<string | null>(null);

  const handleAdherenciaChange = (field: keyof AdherenceData, value: string) => {
    const newData = { ...adherenciaData, [field]: value };
    setAdherenciaData(newData);
    evaluateAdherencia(newData);
  };

  const evaluateAdherencia = (data: AdherenceData) => {
    if (Object.values(data).some(v => v === null)) {
      setAdherenciaResult(null);
      return;
    }

    let puntuacion = 0;
    if (data.olvido === 'si') puntuacion++;
    if (data.tomarMedicamento === 'no') puntuacion++;
    if (data.dejarMedicacion === 'si') puntuacion++;
    if (data.sientaMal === 'si') puntuacion++;

    let resultado = 'Resultado: ';
    if (puntuacion === 0) {
      resultado += 'Sin problemas de adherencia';
    } else if (puntuacion >= 2) {
      resultado += 'Problemas de adherencia';
    } else {
      resultado += 'Baja adherencia';
    }
    resultado += ` (Puntuación: ${puntuacion})`;

    setAdherenciaResult(resultado);
  };

  return {
    adherenciaData,
    adherenciaResult,
    handleAdherenciaChange
  };
};