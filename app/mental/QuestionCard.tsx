'use client';
import React from 'react';
import { Form, Radio, Button, Typography, Progress, Divider, Tag } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { QuestionGroup, SurveyQuestion } from '../type'; // Ajusta ruta

const { Title, Text } = Typography;

interface QuestionCardProps {
  form: any;
  currentQuestion: number;
  questionGroups: QuestionGroup[];
  totalQuestions: number;
  allQuestions: SurveyQuestion[];
  onNext: (values?: any) => void;
  onPrev: () => void;
}

const QuestionCard = ({
  form,
  currentQuestion,
  questionGroups,
  totalQuestions,
  allQuestions,
  onNext,
  onPrev
}: QuestionCardProps) => {

  const getCurrentGroup = () => {
    let accumulated = 0;
    for (const group of questionGroups) {
      if (currentQuestion < accumulated + group.questions.length) {
        return { group, isFirstInGroup: currentQuestion === accumulated };
      }
      accumulated += group.questions.length;
    }
    return { group: questionGroups[0], isFirstInGroup: true };
  };

  const { group } = getCurrentGroup();

  return (
    <div className="animate-fadeIn flex flex-col h-full">

      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progreso</span>
          <span>{currentQuestion + 1} / {totalQuestions}</span>
        </div>
        <Progress
          percent={Math.round(((currentQuestion + 1) / totalQuestions) * 100)}
          showInfo={false}
          strokeColor="#1890ff"
          size="small"
        />
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-6">
        <Text strong className="text-blue-800 uppercase text-xs tracking-wide block">Sección Actual</Text>
        <Title level={5} className="!mt-1 !mb-0 !text-blue-900">{group.title}</Title>
        <Text type="secondary" className="text-xs">{group.description}</Text>
      </div>

      <Form form={form} layout="vertical" className="flex-1 flex flex-col">
        <div className="flex-1">
          <Title level={4} className="text-gray-700 font-medium mb-6">
            {allQuestions[currentQuestion].question}
          </Title>

          <Form.Item
            name="answer"
            rules={[{ required: true, message: 'Seleccione una opción' }]}
          >
            <Radio.Group className="w-full flex flex-col gap-1">
              {allQuestions[currentQuestion].options.map((option, index) => (
                <Radio
                  key={index}
                  value={option}
                  className="w-full px-2 py-1.5 rounded-md"
                >
                  <span className="leading-snug text-base">{option}</span>
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <Button
            disabled={currentQuestion === 0}
            onClick={onPrev}
            icon={<ArrowLeftOutlined />}
            size="large"
          >
            Anterior
          </Button>

          <Button
            type="primary"
            onClick={onNext}
            size="large"
            icon={currentQuestion === totalQuestions - 1 ? <CheckCircleOutlined /> : <ArrowRightOutlined />}
            iconPosition="end" // Antd v5 property, si usas v4 quita esto
          >
            {currentQuestion === totalQuestions - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default QuestionCard;