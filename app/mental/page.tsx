"use client";
import { useGlobalContext } from '../context/GlobalContext';
import { Form, notification } from 'antd';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';
import useSurveyLogic from '../utils/mental/useSurveyLogic';
import { dimensionsConfig } from '../utils/mental/dimensions';
import { questionGroups } from '../utils/mental/questions';
import { actualizarResultado } from '../lib/pacienteService';

const HealthSurveyPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { currentPatient, currentResultId } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();
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

      const dimension_fisica = results!.totalScore;
      const dimension_mental = results!.dimensions.PHYSICAL.rawScore;
      const puntaje_total = results!.dimensions.MENTAL.rawScore;

      await actualizarResultado(
        currentPatient!.dni,
        currentResultId || "",
        'dimension_fisica',
        dimension_fisica
      );

      await actualizarResultado(
        currentPatient!.dni,
        currentResultId || "",
        'dimension_mental',
        dimension_mental
      );

      await actualizarResultado(
        currentPatient!.dni,
        currentResultId || "",
        'puntaje_total',
        puntaje_total
      );

      api.success({
        message: 'Éxito',
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      form.resetFields();
      router.push('/cognitive/');

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error detallado:", err);
      } else {
        console.error("Error desconocido:", err);
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
    <>
      {contextHolder}
      <QuestionCard
        form={form}
        currentQuestion={currentQuestion}
        questionGroups={questionGroups}
        totalQuestions={totalQuestions}
        allQuestions={allQuestions}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};

export default HealthSurveyPage;