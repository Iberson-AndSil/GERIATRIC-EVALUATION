import { Card, Space, Input, Checkbox, Typography, Image } from 'antd';
const { Text } = Typography;

interface BristolCardProps {
  bristolResult: string | null;
  handleBristolChange: (field: any, value: any) => void;
}

export const BristolCard = ({ 
  bristolResult, 
  handleBristolChange 
}: BristolCardProps) => (
  <Card title="ESTREÑIMIENTO (Test de Heces de Bristol)" className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
    <div className='flex justify-between'>
      <Space direction="vertical" size="large" className='w-2/5'>
        <div>
          <Text>Tipo de heces según la escala de Bristol (1 al 7)</Text>
          <Input
            type="number"
            min={1}
            max={7}
            placeholder="Ingrese número del 1 al 7"
            onChange={e => handleBristolChange('bristolType', e.target.value)}
            style={{ marginTop: 8 }}
          />
          <Text type="secondary">Referencia: 1-2 (estreñimiento), 3-4 (normal), 5-7 (diarrea)</Text>
        </div>

        <Checkbox onChange={e => handleBristolChange('effort', e.target.checked)}>
          ¿Esfuerzo para defecar?
        </Checkbox>

        <Checkbox onChange={e => handleBristolChange('hardStool', e.target.checked)}>
          ¿Heces duras?
        </Checkbox>

        <Checkbox onChange={e => handleBristolChange('incomplete', e.target.checked)}>
          ¿Sensación de evacuación incompleta tras la deposición?
        </Checkbox>

        <Checkbox onChange={e => handleBristolChange('obstruction', e.target.checked)}>
          ¿Sensación de obstrucción al defecar?
        </Checkbox>

        <Checkbox onChange={e => handleBristolChange('manualAid', e.target.checked)}>
          ¿Necesita ayuda manual o farmacológica para defecar?
        </Checkbox>

        <Checkbox onChange={e => handleBristolChange('lessThanThree', e.target.checked)}>
          ¿Menos de 3 deposiciones completas a la semana?
        </Checkbox>

        {bristolResult && (
          <Card style={{ marginTop: 16, backgroundColor: '#fff2e8', borderColor: '#ffbb96' }}>
            <Text strong>{bristolResult}</Text>
          </Card>
        )}
      </Space>
      <div className="w-2/5">
        <Image src="/heces.jpg" alt="Escala de Bristol" />
      </div>
    </div>
  </Card>
);