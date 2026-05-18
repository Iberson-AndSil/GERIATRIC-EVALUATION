'use client';
import { Card, Typography, Button, Row, Col, Statistic, Alert, Space, Divider, notification } from 'antd';
import { useRouter } from 'next/navigation';
import {
  MonedasCorrectas,
  BilletesCorrectos,
  CalculoItems,
  RespuestaItem,
  Intrusiones,
  Recuerdo,
} from '../utils/cognitive/types';
import {
  calcularPuntajeParte1,
  calcularPuntajeParte2,
  interpretarResultado
} from '../utils/cognitive/utils';
import { useGlobalContext } from '../context/GlobalContext';
import { actualizarResultado } from '../lib/pacienteService';

const { Title, Text } = Typography;

interface ResultadosEvaluacionProps {
  monedasCorrectas: MonedasCorrectas;
  billetesCorrectos: BilletesCorrectos;
  calculos: Record<CalculoItems, RespuestaItem>;
  cantidadAnimales: number | null;
  intrusiones: Intrusiones;
  recuerdo: Recuerdo;
  fileHandle: any;
  resetEvaluation: () => void;
}

export default function ResultadosEvaluacion({
  monedasCorrectas,
  billetesCorrectos,
  calculos,
  cantidadAnimales,
  intrusiones,
  recuerdo,
  resetEvaluation
}: ResultadosEvaluacionProps) {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const { currentPatient, currentResultId } = useGlobalContext();

  const calcularPuntajeRecuerdoLocal = () => {
    let puntaje = 0;
    if (recuerdo.cantidadMonedas === 'correcto') puntaje += 1;
    if (recuerdo.totalDinero === 'correcto') puntaje += 1;
    if (recuerdo.monedasRecordadas.centimos20?.includes('tipo')) puntaje += 1;
    if (recuerdo.monedasRecordadas.centimos20?.includes('cantidad')) puntaje += 1;
    
    if (recuerdo.monedasRecordadas.centimos50?.includes('tipo')) puntaje += 1;
    if (recuerdo.monedasRecordadas.centimos50?.includes('cantidad')) puntaje += 1;
    
    if (recuerdo.monedasRecordadas.sol1?.includes('tipo')) puntaje += 1;
    if (recuerdo.monedasRecordadas.sol1?.includes('cantidad')) puntaje += 1;
    
    if (recuerdo.monedasRecordadas.soles2?.includes('tipo')) puntaje += 1;
    if (recuerdo.monedasRecordadas.soles2?.includes('cantidad')) puntaje += 1;
    return Math.max(0, puntaje - intrusiones.recuerdo);
  };

  const puntajeParte1 = calcularPuntajeParte1(monedasCorrectas, billetesCorrectos, intrusiones);
  const puntajeParte2 = calcularPuntajeParte2(calculos);
  const puntajeParte3 = calcularPuntajeRecuerdoLocal();
  const puntajeTotal = puntajeParte1 + puntajeParte2 + puntajeParte3;
  const interpretacion = interpretarResultado(puntajeTotal);

  const getClassification = (count: number | null) => {
    if (count === null) return null;
    if (count >= 15) return { text: "Función cognitiva normal", color: "green" };
    if (count >= 11) return { text: "Probable deterioro cognitivo", color: "orange" };
    return { text: "Alta probabilidad de deterioro cognitivo", color: "red" };
  };

  const clasificacionFluencia = getClassification(cantidadAnimales);

  const handleSaveData = async () => {
    try {
      await actualizarResultado(currentPatient!.dni, currentResultId || "", 'cognitivo_total', puntajeTotal);
      
      // Save Fluency data
      if (cantidadAnimales !== null) {
          await actualizarResultado(currentPatient!.dni, currentResultId || "", 'fluencia_verbal_cantidad', cantidadAnimales);
          if (clasificacionFluencia) {
              await actualizarResultado(currentPatient!.dni, currentResultId || "", 'fluencia_verbal_clasificacion', clasificacionFluencia.text);
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
          <Card size="small"><Statistic title="Parte I" value={puntajeParte1} suffix="/11" valueStyle={{ fontSize: '18px' }} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="Parte II" value={puntajeParte2} suffix="/10" valueStyle={{ fontSize: '18px' }} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small"><Statistic title="Parte III" value={puntajeParte3} suffix="/10" valueStyle={{ fontSize: '18px' }} /></Card>
        </Col>
        <Col span={6}>
          <Card size="small" bodyStyle={{ backgroundColor: interpretacion.color === "red" ? '#fff1f0' : '#f6ffed' }}>
            <Statistic 
              title="TOTAL" 
              value={puntajeTotal} 
              suffix="/31" 
              valueStyle={{ color: interpretacion.color === "red" ? '#cf1322' : '#3f8600', fontWeight: 'bold', fontSize: '18px' }} 
            />
          </Card>
        </Col>
      </Row>

      <Alert
        type={interpretacion.color === "red" ? "error" : "success"}
        message={<Text strong>{interpretacion.diagnostico} (Corte: ≤24)</Text>}
        description={<small>{interpretacion.descripcion} <b>Recomendación:</b> {interpretacion.recomendacion}</small>}
        style={{ margin: '12px 0' }}
        showIcon
      />

      <Card size="small" title={<Text strong style={{fontSize: '14px'}}>Detalle Parte III (Recuerdo)</Text>}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Cantidad (11):</Text>
              {recuerdo.cantidadMonedas === 'correcto' ? <Text type="success" strong>+1</Text> : <Text type="danger">0</Text>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">Dinero (S/ 9):</Text>
              {recuerdo.totalDinero === 'correcto' ? <Text type="success" strong>+1</Text> : <Text type="danger">0</Text>}
            </div>
          </Col>
          <Col span={12} style={{ borderLeft: '1px solid #f0f0f0' }}>
            <Row gutter={[8, 4]}>
              {[
                { label: '5 de 0.20', vals: recuerdo.monedasRecordadas.centimos20 || [] },
                { label: '2 de 0.50', vals: recuerdo.monedasRecordadas.centimos50 || [] },
                { label: '1 de 1.00', vals: recuerdo.monedasRecordadas.sol1 || [] },
                { label: '3 de 2.00', vals: recuerdo.monedasRecordadas.soles2 || [] },
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
          <Text type="secondary" style={{ fontSize: '11px' }}>Intrusiones: -{intrusiones.recuerdo}</Text>
        </div>
      </Card>

      {/* Fluencia Verbal Results */}
      {cantidadAnimales !== null && clasificacionFluencia && (
          <Card size="small" style={{ marginTop: '12px' }} title={<Text strong style={{fontSize: '14px'}}>Fluencia Verbal (Distracción)</Text>}>
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary">Cantidad de animales mencionados:</Text>
              </Col>
              <Col>
                <Text strong style={{ fontSize: '16px' }}>{cantidadAnimales}</Text>
              </Col>
            </Row>
            <Row justify="space-between" align="middle" style={{ marginTop: '8px' }}>
              <Col>
                <Text type="secondary">Clasificación:</Text>
              </Col>
              <Col>
                <Text strong style={{ color: clasificacionFluencia.color }}>{clasificacionFluencia.text}</Text>
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