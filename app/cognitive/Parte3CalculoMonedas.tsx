'use client';
import { Typography, Button, Radio, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { CalculoItems, RespuestaItem } from '../utils/cognitive/types';

const { Text, Title } = Typography;

interface Props {
  calculos: Record<CalculoItems, RespuestaItem>;
  setCalculos: React.Dispatch<React.SetStateAction<Record<CalculoItems, RespuestaItem>>>;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Parte3CalculoMonedas({ calculos, setCalculos, nextStep, prevStep }: Props) {

  const handleChange = (item: CalculoItems, value: string) => {
    setCalculos(prev => ({
      ...prev,
      [item]: {
        estado: value as 'correcto' | 'correcto_segundo' | 'incorrecto',
        intentos: value === 'incorrecto' ? 2 : 1
      }
    }));
  };

  const renderItem = (key: CalculoItems, title: string, subtitle: string, correctAnswer: string) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
             <Tag color="blue">{key.toUpperCase()}</Tag>
             <Text strong className="text-gray-800">{title}</Text>
          </div>
          <Text type="secondary" className="block text-sm">{subtitle}</Text>
          <Text type="success" className="block text-xs mt-1 font-medium">Respuesta esperada: {correctAnswer}</Text>
        </div>
        
        <div className="flex-shrink-0">
          <Radio.Group 
            value={calculos[key].estado} 
            onChange={(e) => handleChange(key, e.target.value)}
            buttonStyle="solid"
            size="middle"
          >
            <Radio.Button value="correcto" className="!bg-green-50 !text-green-600 hover:!font-semibold checked:!bg-green-500 checked:!border-green-500">
               ✓ 1º Intento
            </Radio.Button>
            <Radio.Button value="correcto_segundo" className="!bg-orange-50 !text-orange-600 hover:!font-semibold checked:!bg-orange-500 checked:!border-orange-500">
               ✓ 2º Intento
            </Radio.Button>
            <Radio.Button value="incorrecto" className="!bg-red-50 !text-red-600 hover:!font-semibold checked:!bg-red-500 checked:!border-red-500">
               ✕ Fallo
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn">
       <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <Title level={5} className="!mb-1 !text-blue-800">3. Manipulación de Monedas</Title>
        <Text strong>Material:</Text> <Text>3 monedas de S/2.00, 1 de S/1.00, 2 de S/0.50, 5 de S/0.20</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderItem('item3', 'Conteo Total', '“¿Cuántas monedas hay aquí?”', '11 monedas')}
        {renderItem('item4', 'Cambio', '“¿Puede cambiarme esta moneda (S/2.00)?”', '1 de S/1.00 + 2 de S/0.50')}
        {renderItem('item5', 'Suma Total', '“¿Cuánto dinero hay aquí en total?”', '9 soles')}
        {renderItem('item6', 'Reparto en 2', '“Reparta en dos montones iguales”', 'S/ 4.50 cada uno')}
        {renderItem('item7', 'Reparto en 3', '“Reparta en tres montones iguales”', 'S/ 3.00 cada uno')}
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <Button icon={<ArrowLeftOutlined />} onClick={prevStep} size="large">Anterior</Button>
        <Button type="primary" size="large" onClick={nextStep}>Siguiente</Button>
      </div>
    </div>
  );
}