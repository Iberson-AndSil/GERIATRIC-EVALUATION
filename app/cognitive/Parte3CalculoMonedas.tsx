'use client';
import { Card, Space, Typography, Select, Button } from 'antd';
import { CalculoItems, RespuestaItem } from '../utils/cognitive/types';

const { Text, Title } = Typography;
const { Option } = Select;

interface Parte3CalculoMonedasProps {
  calculos: Record<CalculoItems, RespuestaItem>;
  setCalculos: React.Dispatch<React.SetStateAction<Record<CalculoItems, RespuestaItem>>>;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Parte3CalculoMonedas({
  calculos,
  setCalculos,
  nextStep,
  prevStep
}: Parte3CalculoMonedasProps) {
  const handleSelectChange = (item: CalculoItems, value: string) => {
    setCalculos(prev => ({
      ...prev,
      [item]: {
        estado: value as 'correcto' | 'correcto_segundo' | 'incorrecto',
        intentos: value === 'incorrecto' ? 2 : 1
      }
    }));
  };

  return (
    <>
      <Card title="2. Cálculo con monedas" style={{ marginBottom: '20px' }}>
        <Text>Material: 3 monedas de 2 soles, 1 de 1 sol, 2 de 50 céntimos, 5 de 20 céntimos</Text>
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: '16px' }}>
          <div>
            <Text strong>Item 3: ¿Cuántas monedas hay aquí? (11)</Text>
            <Space>
              <Select
                style={{ width: 250 }}
                placeholder="Seleccione una opción"
                onChange={(value) => handleSelectChange('item3', value)}
                value={calculos.item3.estado}
              >
                <Option value="correcto">Correcto (primer intento)</Option>
                <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                <Option value="incorrecto">Incorrecto</Option>
              </Select>
            </Space>
          </div>

          <div>
            <Text strong>Item 4: “¿Puede cambiarme en sencillo esta moneda?” (1 moneda de 2 soles)</Text>
            <Text type="secondary">Respuesta esperada: 1 de 1 sol + 2 de 50 céntimos</Text>
            <Space>
              <Select
                style={{ width: 250 }}
                placeholder="Seleccione una opción"
                onChange={(value) => handleSelectChange('item4', value)}
                value={calculos.item4.estado}
              >
                <Option value="correcto">Correcto (primer intento)</Option>
                <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                <Option value="incorrecto">Incorrecto</Option>
              </Select>
            </Space>
          </div>

          <div>
            <Text strong>Item 5: “¿Cuánto dinero hay aquí en total?” (9 soles)</Text>
            <Space>
              <Select
                style={{ width: 250 }}
                placeholder="Seleccione una opción"
                onChange={(value) => handleSelectChange('item5', value)}
                value={calculos.item5.estado}
              >
                <Option value="correcto">Correcto (primer intento)</Option>
                <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                <Option value="incorrecto">Incorrecto</Option>
              </Select>
            </Space>
          </div>

          <div>
            <Text strong>Item 6: Reparta estas monedas en dos montones que tengan el mismo dinero (4,50 soles)</Text>
            <Space>
              <Select
                style={{ width: 250 }}
                placeholder="Seleccione una opción"
                onChange={(value) => handleSelectChange('item6', value)}
                value={calculos.item6.estado}
              >
                <Option value="correcto">Correcto (primer intento)</Option>
                <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                <Option value="incorrecto">Incorrecto</Option>
              </Select>
            </Space>
          </div>

          <div>
            <Text strong>Item 7: Reparta estas monedas en tres montones que tengan el mismo dinero (3 soles)</Text>
            <Space>
              <Select
                style={{ width: 250 }}
                placeholder="Seleccione una opción"
                onChange={(value) => handleSelectChange('item7', value)}
                value={calculos.item7.estado}
              >
                <Option value="correcto">Correcto (primer intento)</Option>
                <Option value="correcto_segundo">Correcto (segundo intento)</Option>
                <Option value="incorrecto">Incorrecto</Option>
              </Select>
            </Space>
          </div>
        </Space>
      </Card>
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
        <Button type="primary" onClick={nextStep}>Siguiente</Button>
      </div>
    </>
  );
}