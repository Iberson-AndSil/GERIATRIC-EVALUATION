import { Card, Divider, Typography, Form, Radio, Button, Progress } from 'antd';
import { QuestionGroup, SurveyQuestion } from '../type';

const { Title, Text } = Typography;

interface QuestionCardProps {
  form: any;
  currentQuestion: number;
  questionGroups: QuestionGroup[];
  totalQuestions: number;
  allQuestions: SurveyQuestion[];
  onNext: () => void;
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
        return {
          group,
          isFirstInGroup: currentQuestion === accumulated,
          groupStartIndex: accumulated
        };
      }
      accumulated += group.questions.length;
    }
    return { group: questionGroups[0], isFirstInGroup: true, groupStartIndex: 0 };
  };

  const { group, isFirstInGroup } = getCurrentGroup();

  return (
    <div>
      <Title
        level={3}
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#1890ff',
          fontWeight: 500
        }}
      >
        VALORACIÓN MENTAL
      </Title>

      <Card title="CALIDAD DE VIDA RELACIONADA A LA SALUD SF-12">
        <div style={{ marginBottom: 16 }}>
          <Progress
            percent={Math.round((currentQuestion / totalQuestions) * 100)}
            showInfo={false}
          />
          <div style={{ textAlign: "right" }}>
            Pregunta {currentQuestion + 1} de {totalQuestions}
          </div>
        </div>

        {isFirstInGroup && (
          <>
            <Title level={4} style={{ marginBottom: 8 }}>{group.title}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>{group.description}</Text>
            <Divider style={{ margin: '16px 0' }} />
          </>
        )}

        <Form form={form} layout="vertical">
          <Title level={4} style={{ marginBottom: 24 }}>
            {allQuestions[currentQuestion].question}
          </Title>

          <Form.Item
            name="answer"
            rules={[{ required: true, message: 'Por favor seleccione una opción' }]}
          >
            <Radio.Group>
              {allQuestions[currentQuestion].options.map((option, index) => (
                <Radio key={index} value={option} style={{ display: "block", marginBottom: 8 }}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
            <Button
              onClick={onPrev}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            <Button
              type="primary"
              onClick={onNext}
            >
              {currentQuestion === totalQuestions - 1 ? "Finalizar evaluación" : "Siguiente"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionCard;