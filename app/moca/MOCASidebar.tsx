'use client';
import React from 'react';
import { Card, Progress, Typography, Select, Divider, Tag, Statistic } from 'antd';
import { ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { MOCAScores, EducationLevel } from '../type';
import { calculateScore } from '../utils/moca/utils';

const { Text } = Typography;
const { Option } = Select;

interface MOCASidebarProps {
  scores: MOCAScores;
  educationLevel: EducationLevel;
  onEducationChange: (val: EducationLevel) => void;
  activeSectionIndex: number;
  totalSections: number;
}

const MOCASidebar: React.FC<MOCASidebarProps> = ({
  scores,
  educationLevel,
  onEducationChange,
  activeSectionIndex,
  totalSections,
}) => {
  const currentScore = calculateScore(scores, educationLevel);
  const progressPercent = Math.round(((activeSectionIndex) / totalSections) * 100);
  const isFinished = activeSectionIndex === totalSections - 1;

  return (
    <Card
      title={
        <span className="text-purple-600 font-bold text-base">
          <ThunderboltOutlined className="mr-2" /> 
          Panel de Control
        </span>
      }
      className="shadow-sm rounded-xl border-t-4 border-t-purple-500 flex flex-col sticky"
      size="small"
      bodyStyle={{ padding: '24px' }}
    >
      <div className="text-center mb-6">
        <Progress 
          type="dashboard" 
          percent={isFinished ? 100 : progressPercent} 
          width={80} 
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
        />
        <div className="mt-2">
            <Tag color={isFinished ? "success" : "processing"}>
                {isFinished ? "COMPLETADO" : "EN PROGRESO"}
            </Tag>
        </div>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div className="mb-6">
        <Text strong className="block mb-2 text-xs text-gray-500 uppercase">
            Ajuste: Nivel Educativo
        </Text>
        <Select 
            value={educationLevel} 
            onChange={onEducationChange} 
            style={{ width: '100%' }}
            placeholder="Seleccione nivel"
        >
            <Option value="technical">Técnico</Option>
            <Option value="technical_superior">Técnico superior</Option>
            <Option value="university_incomplete">Universitario incompleto</Option>
            <Option value="university_complete">Universitario completo</Option>
            <Option value="master">Maestría</Option>
            <Option value="phd">Doctorado</Option>
            <Option value="none">Ninguno (o &lt; 12 años)</Option>
        </Select>
        {educationLevel === 'none' && (
             <Text type="secondary" className="text-xs mt-1 block text-orange-500">
                * Se añade +1 punto al total.
             </Text>
        )}
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
        <Statistic 
            title={<span className="font-bold text-purple-800">Puntaje Actual</span>}
            value={currentScore}
            suffix="/ 30"
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#3f6600', fontWeight: 'bold' }}
        />
        <Text type="secondary" className="text-xs">
            {currentScore >= 26 ? "Normal" : "Deterioro Cognitivo"}
        </Text>
      </div>
    </Card>
  );
};

export default MOCASidebar;