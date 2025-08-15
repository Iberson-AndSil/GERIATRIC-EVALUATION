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
  calcularPuntajeParte3,
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
  const puntajeParte1 = calcularPuntajeParte1(monedasCorrectas, billetesCorrectos, intrusiones);
  const puntajeParte2 = calcularPuntajeParte2(calculos);
  const puntajeParte3 = calcularPuntajeParte3(recuerdo, intrusiones);
  const puntajeTotal = puntajeParte1 + puntajeParte2 + puntajeParte3;
  const interpretacion = interpretarResultado(puntajeTotal);
  const { currentPatient, currentResultId } = useGlobalContext();
   const [api, contextHolder] = notification.useNotification();

  const totalMonedasCorrectas = Math.max(0,
    Object.values(monedasCorrectas)
      .filter(val => val === true).length - intrusiones.monedas);

  const totalBilletesCorrectos = Math.max(0,
    Object.values(billetesCorrectos)
      .filter(val => val === true).length - intrusiones.billetes);

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
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      router.push('/mmse30');

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error detallado:", err);
        alert(`Error al guardar: ${err.message}`);
      } else {
        console.error("Error desconocido:", err);
        alert("Error al guardar: Verifique la consola para más detalles");
      }
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
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={24}>
          <Card>
            <Statistic
              title="Puntuación Total"
              value={puntajeTotal}
              suffix={`/31`}
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
            <p><em>Punto de corte: ≤24 puntos (Sensibilidad: 90.5%, Especificidad: 83.3%)</em></p>
          </>
        }
        style={{ marginBottom: '20px' }}
      />

      <Title level={4}>Detalle por Ítems</Title>
      <Card>
        <Title level={5}>Parte I: Denominación</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Monedas correctas: </Text>
            <Text>{totalMonedasCorrectas}/6</Text>
            <Text type="secondary"> (Intrusiones: {intrusiones.monedas})</Text>
          </div>
          <div>
            <Text strong>Billetes correctos: </Text>
            <Text>{totalBilletesCorrectos}/5</Text>
            <Text type="secondary"> (Intrusiones: {intrusiones.billetes})</Text>
          </div>
        </Space>

        <Divider />

        <Title level={5}>Parte II: Cálculo con monedas</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          {Object.entries(calculos).map(([key, value]) => (
            <div key={key}>
              <Text strong>Ítem {key.replace('item', '')}: </Text>
              {value.estado === 'correcto' && <Text type="success">Correcto (primer intento) - 2 pts</Text>}
              {value.estado === 'correcto_segundo' && <Text type="warning">Correcto (segundo intento) - 1 pt</Text>}
              {value.estado === 'incorrecto' && <Text type="danger">Incorrecto - 0 pts</Text>}
              {!value.estado && <Text type="secondary">No evaluado</Text>}
            </div>
          ))}
        </Space>

        <Divider />

        <Title level={5}>Parte III: Recuerdo</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Cantidad de monedas (11): </Text>
            {recuerdo.cantidadMonedas === '11' ?
              <Text type="success">Correcto - 1 pt</Text> :
              <Text type="danger">Incorrecto - 0 pts</Text>}
          </div>
          <div>
            <Text strong>Total de dinero (9 soles): </Text>
            {recuerdo.totalDinero === '9' ?
              <Text type="success">Correcto - 1 pt</Text> :
              <Text type="danger">Incorrecto - 0 pts</Text>}
          </div>
          <div>
            <Text strong>Monedas recordadas: </Text>
            <Text>{puntajeParte3 - (recuerdo.cantidadMonedas === '11' ? 1 : 0) - (recuerdo.totalDinero === '9' ? 1 : 0)}/8</Text>
            <Text type="secondary"> (Intrusiones: {intrusiones.recuerdo})</Text>
          </div>
        </Space>

        <Divider />

        <Title level={5}>Fluencia verbal</Title>
        <Text>Total animales mencionados: {animales.length} (no puntúa)</Text>
      </Card>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={resetEvaluation}>Volver al inicio</Button>
        <Button type="primary" onClick={handleSaveData}>Guardar resultados</Button>
      </div>
    </Card>
  );
}