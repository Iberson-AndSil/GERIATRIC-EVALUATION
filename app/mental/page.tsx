"use client";
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { Form, notification, Typography, Button, Card, Steps, Divider } from 'antd';
import { useRouter } from 'next/navigation';
import { 
  MedicineBoxOutlined, 
  ArrowLeftOutlined, 
  SaveOutlined, 
  ReadOutlined, 
} from '@ant-design/icons';
import Link from 'next/link';
import useSurveyLogic from '../utils/mental/useSurveyLogic';
import { dimensionsConfig } from '../utils/mental/dimensions';
import { questionGroups } from '../utils/mental/questions';
import { actualizarResultado } from '../lib/pacienteService';

import QuestionCard from './QuestionCard';
import RealTimeResults from './RealTimeResults'; 
import ResultsSummary from './ResultsSummary';

const { Title, Text } = Typography;

const HealthSurveyPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { currentPatient, currentResultId } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  // Hook de lógica existente
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

  const currentValues = Form.useWatch([], form);
  const progressPercent = Math.round(((currentQuestion) / totalQuestions) * 100);

  const handleSaveData = async () => {
    try {
      setLoading(true);
      const dimension_fisica = results!.totalScore;
      const dimension_mental = results!.dimensions.PHYSICAL.rawScore;
      const puntaje_total = results!.dimensions.MENTAL.rawScore;

      if (!currentPatient?.dni) throw new Error("No hay paciente seleccionado");

      await actualizarResultado(currentPatient.dni, currentResultId || "", 'dimension_fisica', dimension_fisica);
      await actualizarResultado(currentPatient.dni, currentResultId || "", 'dimension_mental', dimension_mental);
      await actualizarResultado(currentPatient.dni, currentResultId || "", 'puntaje_total', puntaje_total);

      api.success({ message: 'Éxito', description: 'Evaluación guardada correctamente' });
      
      setTimeout(() => router.push('/cognitive/'), 1000);

    } catch (err: any) {
      api.error({ message: 'Error', description: err.message || 'Error desconocido' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50/50 p-6">
      {contextHolder}
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-8">
          <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
            <MedicineBoxOutlined className="mr-2" />
            VALORACIÓN MENTAL
          </Title>
          <Text type="secondary" className="text-lg">Calidad de Vida Relacionada a la Salud (SF-12)</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          <div className="md:col-span-2 flex flex-col">
            <Card
              title={
                <span className="text-blue-600 font-bold text-base">
                  <ReadOutlined className="mr-2" /> 
                  {submitted ? "Resultados de la Evaluación" : "Cuestionario SF-12"}
                </span>
              }
              className="shadow-sm rounded-xl border-t-4 border-t-blue-500 h-full flex flex-col"
              bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}
              size="small"
            >
              {!submitted ? (
                <QuestionCard 
                  form={form}
                  currentQuestion={currentQuestion}
                  questionGroups={questionGroups}
                  totalQuestions={totalQuestions}
                  allQuestions={allQuestions}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              ) : (
                <ResultsSummary 
                  results={results!} 
                  onReset={resetEvaluation}
                />
              )}
            </Card>
          </div>

          <div className="md:col-span-1 flex flex-col">
            <RealTimeResults 
              currentValues={currentValues}
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
              results={results}
              submitted={submitted}
              progressPercent={progressPercent}
            />
          </div>

        </div>

        {/* --- FOOTER / BOTONES INFERIORES --- */}
        <div className="flex justify-center gap-4 pb-8 mt-10">
          <Link href="/dashboard"> {/* O la ruta anterior que desees */}
            <Button icon={<ArrowLeftOutlined />}>Volver</Button>
          </Link>
          
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSaveData} 
            loading={loading}
            disabled={!submitted || !currentPatient?.dni} // Solo guardar si terminó
            className="bg-blue-600 hover:bg-blue-500 shadow-md"
          >
            {currentPatient?.dni ? "Guardar Evaluación" : "Seleccione Paciente"}
          </Button>
        </div>
        
        <div className="h-8" />
      </div>
    </div>
  );
};

export default HealthSurveyPage;