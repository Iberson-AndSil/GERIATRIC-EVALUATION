import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from "xlsx";
import { useGlobalContext } from '@/app/context/GlobalContext';
import { DepressionData, SensoryData, BristolData, AdherenceData } from '../../type';

export const useSaveData = () => {
  const { fileHandle } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const guardarDatos = async (
    depresionData: DepressionData,
    sensoryData: SensoryData,
    bristolData: BristolData,
    adherenciaData: AdherenceData
  ) => {
    if (!fileHandle) {
      alert("Por favor seleccione un archivo primero");
      return;
    }
    
    try {
      setLoading(true);

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

      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const existingWb = XLSX.read(arrayBuffer, { type: "array" });
      const wsName = existingWb.SheetNames[0];
      const ws = existingWb.Sheets[wsName];

      const existingData: string[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: ""
      });

      let lastRowIndex = existingData.length - 1;
      while (lastRowIndex > 0 && existingData[lastRowIndex].every(cell => cell === "")) {
        lastRowIndex--;
      }

      if (lastRowIndex < 0 || (lastRowIndex === 0 && existingData[0].every(cell => cell === ""))) {
        existingData.push([]);
        lastRowIndex = existingData.length - 1;
      }

      while (existingData[lastRowIndex].length < 25) {
        existingData[lastRowIndex].push("");
      }

      existingData[lastRowIndex][21] = puntajeDepresion.toString();
      existingData[lastRowIndex][22] = puntajeSensorial.toString();
      existingData[lastRowIndex][23] = puntajeBristol.toString();
      existingData[lastRowIndex][24] = puntajeMoriski().toString();

      const newWs = XLSX.utils.aoa_to_sheet(existingData);
      const updatedWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(updatedWb, newWs, wsName);

      const writable = await fileHandle.createWritable();
      await writable.write(XLSX.write(updatedWb, {
        bookType: "xlsx",
        type: "buffer",
        bookSST: true
      }));
      router.push('/physical');
      await writable.close();
      alert("Paciente guardado exitosamente y última fila actualizada");
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