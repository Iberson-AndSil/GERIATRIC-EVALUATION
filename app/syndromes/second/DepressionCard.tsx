'use client';
import { Card, Space, Radio, Typography } from 'antd';
const { Text } = Typography;

interface DepressionCardProps {
  depresionResult: string | null;
  handleDepresionChange: (field: any, value: any) => void;
}

export const DepressionCard = ({ 
  depresionResult, 
  handleDepresionChange 
}: DepressionCardProps) => (
  <Card title="DEPRESIÓN (Geriatric Depression Scale 4 - UPCH)" className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Text>¿Está satisfecho con su vida?</Text><br />
        <Radio.Group onChange={e => handleDepresionChange('vidaSatisfecha', e.target.value)}>
          <Radio value="no">Sí</Radio>
          <Radio value="si">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Se siente impotente o indefenso?</Text><br />
        <Radio.Group onChange={e => handleDepresionChange('impotente', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Tiene problemas de memoria?</Text><br />
        <Radio.Group onChange={e => handleDepresionChange('problemasMemoria', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Se encuentra a menudo aburrido?</Text><br />
        <Radio.Group onChange={e => handleDepresionChange('aburrido', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      {depresionResult && (
        <Card style={{ marginTop: 16, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Text strong>{depresionResult}</Text>
        </Card>
      )}
    </Space>
  </Card>
);