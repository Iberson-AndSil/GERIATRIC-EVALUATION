'use client';
import React from 'react';
import { Card, Typography, Checkbox, Button, Space } from 'antd';
import { MOCATestProps } from '../type';

const { Text } = Typography;

const MemorySection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="3. Memoria" style={{ marginBottom: '20px' }}>
      <Text strong>Repita las siguientes palabras (no puntúa):</Text>
      <div style={{ fontSize: '18px', margin: '10px 0' }}>
        Rostro, Seda, Iglesia, Clavel, Rojo
      </div>
      
      <Space>
        <Checkbox 
          onChange={onCheckboxChange('memoryAttempt', 0)}
          checked={scores.memoryAttempt[0]}
        >
          Primer intento realizado
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('memoryAttempt', 1)}
          checked={scores.memoryAttempt[1]}
        >
          Segundo intento realizado
        </Checkbox>
      </Space>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('attention')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default MemorySection;