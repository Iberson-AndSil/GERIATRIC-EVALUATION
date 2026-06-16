'use client';
import { useState, useEffect } from 'react';
import { InputNumber, Typography, Button, Tag, Statistic } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Props {
  animalCount: number | null;
  setAnimalCount: React.Dispatch<React.SetStateAction<number | null>>;
  fluencyTime: number;
  setFluencyTime: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Part4VerbalFluency({
  animalCount,
  setAnimalCount,
  fluencyTime,
  setFluencyTime,
  nextStep,
  prevStep
}: Props) {
  const [isRunning, setIsRunning] = useState(false);

  // Lógica del Cronómetro
  useEffect(() => {
    if (!isRunning) return;
    
    if (fluencyTime <= 0) {
      setIsRunning(false);
      return;
    }
    
    const interval = setInterval(() => setFluencyTime(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [fluencyTime, isRunning, setFluencyTime]);

  // Manejador del botón "Iniciar"
  const handleStartTimer = () => {
    if (fluencyTime > 0) {
      setIsRunning(true);
    }
  };

  const getClassification = (count: number | null) => {
    if (count === null) return null;
    if (count >= 15) return { text: "Función cognitiva normal", color: "green" };
    if (count >= 11) return { text: "Probable deterioro cognitivo", color: "orange" };
    return { text: "Alta probabilidad de deterioro cognitivo", color: "red" };
  };

  const classification = getClassification(animalCount);

  return (
    <div className="animate-fadeIn">
       <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mb-6">
        <Title level={5} className="!mb-1 !text-purple-800">4. Tarea de Distracción</Title>
        <Text>“Dígame todos los nombres de animales que se le ocurran en 1 minuto.”</Text>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Panel Izquierdo: Controles e Input */}
        <div className="w-full md:w-1/2 space-y-6">
            
            {/* Tarjeta del Cronómetro */}
            <div className={`
                text-center p-6 rounded-2xl border-2 transition-colors duration-300 relative overflow-hidden
                ${fluencyTime > 10 ? 'border-blue-100 bg-blue-50' : 'border-red-100 bg-red-50 animate-pulse'}
            `}>
                <Statistic 
                    title={<span className="font-bold uppercase text-xs tracking-wider">Tiempo Restante</span>}
                    value={fluencyTime} 
                    suffix="seg" 
                    valueStyle={{ fontSize: '3rem', fontWeight: 'bold', color: fluencyTime > 10 ? '#1890ff' : '#cf1322' }}
                    prefix={<ClockCircleOutlined />}
                />
                
                {/* Botón de Iniciar superpuesto o debajo */}
                {!isRunning && fluencyTime > 0 && fluencyTime === 60 && (
                    <div className="mt-4">
                        <Button 
                            type="primary" 
                            shape="round" 
                            icon={<PlayCircleOutlined />} 
                            size="large"
                            onClick={handleStartTimer}
                            className="bg-green-600 hover:bg-green-500 border-none shadow-lg animate-bounce"
                        >
                            Comenzar Tiempo
                        </Button>
                    </div>
                )}
            </div>

            {/* Input de Animales */}
            <div className="mt-6">
                <Text strong className="mb-2 block">Cantidad total de animales mencionados:</Text>
                <div className="flex items-center gap-4">
                    <InputNumber
                        size="large"
                        min={0}
                        placeholder="Ej. 12"
                        value={animalCount}
                        onChange={(val) => setAnimalCount(val)}
                        className="rounded-lg w-full max-w-[200px]"
                    />
                </div>
                {!isRunning && fluencyTime === 0 && (
                     <Text type="danger" className="text-xs mt-2 block text-center">
                        Tiempo finalizado. Por favor, ingrese la cantidad.
                     </Text>
                )}
            </div>
        </div>

        {/* Panel Derecho: Clasificación */}
        <div className="w-full md:w-1/2 border border-gray-200 rounded-xl bg-gray-50 p-6 flex flex-col items-center justify-center min-h-[300px]">
            <Text strong className="text-gray-500 mb-2 uppercase text-xs tracking-wider">Clasificación Cognitiva (Fluencia)</Text>
            {classification ? (
                <div className="text-center animate-fadeIn">
                    <div className="text-5xl font-bold mb-4" style={{ color: classification.color }}>
                        {animalCount}
                    </div>
                    <Tag color={classification.color} className="text-base px-4 py-1">
                        {classification.text}
                    </Tag>
                </div>
            ) : (
                <div className="text-gray-400 text-sm italic text-center">
                    Ingrese la cantidad de animales para ver la clasificación.
                </div>
            )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <Button icon={<ArrowLeftOutlined />} onClick={prevStep} size="large">Anterior</Button>
        <Button 
            type="primary" 
            size="large" 
            onClick={nextStep} 
        >
            Siguiente
        </Button>
      </div>
    </div>
  );
}
