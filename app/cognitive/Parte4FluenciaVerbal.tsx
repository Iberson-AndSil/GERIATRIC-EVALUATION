'use client';
import { useState, useEffect } from 'react';
import { Card, Input, Typography, Button, Tag } from 'antd';

const { Text } = Typography;

interface Parte4FluenciaVerbalProps {
  animales: string[];
  setAnimales: React.Dispatch<React.SetStateAction<string[]>>;
  tiempoFluencia: number;
  setTiempoFluencia: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Parte4FluenciaVerbal({
  animales,
  setAnimales,
  tiempoFluencia,
  setTiempoFluencia,
  nextStep,
  prevStep
}: Parte4FluenciaVerbalProps) {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (tiempoFluencia <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTiempoFluencia(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
}, [tiempoFluencia, isRunning, setTiempoFluencia]);

  const handleAnimalChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = (e.target as HTMLInputElement).value.trim();
      if (value) {
        setAnimales(prev => [...prev, value]);
        (e.target as HTMLInputElement).value = '';

        if (!isRunning && tiempoFluencia === 60) {
          setIsRunning(true);
        }
      }
    }
  };

  return (
    <Card title="3. Tarea de distracción: fluencia verbal semántica" style={{ marginBottom: '20px' }}>
      <Text>“Quiero que me diga todos los nombres de animales que se le ocurran, ya sean de la tierra, del mar o del aire, del campo o de la casa, ¡¡todos los que se le ocurran!!”</Text>

      <div style={{ margin: '20px 0' }}>
        <Input
          placeholder="Escriba un animal y presione Enter"
          onKeyDown={handleAnimalChange}
          allowClear
          disabled={tiempoFluencia <= 0}
        />

        <div style={{ marginTop: '10px', height: '200px', overflowY: 'auto', border: '1px solid #d9d9d9', padding: '10px' }}>
          {animales.map((animal, index) => (
            <Tag key={index} style={{ marginBottom: '5px' }}>{animal}</Tag>
          ))}
        </div>

        <Text strong style={{ display: 'block', marginTop: '10px' }}>Tiempo restante: {tiempoFluencia} segundos</Text>
        <Text strong>Total animales: {animales.length}</Text>
      </div>

      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button style={{ marginRight: '10px' }} onClick={prevStep}>Anterior</Button>
        <Button
          type="primary"
          onClick={nextStep}
          disabled={tiempoFluencia > 0}
          loading={tiempoFluencia > 0}
        >
          {tiempoFluencia > 0 ? `Espere... (${tiempoFluencia}s)` : 'Siguiente'}
        </Button>
      </div>
    </Card>
  );
}