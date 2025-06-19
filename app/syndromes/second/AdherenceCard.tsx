import { Card, Space, Radio, Typography } from 'antd';
const { Text } = Typography;

interface AdherenceCardProps {
  adherenciaData: any;
  adherenciaResult: string | null;
  handleAdherenciaChange: (field: any, value: any) => void;
}

export const AdherenceCard = ({ 
  adherenciaResult, 
  handleAdherenciaChange 
}: AdherenceCardProps) => (
  <Card title="ADHERENCIA A TRATAMIENTO FARMACOLÓGICO (Moriski Green)" className='h-full !rounded-2xl !shadow-lg !border !border-gray-200 hover:!shadow-xl !transition-shadow !duration-300'>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Text>¿Olvida alguna vez tomar los medicamentos para tratar su enfermedad?</Text><br />
        <Radio.Group onChange={e => handleAdherenciaChange('olvido', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>¿Toma sus medicamentos a las horas indicadas?</Text><br />
        <Radio.Group onChange={e => handleAdherenciaChange('tomarMedicamento', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>Cuando se encuentra bien, ¿deja de tomar la medicación?</Text><br />
        <Radio.Group onChange={e => handleAdherenciaChange('dejarMedicacion', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      <div>
        <Text>Si alguna vez le sienta mal, ¿deja usted de tomarla?</Text><br />
        <Radio.Group onChange={e => handleAdherenciaChange('sientaMal', e.target.value)}>
          <Radio value="si">Sí</Radio>
          <Radio value="no">No</Radio>
        </Radio.Group>
      </div>

      {adherenciaResult && (
        <Card style={{ marginTop: 16, backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Text strong>{adherenciaResult}</Text>
        </Card>
      )}
    </Space>
  </Card>
);