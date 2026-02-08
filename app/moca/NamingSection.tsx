'use client';
import React, { useState } from 'react';
import { Button, Image, Typography } from 'antd';
import { 
  ArrowLeftOutlined,
  CheckCircleFilled, 
  CheckCircleOutlined, 
  EyeOutlined,
  TagsOutlined 
} from '@ant-design/icons';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

interface NamingItemProps {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: (e: any) => void;
  imageSrc: string;
}

const NamingItem: React.FC<NamingItemProps> = ({ label, subLabel, checked, onChange, imageSrc }) => {
  const [previewVisible, setPreviewVisible] = useState(false);

  return (
    <div className={`
      flex items-center justify-between px-3 py-3 mb-3 rounded-lg border transition-all duration-200
      ${checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}
    `}>
      <div className="flex items-center gap-3">
        <Button
          type={checked ? 'primary' : 'default'}
          size="middle"
          icon={checked ? <CheckCircleFilled /> : <CheckCircleOutlined />}
          onClick={(e) => onChange({ target: { checked: !checked } })}
          className={checked ? 'bg-green-600 border-green-600' : 'text-gray-400'}
        >
          {checked ? 'Correcto' : 'Marcar'}
        </Button>
        
        <div className="flex flex-col">
          <Text strong className={`${checked ? 'text-green-800' : 'text-gray-700'}`}>
            {label}
          </Text>
          {subLabel && <Text type="secondary" className="text-xs">{subLabel}</Text>}
        </div>
      </div>

      <div>
        <Button 
          icon={<EyeOutlined />} 
          onClick={() => setPreviewVisible(true)}
          size="small"
          className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center gap-1"
        >
          <span className="hidden sm:inline">Ver Imagen</span>
        </Button>
        
        <div style={{ display: 'none' }}>
          <Image
            src={imageSrc}
            preview={{
              visible: previewVisible,
              onVisibleChange: (visible) => setPreviewVisible(visible),
              src: imageSrc,
            }}
          />
        </div>
      </div>
    </div>
  );
};


const NamingSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <div className="h-full flex flex-col">
      
      <div className="flex-1">
        
        <div className="flex items-center gap-2 mb-4">
          <TagsOutlined className="text-blue-500 text-lg"/> 
          <div>
            <Title level={5} className="!m-0 text-gray-700">Identificación</Title>
            <Text type="secondary" className="text-xs">El paciente debe nombrar los animales mostrados.</Text>
          </div>
        </div>

        <div className="flex flex-col">
          <NamingItem
            label="1. León"
            subLabel="Identificación correcta del animal"
            checked={scores.naming[0]}
            onChange={onCheckboxChange('naming', 0)}
            imageSrc="/moca/lion.jpg"
          />

          <NamingItem
            label="2. Rinoceronte"
            subLabel="Identificación correcta del animal"
            checked={scores.naming[1]}
            onChange={onCheckboxChange('naming', 1)}
            imageSrc="/moca/rino.jpg"
          />

          <NamingItem
            label="3. Camello / Dromedario"
            subLabel="Identificación correcta del animal"
            checked={scores.naming[2]}
            onChange={onCheckboxChange('naming', 2)}
            imageSrc="/moca/camello.jpg"
          />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <Button 
          onClick={() => onSectionChange('visuospatial')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
        <Button 
          onClick={() => onSectionChange('memory')}
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

export default NamingSection;