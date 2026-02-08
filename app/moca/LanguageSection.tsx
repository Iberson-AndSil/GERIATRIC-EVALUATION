'use client';
import React from 'react';
import { Button, Typography, Divider } from 'antd';
import { 
  MessageOutlined, 
  FieldTimeOutlined, 
  CheckCircleFilled, 
  CheckCircleOutlined,
  FontSizeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

const SentenceBlock = ({ text, checked, onChange }: any) => (
  <div className="flex items-center justify-between gap-3 p-3 mb-2 bg-slate-50 border-l-4 border-blue-400 rounded-r-md transition-colors hover:bg-slate-100">
    <Text className="text-gray-700 italic text-sm leading-snug flex-1">
      "{text}"
    </Text>
    <Button
      size="small"
      type={checked ? 'primary' : 'default'}
      icon={checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
      onClick={(e) => onChange({ target: { checked: !checked } })}
      className={checked ? 'bg-green-600 border-green-600 min-w-[90px]' : 'text-gray-400 min-w-[90px]'}
    >
      {checked ? 'Correcto' : 'Exacto'}
    </Button>
  </div>
);

const LanguageSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
                <MessageOutlined className="text-blue-500"/>
                <Text strong className="text-gray-700 text-sm uppercase">Repetición de Frases</Text>
            </div>
            
            <SentenceBlock 
                text="El gato se esconde bajo el sofá cuando los perros entran a la sala"
                checked={scores.language1[0]}
                onChange={onCheckboxChange('language1', 0)}
            />
            
            <SentenceBlock 
                text="Espero que él le entregue el mensaje una vez que ella se lo pida"
                checked={scores.language1[1]}
                onChange={onCheckboxChange('language1', 1)}
            />
        </div>
        
        <Divider dashed className="my-4 border-gray-200" />
        
        <div>
            <div className="flex items-center gap-2 mb-3">
                <FieldTimeOutlined className="text-orange-500"/>
                <Text strong className="text-gray-700 text-sm uppercase">Fluidez Verbal (1 Minuto)</Text>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center text-orange-600 font-bold text-xl shadow-sm">
                        P
                    </div>
                    <div className="flex flex-col">
                        <Text className="text-gray-800 font-medium text-sm">Palabras con "P"</Text>
                        <Text type="secondary" className="text-xs">Meta: &gt; 11 palabras</Text>
                    </div>
                </div>

                <Button
                    size="middle"
                    type={scores.language2[0] ? 'primary' : 'default'}
                    icon={scores.language2[0] ? <FontSizeOutlined /> : <CheckCircleOutlined />}
                    onClick={(e) => onCheckboxChange('language2', 0)({ target: { checked: !scores.language2[0] } })}
                    className={`
                        transition-all
                        ${scores.language2[0] 
                            ? 'bg-green-600 border-green-600 hover:!bg-green-500' 
                            : 'text-gray-500 border-gray-300'
                        }
                    `}
                >
                    {scores.language2[0] ? 'Objetivo Logrado' : 'Registrar Éxito'}
                </Button>
            </div>
            
            <div className="mt-2 text-right">
                <Text type="secondary" className="text-[10px] italic">
                   * No cuentan nombres propios ni conjugaciones del mismo verbo.
                </Text>
            </div>
        </div>

      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
        <Button 
          onClick={() => onSectionChange('attention')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onSectionChange('abstraction')}
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

export default LanguageSection;