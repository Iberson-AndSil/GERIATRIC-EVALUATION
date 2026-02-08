'use client';
import React, { useState } from 'react';
import { Steps, Typography, Card, Button, notification } from 'antd';
import { initialScores, sections, calculateScore, calculateSectionProgress } from '../utils/moca/utils';
import { MOCAScores, EducationLevel, SectionKey } from '../type';
import { FileTextOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VisuospatialSection from './VisuospatialSection';
import NamingSection from './NamingSection';
import MemorySection from './MemorySection';
import AttentionSection from './AttentionSection';
import LanguageSection from './LanguageSection';
import AbstractionSection from './AbstractionSection';
import DelayedRecallSection from './DelayedRecallSection';
import OrientationSection from './OrientationSection';
import ResultsSection from './ResultsSection';
import MOCASidebar from './MOCASidebar';
import { useGlobalContext } from '../context/GlobalContext';
import { actualizarResultado } from '../lib/pacienteService';

const { Title, Text } = Typography;
const { Step } = Steps;

const MOCATest: React.FC = () => {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('university_complete');
  const [activeSection, setActiveSection] = useState<SectionKey>('visuospatial');
  const [scores, setScores] = useState<MOCAScores>(initialScores);
  const { currentPatient, currentResultId } = useGlobalContext();
  const [api, contextHolder] = notification.useNotification();
  const activeSectionsList = sections.filter(s => s.key !== 'info');
  const activeSectionIndex = activeSectionsList.findIndex(s => s.key === activeSection);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (section: keyof MOCAScores, index: number) => (e: any) => {
    const newScores = { ...scores };
    newScores[section][index] = e.target.checked;
    setScores(newScores);
  };

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        message: 'Guardado Exitoso',
        description: 'La evaluación MOCA ha sido registrada.',
        placement: 'topRight'
      });

      setTimeout(() => {
        router.push('/affective');
      }, 1000);

    } catch (err: unknown) {
      console.error(err);
      api.error({ message: 'Error al guardar', description: 'Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const totalScore = calculateScore(scores, educationLevel);
  const isNormal = totalScore >= 26;

  const commonProps = {
    scores,
    educationLevel,
    activeSection,
    onCheckboxChange: handleCheckboxChange,
    onEducationChange: setEducationLevel,
    onSectionChange: handleSectionChange,
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'visuospatial': return <VisuospatialSection {...commonProps} />;
      case 'naming': return <NamingSection {...commonProps} />;
      case 'memory': return <MemorySection {...commonProps} />;
      case 'attention': return <AttentionSection {...commonProps} />;
      case 'language': return <LanguageSection {...commonProps} />;
      case 'abstraction': return <AbstractionSection {...commonProps} />;
      case 'delayedRecall': return <DelayedRecallSection {...commonProps} />;
      case 'orientation': return <OrientationSection {...commonProps} />;
      case 'results':
        return <ResultsSection
          {...commonProps}
          totalScore={totalScore}
          isNormal={isNormal}
          calculateSectionProgress={calculateSectionProgress}
        />;
      default: return null;
    }
  };

  const currentSectionTitle = activeSectionsList.find(s => s.key === activeSection)?.title || "Evaluación";

  return (
    <div className="min-h-screen w-full p-0">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 rounded-lg mb-6 justify-center text-center">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <FileTextOutlined style={{ fontSize: '24px' }} />
          </div>
          <div className='text-center'>
            <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
              Evaluación Cognitiva Montreal (MOCA)
            </Title>
            <Text type="secondary">Evaluación rápida de disfunción cognitiva leve</Text>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col">
            <Card
              title={
                <div className="flex flex-col py-2">
                  <span className="text-blue-600 font-bold text-base uppercase tracking-wider mb-2">
                    Sección: {currentSectionTitle}
                  </span>
                  <Steps
                    current={activeSectionIndex}
                    size="small"
                    className="w-full"
                    progressDot
                  >
                    {activeSectionsList.map(s => <Step key={s.key} />)}
                  </Steps>
                </div>
              }
              className="shadow-sm rounded-xl border-t-4 border-t-blue-500 "
              bodyStyle={{ padding: '24px' }}
            >
              <div className="animate-fadeIn">
                {renderSectionContent()}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <MOCASidebar
              scores={scores}
              educationLevel={educationLevel}
              onEducationChange={setEducationLevel}
              activeSectionIndex={activeSectionIndex}
              totalSections={activeSectionsList.length}
            />
            <div className="mt-6 flex justify-between items-center gap-4">
              <Link href="/mmse30" passHref>
                <Button
                  icon={<ArrowLeftOutlined />}
                  size="large"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Volver a MMSE
                </Button>
              </Link>

              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                onClick={handleSaveData}
                loading={loading}
                disabled={!currentPatient}
                className="bg-blue-600 shadow-md hover:scale-105 transition-transform flex-1 max-w-xs"
              >
                {currentPatient ? "Guardar y Finalizar" : "Seleccione Paciente"}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MOCATest;