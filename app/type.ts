export type EducationLevelOption = {
    value: string;
    label: string;
    children: {
        value: string;
        label: string;
    }[];
};

export type ScoresType = {
  eat: number | null;
  transfer: number | null;
  grooming: number | null;
  toilet: number | null;
  bathing: number | null;
  walking: number | null;
  stairs: number | null;
  dressing: number | null;
  bowels: number | null;
  bladder: number | null;
};

// Deprecated alias for backward compatibility during refactoring if needed
export type PuntajesType = ScoresType;

export type ResponsesType = {
  [key: string]: number | null;
};

export type RespuestasType = ResponsesType;

export type OptionType = {
  label: string;
  value: number;
};

export type ActivityType = {
  name: string;
  key: string;
  options: {
    description: string;
    value: number;
  }[];
};

export type QuestionType = {
  key: string;
  text: string;
};

export type DepressionData = {
  satisfiedLife: string | null;
  helpless: string | null;
  memoryProblems: string | null;
  bored: string | null;
};

export type SensoryData = {
  visionDifficulty: string | null;
  wearsGlasses: string | null;
  hearingDifficulty: string | null;
  wearsHearingAids: string | null;
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
  takeMedicationQuestion?: string | null;
  forgot: string | null;
  takeMedication: string | null;
  stopMedication: string | null;
  feelsBad: string | null;
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