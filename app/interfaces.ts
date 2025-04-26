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
  abvdDescription:string;
  aivdScore:number;
  aivdDescription:string;
}