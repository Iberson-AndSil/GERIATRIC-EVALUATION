'use client';
import React from 'react';
import { Card, Typography, Checkbox, Button, Divider } from 'antd';
import { MOCATestProps } from '../type';

const { Title, Text } = Typography;

const LanguageSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="5. Lenguaje (3 puntos)" style={{ marginBottom: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>Repita las siguientes oraciones:</Title>
        <div style={{ fontSize: '16px', margin: '10px 0' }}>
          1. El gato se esconde bajo el sofá cuando los perros entran a la sala
        </div>
        <Checkbox 
          onChange={onCheckboxChange('language1', 0)}
          checked={scores.language1[0]}
        >
          Hecho (1 punto)
        </Checkbox>
        
        <div style={{ fontSize: '16px', margin: '10px 0' }}>
          2. Espero que él le entregue el mensaje una vez que ella se lo pida
        </div>
        <Checkbox 
          onChange={onCheckboxChange('language1', 1)}
          checked={scores.language1[1]}
        >
          Hecho (1 punto)
        </Checkbox>
      </div>
      
      <Divider />
      
      <div>
        <Title level={4}>Fluidez verbal (1 punto)</Title>
        <Text>
          Mencione el mayor número posible de palabras que comiencen con la letra P en un minuto.
          Más de 11 palabras correctas = 1 punto.
        </Text>
        <Checkbox 
          onChange={onCheckboxChange('language2', 0)}
          checked={scores.language2[0]}
        >
          Logró decir más de 11 palabras (1 punto)
        </Checkbox>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('abstraction')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default LanguageSection;