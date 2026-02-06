'use client';
import { useState } from 'react';
import { Typography, Progress, Card, Steps, Divider } from 'antd';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  DollarCircleOutlined, 
  CalculatorOutlined, 
  FieldTimeOutlined, 
  BulbOutlined, 
  FileDoneOutlined 
} from '@ant-design/icons';

// Importamos tus componentes (asegúrate de que las rutas sean correctas)
import Parte1DenominacionMonedas from './Parte1DenominacionMonedas';
import Parte2DenominacionBilletes from './Parte2DenominacionBilletes';
import Parte3CalculoMonedas from './Parte3CalculoMonedas';
import Parte4FluenciaVerbal from './Parte4FluenciaVerbal';
import Parte5Recuerdo from './Parte5Recuerdo';
import ResultadosEvaluacion from './ResultadosEvaluacion';

// Tipos
import { 
  MonedasCorrectas, 
  BilletesCorrectos, 
  CalculoItems, 
  RespuestaItem,
  Intrusiones,
  Recuerdo
} from '../utils/cognitive/types';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function EvaluacionMonetaria() {
  const [currentStep, setCurrentStep] = useState(1);
  const [tiempoFluencia, setTiempoFluencia] = useState(60);
  const { currentPatient } = useGlobalContext();

  // --- ESTADOS (Tu lógica original) ---
  const [monedasCorrectas, setMonedasCorrectas] = useState<MonedasCorrectas>({
    centimos10: false, centimos20: false, centimos50: false,
    soles1: false, soles2: false, soles5: false, otrasMonedas: '',
  });

  const [billetesCorrectos, setBilletesCorrectos] = useState<BilletesCorrectos>({
    soles10: false, soles20: false, soles50: false,
    soles100: false, soles200: false, otrosBilletes: '',
  });

  const [calculos, setCalculos] = useState<Record<CalculoItems, RespuestaItem>>({
    item3: { estado: null, intentos: 0 }, item4: { estado: null, intentos: 0 },
    item5: { estado: null, intentos: 0 }, item6: { estado: null, intentos: 0 },
    item7: { estado: null, intentos: 0 },
  });

  const [animales, setAnimales] = useState<string[]>([]);
  
  const [intrusiones, setIntrusiones] = useState<Intrusiones>({
    monedas: 0, billetes: 0, recuerdo: 0,
  });

  const [recuerdo, setRecuerdo] = useState<Recuerdo>({
    cantidadMonedas: '', totalDinero: '',
    monedasRecordadas: { centimos20: 0, centimos50: 0, sol1: 0, soles2: 0 },
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleIntrusionChange = (tipo: keyof Intrusiones, value: number) => {
    setIntrusiones(prev => ({ ...prev, [tipo]: value }));
  };

  // --- RENDERIZADO ---
  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Parte1DenominacionMonedas monedasCorrectas={monedasCorrectas} setMonedasCorrectas={setMonedasCorrectas} intrusiones={intrusiones} handleIntrusionChange={handleIntrusionChange} nextStep={nextStep} />;
      case 2: return <Parte2DenominacionBilletes billetesCorrectos={billetesCorrectos} setBilletesCorrectos={setBilletesCorrectos} intrusiones={intrusiones} handleIntrusionChange={handleIntrusionChange} nextStep={nextStep} prevStep={prevStep} />;
      case 3: return <Parte3CalculoMonedas calculos={calculos} setCalculos={setCalculos} nextStep={nextStep} prevStep={prevStep} />;
      case 4: return <Parte4FluenciaVerbal animales={animales} setAnimales={setAnimales} tiempoFluencia={tiempoFluencia} setTiempoFluencia={setTiempoFluencia} nextStep={nextStep} prevStep={prevStep} />;
      case 5: return <Parte5Recuerdo recuerdo={recuerdo} setRecuerdo={setRecuerdo} intrusiones={intrusiones} handleIntrusionChange={handleIntrusionChange} nextStep={nextStep} prevStep={prevStep} />;
      case 6: return <ResultadosEvaluacion monedasCorrectas={monedasCorrectas} billetesCorrectos={billetesCorrectos} calculos={calculos} animales={animales} intrusiones={intrusiones} recuerdo={recuerdo} fileHandle={currentPatient} resetEvaluation={() => setCurrentStep(1)} />;
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
            {/* Stepper Visual */}
            <div className="mb-8 px-4">
                <Steps current={currentStep - 1} size="small" className="hidden sm:flex">
                    <Step title="Monedas" icon={<DollarCircleOutlined />} />
                    <Step title="Billetes" icon={<DollarCircleOutlined />} />
                    <Step title="Cálculo" icon={<CalculatorOutlined />} />
                    <Step title="Fluencia" icon={<FieldTimeOutlined />} />
                    <Step title="Recuerdo" icon={<BulbOutlined />} />
                    <Step title="Fin" icon={<FileDoneOutlined />} />
                </Steps>
                {/* Barra simple para móviles */}
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