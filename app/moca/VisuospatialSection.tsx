'use client';
import React from 'react';
import { Card, Row, Col, Divider, Typography, Checkbox, Button, Image } from 'antd';
import { MOCATestProps } from '../type';

const { Title } = Typography;

const VisuospatialSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="1. Visuoespacial/Ejecutiva (5 puntos)" style={{ marginBottom: '20px' }}>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px', marginBottom: '10px' }}>
            <Image src="/moca/nodos.jpg" alt="nodes" style={{ maxWidth: '100%' }} />
            <Checkbox 
              onChange={onCheckboxChange('visuospatial', 0)}
              checked={scores.visuospatial[0]}
            >
              Hecho
            </Checkbox>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px', marginBottom: '10px' }}>
            <Image src="/moca/cubo.jpg" alt="Clock" style={{ maxWidth: '100%' }} />
            <Checkbox 
              onChange={onCheckboxChange('visuospatial', 1)}
              checked={scores.visuospatial[1]}
            >
              Hecho
            </Checkbox>
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      <Title level={4}>Dibujar un reloj (Once y Diez)</Title>
      <Checkbox 
        onChange={onCheckboxChange('visuospatial', 2)}
        checked={scores.visuospatial[2]}
      >
        Contorno correcto
      </Checkbox>
      <Checkbox 
        onChange={onCheckboxChange('visuospatial', 3)}
        checked={scores.visuospatial[3]}
      >
        Números correctamente colocados
      </Checkbox>
      <Checkbox 
        onChange={onCheckboxChange('visuospatial', 4)}
        checked={scores.visuospatial[4]}
      >
        Agujas correctamente colocadas (hora 11:10)
      </Checkbox>
      
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('naming')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default VisuospatialSection;