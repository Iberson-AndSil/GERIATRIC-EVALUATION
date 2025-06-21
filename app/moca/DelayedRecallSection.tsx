'use client';
import React from 'react';
import { Card, Typography, Checkbox, Button } from 'antd';
import { MOCATestProps } from '../type';

const { Text } = Typography;

const DelayedRecallSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="7. Recuerdo diferido (5 puntos)" style={{ marginBottom: '20px' }}>
      <Text>Recuerde las palabras que le dije anteriormente (sin ayuda):</Text>
      <div style={{ margin: '10px 0' }}>
        <Checkbox 
          onChange={onCheckboxChange('delayedRecall', 0)}
          checked={scores.delayedRecall[0]}
        >
          Rostro (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('delayedRecall', 1)}
          checked={scores.delayedRecall[1]}
        >
          Seda (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('delayedRecall', 2)}
          checked={scores.delayedRecall[2]}
        >
          Iglesia (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('delayedRecall', 3)}
          checked={scores.delayedRecall[3]}
        >
          Clavel (1 punto)
        </Checkbox>
        <Checkbox 
          onChange={onCheckboxChange('delayedRecall', 4)}
          checked={scores.delayedRecall[4]}
        >
          Rojo (1 punto)
        </Checkbox>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('orientation')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default DelayedRecallSection;