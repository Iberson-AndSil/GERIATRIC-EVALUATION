import React from 'react';
import { Card, Typography, Divider, Space, Progress } from 'antd';
import { MOCATestProps, SectionKey } from '../type';

const { Title, Text } = Typography;

interface ResultsSectionProps extends MOCATestProps {
  totalScore: number;
  isNormal: boolean;
  calculateSectionProgress: (section: SectionKey, scores: any) => number;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  scores,
  educationLevel,
  totalScore,
  isNormal,
  calculateSectionProgress,
}) => {
  return (
    <Card title="Resultado">
      <Title level={3}>
        Puntuación total: {totalScore}/30
        {totalScore > 0 && (
          <span style={{ 
            color: isNormal ? '#389e0d' : '#cf1322',
            marginLeft: '20px',
            fontSize: '24px'
          }}>
            {isNormal ? 'Normal (≥26 puntos)' : 'Anormal (<26 puntos)'}
          </span>
        )}
      </Title>
      {educationLevel === 'none' && (
        <Text type="secondary">
          * Se ha añadido 1 punto adicional por nivel de estudios: Ninguno de estos
        </Text>
      )}
      
      <Divider />
      
      <Title level={4}>Desglose por sección:</Title>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text>Visuoespacial/Ejecutiva</Text>
          <Progress percent={calculateSectionProgress('visuospatial', scores)} status="active" />
        </div>
        <div>
          <Text>Identificación</Text>
          <Progress percent={calculateSectionProgress('naming', scores)} status="active" />
        </div>
        <div>
          <Text>Atención</Text>
          <Progress percent={calculateSectionProgress('attention', scores)} status="active" />
        </div>
        <div>
          <Text>Lenguaje</Text>
          <Progress percent={calculateSectionProgress('language', scores)} status="active" />
        </div>
        <div>
          <Text>Abstracción</Text>
          <Progress percent={calculateSectionProgress('abstraction', scores)} status="active" />
        </div>
        <div>
          <Text>Recuerdo diferido</Text>
          <Progress percent={calculateSectionProgress('delayedRecall', scores)} status="active" />
        </div>
        <div>
          <Text>Orientación</Text>
          <Progress percent={calculateSectionProgress('orientation', scores)} status="active" />
        </div>
      </Space>
    </Card>
  );
};

export default ResultsSection;