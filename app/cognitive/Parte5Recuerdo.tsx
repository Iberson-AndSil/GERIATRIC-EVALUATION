'use client';
import { Card, Input, Typography, Button, Space, Row, Col, Divider, Form } from 'antd';
import { Recuerdo, Intrusiones } from '../utils/cognitive/types';

const { Text, Title } = Typography;

interface Parte5RecuerdoProps {
  recuerdo: Recuerdo;
  setRecuerdo: React.Dispatch<React.SetStateAction<Recuerdo>>;
  intrusiones: Intrusiones;
  handleIntrusionChange: (tipo: keyof Intrusiones, value: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Parte5Recuerdo({
  recuerdo,
  setRecuerdo,
  intrusiones,
  handleIntrusionChange,
  nextStep,
  prevStep
}: Parte5RecuerdoProps) {
  
  const handleMonedaRecordadaChange = (key: keyof Recuerdo['monedasRecordadas'], value: string) => {
    setRecuerdo(prev => ({
      ...prev,
      monedasRecordadas: {
        ...prev.monedasRecordadas,
        [key]: parseInt(value) || 0
      }
    }));
  };

  return (
    <Card title="4. Tercera parte (Recuerdo)" style={{ marginBottom: '20px' }}>
      <Text style={{ display: 'block', marginBottom: '20px', fontSize: '16px' }}>
        “Para finalizar, quiero que haga un último esfuerzo y trate de recordar”:
      </Text>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <Row gutter={[24, 24]}>
          <Col span={12} xs={24} sm={12}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              1. “¿Cuántas monedas le enseñé antes?”
            </Text>
            <Input
              type="number"
              suffix={<Text type="secondary">monedas</Text>}
              value={recuerdo.cantidadMonedas}
              onChange={(e) => setRecuerdo(prev => ({ ...prev, cantidadMonedas: e.target.value }))}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>(Correcto: 11)</Text>
          </Col>
          <Col span={12} xs={24} sm={12}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              2. “¿Cuánto dinero había en total?”
            </Text>
            <Input
              type="number"
              prefix="S/."
              value={recuerdo.totalDinero}
              onChange={(e) => setRecuerdo(prev => ({ ...prev, totalDinero: e.target.value }))}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>(Correcto: 9)</Text>
          </Col>
        </Row>
      </div>

      <Divider orientation="left" style={{ borderColor: '#d9d9d9' }}>Detalle de Monedas</Divider>

      <Text strong style={{ display: 'block', marginBottom: '16px' }}>
        3. “¿Recuerda qué monedas había exactamente?”
      </Text>
      
      <Row gutter={[16, 16]}>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title="20 céntimos">
            <Input
              type="number"
              placeholder="0"
              value={recuerdo.monedasRecordadas.centimos20}
              onChange={(e) => handleMonedaRecordadaChange('centimos20', e.target.value)}
            />
          </Card>
        </Col>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title="50 céntimos">
            <Input
              type="number"
              placeholder="0"
              value={recuerdo.monedasRecordadas.centimos50}
              onChange={(e) => handleMonedaRecordadaChange('centimos50', e.target.value)}
            />
          </Card>
        </Col>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title="1 Sol">
            <Input
              type="number"
              placeholder="0"
              value={recuerdo.monedasRecordadas.sol1}
              onChange={(e) => handleMonedaRecordadaChange('sol1', e.target.value)}
            />
          </Card>
        </Col>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title="2 Soles">
            <Input
              type="number"
              placeholder="0"
              value={recuerdo.monedasRecordadas.soles2}
              onChange={(e) => handleMonedaRecordadaChange('soles2', e.target.value)}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '24px', padding: '15px', border: '1px solid #ffa39e', background: '#fff1f0', borderRadius: '8px' }}>
        <Space>
          <Text strong type="danger">Intrusiones (respuestas incorrectas): </Text>
          <Input 
            type="number" 
            min={0}
            style={{ width: '80px' }}
            value={intrusiones.recuerdo}
            onChange={(e) => handleIntrusionChange('recuerdo', parseInt(e.target.value) || 0)}
          />
        </Space>
      </div>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
        <Button type="primary" onClick={nextStep}>Finalizar</Button>
      </div>
    </Card>
  );
}