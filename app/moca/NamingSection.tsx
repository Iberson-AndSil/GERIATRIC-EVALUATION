'use client';
import React from 'react';
import { Card, Row, Col, Checkbox, Button, Image } from 'antd';
import { MOCATestProps } from '../type';

const NamingSection: React.FC<MOCATestProps> = ({
  scores,
  onCheckboxChange,
  onSectionChange,
}) => {
  return (
    <Card title="2. Identificación (3 puntos)" style={{ marginBottom: '20px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px' }}>
            <Image src="/animal1.png" alt="Animal 1" style={{ maxWidth: '100%' }} />
            <Checkbox 
              onChange={onCheckboxChange('naming', 0)}
              checked={scores.naming[0]}
            >
              Hecho
            </Checkbox>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px' }}>
            <Image src="/animal2.png" alt="Animal 2" style={{ maxWidth: '100%' }}/>
            <Checkbox 
              onChange={onCheckboxChange('naming', 1)}
              checked={scores.naming[1]}
            >
              Hecho
            </Checkbox>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ border: '1px solid #d9d9d9', padding: '10px' }}>
            <Image src="/animal3.png" alt="Animal 3" style={{ maxWidth: '100%' }} />
            <Checkbox 
              onChange={onCheckboxChange('naming', 2)}
              checked={scores.naming[2]}
            >
              Hecho
            </Checkbox>
          </div>
        </Col>
      </Row>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button 
          onClick={() => onSectionChange('memory')}
          type="primary"
        >
          Siguiente
        </Button>
      </div>
    </Card>
  );
};

export default NamingSection;