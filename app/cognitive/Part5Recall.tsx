'use client';
import { Card, Input, Typography, Button, Space, Row, Col, Divider, Radio, Checkbox } from 'antd';
import { Recall, Intrusions } from '../utils/cognitive/types';

const { Text } = Typography;

interface Part5RecallProps {
  recall: Recall;
  setRecall: React.Dispatch<React.SetStateAction<Recall>>;
  intrusions: Intrusions;
  handleIntrusionChange: (type: keyof Intrusions, value: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Part5Recall({
  recall,
  setRecall,
  intrusions,
  handleIntrusionChange,
  nextStep,
  prevStep
}: Part5RecallProps) {
  
  const handleMonedaRecordadaChange = (key: keyof Recall['recalledCoins'], checkedValues: string[]) => {
    setRecall(prev => ({
      ...prev,
      recalledCoins: {
        ...prev.recalledCoins,
        [key]: checkedValues
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
            <Radio.Group 
              value={recall.coinQuantity} 
              onChange={(e) => setRecall(prev => ({ ...prev, coinQuantity: e.target.value }))}
            >
              <Radio value="correcto">Correcto</Radio>
              <Radio value="incorrecto">Incorrecto</Radio>
            </Radio.Group>
            <Text type="secondary" style={{ fontSize: '12px' }}>(Correcto: 11)</Text>
          </Col>
          <Col span={12} xs={24} sm={12}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              2. “¿Cuánto dinero había en total?”
            </Text>
            <Radio.Group 
              value={recall.totalMoney} 
              onChange={(e) => setRecall(prev => ({ ...prev, totalMoney: e.target.value }))}
            >
              <Radio value="correcto">Correcto</Radio>
              <Radio value="incorrecto">Incorrecto</Radio>
            </Radio.Group>
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
          <Card size="small" type="inner" title={<span translate="no" className="notranslate">20 céntimos</span>}>
            <Checkbox.Group 
              value={recall.recalledCoins.cents20}
              onChange={(checked) => handleMonedaRecordadaChange('cents20', checked as string[])}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Checkbox value="tipo">Recuerda moneda</Checkbox>
              <Checkbox value="cantidad" disabled={!recall.recalledCoins.cents20?.includes('tipo')}>Recuerda cantidad (5)</Checkbox>
            </Checkbox.Group>
          </Card>
        </Col>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title={<span translate="no" className="notranslate">50 céntimos</span>}>
            <Checkbox.Group 
              value={recall.recalledCoins.cents50}
              onChange={(checked) => handleMonedaRecordadaChange('cents50', checked as string[])}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Checkbox value="tipo">Recuerda moneda</Checkbox>
              <Checkbox value="cantidad" disabled={!recall.recalledCoins.cents50?.includes('tipo')}>Recuerda cantidad (2)</Checkbox>
            </Checkbox.Group>
          </Card>
        </Col>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title={<span translate="no" className="notranslate">1 Sol</span>}>
            <Checkbox.Group 
              value={recall.recalledCoins.sol1}
              onChange={(checked) => handleMonedaRecordadaChange('sol1', checked as string[])}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Checkbox value="tipo">Recuerda moneda</Checkbox>
              <Checkbox value="cantidad" disabled={!recall.recalledCoins.sol1?.includes('tipo')}>Recuerda cantidad (1)</Checkbox>
            </Checkbox.Group>
          </Card>
        </Col>
        <Col span={6} xs={12}>
          <Card size="small" type="inner" title={<span translate="no" className="notranslate">2 Soles</span>}>
            <Checkbox.Group 
              value={recall.recalledCoins.soles2}
              onChange={(checked) => handleMonedaRecordadaChange('soles2', checked as string[])}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <Checkbox value="tipo">Recuerda moneda</Checkbox>
              <Checkbox value="cantidad" disabled={!recall.recalledCoins.soles2?.includes('tipo')}>Recuerda cantidad (3)</Checkbox>
            </Checkbox.Group>
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
            value={intrusions.recall}
            onChange={(e) => handleIntrusionChange('recall', parseInt(e.target.value) || 0)}
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
