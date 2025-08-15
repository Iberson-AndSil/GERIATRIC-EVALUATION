"use client";
import { Row, Col, Typography } from 'antd';
import { useDepression } from '@/app/utils/syndromes/useDepression';
import { useSensory } from '@/app/utils/syndromes/useSensory';
import { useBristol } from '@/app/utils/syndromes/useBristol';
import { useAdherence } from '@/app/utils/syndromes/useAdherence';
import { useSaveData } from '@/app/utils/syndromes/useSaveData';
import { DepressionCard } from './DepressionCard';
import { SensoryCard } from './SensoryCard';
import { BristolCard } from './BristolCard';
import { AdherenceCard } from './AdherenceCard';
import { SaveButtons } from './SaveButtons';


const { Title } = Typography;

export default function Home() {
  const {
    depresionData,
    depresionResult,
    handleDepresionChange
  } = useDepression();

  const {
    sensoryData,
    sensoryResult,
    handleSensoryChange
  } = useSensory();

  const {
    bristolData,
    bristolResult,
    handleBristolChange
  } = useBristol();

  const {
    adherenciaData,
    adherenciaResult,
    handleAdherenciaChange
  } = useAdherence();

  const {
    loading,
    guardarDatos
  } = useSaveData();

  const handleSave = async () => {
    try {
      await guardarDatos(
        depresionData,
        sensoryData,
        bristolData,
        adherenciaData
      );
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const allResultsReady = depresionResult && sensoryResult && bristolResult && adherenciaResult;

  return (
    <div style={{ padding: 24 }}>
      <Title
        level={3}
        style={{
          textAlign: 'center',
          marginBottom: '24px',
          color: '#1890ff',
          fontWeight: 500
        }}
      >
        SÍNDROMES GERIÁTRICOS
      </Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <DepressionCard 
            depresionResult={depresionResult}
            handleDepresionChange={handleDepresionChange}
          />
        </Col>
        <Col xs={24} md={12}>
          <SensoryCard 
            sensoryResult={sensoryResult}
            handleSensoryChange={handleSensoryChange}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <BristolCard 
            bristolResult={bristolResult}
            handleBristolChange={handleBristolChange}
          />
        </Col>
        <Col xs={24} md={12}>
          <AdherenceCard 
            adherenciaData={adherenciaData}
            adherenciaResult={adherenciaResult}
            handleAdherenciaChange={handleAdherenciaChange}
          />
        </Col>
      </Row>

      <SaveButtons 
        loading={loading} 
        allResultsReady={allResultsReady} 
        onSave={handleSave} 
      />
    </div>
  );
}