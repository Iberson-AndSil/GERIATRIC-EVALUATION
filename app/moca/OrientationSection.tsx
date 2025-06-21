'use client';
import React from 'react';
import { Card, Checkbox, Button } from 'antd';
import { MOCATestProps } from '../type';

const OrientationSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="8. Orientación (6 puntos)" style={{ marginBottom: '20px' }}>
      <div style={{ margin: '10px 0' }}>
        <Checkbox 
          onChange={onCheckboxChange('orientation', 0)}
          checked={scores.orientation[0]}
        >
          Día del mes correcto (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('orientation', 1)}
          checked={scores.orientation[1]}
        >
          Mes correcto (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('orientation', 2)}
          checked={scores.orientation[2]}
        >
          Año correcto (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('orientation', 3)}
          checked={scores.orientation[3]}
        >
          Día de la semana correcto (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('orientation', 4)}
          checked={scores.orientation[4]}
        >
          Lugar correcto (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('orientation', 5)}
          checked={scores.orientation[5]}
        >
          Localidad correcta (1 punto)
        </Checkbox>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('results')}
          type="primary"
        >
          Ver Resultados
        </Button>
      </div>
    </Card>
  );
};

export default OrientationSection;