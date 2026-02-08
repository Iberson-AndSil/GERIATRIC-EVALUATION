'use client';
import { Typography, Divider, Progress, Row, Col, Button } from 'antd';
import { MOCATestProps, SectionKey } from '../type';
import { 
  EyeOutlined,
  TagsOutlined,
  NumberOutlined,
  MessageOutlined,
  BulbOutlined,
  HistoryOutlined,
  CompassOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

interface ResultsSectionProps extends MOCATestProps {
  totalScore: number;
  isNormal: boolean;
  calculateSectionProgress: (section: SectionKey, scores: any) => number;
}

const SECTION_CONFIG: Record<string, { label: string, icon: React.ReactNode }> = {
  visuospatial: { label: 'Visuoespacial', icon: <EyeOutlined /> },
  naming:       { label: 'Identificación', icon: <TagsOutlined /> },
  attention:    { label: 'Atención', icon: <NumberOutlined /> },
  language:     { label: 'Lenguaje', icon: <MessageOutlined /> },
  abstraction:  { label: 'Abstracción', icon: <BulbOutlined /> },
  delayedRecall:{ label: 'Recuerdo', icon: <HistoryOutlined /> },
  orientation:  { label: 'Orientación', icon: <CompassOutlined /> },
};

const ResultsSection: React.FC<ResultsSectionProps> = ({
  scores,
  educationLevel,
  totalScore,
  isNormal,
  onSectionChange,
  calculateSectionProgress,
}) => {


  return (
    <div className="h-full flex flex-col">      
      <div className="flex-1 overflow-y-auto pr-2">
        <Divider orientation="left" className="!text-xs !text-gray-400 !uppercase !font-bold !mt-0">Desglose por Área</Divider>
        <Row gutter={[12, 12]}>
            {Object.keys(SECTION_CONFIG).map((key) => {
                const config = SECTION_CONFIG[key];
                const percent = calculateSectionProgress(key as SectionKey, scores);
                
                return (
                    <Col span={12} key={key}>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col justify-center h-full">
                            <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium text-xs uppercase">
                                <span className="text-blue-500">{config.icon}</span>
                                {config.label}
                            </div>
                            <Progress 
                                percent={percent} 
                                size="small" 
                                status={percent === 100 ? "success" : "normal"}
                                strokeColor={percent === 100 ? "#52c41a" : "#1890ff"}
                            />
                        </div>
                    </Col>
                );
            })}
        </Row>
      </div>

      <div className="mt-6 flex justify-start items-center gap-4">
        <Button 
          onClick={() => onSectionChange('orientation')}
          type="default"
          size="large"
          icon={<ArrowLeftOutlined />}
          className="text-gray-500 hover:text-blue-600 border-gray-300"
        >
          Anterior
        </Button>
      </div>
    </div>
  );
};

export default ResultsSection;