import { Card, Input, Typography, Button, Space } from 'antd';
import { Recuerdo, Intrusiones } from '../utils/cognitive/types';

const { Text } = Typography;

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
    <Card title="4. Tercera parte (recuerdo)" style={{ marginBottom: '20px' }}>
      <Text>“Para finalizar, quiero que haga un último esfuerzo y trate de recordar”:</Text>

      <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '20px' }}>
        <div>
          <Text strong>“¿Cuántas monedas le enseñé antes?” (11)</Text>
          <Input
            type="number"
            style={{ width: '80px' }}
            value={recuerdo.cantidadMonedas}
            onChange={(e) => setRecuerdo(prev => ({ ...prev, cantidadMonedas: e.target.value }))}
          />
        </div>

        <div>
          <Text strong>“¿Cuánto dinero había en total?” (9 soles)</Text>
          <Input
            type="number"
            style={{ width: '80px' }}
            value={recuerdo.totalDinero}
            onChange={(e) => setRecuerdo(prev => ({ ...prev, totalDinero: e.target.value }))}
          />
        </div>

        <div>
          <Text strong>“¿Recuerda qué monedas había exactamente?”</Text>
          <table style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Cantidad</th>
                <th>Moneda</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Input
                    type="number"
                    style={{ width: '60px' }}
                    value={recuerdo.monedasRecordadas.centimos20}
                    onChange={(e) => handleMonedaRecordadaChange('centimos20', e.target.value)}
                  />
                </td>
                <td>de 20 céntimos</td>
              </tr>
              <tr>
                <td>
                  <Input
                    type="number"
                    style={{ width: '60px' }}
                    value={recuerdo.monedasRecordadas.centimos50}
                    onChange={(e) => handleMonedaRecordadaChange('centimos50', e.target.value)}
                  />
                </td>
                <td>de 50 céntimos</td>
              </tr>
              <tr>
                <td>
                  <Input
                    type="number"
                    style={{ width: '60px' }}
                    value={recuerdo.monedasRecordadas.sol1}
                    onChange={(e) => handleMonedaRecordadaChange('sol1', e.target.value)}
                  />
                </td>
                <td>de 1 sol</td>
              </tr>
              <tr>
                <td>
                  <Input
                    type="number"
                    style={{ width: '60px' }}
                    value={recuerdo.monedasRecordadas.soles2}
                    onChange={(e) => handleMonedaRecordadaChange('soles2', e.target.value)}
                  />
                </td>
                <td>de 2 soles</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ margin: '16px 0' }}>
          <Text strong>Intrusiones (respuestas incorrectas adicionales): </Text>
          <Input 
            type="number" 
            min={0}
            style={{ width: '80px' }}
            value={intrusiones.recuerdo}
            onChange={(e) => handleIntrusionChange('recuerdo', parseInt(e.target.value) || 0)}
          />
        </div>
      </Space>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
        <Button type="primary" onClick={nextStep}>Finalizar</Button>
      </div>
    </Card>
  );
}