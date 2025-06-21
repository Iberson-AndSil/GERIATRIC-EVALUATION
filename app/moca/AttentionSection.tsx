'use client';
import React from 'react';
import { Card, Typography, Checkbox, Button, Divider } from 'antd';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

const AttentionSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="4. Atención (6 puntos)" style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>Repita los números:</Title>
        <div style={{ fontSize: '18px', margin: '10px 0' }}>2, 1, 8, 5, 4</div>
        <Checkbox 
          onChange={onCheckboxChange('attention1', 0)}
          checked={scores.attention1[0]}
        >
          Hecho (1 punto)
        </Checkbox>
        
        <Divider />
        
        <Title level={4}>Repita los números en orden inverso:</Title>
        <div style={{ fontSize: '18px', margin: '10px 0' }}>7, 4, 2</div>
        <Checkbox 
          onChange={onCheckboxChange('attention1', 1)}
          checked={scores.attention1[1]}
        >
          Hecho (1 punto)
        </Checkbox>
      </div>
      
      <Divider />
      
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>Golpecitos con la letra A (1 punto)</Title>
        <Text>
          Lea la serie de letras. El paciente debe dar un golpecito con la mano cada vez que se diga la letra A.
          No se asigna punto si hay más o igual a dos errores.
        </Text>
        <div style={{ 
          fontSize: '18px', 
          margin: '10px 0',
          letterSpacing: '3px',
          wordBreak: 'break-all'
        }}>
          F B A C M N A A I K L B A F A K D E A A A J A M O F A A B
        </div>
        <Checkbox 
          onChange={onCheckboxChange('attention2', 0)}
          checked={scores.attention2[0]}
        >
          Hecho (1 punto)
        </Checkbox>
      </div>
      
      <Divider />
      
      <div>
        <Title level={4}>Resta sucesiva de 7 en 7 (3 puntos máx.)</Title>
        <Text>Comience con 100 y reste 7 cada vez:</Text>
        <div style={{ margin: '10px 0' }}>
          <Checkbox 
            onChange={onCheckboxChange('attention3', 0)}
            checked={scores.attention3[0]}
          >
            93
          </Checkbox>
          <Checkbox 
            onChange={onCheckboxChange('attention3', 1)}
            checked={scores.attention3[1]}
          >
            86
          </Checkbox>
          <Checkbox 
            onChange={onCheckboxChange('attention3', 2)}
            checked={scores.attention3[2]}
          >
            79
          </Checkbox>
          <Checkbox 
            onChange={onCheckboxChange('attention3', 3)}
            checked={scores.attention3[3]}
          >
            72
          </Checkbox>
          <Checkbox 
            onChange={onCheckboxChange('attention3', 4)}
            checked={scores.attention3[4]}
          >
            65
          </Checkbox>
        </div>
        <Text type="secondary">
          Puntuación: 4-5 correctas = 3 puntos | 2-3 correctas = 2 puntos | 1 correcta = 1 punto | 0 correctas = 0 puntos
        </Text>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('language')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default AttentionSection;