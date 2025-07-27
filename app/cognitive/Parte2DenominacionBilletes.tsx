'use client';
import { Card, Checkbox, Input, Space, Typography, Button } from 'antd';
import { BilletesCorrectos, Intrusiones } from '../utils/cognitive/types';

const { Text } = Typography;

interface Parte2DenominacionBilletesProps {
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
}: Parte2DenominacionBilletesProps) {
  const handleBilletesChange = (key: keyof BilletesCorrectos) => (e: any) => {
    setBilletesCorrectos(prev => ({ ...prev, [key]: e.target.checked }));
  };

  const totalBilletesCorrectos = Math.max(0, 
    Object.values(billetesCorrectos)
    .filter(val => val === true).length - intrusiones.billetes);

  return (
    <>
      <Card title="1. Conocimiento/Denominación (Billetes)" style={{ marginBottom: '20px' }}>
        <Text>“¿Recuerda de qué cantidades hay billetes actualmente?”</Text>
        <p>(máximo un minuto)</p>

        <Space direction="vertical" style={{ margin: '20px 0' }}>
          <Checkbox onChange={handleBilletesChange('soles10')}>10 soles</Checkbox>
          <Checkbox onChange={handleBilletesChange('soles20')}>20 soles</Checkbox>
          <Checkbox onChange={handleBilletesChange('soles50')}>50 soles</Checkbox>
          <Checkbox onChange={handleBilletesChange('soles100')}>100 soles</Checkbox>
          <Checkbox onChange={handleBilletesChange('soles200')}>200 soles</Checkbox>
          <Input
            placeholder="Otras (especificar)"
            onChange={(e) => setBilletesCorrectos(prev => ({ ...prev, otrosBilletes: e.target.value }))}
          />
        </Space>

        <div style={{ margin: '16px 0' }}>
          <Text strong>Intrusiones (respuestas incorrectas adicionales): </Text>
          <Input 
            type="number" 
            min={0}
            style={{ width: '80px' }}
            value={intrusiones.billetes}
            onChange={(e) => handleIntrusionChange('billetes', parseInt(e.target.value) || 0)}
          />
        </div>

        <Text strong>Total correctas: {totalBilletesCorrectos} (máximo 5)</Text>
      </Card>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
        <Button type="primary" onClick={nextStep}>Siguiente</Button>
      </div>
    </>
  );
}