export type PuntajesType = {
  comer: number | null;
  trasladarse: number | null;
  aseo: number | null;
  retrete: number | null;
  banarse: number | null;
  desplazarse: number | null;
  escaleras: number | null;
  vestirse: number | null;
  heces: number | null;
  orina: number | null;
};

export type RespuestasType = {
  [key: string]: number | null;
};

export type OpcionType = {
  label: string;
  valor: number;
};

export type ActividadType = {
  nombre: string;
  key: string;
  opciones: {
    descripcion: string;
    valor: number;
  }[];
};

export type PreguntaType = {
  key: string;
  texto: string;
};

export type DepressionData = {
  vidaSatisfecha: string | null;
  impotente: string | null;
  problemasMemoria: string | null;
  aburrido: string | null;
};

export type SensoryData = {
  dificultadVista: string | null;
  usaAnteojos: string | null;
  dificultadEscucha: string | null;
  usaAudifonos: string | null;
};

export type BristolData = {
  bristolType: string | null;
  effort: boolean;
  hardStool: boolean;
  incomplete: boolean;
  obstruction: boolean;
  manualAid: boolean;
  lessThanThree: boolean;
};

export type AdherenceData = {
  olvido: string | null;
  tomarMedicamento: string | null;
  dejarMedicacion: string | null;
  sientaMal: string | null;
};

export type SarcopeniaResponses = {
  liftingWeight?: number;
  crossingRoom?: number;
  transferring?: number;
  climbingStairs?: number;
  falls?: number;
};

export type FallsResponses = {
  hasFallen?: boolean;
  neededMedicalAssistance?: boolean;
  couldNotGetUp?: boolean;
  fearOfFalling?: boolean;
};

export type CognitiveResponses = {
  forgetsRecentEvents?: boolean;
  rememberQuickly?: boolean;
  rememberSlowly?: boolean;
  affectsDailyActivities?: boolean;
};

export type IncontinenceResponses = {
  frequency?: number;
  amount?: number;
  impact?: number;
  situations?: string[];
  situationsScore?: number;
};

export interface AllResponses {
  sarcopenia: SarcopeniaResponses;
  falls: FallsResponses;
  cognitive: CognitiveResponses;
  incontinence: IncontinenceResponses;
}

export type SarcopeniaQuestion = {
  key: keyof SarcopeniaResponses;
  text: string;
  options: { label: string; value: number }[];
};

export type OptionType = {
  label: string;
  value: number;
};

export type DimensionKey = 'PHYSICAL' | 'MENTAL';

export interface DimensionConfig {
  name: string;
  description: string;
  questionIndexes: number[];
  maxScore: number;
  icon: React.ReactNode;
}

export type DimensionsConfig = {
  [key in DimensionKey]: DimensionConfig;
};

export interface SurveyQuestion {
  question: string;
  options: string[];
  type: string;
  scores: number[];
}

export interface QuestionGroup {
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface SurveyResults {
  dimensions: {
    [key in DimensionKey]: {
      rawScore: number;
      maxPossible: number;
    } & DimensionConfig;
  };
  totalScore: number;
  answers: Record<string, string>;
}

export type MOCAScores = {
  visuospatial: boolean[];
  naming: boolean[];
  memoryAttempt: boolean[];
  attention1: boolean[];
  attention2: boolean[];
  attention3: boolean[];
  language1: boolean[];
  language2: boolean[];
  abstraction: boolean[];
  delayedRecall: boolean[];
  orientation: boolean[];
};

export type EducationLevel = any;

export type SectionKey = 
  | 'info' 
  | 'visuospatial' 
  | 'naming' 
  | 'memory' 
  | 'attention' 
  | 'language' 
  | 'abstraction' 
  | 'delayedRecall' 
  | 'orientation' 
  | 'results';

export interface Section {
  key: SectionKey;
  title: string;
}

export interface MOCATestProps {
  scores: MOCAScores;
  educationLevel: EducationLevel;
  activeSection: SectionKey;
  onCheckboxChange: (section: keyof MOCAScores, index: number) => (e: any) => void;
  onEducationChange: (value: EducationLevel) => void;
  onSectionChange: (section: SectionKey) => void;
}