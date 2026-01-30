import { Card, Checkbox, Typography, Slider, Row, Col, Image } from 'antd';
import { AlertOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface BristolCardProps {
  bristolResult: string | null;
  handleBristolChange: (field: any, value: any) => void;
}

export const BristolCard = ({ bristolResult, handleBristolChange }: BristolCardProps) => {
    
  const marks = {
    1: '1',
    2: '2', 
    3: '3', 
    4: '4', 
    5: '5', 
    6: '6', 
    7: '7'
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
                    min={1} 
                    max={7} 
                    marks={marks} 
                    onChange={val => handleBristolChange('bristolType', val)}
                    trackStyle={{ backgroundColor: '#fa8c16' }}
                    handleStyle={{ borderColor: '#fa8c16' }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Estreñimiento</span>
                    <span>Normal</span>
                    <span>Diarrea</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Text strong>Síntomas asociados:</Text>
                <Checkbox onChange={e => handleBristolChange('effort', e.target.checked)}>Esfuerzo excesivo</Checkbox>
                <Checkbox onChange={e => handleBristolChange('hardStool', e.target.checked)}>Heces duras</Checkbox>
                <Checkbox onChange={e => handleBristolChange('incomplete', e.target.checked)}>Evacuación incompleta</Checkbox>
                <Checkbox onChange={e => handleBristolChange('obstruction', e.target.checked)}>Sensación de obstrucción</Checkbox>
                <Checkbox onChange={e => handleBristolChange('manualAid', e.target.checked)}>Necesita ayuda manual</Checkbox>
                <Checkbox onChange={e => handleBristolChange('lessThanThree', e.target.checked)} className="text-red-500 font-medium">
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
        <div className={`mt-4 p-3 rounded-lg border ${bristolResult.includes('Estreñimiento') ? 'bg-orange-50 border-orange-200 text-orange-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
            <AlertOutlined className="mr-2"/>
            <Text strong className="text-inherit">{bristolResult}</Text>
        </div>
      )}
    </Card>
  );
};