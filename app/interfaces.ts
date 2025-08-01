export interface Paciente {
  codigo: string;
  nombre: string;
  dni: string;
  edad: number;
  fecha_nacimiento: string;
  sexo: 'M' | 'F';
  zona_residencia: string;
  domicilio: string;
  nivel_educativo: string
  ocupacion: string;
  sistema_pension: string;
  ingreso_economico: number;
  con_quien_vive: string;
  relacion: string;
  gijon: number;
  abvdScore: number;
  aivdScore: number;
  sarcopenia: number;
  caida: number;
  deterioro: number;
  incontinencia: number;
  depresion: number;
  sensorial: number;
  bristol: number;
  adherencia: number;
  dynamometry: number;
  balance: number;
  dimension_fisica: number;
  dimension_mental: number;
  puntaje_total: number;
  cognitivo_total: number;
  mmse30: number;
  moca:number;
  afectiva:number;
  nutricional:number;
}

export interface GijonCategory {
  key: string;
  title: string;
  options: string[];
}

export interface GijonScores {
  familiar: number;
  economica: number;
  vivienda: number;
  sociales: number;
  apoyo: number;
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