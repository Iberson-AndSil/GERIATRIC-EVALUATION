'use client';
import { Card, Space, Radio, Typography } from 'antd';
const { Text } = Typography;

interface SensoryCardProps {
  sensoryResult: string | null;
  handleSensoryChange: (field: any, value: any) => void;
}

export const SensoryCard = ({ 
  sensoryResult, 
  handleSensoryChange 
}: SensoryCardProps) => (
  <Card title="DETERIORO SENSORIAL (Geriatric Depression Scale 4 - UPCH)" className='!rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Text>¿Tiene dificultad para ver la televisión, leer o para ejecutar cualquier actividad de la vida diaria a causa de su vista?</Text><br />
        <Radio.Group onChange={e => handleSensoryChange('dificultadVista', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Usa anteojos?</Text><br />
        <Radio.Group onChange={e => handleSensoryChange('usaAnteojos', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Tiene usted problemas para escuchar o tiene dificultad para entender la conversación?</Text><br />
        <Radio.Group onChange={e => handleSensoryChange('dificultadEscucha', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Usa audífonos?</Text><br />
        <Radio.Group onChange={e => handleSensoryChange('usaAudifonos', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      {sensoryResult && (
        <Card style={{ marginTop: 16, backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
          <Text strong>{sensoryResult}</Text>
        </Card>
      )}
    </Space>
  </Card>
);