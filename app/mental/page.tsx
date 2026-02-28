"use client";
import React, { useState, useEffect } from "react";
import { Form, notification, Typography, Button } from "antd";
import { ArrowLeftOutlined, HeartOutlined, SmileOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/GlobalContext";
import { actualizarResultado } from "../lib/pacienteService";

import QuestionCard from "./QuestionCard";
import RealTimeResults from "./RealTimeResults";
import ResultsCard from "./ResultsCard";
import { SurveyResults, DimensionKey } from "../type";

const { Title, Text } = Typography;

// --- CONFIGURACIÓN DE PREGUNTAS SF-12 ---
const sf12Questions = [
  {
    id: 1,
    question: "1. En general, usted diría que su salud es:",
    options: ["Excelente", "Muy buena", "Buena", "Regular", "Mala"],
    scores: [1, 2, 3, 4, 5], 
  },
  {
    id: 2,
    question: "2. Esfuerzos moderados, como mover una mesa, pasa la aspiradora, jugar a los bolos o caminar más de 1 hora:",
    options: ["Sí, me limita mucho", "Sí, me limita un poco", "No, no me limita nada"],
    scores: [1, 2, 3],
  },
  {
    id: 3,
    question: "3. Subir varios pisos por la escalera:",
    options: ["Sí, me limita mucho", "Sí, me limita un poco", "No, no me limita nada"],
    scores: [1, 2, 3],
  },
  {
    id: 4,
    question: "4. ¿Hizo menos de lo que hubiera querido hacer a causa de su salud física?",
    options: ["Sí", "No"],
    scores: [1, 2],
  },
  {
    id: 5,
    question: "5. ¿Tuvo que dejar de hacer algunas tareas en su trabajo o en sus actividades cotidianas a causa de su salud física?",
    options: ["Sí", "No"],
    scores: [1, 2],
  },
  {
    id: 6,
    question: "6. ¿Hizo menos de lo que hubiera querido hacer, por algún problema emocional?",
    options: ["Sí", "No"],
    scores: [1, 2],
  },
  {
    id: 7,
    question: "7. ¿No hizo su trabajo o sus actividades cotidianas tan cuidadosamente como de costumbre, por algún problema emocional?",
    options: ["Sí", "No"],
    scores: [1, 2],
  },
  {
    id: 8,
    question: "8. Durante las 4 últimas semanas, ¿Hasta qué punto el dolor le ha dificultado su trabajo habitual?",
    options: ["Nada", "Un poco", "Regular", "Bastante", "Mucho"],
    scores: [1, 2, 3, 4, 5],
  },
  {
    id: 9,
    question: "9. ¿Cuánto tiempo se sintió calmado y tranquilo?",
    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
    scores: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 10,
    question: "10. ¿Cuánto tiempo tuvo mucha energía?",
    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
    scores: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 11,
    question: "11. ¿Cuánto tiempo se sintió desanimado y triste?",
    options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
    scores: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 12,
    question: "12. ¿Con qué frecuencia la salud física o los problemas emocionales le han dificultado sus actividades sociales?",
    options: ["Siempre", "Casi siempre", "Algunas veces", "Sólo alguna vez", "Nunca"],
    scores: [1, 2, 3, 4, 5],
  }
];

// --- AGRUPACIÓN PARA EL QUESTION CARD ---
const sf12Groups = [
  {
    title: "Salud General y Funcional",
    description: "Evaluación de la percepción general del estado de salud y capacidades.",
    questions: sf12Questions.slice(0, 3) 
  },
  {
    title: "Impacto Físico en la Rutina",
    description: "Cómo la salud física afecta la cotidianidad.",
    questions: sf12Questions.slice(3, 5)
  },
  {
    title: "Impacto Emocional y Dolor",
    description: "Evaluación del factor anímico y el dolor en el cuerpo.",
    questions: sf12Questions.slice(5, 8) 
  },
  {
    title: "Estado de Ánimo y Socialización",
    description: "Análisis del balance emocional, vitalidad y relacionamiento social social.",
    questions: sf12Questions.slice(8, 12)
  }
];

const MENTAL_QUESTION_IDS = [6, 7, 9, 10, 11, 12];
const PHYSICAL_QUESTION_IDS = [1, 2, 3, 4, 5, 8];

const MentalEvaluationPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { currentPatient, currentResultId } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SurveyResults | null>(null);

  // Calcula las métricas en tiempo real basados en respuestas
  const currentResults = React.useMemo(() => {
    let physicalScore = 0;
    let mentalScore = 0;

    Object.entries(answers).forEach(([qIdStr, optIndex]) => {
      const qId = parseInt(qIdStr);
      const question = sf12Questions.find(q => q.id === qId);
      if (question) {
        const score = question.scores[optIndex];
        if (PHYSICAL_QUESTION_IDS.includes(qId)) physicalScore += score;
        if (MENTAL_QUESTION_IDS.includes(qId)) mentalScore += score;
      }
    });

    const maxPhysical = PHYSICAL_QUESTION_IDS.reduce((acc, id) => {
        const q = sf12Questions.find((q) => q.id === id);
        return acc + (q ? Math.max(...q.scores) : 0);
    }, 0);

    const maxMental = MENTAL_QUESTION_IDS.reduce((acc, id) => {
        const q = sf12Questions.find((q) => q.id === id);
        return acc + (q ? Math.max(...q.scores) : 0);
    }, 0);


    return {
      totalScore: physicalScore + mentalScore,
      answers: {}, // Formato adaptativo
      dimensions: {
        PHYSICAL: {
          rawScore: physicalScore,
          maxPossible: maxPhysical,
          name: "Dimensión Física",
          description: "Funcionalidad, dolor corporal e impacto físico general.",
          icon: <HeartOutlined />,
          questionIndexes: PHYSICAL_QUESTION_IDS
        },
        MENTAL: {
          rawScore: mentalScore,
          maxPossible: maxMental,
          name: "Dimensión Mental",
          description: "Salud emocional, vitalidad y participación social.",
          icon: <SmileOutlined />,
          questionIndexes: MENTAL_QUESTION_IDS
        }
      } as Record<DimensionKey, any>
    };
  }, [answers]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      
      const optionIndex = sf12Questions[currentQuestion].options.findIndex(
        opt => opt === values.answer
      );

      setAnswers(prev => ({
        ...prev,
        [sf12Questions[currentQuestion].id]: optionIndex
      }));

      if (currentQuestion < sf12Questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        form.resetFields();
      } else {
        // Al darle finalizar
        setResults(currentResults);
        setIsSubmitted(true);
      }
    } catch (error) {
       console.log("Valide la respuesta primero.");
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      form.resetFields();
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsSubmitted(false);
    setResults(null);
    form.resetFields();
  };

  const saveFile = async () => {
    try {
      setLoading(true);
      if (!currentPatient?.dni) throw new Error("No hay paciente seleccionado");

      const physScore = currentResults.dimensions.PHYSICAL.rawScore;
      const mentScore = currentResults.dimensions.MENTAL.rawScore;
      const totalScore = currentResults.totalScore;

      await actualizarResultado(currentPatient.dni, currentResultId || "", "dimension_fisica", physScore.toString());
      await actualizarResultado(currentPatient.dni, currentResultId || "", "dimension_mental", mentScore.toString());
      await actualizarResultado(currentPatient.dni, currentResultId || "", "puntaje_total_sf12", totalScore.toString());

      api.success({
        message: "Guardado Exitoso",
        description: "Los resultados de la encuesta SF-12 se han guardado con éxito.",
      });

      setTimeout(() => router.push("/clinic"), 1500); // Routea al que sigue orgánicamente según prefiramos
    } catch (err: any) {
      api.error({
        message: "Error de Guardado",
        description: err.message || "Ocurrió un error inesperado al intentar guardar.",
      });
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
            EVALUACIÓN DE CALIDAD DE VIDA (SF-12)
          </Title>
          <Text type="secondary" className="text-lg">
            INSTRUCCIONES: Responda francamente para saber cómo se encuentra usted y su capacidad funcional.
          </Text>
        </div>

        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                <QuestionCard
                  form={form}
                  currentQuestion={currentQuestion}
                  questionGroups={sf12Groups as any}
                  totalQuestions={sf12Questions.length}
                  allQuestions={sf12Questions as any}
                  onNext={handleNext}
                  onPrev={handlePrev}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <RealTimeResults
                currentValues={answers}
                currentQuestion={currentQuestion}
                totalQuestions={sf12Questions.length}
                results={currentResults}
                submitted={isSubmitted}
                progressPercent={Math.round((Object.keys(answers).length / sf12Questions.length) * 100)}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <ResultsCard
              results={results as any}
              onReset={handleReset}
              onSave={saveFile}
            />
          </div>
        )}

        {!isSubmitted && (
            <div className="flex justify-center mt-8">
              <Link href="/physical">
                <Button icon={<ArrowLeftOutlined />} size="large">Volver Atrás</Button>
              </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default MentalEvaluationPage;