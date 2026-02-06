'use client';
import { useState, useEffect } from 'react';
import { Input, Typography, Button, Tag, Statistic, Row, Col } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, ThunderboltFilled, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Props {
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
}: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Estado para controlar el texto del input

  // Lógica del Cronómetro
  useEffect(() => {
    if (!isRunning) return;
    
    if (tiempoFluencia <= 0) {
      setIsRunning(false);
      return;
    }
    
    const interval = setInterval(() => setTiempoFluencia(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [tiempoFluencia, isRunning, setTiempoFluencia]);

  // Manejador del botón "Iniciar"
  const handleStartTimer = () => {
    if (tiempoFluencia > 0) {
      setIsRunning(true);
    }
  };

  // Manejador del Input (Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita comportamientos por defecto
      
      const value = inputValue.trim();
      
      if (value) {
        setAnimales(prev => [...prev, value]);
        setInputValue(''); // Limpia el input automáticamente
      }
    }
  };

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
                ${tiempoFluencia > 10 ? 'border-blue-100 bg-blue-50' : 'border-red-100 bg-red-50 animate-pulse'}
            `}>
                <Statistic 
                    title={<span className="font-bold uppercase text-xs tracking-wider">Tiempo Restante</span>}
                    value={tiempoFluencia} 
                    suffix="seg" 
                    valueStyle={{ fontSize: '3rem', fontWeight: 'bold', color: tiempoFluencia > 10 ? '#1890ff' : '#cf1322' }}
                    prefix={<ClockCircleOutlined />}
                />
                
                {/* Botón de Iniciar superpuesto o debajo */}
                {!isRunning && tiempoFluencia > 0 && tiempoFluencia === 60 && (
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
            <div>
                <Text strong className="mb-2 block">Ingresar Animal (Presionar Enter):</Text>
                <div className="flex gap-2">
                    <Input
                        size="large"
                        placeholder={isRunning ? "Escriba aquí..." : "Presione 'Comenzar Tiempo' primero"}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={!isRunning} // Se bloquea si no está corriendo el tiempo
                        prefix={<ThunderboltFilled className={isRunning ? "text-yellow-500" : "text-gray-300"} />}
                        className="rounded-lg py-3"
                        autoFocus={isRunning}
                    />
                </div>
                {!isRunning && tiempoFluencia === 60 && (
                     <Text type="secondary" className="text-xs mt-2 block text-center">
                        El campo se habilitará cuando inicie el cronómetro.
                     </Text>
                )}
                 {!isRunning && tiempoFluencia === 0 && (
                     <Text type="danger" className="text-xs mt-2 block text-center">
                        Tiempo finalizado.
                     </Text>
                )}
            </div>
        </div>

        {/* Panel Derecho: Lista de Resultados */}
        <div className="w-full md:w-1/2 h-[300px] border border-gray-200 rounded-xl bg-gray-50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                <Text strong>Registrados</Text>
                <Tag color="blue">{animales.length}</Tag>
            </div>
            <div className="flex-1 overflow-y-auto content-start flex flex-wrap gap-2">
                {animales.map((animal, index) => (
                    <Tag key={index} className="m-0 text-sm py-1 px-3 rounded-full bg-white border border-gray-300">
                        {index + 1}. {animal}
                    </Tag>
                ))}
                {animales.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm italic">
                        Sin registros aún...
                    </div>
                )}
            </div>
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