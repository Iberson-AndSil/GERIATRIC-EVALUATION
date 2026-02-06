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
  animales: string[];
  intrusiones: Intrusiones;
  recuerdo: Recuerdo;
  fileHandle: any;
  resetEvaluation: () => void;
}

export default function ResultadosEvaluacion({
  monedasCorrectas,
  billetesCorrectos,
  calculos,
  animales,
  intrusiones,
  recuerdo,
  resetEvaluation
}: ResultadosEvaluacionProps) {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const { currentPatient, currentResultId } = useGlobalContext();

  // --- Lógica de Puntuación Parte 3 (Recuerdo) Corregida ---
  const calcularPuntajeRecuerdoLocal = () => {
    let puntaje = 0;

    // Pregunta 1: Cantidad correcta (11) -> Suma 1
    if (recuerdo.cantidadMonedas === '11') puntaje += 1;

    // Pregunta 2: Total dinero correcto (9) -> Suma 1
    if (recuerdo.totalDinero === '9') puntaje += 1;

    // Pregunta 3: Items correctos -> Suma 2 cada uno
    // Valores correctos: 5 de 0.20, 2 de 0.50, 1 de 1.00, 3 de 2.00
    if (Number(recuerdo.monedasRecordadas.centimos20) === 5) puntaje += 2;
    if (Number(recuerdo.monedasRecordadas.centimos50) === 2) puntaje += 2;
    if (Number(recuerdo.monedasRecordadas.sol1) === 1) puntaje += 2;
    if (Number(recuerdo.monedasRecordadas.soles2) === 3) puntaje += 2;

    // Restamos intrusiones al final (opcional, pero estándar en Eurotest)
    // Usamos Math.max para que no de negativo
    return Math.max(0, puntaje - intrusiones.recuerdo);
  };

  const puntajeParte1 = calcularPuntajeParte1(monedasCorrectas, billetesCorrectos, intrusiones);
  const puntajeParte2 = calcularPuntajeParte2(calculos);
  const puntajeParte3 = calcularPuntajeRecuerdoLocal(); 
  
  const puntajeTotal = puntajeParte1 + puntajeParte2 + puntajeParte3;
  const interpretacion = interpretarResultado(puntajeTotal);

  const totalMonedasCorrectas = Math.max(0, 
    Object.values(monedasCorrectas).filter(val => val === true).length - intrusiones.monedas);

  const totalBilletesCorrectos = Math.max(0, 
    Object.values(billetesCorrectos).filter(val => val === true).length - intrusiones.billetes);

  const handleSaveData = async () => {
    try {
      await actualizarResultado(
        currentPatient!.dni,
        currentResultId || "",
        'cognitivo_total',
        puntajeTotal
      );

      api.success({
        message: 'Éxito',
        description: 'Resultados de valoración cognitiva guardados correctamente',
        placement: 'topRight'
      });

      router.push('/mmse30');

    } catch (err: unknown) {
        // Manejo de error simplificado
        console.error(err);
        api.error({ message: 'Error al guardar datos' });
    }
  };

  return (
    <Card title="Resultados de la Evaluación">
      {contextHolder}
      <Title level={4}>Resumen de puntuaciones</Title>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Parte I: Denominación"
              value={puntajeParte1}
              suffix={`/11`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Parte II: Cálculo"
              value={puntajeParte2}
              suffix={`/10`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Parte III: Recuerdo"
              value={puntajeParte3}
              suffix={`/10`} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={24}>
          <Card className={interpretacion.color === "red" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            <Statistic
              title="Puntuación Total"
              value={puntajeTotal}
              suffix={`/31`}
              valueStyle={{ color: interpretacion.color === "red" ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Title level={4}>Interpretación Clínica</Title>
      <Alert
        type={interpretacion.color === "red" ? "error" : "success"}
        message={interpretacion.diagnostico}
        description={
          <>
            <p>{interpretacion.descripcion}</p>
            <p><strong>Recomendación:</strong> {interpretacion.recomendacion}</p>
            <p><em>Punto de corte: ≤24 puntos</em></p>
          </>
        }
        style={{ marginBottom: '20px' }}
      />

      <Title level={4}>Detalle Parte III (Recuerdo)</Title>
      <Card size="small">
        <Space direction="vertical" style={{ width: '100%' }}>
          
          <Row justify="space-between" align="middle">
            <Text strong>1. Cantidad de monedas (11):</Text>
            {recuerdo.cantidadMonedas === '11' ? 
              <Text type="success" strong>+1 punto</Text> : 
              <Text type="danger">0 puntos</Text>}
          </Row>

          <Row justify="space-between" align="middle">
            <Text strong>2. Total de dinero (9 soles):</Text>
            {recuerdo.totalDinero === '9' ? 
              <Text type="success" strong>+1 punto</Text> : 
              <Text type="danger">0 puntos</Text>}
          </Row>
          
          <Divider style={{margin: '10px 0'}} dashed />
          <Text strong>3. Desglose de monedas (+2 c/u):</Text>

          <Row justify="space-between">
            <Text>5 de 20 céntimos:</Text>
            {Number(recuerdo.monedasRecordadas.centimos20) === 5 ? <Text type="success">+2 pts</Text> : <Text type="secondary">Incorrecto</Text>}
          </Row>
          <Row justify="space-between">
            <Text>2 de 50 céntimos:</Text>
            {Number(recuerdo.monedasRecordadas.centimos50) === 2 ? <Text type="success">+2 pts</Text> : <Text type="secondary">Incorrecto</Text>}
          </Row>
          <Row justify="space-between">
            <Text>1 de 1 sol:</Text>
            {Number(recuerdo.monedasRecordadas.sol1) === 1 ? <Text type="success">+2 pts</Text> : <Text type="secondary">Incorrecto</Text>}
          </Row>
          <Row justify="space-between">
            <Text>3 de 2 soles:</Text>
            {Number(recuerdo.monedasRecordadas.soles2) === 3 ? <Text type="success">+2 pts</Text> : <Text type="secondary">Incorrecto</Text>}
          </Row>

          <Divider style={{margin: '10px 0'}} />
          <Row justify="end">
             <Text type="secondary"> (Menos Intrusiones: -{intrusiones.recuerdo})</Text>
          </Row>
        </Space>
      </Card>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={resetEvaluation}>Volver al inicio</Button>
        <Button type="primary" onClick={handleSaveData}>Guardar resultados</Button>
      </div>
    </Card>
  );
}