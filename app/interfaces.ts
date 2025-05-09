export interface Paciente {
  codigo: string;
  nombre: string;
  dni: string;
  edad: number;
  fecha_nacimiento:string;
  sexo: 'M' | 'F';
  zona_residencia:string;
  domicilio:string;
  nivel_educativo:string
  ocupacion:string;
  sistema_pension:string;
  ingreso_economico:number;
  con_quien_vive:string;
  relacion:string;
  gijon:number;
  abvdScore:number;
  aivdScore:number;
  sarcopenia:number;
  caida:number;
  deterioro:number;
  incontinencia:number;
  depresion:number;
  sensorial:number;
  bristol:number;
  adherencia:number;
  dynamometry:number;
  balance:number;
  dimension_fisica:number;
  dimension_mental:number;
  puntaje_total:number;
}