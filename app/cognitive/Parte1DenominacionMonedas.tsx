'use client';
import { Card, Checkbox, Input, Space, Typography, Button } from 'antd';
import { MonedasCorrectas, Intrusiones } from '../utils/cognitive/types';

const { Text } = Typography;

interface Parte1DenominacionMonedasProps {
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
}: Parte1DenominacionMonedasProps) {
  const handleMonedasChange = (key: keyof MonedasCorrectas) => (e: any) => {
    setMonedasCorrectas((prev:any) => ({ ...prev, [key]: e.target.checked }));
  };

  const totalMonedasCorrectas = Math.max(0, 
    Object.values(monedasCorrectas)
    .filter(val => val === true).length - intrusiones.monedas);

  const handleStep1Next = () => {
    const seleccionadas = Object.values(monedasCorrectas).filter(v => v === true).length;
    if (seleccionadas === 0) {
      alert('Seleccione al menos una moneda.');
      return;
    }
    nextStep();
  };

  return (
    <Card title="1. Conocimiento/Denominación (Monedas)" style={{ marginBottom: '20px' }}>
      <Text>“¿Recuerda de qué cantidades hay monedas en la actualidad?; fíjese que le pregunto monedas y no billetes”</Text>
      <p>(máximo un minuto)</p>

      <Space direction="vertical" style={{ margin: '20px 0' }}>
        <Checkbox onChange={handleMonedasChange('centimos10')}>10 céntimos</Checkbox>
        <Checkbox onChange={handleMonedasChange('centimos20')}>20 céntimos</Checkbox>
        <Checkbox onChange={handleMonedasChange('centimos50')}>50 céntimos</Checkbox>
        <Checkbox onChange={handleMonedasChange('soles1')}>1 sol</Checkbox>
        <Checkbox onChange={handleMonedasChange('soles2')}>2 soles</Checkbox>
        <Checkbox onChange={handleMonedasChange('soles5')}>5 soles</Checkbox>
        <Input
          placeholder="Otras (especificar)"
          onChange={(e) => setMonedasCorrectas((prev:any) => ({ ...prev, otrasMonedas: e.target.value }))}
        />
      </Space>

      <div style={{ margin: '16px 0' }}>
        <Text strong>Intrusiones (respuestas incorrectas adicionales): </Text>
        <Input 
          type="number" 
          min={0}
          style={{ width: '80px' }}
          value={intrusiones.monedas}
          onChange={(e) => handleIntrusionChange('monedas', parseInt(e.target.value) || 0)}
        />
      </div>

      <Text strong>Total correctas: {totalMonedasCorrectas} (máximo 6)</Text>

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button type="primary" onClick={handleStep1Next}>Siguiente</Button>
      </div>
    </Card>
  );
}