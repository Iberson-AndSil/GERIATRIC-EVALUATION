"use client";
import { useGlobalContext } from '../context/GlobalContext';
import { Form } from 'antd';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';
import useSurveyLogic from '../utils/mental/useSurveyLogic';
import { dimensionsConfig } from '../utils/mental/dimensions';
import { questionGroups } from '../utils/mental/questions';
import * as XLSX from "xlsx";

const HealthSurveyPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { fileHandle } = useGlobalContext();
  
  const {
    currentQuestion,
    submitted,
    results,
    totalQuestions,
    allQuestions,
    handleNext,
    handlePrev,
    resetEvaluation,
  } = useSurveyLogic(form, dimensionsConfig, questionGroups);

  const handleSaveData = async () => {
    try {
      if (!fileHandle) {
        alert("Por favor seleccione un archivo primero");
        return;
      }

      const file = await fileHandle.getFile();
      const arrayBuffer = await file.arrayBuffer();
      const existingWb = XLSX.read(arrayBuffer, { type: "array" });
      const wsName = existingWb.SheetNames[0];
      const ws = existingWb.Sheets[wsName];

      const existingData: number[][] = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: ""
      });
      const lastRowIndex = existingData.length - 1;

      if (lastRowIndex >= 0 && results) {
        while (existingData[lastRowIndex].length < 18) {
          existingData[lastRowIndex].push(0);
        }

        existingData[lastRowIndex][27] = results.totalScore;
        existingData[lastRowIndex][28] = results.dimensions.PHYSICAL.rawScore;
        existingData[lastRowIndex][29] = results.dimensions.MENTAL.rawScore;
      }

      const updatedWs = XLSX.utils.aoa_to_sheet(existingData);
      const updatedWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(updatedWb, updatedWs, wsName);

      const writable = await fileHandle.createWritable();
      await writable.write(XLSX.write(updatedWb, {
        bookType: "xlsx",
        type: "buffer",
        bookSST: true
      }));
      await writable.close();

      form.resetFields();
      alert("Resultados guardados exitosamente");
      router.push('/cognitive/');

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error detallado:", err);
        alert(`Error al guardar: ${err.message}`);
      } else {
        console.error("Error desconocido:", err);
        alert("Error al guardar: Verifique la consola para más detalles");
      }
    }
  };

  if (submitted && results) {
    return <ResultsCard 
      results={results} 
      onReset={resetEvaluation}
      onSave={handleSaveData}
    />;
  }

  return (
    <QuestionCard
      form={form}
      currentQuestion={currentQuestion}
      questionGroups={questionGroups}
      totalQuestions={totalQuestions}
      allQuestions={allQuestions}
      onNext={handleNext}
      onPrev={handlePrev}
    />
  );
};

export default HealthSurveyPage;