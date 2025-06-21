'use client';
import React from 'react';
import { Card, Typography, Checkbox, Button } from 'antd';
import { MOCATestProps } from '../type';

const { Text } = Typography;

const AbstractionSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="6. Abstracción (2 puntos)" style={{ marginBottom: '20px' }}>
      <Text>¿Qué parecido hay entre...?</Text>
      <div style={{ margin: '10px 0' }}>
        <div style={{ fontSize: '16px', margin: '5px 0' }}>Tren - Bicicleta</div>
        <Checkbox 
          onChange={onCheckboxChange('abstraction', 0)}
          checked={scores.abstraction[0]}
        >
          Respuesta correcta (1 punto)
        </Checkbox>
        
        <div style={{ fontSize: '16px', margin: '5px 0' }}>Reloj - Regla</div>
        <Checkbox 
          onChange={onCheckboxChange('abstraction', 1)}
          checked={scores.abstraction[1]}
        >
          Respuesta correcta (1 punto)
        </Checkbox>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('delayedRecall')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default AbstractionSection;