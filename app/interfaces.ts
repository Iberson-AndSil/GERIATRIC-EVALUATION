export interface Patient {
  [key: string]: any;
  id: string;
  name: string;
  dni: string;
  age: number;
  birthDate: Date;
  gender: 'M' | 'F';
  residenceZone: string;
  address: string;
  educationLevel: string;
  occupation: string;
  pensionSystem: string;
  economicIncome: number;
  livesWith: string;
  relationship: string;
  phone?: string;
  email?: string;
  evaluationDate?: any;
  ipress?: string;
  doctorName?: string;
  licensedName?: string;
  economicActivity?: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  department?: string;
  province?: string;
  district?: string;
}

export interface Result {
  id: string;
  date: any;
  gijon?: number;
  completed?: boolean;
  abvdScore?: number;
  aivdScore?: number;
  sarcopenia?: number;
  falls?: number;
  deterioration?: number;
  incontinence?: number;
  depression?: number;
  sensory?: number;
  bristol?: number;
  adherence?: number;
  dynamometry?: number;
  balance?: number;
  physicalDimension?: number;
  mentalDimension?: number;
  totalScore?: number;
  totalCognitive?: number;
  mmse30?: number;
  moca?: number;
  affective?: number;
  nutritional?: number;
  [key: string]: any;
}

export interface GijonCategory {
  key: string;
  title: string;
  options: string[];
}

export interface GijonScores {
  family: number;
  economic: number;
  housing: number;
  social: number;
  support: number;
}

export interface FormValues {
  weight?: number;
  height?: number;
  imc?: number;
  abdominalPerimeter?: number;
  calfPerimeter?: number;
  brachialPerimeter?: number;
  heelKneeHeight?: number;
  biaFat?: number;
  muscleMass?: number;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  q5?: number;
  q6?: number;
  q7?: number;
  q8?: number;
  q9?: number;
  q10?: number;
  q11?: number;
  q12_dairy?: boolean;
  q12_eggs?: boolean;
  q12_meat?: boolean;
  q13?: number;
  q14?: number;
  q15?: number;
  q16?: number;
  q17?: number;
  q18?: number;
}