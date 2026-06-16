"use client";
import { Row, Col, Typography, Divider } from 'antd';
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
  const { depressionData, depressionResult, score: depressionScore, handleDepressionChange } = useDepression();
  const { sensoryData, sensoryResult, score: sensoryScore, handleSensoryChange } = useSensory();
  const { bristolData, bristolResult, score: bristolScore, handleBristolChange } = useBristol();
  const { adherenceData, adherenceResult, score: adherenceScore, handleAdherenceChange } = useAdherence();

  const { loading, guardarDatos } = useSaveData();

  const handleSave = async () => {
    try {
      await guardarDatos(depressionData, sensoryData, bristolData, adherenceData);
    } catch (error) {
      console.error("Error saving syndromes second part:", error);
    }
  };

  const allResultsReady =
    depressionResult !== null &&
    sensoryResult !== null &&
    bristolResult !== null &&
    adherenceResult !== null;

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
              depressionResult={depressionResult}
              score={depressionScore}
              handleDepressionChange={handleDepressionChange}
            />
          </Col>
          <Col xs={24} lg={12}>
            <AdherenceCard
              adherenceData={adherenceData}
              adherenceResult={adherenceResult}
              score={adherenceScore}
              handleAdherenceChange={handleAdherenceChange}
            />
          </Col>
          <Col xs={24} lg={12}>
            <SensoryCard
              sensoryResult={sensoryResult}
              score={sensoryScore}
              handleSensoryChange={handleSensoryChange}
            />
          </Col>
          <Col xs={24} lg={12}>
            <BristolCard
              bristolData={bristolData}
              bristolResult={bristolResult}
              score={bristolScore}
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