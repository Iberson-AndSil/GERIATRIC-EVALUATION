'use client';
import React, { useState } from 'react';
import { Steps, Typography } from 'antd';
import { 
  initialScores, 
  sections, 
  calculateScore, 
  calculateSectionProgress 
} from '../utils/moca/utils';
import { MOCAScores, EducationLevel, SectionKey } from '../type';
import InfoSection from './InfoSection';
import VisuospatialSection from './VisuospatialSection';
import NamingSection from './NamingSection';
import MemorySection from './MemorySection';
import AttentionSection from './AttentionSection';
import LanguageSection from './LanguageSection';
import AbstractionSection from './AbstractionSection';
import DelayedRecallSection from './DelayedRecallSection';
import OrientationSection from './OrientationSection';
import ResultsSection from './ResultsSection';

const { Title } = Typography;
const { Step } = Steps;

const MOCATest: React.FC = () => {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('');
  const [activeSection, setActiveSection] = useState<SectionKey>('info');
  const [scores, setScores] = useState<MOCAScores>(initialScores);

  const handleCheckboxChange = (section: keyof MOCAScores, index: number) => (e: any) => {
    const newScores = { ...scores };
    newScores[section][index] = e.target.checked;
    setScores(newScores);
  };

  const handleEducationChange = (value: EducationLevel) => {
    setEducationLevel(value);
  };

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
  };

  const totalScore = calculateScore(scores, educationLevel);
  const isNormal = totalScore >= 26;

  const renderSection = () => {
    const commonProps = {
      scores,
      educationLevel,
      activeSection,
      onCheckboxChange: handleCheckboxChange,
      onEducationChange: handleEducationChange,
      onSectionChange: handleSectionChange,
    };

    switch(activeSection) {
      case 'info':
        return <InfoSection {...commonProps} />;
      case 'visuospatial':
        return <VisuospatialSection {...commonProps} />;
      case 'naming':
        return <NamingSection {...commonProps} />;
      case 'memory':
        return <MemorySection {...commonProps} />;
      case 'attention':
        return <AttentionSection {...commonProps} />;
      case 'language':
        return <LanguageSection {...commonProps} />;
      case 'abstraction':
        return <AbstractionSection {...commonProps} />;
      case 'delayedRecall':
        return <DelayedRecallSection {...commonProps} />;
      case 'orientation':
        return <OrientationSection {...commonProps} />;
      case 'results':
        return <ResultsSection 
          {...commonProps} 
          totalScore={totalScore} 
          isNormal={isNormal} 
          calculateSectionProgress={calculateSectionProgress}
        />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Title level={2}>Evaluación Cognitiva Montreal (MOCA)</Title>
      
      <Steps 
        current={sections.findIndex(s => s.key === activeSection)} 
        style={{ marginBottom: '20px' }}
        size="small"
      >
        {sections.map(section => (
          <Step 
            key={section.key} 
            title={section.title} 
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveSection(section.key)}
          />
        ))}
      </Steps>
      
      {renderSection()}
    </div>
  );
};

export default MOCATest;