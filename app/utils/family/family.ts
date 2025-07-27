'use client';
import { Paciente } from "../../interfaces";
import * as XLSX from "xlsx";

export const generarCodigoUnico = (dni: string, existingCodes: Set<string>): string => {
  const baseCodigo = `PAC-${dni}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
  let codigo = baseCodigo;
  let counter = 1;

  while (existingCodes.has(codigo)) {
    codigo = `${baseCodigo}-${counter.toString().padStart(2, '0')}`;
    counter++;
  }

  return codigo;
};

export const formatPatientData = (formData: any, score: number, existingCodes: Set<string>): Paciente => {
  return {
    codigo: generarCodigoUnico(formData.dni, existingCodes),
    nombre: formData.nombre.trim(),
    dni: formData.dni,
    fecha_nacimiento: formData.fecha_nacimiento,
    edad: formData.edad,
    sexo: formData.sexo,
    zona_residencia: formData.zona_residencia,
    domicilio: formData.domicilio.trim(),
    nivel_educativo: Array.isArray(formData.nivel_educativo)
      ? formData.nivel_educativo.join(', ')
      : formData.nivel_educativo,
    ocupacion: formData.ocupacion.trim(),
    sistema_pension: Array.isArray(formData.sistema_pension)
      ? formData.sistema_pension.join(', ')
      : formData.sistema_pension,
    ingreso_economico: formData.ingreso_economico,
    con_quien_vive: formData.con_quien_vive.trim(),
    relacion: formData.relacion.trim(),
    gijon: score,
    abvdScore: 0,
    aivdScore: 0,
    sarcopenia: 0,
    caida: 0,
    deterioro: 0,
    incontinencia: 0,
    depresion: 0,
    sensorial: 0,
    bristol: 0,
    adherencia: 0,
    dynamometry: 0,
    balance: 0,
    dimension_fisica: 0,
    dimension_mental: 0,
    puntaje_total: 0,
    cognitivo_total: 0,
    mmse30:0,
  };
};

export const savePatientToExcel = async (fileHandle: any, patient: Paciente, form: any) => {
  const file = await fileHandle.getFile();
  const arrayBuffer = await file.arrayBuffer();
  const existingWb = XLSX.read(arrayBuffer, { type: "array" });
  const wsName = existingWb.SheetNames[0];
  const ws = existingWb.Sheets[wsName];

  const existingData: Paciente[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: ""
  });

  const nuevosDatos = [Object.values(patient)];

  const writable = await fileHandle.createWritable();
  const updatedWs = existingData.length === 0
    ? XLSX.utils.aoa_to_sheet([Object.keys(patient), ...nuevosDatos])
    : XLSX.utils.sheet_add_aoa(ws, nuevosDatos, { origin: -1 });

  const updatedWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(updatedWb, updatedWs, wsName);

  await writable.write(XLSX.write(updatedWb, {
    bookType: "xlsx",
    type: "buffer",
    bookSST: true
  }));

  await writable.close();
  form.resetFields();
};