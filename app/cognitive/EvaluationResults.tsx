'use client';
import { Card, Typography, Button, Row, Col, Statistic, Alert, Space, notification } from 'antd';
import { useRouter } from 'next/navigation';
import {
  CorrectCoins,
  CorrectBills,
  CalculationItems,
  ResponseItem,
  Intrusions,
  Recall,
} from '../utils/cognitive/types';
import {
  calculatePart1Score,
  calculatePart2Score,
  interpretResult
} from '../utils/cognitive/utils';
import { useGlobalContext } from '../context/GlobalContext';
import { actualizarResultado } from '../lib/pacienteService';

const { Text } = Typography;

interface EvaluationResultsProps {
  correctCoins: CorrectCoins;
  correctBills: CorrectBills;
  calculations: Record<CalculationItems, ResponseItem>;
  animalCount: number | null;
  intrusions: Intrusions;
  recall: Recall;
  fileHandle: any;
  resetEvaluation: () => void;
}

export default function EvaluationResults({
  correctCoins,
  correctBills,
  calculations,
  animalCount,
  intrusions,
  recall,
  resetEvaluation
}: EvaluationResultsProps) {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const { currentPatient, currentResultId } = useGlobalContext();

  const calculateLocalRecallScore = () => {
    let score = 0;
    if (recall.coinQuantity === 'correcto') score += 1;
    if (recall.totalMoney === 'correcto') score += 1;
    if (recall.recalledCoins.cents20?.includes('tipo')) score += 1;
    if (recall.recalledCoins.cents20?.includes('cantidad')) score += 1;
    
    if (recall.recalledCoins.cents50?.includes('tipo')) score += 1;
    if (recall.recalledCoins.cents50?.includes('cantidad')) score += 1;
    
    if (recall.recalledCoins.sol1?.includes('tipo')) score += 1;
    if (recall.recalledCoins.sol1?.includes('cantidad')) score += 1;
    
    if (recall.recalledCoins.soles2?.includes('tipo')) score += 1;
    if (recall.recalledCoins.soles2?.includes('cantidad')) score += 1;
    return Math.max(0, score - intrusions.recall);
  };

  const part1Score = calculatePart1Score(correctCoins, correctBills, intrusions);
  const part2Score = calculatePart2Score(calculations);
  const part3Score = calculateLocalRecallScore();
  const totalScore = part1Score + part2Score + part3Score;
  const interpretation = interpretResult(totalScore);

  const getClassification = (count: number | null) => {
    if (count === null) return null;
    if (count >= 15) return { text: "Función cognitiva normal", color: "green" };
    if (count >= 11) return { text: "Probable deterioro cognitivo", color: "orange" };
    return { text: "Alta probabilidad de deterioro cognitivo", color: "red" };
  };

  const fluencyClassification = getClassification(animalCount);

  const handleSaveData = async () => {
    try {
      await actualizarResultado(currentPatient!.dni, currentResultId || "", 'cognitivo_total', totalScore);
      
      // Save Fluency data
      if (animalCount !== null) {
          await actualizarResultado(currentPatient!.dni, currentResultId || "", 'fluencia_verbal_cantidad', animalCount);
          if (fluencyClassification) {
              await actualizarResultado(currentPatient!.dni, currentResultId || "", 'fluencia_verbal_clasificacion', fluencyClassification.text);
          }
      }

      api.success({ message: 'Éxito', description: 'Resultados guardados', placement: 'topRight' });
      router.push('/mmse30');
    } catch (err) {
      api.error({ message: 'Error al guardar datos' });
    }
  };

  return (
    <Card title="Resultados de la Evaluación" size="small" style={{ margin: '0 auto' }}>
      {contextHolder}

      <Row gutter={[8, 8]}>
        <Col span={6}>
          <Card size="small"><Statistic title="Parte I" value={part1Score} suffix="/11" valueStyle={{ fontSize: '18px' }} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="Parte II" value={part2Score} suffix="/10" valueStyle={{ fontSize: '18px' }} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="Parte III" value={part3Score} suffix="/10" valueStyle={{ fontSize: '18px' }} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={{ backgroundColor: interpretation.color === "red" ? '#fff1f0' : '#f6ffed' }}>
            <Statistic 
              title="TOTAL" 
              value={totalScore} 
              suffix="/31" 
              valueStyle={{ color: interpretation.color === "red" ? '#cf1322' : '#3f8600', fontWeight: 'bold', fontSize: '18px' }} 
            />
          </Card>
        </Col>
      </Row>

      <Alert
        type={interpretation.color === "red" ? "error" : "success"}
        message={<Text strong>{interpretation.diagnosis} (Corte: ≤24)</Text>}
        description={<small>{interpretation.description} <b>Recomendación:</b> {interpretation.recommendation}</small>}
        style={{ margin: '12px 0' }}
        showIcon
      />

      <Card size="small" title={<Text strong style={{fontSize: '14px'}}>Detalle Parte III (Recuerdo)</Text>}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Cantidad (11):</Text>
              {recall.coinQuantity === 'correcto' ? <Text type="success" strong>+1</Text> : <Text type="danger">0</Text>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Dinero (S/ 9):</Text>
              {recall.totalMoney === 'correcto' ? <Text type="success" strong>+1</Text> : <Text type="danger">0</Text>}
            </div>
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid #f0f0f0' }}>
            <Row gutter={[8, 4]}>
              {[
                { label: '5 de 0.20', vals: recall.recalledCoins.cents20 || [] },
                { label: '2 de 0.50', vals: recall.recalledCoins.cents50 || [] },
                { label: '1 de 1.00', vals: recall.recalledCoins.sol1 || [] },
                { label: '3 de 2.00', vals: recall.recalledCoins.soles2 || [] },
              ].map((item, idx) => {
                let pts = 0;
                if (item.vals.includes('tipo')) pts += 1;
                if (item.vals.includes('cantidad')) pts += 1;
                return (
                  <Col span={12} key={idx} style={{ fontSize: '12px' }}>
                    {item.label}: {pts > 0 ? <Text type="success">+{pts}</Text> : <Text type="danger">0</Text>}
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
        <div style={{ textAlign: 'right', borderTop: '1px dashed #f0f0f0', marginTop: '8px', paddingTop: '4px' }}>
          <Text type="secondary" style={{ fontSize: '11px' }}>Intrusiones: -{intrusions.recall}</Text>
        </div>
      </Card>

      {/* Fluencia Verbal Results */}
      {animalCount !== null && fluencyClassification && (
          <Card size="small" style={{ marginTop: '12px' }} title={<Text strong style={{fontSize: '14px'}}>Fluencia Verbal (Distracción)</Text>}>
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary">Cantidad de animales mencionados:</Text>
              </Col>
              <Col>
                <Text strong style={{ fontSize: '16px' }}>{animalCount}</Text>
              </Col>
            </Row>
            <Row justify="space-between" align="middle" style={{ marginTop: '8px' }}>
              <Col>
                <Text type="secondary">Clasificación:</Text>
              </Col>
              <Col>
                <Text strong style={{ color: fluencyClassification.color }}>{fluencyClassification.text}</Text>
              </Col>
            </Row>
          </Card>
      )}

      <div style={{ textAlign: 'right', marginTop: '16px' }}>
        <Space>
          <Button size="middle" onClick={resetEvaluation}>Volver</Button>
          <Button size="middle" type="primary" onClick={handleSaveData}>Guardar</Button>
        </Space>
      </div>
    </Card>
  );
}
