import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { DepressionData, SensoryData, BristolData, AdherenceData } from '../../type';
import { actualizarResultado } from '@/app/lib/pacienteService';
import { notification } from 'antd';

export const useSaveData = () => {
  const { currentPatient, currentResultId } = useGlobalContext();
  const router = useRouter();
  const [api] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const guardarDatos = async (depresionData: DepressionData, sensoryData: SensoryData, bristolData: BristolData, adherenciaData: AdherenceData
  ) => {
    try {
      setLoading(true);

      if (!currentPatient?.dni) {
        throw new Error("No se ha seleccionado un paciente");
      }

      const puntajeDepresion = Object.values(depresionData).filter(v => v === 'si').length;
      const puntajeSensorial = [
        sensoryData.dificultadVista === 'si' ? 1 : 0,
        sensoryData.dificultadEscucha === 'si' ? 1 : 0,
        sensoryData.usaAnteojos === 'si' ? 1 : 0,
        sensoryData.usaAudifonos === 'si' ? 1 : 0
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
        let puntuacion = 0;
        if (adherenciaData.olvido === 'si') puntuacion++;
        if (adherenciaData.tomarMedicamento === 'si') puntuacion++;
        if (adherenciaData.dejarMedicacion === 'si') puntuacion++;
        if (adherenciaData.sientaMal === 'si') puntuacion++;
        return puntuacion;
      };

      const depresion = puntajeDepresion.toString();
      const sensorial = puntajeSensorial.toString();
      const bristol = puntajeBristol.toString();
      const adherencia = puntajeMoriski().toString();

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'depresion',
        depresion
      );

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'sensorial',
        sensorial
      );

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'bristol',
        bristol
      );

      await actualizarResultado(
        currentPatient.dni,
        currentResultId || "",
        'adherencia',
        adherencia
      );

      api.success({
        message: 'Éxito',
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      router.push('/physical');

    } catch (error) {
      console.error("Error al guardar datos:", error);
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