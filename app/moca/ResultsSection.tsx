import React, { useState } from 'react';
import { Card, Typography, Divider, Space, Progress, Row, Col, Button, notification } from 'antd';
import { MOCATestProps, SectionKey } from '../type';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { actualizarResultado } from '../lib/pacienteService';

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

  const { currentPatient, currentResultId } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const handleSaveData = async () => {
    try {

      setLoading(true);

      await actualizarResultado(
        currentPatient!.dni,
        currentResultId || "",
        'moca',
        totalScore
      );

      api.success({
        message: 'Éxito',
        description: 'Resultados de ABVD y AIVD guardados correctamente',
        placement: 'topRight'
      });

      router.push('/affective');

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error detallado:", err);
        alert(`Error al guardar: ${err.message}`);
      } else {
        console.error("Error desconocido:", err);
        alert("Error al guardar: Verifique la consola para más detalles");
      }
    }
  };

  return (
    <>
      {contextHolder}
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

      <Row key="actions" className="m-12 flex justify-center">
        <Col>
          <Link href="/mmse30" passHref>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              size="large"
              style={{ minWidth: '120px' }}
            >
              Volver a MMSE30
            </Button>
          </Link>
        </Col>
        <Col>
          <Button className="!ml-3"
            type="primary"
            size="large"
            onClick={handleSaveData}
            style={{ minWidth: '120px' }}
            disabled={!currentPatient}
            loading={loading}
            icon={<SaveOutlined />}
          >
            {currentPatient ? "Guardar Paciente" : "Seleccione archivo primero"}
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ResultsSection;