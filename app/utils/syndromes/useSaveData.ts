import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/app/context/GlobalContext';
import { DepressionData, SensoryData, BristolData, AdherenceData } from '../../type';
import { actualizarResultado, crearRegistroResultados } from '@/app/lib/pacienteService';
import { notification } from 'antd';

export const useSaveData = () => {
  const { currentPatient, currentResultId, setCurrentResultId } = useGlobalContext();
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
        if (adherenciaData.tomaMedicamentoPregunta === 'no') return 0;
        let puntuacion = 0;
        if (adherenciaData.olvido === 'no') puntuacion++;
        if (adherenciaData.tomarMedicamento === 'si') puntuacion++;
        if (adherenciaData.dejarMedicacion === 'no') puntuacion++;
        if (adherenciaData.sientaMal === 'no') puntuacion++;
        return puntuacion;
      };

      const depresion = puntajeDepresion.toString();
      const sensorial = puntajeSensorial.toString();
      const bristol = puntajeBristol.toString();
      const adherencia = puntajeMoriski().toString();

      let resId = currentResultId;
      if (!resId) {
        resId = await crearRegistroResultados(currentPatient.dni, {
          depresion: depresion,
          sensorial: sensorial,
          bristol: bristol,
          adherencia: adherencia
        });
        setCurrentResultId(resId);
      } else {
        await Promise.all([
          actualizarResultado(currentPatient.dni, resId, 'depresion', depresion),
          actualizarResultado(currentPatient.dni, resId, 'sensorial', sensorial),
          actualizarResultado(currentPatient.dni, resId, 'bristol', bristol),
          actualizarResultado(currentPatient.dni, resId, 'adherencia', adherencia)
        ]);
      }

      api.success({
        message: 'Éxito',
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      router.push('/social');

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