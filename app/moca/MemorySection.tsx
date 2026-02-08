'use client';
import React from 'react';
import { Button, Typography, Divider } from 'antd';
import { 
  ReadOutlined, 
  CheckCircleOutlined, 
  CheckCircleFilled,
  SoundOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;
const WORD_LIST = ['ROSTRO', 'SEDA', 'IGLESIA', 'CLAVEL', 'ROJO'];

const MemorySection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  
  const renderAttemptButton = (index: number, label: string) => {
    const isChecked = scores.memoryAttempt[index];
    return (
      <Button
        block
        size="large"
        type={isChecked ? 'primary' : 'default'}
        icon={isChecked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
        onClick={(e) => onCheckboxChange('memoryAttempt', index)({ target: { checked: !isChecked } })}
        className={`
          flex items-center justify-center h-12 font-medium transition-all duration-200
          ${isChecked 
            ? 'bg-green-600 border-green-600 hover:!bg-green-500 shadow-md' 
            : 'text-gray-500 border-gray-300 hover:text-blue-500 hover:border-blue-400'
          }
        `}
      >
        {isChecked ? `${label}: Completado` : `Marcar ${label}`}
      </Button>
    );
  };

  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1">
        
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
            <ReadOutlined style={{ fontSize: '20px' }} />
          </div>
          <div>
            <Title level={5} className="!m-0 text-gray-800">Aprendizaje de Memoria</Title>
            <Text type="secondary" className="text-sm">
              Lea la lista de palabras (1 por seg). El paciente debe repetirlas. Haga 2 intentos.
            </Text>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3 text-indigo-800 text-xs font-bold uppercase tracking-wide">
                <SoundOutlined /> Palabras a leer:
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {WORD_LIST.map((word, i) => (
                    <div 
                        key={i}
                        className="bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100 text-gray-700 font-bold text-base tracking-wide"
                    >
                        {word}
                    </div>
                ))}
            </div>
        </div>

        <Divider dashed className="my-6" />

        <div className="space-y-3">
           <Text type="secondary" className="text-xs uppercase font-bold ml-1">Registro de Intentos (No puntúa):</Text>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderAttemptButton(0, "1er Intento")}
              {renderAttemptButton(1, "2do Intento")}
           </div>
        </div>

      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
        <Button 
          onClick={() => onSectionChange('naming')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onSectionChange('attention')}
          type="primary"
          size="large"
          className="bg-blue-600 shadow-sm hover:scale-105 transition-transform"
        >
          Siguiente Sección
        </Button>
      </div>
    </div>
  );
};

export default MemorySection;