'use client';
import { Input, Typography, Button, Row, Col } from 'antd';
import { CheckCircleFilled, CloseCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { BilletesCorrectos, Intrusiones } from '../utils/cognitive/types';

const { Text, Title } = Typography;

interface Props {
  billetesCorrectos: BilletesCorrectos;
  setBilletesCorrectos: React.Dispatch<React.SetStateAction<BilletesCorrectos>>;
  intrusiones: Intrusiones;
  handleIntrusionChange: (tipo: keyof Intrusiones, value: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Parte2DenominacionBilletes({
  billetesCorrectos,
  setBilletesCorrectos,
  intrusiones,
  handleIntrusionChange,
  nextStep,
  prevStep
}: Props) {

  const toggleBillete = (key: keyof BilletesCorrectos) => {
    setBilletesCorrectos((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const billetes = [
    { key: 'soles10', label: '10 Soles' },
    { key: 'soles20', label: '20 Soles' },
    { key: 'soles50', label: '50 Soles' },
    { key: 'soles100', label: '100 Soles' },
    { key: 'soles200', label: '200 Soles' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <Title level={5} className="!mb-1 !text-blue-800">2. Conocimiento de Billetes</Title>
        <Text>Pregunta: “¿Recuerda de qué cantidades hay billetes actualmente?”</Text>
      </div>

      <Row gutter={[12, 12]}>
        {billetes.map((billete) => {
          const isSelected = (billetesCorrectos as any)[billete.key];
          return (
            <Col xs={12} sm={8} md={4} key={billete.key}>
              <div 
                onClick={() => toggleBillete(billete.key as keyof BilletesCorrectos)}
                className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center h-24
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'}
                `}
              >
                <span className={`font-bold mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                    {billete.label}
                </span>
                {isSelected && <CheckCircleFilled className="text-blue-500" />}
              </div>
            </Col>
          );
        })}
      </Row>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Text type="secondary" className="block mb-1 text-xs uppercase font-bold">Otros Billetes</Text>
            <Input 
                value={billetesCorrectos.otrosBilletes}
                onChange={(e) => setBilletesCorrectos(prev => ({ ...prev, otrosBilletes: e.target.value }))}
            />
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
             <div className="flex items-center gap-2 mb-2 text-red-800">
                <CloseCircleOutlined />
                <span className="font-bold text-sm">Intrusiones</span>
            </div>
            <Input 
                type="number" min={0}
                value={intrusiones.billetes}
                onChange={(e) => handleIntrusionChange('billetes', parseInt(e.target.value) || 0)}
                addonAfter="Errores"
            />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <Button icon={<ArrowLeftOutlined />} onClick={prevStep} size="large">Anterior</Button>
        <Button type="primary" size="large" onClick={nextStep}>Siguiente</Button>
      </div>
    </div>
  );
}