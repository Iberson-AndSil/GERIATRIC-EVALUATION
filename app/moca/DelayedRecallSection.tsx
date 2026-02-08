'use client';
import React from 'react';
import { Button, Typography, Tag } from 'antd';
import { 
  HistoryOutlined, 
  CheckCircleFilled, 
  CheckCircleOutlined,
  BulbOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;
const WORDS = [
  { id: 0, label: 'ROSTRO' },
  { id: 1, label: 'SEDA' },
  { id: 2, label: 'IGLESIA' },
  { id: 3, label: 'CLAVEL' },
  { id: 4, label: 'ROJO' },
];
const WordChip = ({ label, checked, onChange }: any) => (
  <div 
    onClick={(e) => onChange({ target: { checked: !checked } })}
    className={`
      cursor-pointer group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 select-none
      ${checked 
        ? 'bg-green-50 border-green-300 shadow-sm' 
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }
    `}
  >
    <Text strong className={`text-base ${checked ? 'text-green-800' : 'text-gray-600'}`}>
      {label}
    </Text>

    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center transition-colors
      ${checked ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-400'}
    `}>
        {checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
    </div>
  </div>
);

const DelayedRecallSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <HistoryOutlined className="text-purple-500 text-lg" />
          <div>
            <Title level={5} className="!m-0 text-gray-700">Recuerdo Diferido</Title>
            <Text type="secondary" className="text-xs">
              "Dígame las palabras que le pedí recordar antes" (Sin pistas)
            </Text>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WORDS.map((item) => (
                <WordChip
                    key={item.id}
                    label={item.label}
                    checked={scores.delayedRecall[item.id]}
                    onChange={onCheckboxChange('delayedRecall', item.id)}
                />
            ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded border border-gray-100">
            <BulbOutlined />
            <span>Si el paciente no recuerda, puede dar pistas de categoría (ej: "parte del cuerpo"), pero <strong>solo puntúan</strong> las recordadas sin ayuda.</span>
        </div>

      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <Button 
          onClick={() => onSectionChange('abstraction')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onSectionChange('orientation')}
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

export default DelayedRecallSection;