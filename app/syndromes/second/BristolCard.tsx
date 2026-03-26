import { Card, Checkbox, Typography, Slider, Row, Col, Image, Badge } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface BristolCardProps {
  bristolData: any;
  bristolResult: string | null;
  score: number;
  handleBristolChange: (field: any, value: any) => void;
}

export const BristolCard = ({ bristolData, bristolResult, score, handleBristolChange }: BristolCardProps) => {

  const marks = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6'
  };

  return (
    <Card
      title={<span className="text-orange-600 font-bold">ESTREÑIMIENTO (Bristol)</span>}
      className="h-full shadow-md rounded-xl border-t-4 border-t-orange-500 hover:shadow-lg transition-all"
    >
      <Row gutter={24}>
        <Col span={14}>
          <div className="mb-6">
            <Text strong className="block mb-2">Escala de Bristol (Tipo de heces)</Text>
            <Slider
              min={0}
              max={6}
              marks={marks}
              value={Number(bristolData.bristolType) || 0}
              onChange={val => handleBristolChange('bristolType', val)}
              trackStyle={Number(bristolData.bristolType) > 0 ? { backgroundColor: '#ff4d4f' } : { backgroundColor: '#f5f5f5' }}
              handleStyle={Number(bristolData.bristolType) > 0 ? { borderColor: '#ff4d4f' } : { borderColor: '#d9d9d9' }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Estreñimiento</span>
              <span>Normal</span>
              <span>Diarrea</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Text strong>Criterios de Roma IV:</Text>
            <Checkbox checked={bristolData.effort} onChange={e => handleBristolChange('effort', e.target.checked)}>Esfuerzo para defecar</Checkbox>
            <Checkbox checked={bristolData.hardStool} disabled={Number(bristolData.bristolType) > 2} onChange={e => handleBristolChange('hardStool', e.target.checked)}>Heces duras</Checkbox>
            <Checkbox checked={bristolData.incomplete} onChange={e => handleBristolChange('incomplete', e.target.checked)}>Evacuación incompleta tras defecación</Checkbox>
            <Checkbox checked={bristolData.obstruction} onChange={e => handleBristolChange('obstruction', e.target.checked)}>Sensación de obstrucción</Checkbox>
            <Checkbox checked={bristolData.manualAid} onChange={e => handleBristolChange('manualAid', e.target.checked)}>Necesita ayuda manual o farmacológica</Checkbox>
            <Checkbox checked={bristolData.lessThanThree} onChange={e => handleBristolChange('lessThanThree', e.target.checked)} className="text-red-500 font-medium">
              &lt; 3 deposiciones/semana
            </Checkbox>
          </div>
        </Col>
        <Col span={10} className="!flex flex-col !items-center !justify-center border-l pl-4">
          <div className="mt-2 text-center">
            <Text type="secondary" style={{ fontSize: 10 }}>Referencia visual</Text>
            <Image src="/heces.jpg" alt="Escala de Bristol" />
          </div>
        </Col>
      </Row>

      {bristolResult && (
        <div
          className={`mt-4 p-3 rounded-lg border flex items-center justify-between gap-3 ${score >= 2
            ? 'bg-orange-50 border-orange-200 text-orange-800'
            : 'bg-green-50 border-green-200 text-green-800'
            }`}
        >
          <AlertOutlined />
          <Text strong className="text-inherit">
            {bristolResult}
          </Text>
          <Badge
            count={score}
            color={score >= 2 ? 'orange' : 'green'}
          />
        </div>
      )}
    </Card>
  );
};