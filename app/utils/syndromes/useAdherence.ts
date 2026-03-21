import { useState } from 'react';
import { AdherenceData } from '../../type';

export const useAdherence = () => {
  const [adherenciaData, setAdherenciaData] = useState<AdherenceData>({
    tomaMedicamentoPregunta: null,
    olvido: null,
    tomarMedicamento: null,
    dejarMedicacion: null,
    sientaMal: null,
  });

  const [adherenciaResult, setAdherenciaResult] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleAdherenciaChange = (field: keyof AdherenceData, value: string) => {
    let newData = { ...adherenciaData, [field]: value };
    
    // Clear sub-questions if user changes answer to "no"
    if (field === 'tomaMedicamentoPregunta' && value === 'no') {
      newData = {
        ...newData,
        olvido: null,
        tomarMedicamento: null,
        dejarMedicacion: null,
        sientaMal: null,
      };
    }

    setAdherenciaData(newData);
    evaluateAdherencia(newData);
  };

  const evaluateAdherencia = (data: AdherenceData) => {
    if (!data.tomaMedicamentoPregunta) {
      setAdherenciaResult(null);
      setScore(0);
      return;
    }

    if (data.tomaMedicamentoPregunta === 'no') {
      setAdherenciaResult('No aplica (No toma medicamentos)');
      setScore(0);
      return;
    }

    if (
      data.olvido === null ||
      data.tomarMedicamento === null ||
      data.dejarMedicacion === null ||
      data.sientaMal === null
    ) {
      setAdherenciaResult(null);
      setScore(0);
      return;
    }

    let puntuacion = 0;
    if (data.olvido === 'no') puntuacion++;
    if (data.tomarMedicamento === 'si') puntuacion++;
    if (data.dejarMedicacion === 'no') puntuacion++;
    if (data.sientaMal === 'no') puntuacion++;

    setScore(puntuacion);

    let resultado = '';
    if (puntuacion === 4) {
      resultado = 'Alta adherencia (Cumplimiento de tratamiento farmacológico)';
    } else if (puntuacion >= 2) {
      resultado = 'Media adherencia (Cumplimiento moderado de tratamiento farmacológico)';
    } else {
      resultado = 'Deficiente adherencia (Incumplimiento de tratamiento farmacológico)';
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
