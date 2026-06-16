'use client';
import { useState } from 'react';
import { Typography, Progress, Card, Steps } from 'antd';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  DollarCircleOutlined, 
  CalculatorOutlined, 
  FieldTimeOutlined, 
  BulbOutlined, 
  FileDoneOutlined 
} from '@ant-design/icons';

import Part1CoinDenomination from './Part1CoinDenomination';
import Part2BillDenomination from './Part2BillDenomination';
import Part3CoinCalculation from './Part3CoinCalculation';
import Part4VerbalFluency from './Part4VerbalFluency';
import Part5Recall from './Part5Recall';
import EvaluationResults from './EvaluationResults';

import { 
  CorrectCoins, 
  CorrectBills, 
  CalculationItems, 
  ResponseItem,
  Intrusions,
  Recall
} from '../utils/cognitive/types';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function EvaluacionMonetaria() {
  const [currentStep, setCurrentStep] = useState(1);
  const [fluencyTime, setFluencyTime] = useState(60);
  const { currentPatient } = useGlobalContext();

  const [correctCoins, setCorrectCoins] = useState<CorrectCoins>({
    cents10: false, cents20: false, cents50: false,
    soles1: false, soles2: false, soles5: false, otherCoins: '',
  });

  const [correctBills, setCorrectBills] = useState<CorrectBills>({
    soles10: false, soles20: false, soles50: false,
    soles100: false, soles200: false, otherBills: '',
  });

  const [calculations, setCalculations] = useState<Record<CalculationItems, ResponseItem>>({
    item3: { status: null, attempts: 0 }, item4: { status: null, attempts: 0 },
    item5: { status: null, attempts: 0 }, item6: { status: null, attempts: 0 },
    item7: { status: null, attempts: 0 },
  });

  const [animalCount, setAnimalCount] = useState<number | null>(null);
  
  const [intrusions, setIntrusions] = useState<Intrusions>({
    coins: 0, bills: 0, recall: 0,
  });

  const [recall, setRecall] = useState<Recall>({
    coinQuantity: '', totalMoney: '',
    recalledCoins: { cents20: [], cents50: [], sol1: [], soles2: [] },
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleIntrusionChange = (type: keyof Intrusions, value: number) => {
    setIntrusions(prev => ({ ...prev, [type]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Part1CoinDenomination correctCoins={correctCoins} setCorrectCoins={setCorrectCoins} intrusions={intrusions} handleIntrusionChange={handleIntrusionChange} nextStep={nextStep} />;
      case 2: return <Part2BillDenomination correctBills={correctBills} setCorrectBills={setCorrectBills} intrusions={intrusions} handleIntrusionChange={handleIntrusionChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3: return <Part3CoinCalculation calculations={calculations} setCalculations={setCalculations} nextStep={nextStep} prevStep={prevStep} />;
      case 4: return <Part4VerbalFluency animalCount={animalCount} setAnimalCount={setAnimalCount} fluencyTime={fluencyTime} setFluencyTime={setFluencyTime} nextStep={nextStep} prevStep={prevStep} />;
      case 5: return <Part5Recall recall={recall} setRecall={setRecall} intrusions={intrusions} handleIntrusionChange={handleIntrusionChange} nextStep={nextStep} prevStep={prevStep} />;
      case 6: return <EvaluationResults correctCoins={correctCoins} correctBills={correctBills} calculations={calculations} animalCount={animalCount} intrusions={intrusions} recall={recall} fileHandle={currentPatient} resetEvaluation={() => setCurrentStep(1)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full">
        
        <div className="text-center mb-8">
          <Title level={3} style={{ color: '#0050b3', margin: 0 }}>
            <DollarCircleOutlined className="mr-2" /> VALORACIÓN COGNITIVA (SOLTEST)
          </Title>
          <Text type="secondary">Evaluación del manejo del dinero y memoria</Text>
        </div>

        <Card className="w-full shadow-lg rounded-2xl border-t-4 border-t-blue-500">
            <div className="mb-8 px-4">
                <Steps current={currentStep - 1} size="small" className="hidden sm:flex">
                    <Step title="Monedas" icon={<DollarCircleOutlined />} />
                    <Step title="Billetes" icon={<DollarCircleOutlined />} />
                    <Step title="Cálculo" icon={<CalculatorOutlined />} />
                    <Step title="Fluencia" icon={<FieldTimeOutlined />} />
                    <Step title="Recuerdo" icon={<BulbOutlined />} />
                    <Step title="Fin" icon={<FileDoneOutlined />} />
                </Steps>
                <div className="sm:hidden">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Paso {currentStep} de 6</span>
                        <span>{Math.round((currentStep / 6) * 100)}%</span>
                    </div>
                    <Progress percent={(currentStep / 6) * 100} showInfo={false} strokeColor="#1890ff" />
                </div>
            </div>
            
            <div className="mt-4">
                {renderStep()}
            </div>
        </Card>
      </div>
    </div>
  );
}