'use client';
import { Badge, Card, Form, Radio, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { SensoryData } from '@/app/utils/syndromes/useSensory';

const { Text } = Typography;

interface SensoryCardProps {
   sensoryResult: string | null;
   score: number;
   handleSensoryChange: (field: keyof SensoryData, value: string) => void;
}


export const SensoryCard = ({ sensoryResult, score, handleSensoryChange }: SensoryCardProps) => {
   return (
      <Card
         title={<span className="text-teal-600 font-bold"><EyeOutlined className="mr-2" />DETERIORO SENSORIAL</span>}
         className="h-full shadow-md rounded-xl border-t-4 border-t-teal-500 hover:shadow-lg transition-all"
      >
         <Form layout="vertical">
            <div className="bg-teal-50 p-2 rounded-md mb-3 border border-teal-100">
               <Text type="secondary" strong className="text-teal-800 text-xs uppercase tracking-wider">
                  Visión
               </Text>
            </div>

            <Form.Item className="mb-3">
               <div className="flex items-center justify-between gap-4">
                  <Text strong className="w-1/2">
                     ¿Dificultad para ver TV, leer o ejecutar actividades?
                  </Text>

                  <Radio.Group
                     onChange={e => handleSensoryChange('dificultadVista', e.target.value)}
                     optionType="button"
                     buttonStyle="solid"
                     className="flex text-center"
                  >
                     <Radio.Button value="si" className="w-1/2">Sí</Radio.Button>
                     <Radio.Button value="no" className="w-1/2">No</Radio.Button>
                  </Radio.Group>
               </div>
            </Form.Item>

            <Form.Item className="mb-6">
               <div className="flex items-center justify-between gap-4">
                  <Text strong className="w-1/2">
                     ¿Usa anteojos?
                  </Text>

                  <Radio.Group
                     onChange={e => handleSensoryChange('usaAnteojos', e.target.value)}
                     optionType="button"
                     buttonStyle="solid"
                     className="flex text-center"
                  >
                     <Radio.Button value="si" className="w-1/2">Sí</Radio.Button>
                     <Radio.Button value="no" className="w-1/2">No</Radio.Button>
                  </Radio.Group>
               </div>
            </Form.Item>
            <div className="bg-teal-50 p-2 rounded-md mb-3 border border-teal-100">
               <Text type="secondary" strong className="text-teal-800 text-xs uppercase tracking-wider">
                  Audición
               </Text>
            </div>

            <Form.Item className="mb-3">
               <div className="flex items-center justify-between gap-4">
                  <Text strong className="w-1/2">
                     ¿Problemas para escuchar o entender conversaciones?
                  </Text>

                  <Radio.Group
                     onChange={e => handleSensoryChange('dificultadEscucha', e.target.value)}
                     optionType="button"
                     buttonStyle="solid"
                     className="flex text-center"
                  >
                     <Radio.Button value="si" className="w-1/2">Sí</Radio.Button>
                     <Radio.Button value="no" className="w-1/2">No</Radio.Button>
                  </Radio.Group>
               </div>
            </Form.Item>

            <Form.Item className="mb-0">
               <div className="flex items-center justify-between gap-4">
                  <Text strong className="w-1/2">
                     ¿Usa audífonos?
                  </Text>

                  <Radio.Group
                     onChange={e => handleSensoryChange('usaAudifonos', e.target.value)}
                     optionType="button"
                     buttonStyle="solid"
                     className="flex text-center"
                  >
                     <Radio.Button value="si" className="w-1/2">Sí</Radio.Button>
                     <Radio.Button value="no" className="w-1/2">No</Radio.Button>
                  </Radio.Group>
               </div>
            </Form.Item>

         </Form>

         {sensoryResult && (
            <div
               className={`mt-6 p-3 rounded-lg border flex items-center justify-between gap-3 ${score === 0
                     ? 'bg-green-50 border-green-200 text-green-800'
                     : 'bg-orange-50 border-orange-200 text-orange-800'
                  }`}
            >
               <Text strong className="text-inherit">
                  {sensoryResult}
               </Text>
               <Badge
                  count={score}
                  color={score > 0 ? 'orange' : 'green'}
               />
            </div>
         )}

      </Card>
   );
};