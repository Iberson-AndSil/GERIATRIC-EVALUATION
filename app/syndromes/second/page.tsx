"use client";
import { Row, Col, Typography, Layout, Divider } from 'antd';
import { MedicineBoxOutlined } from '@ant-design/icons';
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

const { Title, Text } = Typography;


export default function Home() {
  const { depresionData, depresionResult, handleDepresionChange } = useDepression();
  const { sensoryData, sensoryResult, handleSensoryChange } = useSensory();
  const { bristolData, bristolResult, handleBristolChange } = useBristol();
  const { adherenciaData, adherenciaResult, handleAdherenciaChange } = useAdherence();
  const { loading, guardarDatos } = useSaveData();

  const handleSave = async () => {
    try {
      await guardarDatos(depresionData, sensoryData, bristolData, adherenciaData);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const allResultsReady =
    depresionResult !== null &&
    sensoryResult !== null &&
    bristolResult !== null &&
    adherenciaResult !== null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
            <MedicineBoxOutlined className="mr-2" />
            Valoración de Síndromes Geriátricos
          </Title>
          <Text type="secondary" className="text-lg">Evaluación de síndromes clínicos</Text>
          <Divider />
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <DepressionCard
              depresionResult={depresionResult}
              handleDepresionChange={handleDepresionChange}
            />
          </Col>
          <Col xs={24} lg={12}>
            <AdherenceCard
              adherenciaData={adherenciaData}
              adherenciaResult={adherenciaResult}
              handleAdherenciaChange={handleAdherenciaChange}
            />
          </Col>
          <Col xs={24} lg={12}>
            <SensoryCard
              sensoryResult={sensoryResult}
              handleSensoryChange={handleSensoryChange}
            />
          </Col>
          <Col xs={24} lg={12}>
            <BristolCard
              bristolResult={bristolResult}
              handleBristolChange={handleBristolChange}
            />
          </Col>
        </Row>

        <div className="mt-12 pb-12">
          <SaveButtons
            loading={loading}
            allResultsReady={allResultsReady}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}