import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { DepressionData, SensoryData, BristolData, AdherenceData } from '../../type';
import { updateResult, createResultsRecord } from '@/app/lib/pacienteService';
import { notification } from 'antd';

export const useSaveData = () => {
  const { currentPatient, currentResultId, setCurrentResultId } = useGlobalContext();
  const router = useRouter();
  const [api] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const guardarDatos = async (
    depressionData: DepressionData, 
    sensoryData: SensoryData, 
    bristolData: BristolData, 
    adherenceData: AdherenceData
  ) => {
    try {
      setLoading(true);

      if (!currentPatient?.dni) {
        throw new Error("No patient selected");
      }

      const puntajeDepresion = Object.values(depressionData).filter(v => v === 'si').length;
      const puntajeSensorial = [
        sensoryData.visionDifficulty === 'si' ? 1 : 0,
        sensoryData.hearingDifficulty === 'si' ? 1 : 0,
        sensoryData.wearsGlasses === 'si' ? 1 : 0,
        sensoryData.wearsHearingAids === 'si' ? 1 : 0
      ].reduce((a, b) => a + b, 0);

      const puntajeBristol = [
        bristolData.effort ? 1 : 0,
        bristolData.hardStool ? 1 : 0,
        bristolData.incomplete ? 1 : 0,
        bristolData.obstruction ? 1 : 0,
        bristolData.manualAid ? 1 : 0,
        bristolData.lessThanThree ? 1 : 0,
        [1, 2].includes(parseInt(bristolData.bristolType || '0')) ? 1 : 0
      ].reduce((a, b) => a + b, 0);

      const puntajeMoriski = () => {
        if (adherenceData.takeMedicationQuestion === 'no') return 0;
        let puntuacion = 0;
        if (adherenceData.forgot === 'no') puntuacion++;
        if (adherenceData.takeMedication === 'si') puntuacion++;
        if (adherenceData.stopMedication === 'no') puntuacion++;
        if (adherenceData.feelsBad === 'no') puntuacion++;
        return puntuacion;
      };

      const depression = puntajeDepresion;
      const sensory = puntajeSensorial;
      const bristol = puntajeBristol;
      const adherence = puntajeMoriski();

      let resId = currentResultId;
      if (!resId) {
        resId = await createResultsRecord(currentPatient.dni, {
          depression: depression,
          sensory: sensory,
          bristol: bristol,
          adherence: adherence
        });
        setCurrentResultId(resId);
      } else {
        await Promise.all([
          updateResult(currentPatient.dni, resId, 'depression', depression),
          updateResult(currentPatient.dni, resId, 'sensory', sensory),
          updateResult(currentPatient.dni, resId, 'bristol', bristol),
          updateResult(currentPatient.dni, resId, 'adherence', adherence)
        ]);
      }

      router.push('/social');

    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    guardarDatos
  };
};