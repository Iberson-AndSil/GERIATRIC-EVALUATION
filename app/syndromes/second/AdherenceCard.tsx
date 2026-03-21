import { Badge, Card, Radio, Space, Typography } from 'antd';
import { MedicineBoxOutlined, SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface AdherenceCardProps {
  adherenciaData: any;
  adherenciaResult: string | null;
  score: number;
  handleAdherenciaChange: (field: any, value: any) => void;
}

export const AdherenceCard = ({ adherenciaData, adherenciaResult, score, handleAdherenciaChange }: AdherenceCardProps) => (
  <Card
    title={<span className="text-green-600 font-bold"><MedicineBoxOutlined className="mr-2" />ADHERENCIA (Morisky Green)</span>}
    className="h-full shadow-md rounded-xl border-t-4 border-t-green-500 hover:shadow-lg transition-all"
  >
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>

      <div className="flex justify-between items-center border-b pb-1">
        <Text className="w-2/3 pr-2 text-blue-800 font-semibold">¿Toma algún medicamento: diario, interdiario, semanal o mensual?</Text>
        <Radio.Group
          onChange={e => handleAdherenciaChange('tomaMedicamentoPregunta', e.target.value)}
          value={adherenciaData.tomaMedicamentoPregunta}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="si">Sí</Radio.Button>
          <Radio.Button value="no">No</Radio.Button>
        </Radio.Group>
      </div>

      {adherenciaData.tomaMedicamentoPregunta === 'si' && (
        <>
          {[
            { key: 'olvido', text: '1. ¿Olvida alguna vez tomar los medicamentos?' },
            { key: 'tomarMedicamento', text: '2. ¿Toma sus medicamentos a las horas indicadas?' },
            { key: 'dejarMedicacion', text: '3. Cuando se encuentra bien, ¿deja de tomar la medicación?' },
            { key: 'sientaMal', text: '4. Si alguna vez le sienta mal, ¿deja usted de tomarla?' }
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center border-b pb-2 last:border-0 pl-4">
              <Text className="w-2/3 pr-2">{item.text}</Text>
              <Radio.Group
                onChange={e => handleAdherenciaChange(item.key, e.target.value)}
                value={adherenciaData[item.key]}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="si">Sí</Radio.Button>
                <Radio.Button value="no">No</Radio.Button>
              </Radio.Group>
            </div>
          ))}
        </>
      )}

      {adherenciaResult && (
        <div
          className={`mt-2 p-3 rounded-lg border flex items-center justify-between gap-3 ${adherenciaData.tomaMedicamentoPregunta === 'no'
            ? 'bg-gray-50 border-gray-200 text-gray-700'
            : score === 4
              ? 'bg-green-50 border-green-200 text-green-700'
              : score >= 2
                ? 'bg-orange-50 border-orange-200 text-orange-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
        >
          <div className='flex items-center gap-2'>
            {adherenciaData.tomaMedicamentoPregunta === 'no' ? (
              <SmileOutlined className="text-xl" />
            ) : score === 4 ? (
              <SmileOutlined className="text-xl" />
            ) : score >= 2 ? (
              <MehOutlined className="text-xl" />
            ) : (
              <FrownOutlined className="text-xl" />
            )}

            <Text strong className="text-inherit">
              {adherenciaResult}
            </Text>
          </div>
          {adherenciaData.tomaMedicamentoPregunta !== 'no' && (
            <Badge
              count={score}
              color={score === 4 ? 'green' : score >= 2 ? 'orange' : 'red'}
            />
          )}
        </div>
      )}

    </Space>
  </Card>
);