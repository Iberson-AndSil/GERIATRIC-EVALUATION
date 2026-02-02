'use client';
import { Badge, Card, Form, Radio, Typography } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { DepressionData } from '@/app/utils/syndromes/useDepression';

const { Text } = Typography;

interface DepressionCardProps {
  depresionResult: string | null;
  score: number;
  handleDepresionChange: (field: keyof DepressionData, value: string) => void;
}


export const DepressionCard = ({ depresionResult, score, handleDepresionChange }: DepressionCardProps) => {

  const questions: { key: keyof DepressionData; label: string; reverse?: boolean }[] = [
    { key: 'vidaSatisfecha', label: '1. ¿Está satisfecho con su vida?', reverse: true },
    { key: 'impotente', label: '2. ¿Se siente impotente o indefenso?' },
    { key: 'problemasMemoria', label: '3. ¿Tiene problemas de memoria?' },
    { key: 'aburrido', label: '4. ¿Se encuentra a menudo aburrido?' },
  ];

  return (
    <Card
      title={<span className="text-indigo-600 font-bold"><FrownOutlined className="mr-2" />DEPRESIÓN (GDS-4)</span>}
      className="h-full shadow-md rounded-xl border-t-4 border-t-indigo-500 hover:shadow-lg transition-all"
    >
      <Form layout="vertical">
        {questions.map((q) => (
          <Form.Item key={q.key} className="mb-4">
            <div className="flex items-center justify-between gap-4">
              <Text className="w-1/2">
                {q.label}
              </Text>
              <Radio.Group
                onChange={e => handleDepresionChange(q.key, e.target.value)}
                optionType="button"
                buttonStyle="solid"
                className=" flex text-center"
              >
                <Radio.Button value="si" className="w-1/2">
                  Sí
                </Radio.Button>
                <Radio.Button value="no" className="w-1/2">
                  No
                </Radio.Button>
              </Radio.Group>

            </div>
          </Form.Item>
        ))}
      </Form>


      {depresionResult && (
        <div
          className={`mt-4 p-3 rounded-lg border flex items-center justify-between gap-3 ${depresionResult.includes('Depresión')
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
            }`}
        >
          <div className="flex items-center gap-2">
            {depresionResult.includes('Depresión')
              ? <FrownOutlined className="text-xl" />
              : <SmileOutlined className="text-xl" />
            }
            <Text strong className="text-inherit">
              {depresionResult}
            </Text>
          </div>
          <Badge
            count={score}
            color={score >= 2 ? 'red' : 'green'}
          />
        </div>
      )}

    </Card>
  );
};