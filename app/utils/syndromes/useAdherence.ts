import { useState } from 'react';
import { AdherenceData } from '../../type';

export const useAdherence = () => {
  const [adherenceData, setAdherenceData] = useState<AdherenceData>({
    takeMedicationQuestion: null,
    forgot: null,
    takeMedication: null,
    stopMedication: null,
    feelsBad: null,
  });

  const [adherenceResult, setAdherenceResult] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleAdherenceChange = (field: keyof AdherenceData, value: string) => {
    let newData = { ...adherenceData, [field]: value };
    
    // Clear sub-questions if user changes answer to "no"
    if (field === 'takeMedicationQuestion' && value === 'no') {
      newData = {
        ...newData,
        forgot: null,
        takeMedication: null,
        stopMedication: null,
        feelsBad: null,
      };
    }

    setAdherenceData(newData);
    evaluateAdherence(newData);
  };

  const evaluateAdherence = (data: AdherenceData) => {
    if (!data.takeMedicationQuestion) {
      setAdherenceResult(null);
      setScore(0);
      return;
    }

    if (data.takeMedicationQuestion === 'no') {
      setAdherenceResult('No aplica (No toma medicamentos)');
      setScore(0);
      return;
    }

    if (
      data.forgot === null ||
      data.takeMedication === null ||
      data.stopMedication === null ||
      data.feelsBad === null
    ) {
      setAdherenceResult(null);
      setScore(0);
      return;
    }

    let puntuacion = 0;
    if (data.forgot === 'no') puntuacion++;
    if (data.takeMedication === 'si') puntuacion++;
    if (data.stopMedication === 'no') puntuacion++;
    if (data.feelsBad === 'no') puntuacion++;

    setScore(puntuacion);

    let resultado = '';
    if (puntuacion === 4) {
      resultado = 'Alta adherencia (Cumplimiento de tratamiento farmacológico)';
    } else if (puntuacion >= 2) {
      resultado = 'Media adherencia (Cumplimiento moderado de tratamiento farmacológico)';
    } else {
      resultado = 'Deficiente adherencia (Incumplimiento de tratamiento farmacológico)';
    }

    setAdherenceResult(resultado);
  };

  return {
    adherenceData,
    adherenceResult,
    score,
    handleAdherenceChange,
    // Aliases for backward compatibility during refactoring
    adherenciaData: adherenceData,
    adherenciaResult: adherenceResult,
    handleAdherenciaChange: handleAdherenceChange
  };
};
