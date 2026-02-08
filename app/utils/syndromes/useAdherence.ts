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
  const [score, setScore] = useState<number>(0);

  const handleAdherenciaChange = (field: keyof AdherenceData, value: string) => {
    const newData = { ...adherenciaData, [field]: value };
    setAdherenciaData(newData);
    evaluateAdherencia(newData);
  };

  const evaluateAdherencia = (data: AdherenceData) => {
    if (Object.values(data).some(v => v === null)) {
      setAdherenciaResult(null);
      setScore(0);
      return;
    }

    let puntuacion = 0;
    if (data.olvido === 'si') puntuacion++;
    if (data.tomarMedicamento === 'no') puntuacion++;
    if (data.dejarMedicacion === 'si') puntuacion++;
    if (data.sientaMal === 'si') puntuacion++;

    setScore(puntuacion);

    let resultado = '';
    if (puntuacion < 2) {
      resultado += 'Deficiente adherencia (Incumplimiento de tratamiento farmacológico)';
    } else if (puntuacion <= 3 && puntuacion >= 2) {
      resultado += 'Media adherencia (Cumplimiento moderado de tratamiento farmacológico)';
    } else {
      resultado += 'Alta adherencia (Cumplimiento de tratamiento farmacológico)';
    }

    setAdherenciaResult(resultado);
  };

  return {
    adherenciaData,
    adherenciaResult,
    score,
    handleAdherenciaChange
  };
};
