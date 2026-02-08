'use client';
import React from 'react';
import { Button, Typography, Divider } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  CheckCircleFilled, 
  CheckCircleOutlined,
  CompassOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

const OrientationBtn = ({ label, checked, onChange }: any) => (
  <Button
    block
    size="large"
    type={checked ? 'primary' : 'default'}
    icon={checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
    onClick={(e) => onChange({ target: { checked: !checked } })}
    className={`
      flex items-center justify-start text-left h-auto py-3 px-4 transition-all
      ${checked 
        ? 'bg-green-600 border-green-600 hover:!bg-green-500 shadow-sm' 
        : 'text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
      }
    `}
  >
    <span className="flex-1 truncate ml-2 font-medium">{label}</span>
  </Button>
);

const OrientationSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  
  const today = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
                <CompassOutlined className="text-blue-500 text-lg"/>
                <Title level={5} className="!m-0 text-gray-700">Orientación</Title>
            </div>
            <div className="text-xs text-blue-800 bg-white px-2 py-1 rounded border border-blue-200 shadow-sm">
                <strong>Hoy es:</strong> {today}
            </div>
        </div>
        <div className="mb-2">
            <Text type="secondary" className="text-xs font-bold uppercase tracking-wider mb-2 block pl-1">
                <CalendarOutlined className="mr-1"/> Tiempo
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OrientationBtn 
                    label="Día del mes" 
                    checked={scores.orientation[0]} 
                    onChange={onCheckboxChange('orientation', 0)} 
                />
                <OrientationBtn 
                    label="Mes" 
                    checked={scores.orientation[1]} 
                    onChange={onCheckboxChange('orientation', 1)} 
                />
                <OrientationBtn 
                    label="Año" 
                    checked={scores.orientation[2]} 
                    onChange={onCheckboxChange('orientation', 2)} 
                />
                <OrientationBtn 
                    label="Día de la semana" 
                    checked={scores.orientation[3]} 
                    onChange={onCheckboxChange('orientation', 3)} 
                />
            </div>
        </div>

        <Divider dashed className="my-4 border-gray-200" />

        <div>
            <Text type="secondary" className="text-xs font-bold uppercase tracking-wider mb-2 block pl-1">
                <EnvironmentOutlined className="mr-1"/> Espacio
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <OrientationBtn 
                    label="Lugar (Ej: Clínica)" 
                    checked={scores.orientation[4]} 
                    onChange={onCheckboxChange('orientation', 4)} 
                />
                <OrientationBtn 
                    label="Localidad (Ciudad)" 
                    checked={scores.orientation[5]} 
                    onChange={onCheckboxChange('orientation', 5)} 
                />
            </div>
        </div>

      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <Button 
          onClick={() => onSectionChange('delayedRecall')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onSectionChange('results')}
          type="primary"
          size="large"
          className="bg-purple-600 hover:bg-purple-500 shadow-md border-none hover:scale-105 transition-transform"
        >
          Ver Resultados Finales
        </Button>
      </div>
    </div>
  );
};

export default OrientationSection;