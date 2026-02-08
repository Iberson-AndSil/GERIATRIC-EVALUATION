'use client';
import React from 'react';
import { Button, Typography } from 'antd';
import { 
  BulbOutlined, 
  CheckCircleFilled, 
  CheckCircleOutlined,
  ExperimentOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

interface AbstractionPairProps {
  pair: string;
  expectedAnswer: string;
  checked: boolean;
  onChange: (e: any) => void;
}
const AbstractionPair: React.FC<AbstractionPairProps> = ({ pair, expectedAnswer, checked, onChange }) => (
  <div className={`
    flex flex-col justify-between p-3 rounded-lg border transition-all duration-200 h-full
    ${checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}
  `}>
    <div className="mb-3">
        <Text strong className="text-base text-gray-800 block mb-1">
            {pair}
        </Text>
        <div className="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded inline-block uppercase font-bold tracking-wider">
            {expectedAnswer}
        </div>
    </div>

    <Button
        block
        size="small"
        type={checked ? 'primary' : 'default'}
        icon={checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
        onClick={(e) => onChange({ target: { checked: !checked } })}
        className={checked ? 'bg-green-600 border-green-600' : 'text-gray-400'}
    >
        {checked ? 'Correcto' : 'Marcar'}
    </Button>
  </div>
);

const AbstractionSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <BulbOutlined className="text-amber-500 text-lg" />
          <div>
            <Title level={5} className="!m-0 text-gray-700">Abstracción</Title>
            <Text type="secondary" className="text-xs">
              Pregunte: "¿Qué parecido hay entre...?"
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AbstractionPair
                pair="Tren - Bicicleta"
                expectedAnswer="Medios de Transporte"
                checked={scores.abstraction[0]}
                onChange={onCheckboxChange('abstraction', 0)}
            />

            <AbstractionPair
                pair="Reloj - Regla"
                expectedAnswer="Instrumentos de Medida"
                checked={scores.abstraction[1]}
                onChange={onCheckboxChange('abstraction', 1)}
            />
        </div>

        <div className="mt-4 bg-amber-50 p-2 rounded border border-amber-100 text-xs text-amber-800 flex items-start gap-2">
            <ExperimentOutlined />
            <span>
               <strong>Nota:</strong> Solo se aceptan respuestas abstractas (categorías). Ejemplos concretos (tienen ruedas, tienen números) no puntúan.
            </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        
        <Button 
          onClick={() => onSectionChange('language')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onSectionChange('delayedRecall')}
          type="primary"
          size="large"
          className="bg-blue-600 shadow-sm hover:scale-105 transition-transform"
        >
          Siguiente
        </Button>
      </div>

    </div>
  );
};

export default AbstractionSection;