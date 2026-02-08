'use client';
import React, { useState } from 'react';
import { Divider, Button, Image, Typography } from 'antd';
import { 
  CheckCircleFilled, 
  CheckCircleOutlined, 
  EyeOutlined,
  FileImageOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { MOCATestProps } from '../type'; 

const { Title, Text } = Typography;

interface EvaluationItemProps {
  label: string;
  checked: boolean;
  onChange: (e: any) => void;
  imageSrc?: string; 
  compact?: boolean;
}

const EvaluationItem: React.FC<EvaluationItemProps> = ({ label, checked, onChange, imageSrc, compact }) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <div className={`
      flex items-center justify-between 
      ${compact ? 'p-2' : 'px-3 py-2'} 
      rounded-md border transition-all duration-200 h-full
      ${checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}
    `}>
      <div className="flex items-center gap-2 overflow-hidden">
        <Button
          type={checked ? 'primary' : 'default'}
          size="small"
          icon={checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
          onClick={(e) => onChange({ target: { checked: !checked } })}
          className={checked ? 'bg-green-600 border-green-600 text-xs' : 'text-gray-400 text-xs'}
        >
          {checked ? 'Listo' : 'Marcar'}
        </Button>
        
        <Text 
          className={`text-sm truncate ${checked ? 'text-green-700 font-medium' : 'text-gray-600'}`}
          title={label}
        >
          {label}
        </Text>
      </div>

      {imageSrc && (
        <>
          <Button 
            type="text"
            icon={<EyeOutlined />} 
            onClick={() => setPreviewVisible(true)}
            size="small"
            className="text-blue-500 hover:bg-blue-50 hover:text-blue-700 min-w-[32px]"
          />
          <div style={{ display: 'none' }}>
            <Image
              src={imageSrc}
              preview={{
                visible: previewVisible,
                onVisibleChange: (visible) => setPreviewVisible(visible),
                scaleStep: 0.5,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

const VisuospatialSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <div className="h-full flex flex-col"> 
      
      <div className="flex-1 overflow-y-auto pr-1">
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileImageOutlined className="text-blue-500"/> 
            <Text strong className="text-xs uppercase text-gray-500 tracking-wider">Ejercicios Visuales</Text>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <EvaluationItem
              label="Alternancia (Nodos)"
              checked={scores.visuospatial[0]}
              onChange={onCheckboxChange('visuospatial', 0)}
              imageSrc="/moca/nodos.jpg"
            />
            <EvaluationItem
              label="Copia del Cubo"
              checked={scores.visuospatial[1]}
              onChange={onCheckboxChange('visuospatial', 1)}
              imageSrc="/moca/cubo.jpg"
            />
          </div>
        </div>
          
        <Divider className="my-3 border-gray-100" />
          
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ClockCircleOutlined className="text-blue-500"/>
            <Text strong className="text-xs uppercase text-gray-500 tracking-wider">Prueba del Reloj (11:10)</Text>
          </div>
          
          <div className="space-y-2">
            <EvaluationItem
              compact
              label="1. Contorno (Círculo aceptable)"
              checked={scores.visuospatial[2]}
              onChange={onCheckboxChange('visuospatial', 2)}
            />
            <EvaluationItem
              compact
              label="2. Números colocados correctamente"
              checked={scores.visuospatial[3]}
              onChange={onCheckboxChange('visuospatial', 3)}
            />
            <EvaluationItem
              compact
              label="3. Agujas indican hora correcta"
              checked={scores.visuospatial[4]}
              onChange={onCheckboxChange('visuospatial', 4)}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 pt-3 border-t border-gray-100 flex justify-end">
        <Button 
          onClick={() => onSectionChange('naming')}
          type="primary"
          className="bg-blue-600 shadow-sm"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default VisuospatialSection;