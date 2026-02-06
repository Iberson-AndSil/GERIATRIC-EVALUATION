'use client';
import { Card, Input, Typography, Button, Row, Col } from 'antd';
import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import { MonedasCorrectas, Intrusiones } from '../utils/cognitive/types';

const { Text, Title } = Typography;

interface Props {
  monedasCorrectas: MonedasCorrectas;
  setMonedasCorrectas: React.Dispatch<React.SetStateAction<MonedasCorrectas>>;
  intrusiones: Intrusiones;
  handleIntrusionChange: (tipo: keyof Intrusiones, value: number) => void;
  nextStep: () => void;
}

export default function Parte1DenominacionMonedas({
  monedasCorrectas,
  setMonedasCorrectas,
  intrusiones,
  handleIntrusionChange,
  nextStep
}: Props) {

  const toggleMoneda = (key: keyof MonedasCorrectas) => {
    setMonedasCorrectas((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const monedas = [
    { key: 'centimos10', label: '10 Céntimos' },
    { key: 'centimos20', label: '20 Céntimos' },
    { key: 'centimos50', label: '50 Céntimos' },
    { key: 'soles1', label: '1 Sol' },
    { key: 'soles2', label: '2 Soles' },
    { key: 'soles5', label: '5 Soles' },
  ];

  const seleccionadas = Object.values(monedasCorrectas).filter(v => v === true).length;

  return (
    <div className="animate-fadeIn">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <Title level={5} className="!mb-1 !text-blue-800">1. Conocimiento de Monedas</Title>
        <Text>Pregunta: “¿Recuerda de qué cantidades hay monedas en la actualidad?”</Text>
      </div>

      <Text strong className="block mb-3 text-gray-500">Seleccione las que el paciente mencione:</Text>
      
      <Row gutter={[12, 12]}>
        {monedas.map((moneda) => {
          const isSelected = (monedasCorrectas as any)[moneda.key];
          return (
            <Col xs={12} sm={8} md={8} key={moneda.key}>
              <div 
                onClick={() => toggleMoneda(moneda.key as keyof MonedasCorrectas)}
                className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'}
                `}
              >
                <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                    {moneda.label}
                </span>
                {isSelected && <CheckCircleFilled className="text-blue-500 text-lg" />}
              </div>
            </Col>
          );
        })}
      </Row>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Text type="secondary" className="block mb-1 text-xs uppercase font-bold">Otras Monedas (si menciona antiguas)</Text>
            <Input 
                placeholder="Ej: 5 céntimos, Inti..." 
                value={monedasCorrectas.otrasMonedas}
                onChange={(e) => setMonedasCorrectas((prev: any) => ({ ...prev, otrasMonedas: e.target.value }))}
            />
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 mb-2 text-red-800">
                <CloseCircleOutlined />
                <span className="font-bold text-sm">Intrusiones</span>
            </div>
            <Input 
                type="number" 
                min={0}
                value={intrusiones.monedas}
                onChange={(e) => handleIntrusionChange('monedas', parseInt(e.target.value) || 0)}
                addonAfter="Errores"
                className="w-full"
            />
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
         <span className="text-gray-400 text-sm">Seleccionadas: {seleccionadas}</span>
         <Button type="primary" size="large" onClick={() => seleccionadas > 0 ? nextStep() : alert("Seleccione al menos una")}>
            Siguiente
         </Button>
      </div>
    </div>
  );
}