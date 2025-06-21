import React from 'react';
import { Card, Radio, Typography, Space, Button } from 'antd';
import { MOCATestProps } from '../type';

const { Text } = Typography;

const InfoSection: React.FC<MOCATestProps> = ({
  educationLevel,
  onEducationChange,
  onSectionChange,
}) => {
  return (
    <Card title="Información del Paciente" style={{ marginBottom: '20px' }}>
      <Text strong>Nivel de estudios:</Text>
      <Radio.Group 
        onChange={(e) => onEducationChange(e.target.value)} 
        value={educationLevel}
        style={{ marginLeft: '20px' }}
      >
        <Space direction="vertical">
          <Radio value="technical">Técnico</Radio>
          <Radio value="technical_superior">Técnico superior</Radio>
          <Radio value="university_incomplete">Universitario incompleto</Radio>
          <Radio value="university_complete">Universitario completo</Radio>
          <Radio value="master">Maestría</Radio>
          <Radio value="phd">Doctorado</Radio>
          <Radio value="none">Ninguno de estos</Radio>
        </Space>
      </Radio.Group>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('visuospatial')}
          type="primary"
        >
          Comenzar Evaluación
        </Button>
      </div>
    </Card>
  );
};

export default InfoSection;