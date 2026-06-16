import { Patient, Result } from "../interfaces";
import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// --- Data Mappers ---
export const mapDbPatientToClient = (dbData: any): Patient => {
  if (!dbData) return dbData;
  return {
    id: dbData.id || dbData.dni,
    name: dbData.nombre || "",
    dni: dbData.dni || "",
    age: dbData.edad || 0,
    birthDate: dbData.fecha_nacimiento?.toDate ? dbData.fecha_nacimiento.toDate() : dbData.fecha_nacimiento,
    gender: dbData.sexo || "M",
    residenceZone: dbData.zona_residencia || "",
    address: dbData.domicilio || "",
    educationLevel: dbData.nivel_educativo || "",
    occupation: dbData.ocupacion || "",
    pensionSystem: dbData.sistema_pension || "",
    economicIncome: dbData.ingreso_economico || 0,
    livesWith: dbData.con_quien_vive || "",
    relationship: dbData.relacion || "",
    phone: dbData.telefono || dbData.phone || "",
    email: dbData.email || "",
    evaluationDate: dbData.dateEvaluation || dbData.evaluationDate || null,
    ipress: dbData.ipress || "",
    doctorName: dbData.nameDoctor || dbData.doctorName || "",
    licensedName: dbData.nameLicensed || dbData.licensedName || "",
    economicActivity: dbData.economic_activity || dbData.economicActivity || "",
    birthDay: dbData.birth_day || dbData.birthDay || "",
    birthMonth: dbData.birth_month || dbData.birthMonth || "",
    birthYear: dbData.birth_year || dbData.birthYear || "",
    department: dbData.department || "",
    province: dbData.province || "",
    district: dbData.district || "",
  };
};

export const mapClientPatientToDb = (clientData: any): any => {
  if (!clientData) return clientData;
  const dbData: any = {};
  if (clientData.id) dbData.id = clientData.id;
  if (clientData.name !== undefined) dbData.nombre = clientData.name;
  if (clientData.dni !== undefined) dbData.dni = clientData.dni;
  if (clientData.age !== undefined) dbData.edad = clientData.age;
  if (clientData.birthDate !== undefined) dbData.fecha_nacimiento = clientData.birthDate;
  if (clientData.gender !== undefined) dbData.sexo = clientData.gender;
  if (clientData.residenceZone !== undefined) dbData.zona_residencia = clientData.residenceZone;
  if (clientData.address !== undefined) dbData.domicilio = clientData.address;
  if (clientData.educationLevel !== undefined) dbData.nivel_educativo = clientData.educationLevel;
  if (clientData.occupation !== undefined) dbData.ocupacion = clientData.occupation;
  if (clientData.pensionSystem !== undefined) dbData.sistema_pension = clientData.pensionSystem;
  if (clientData.economicIncome !== undefined) dbData.ingreso_economico = clientData.economicIncome;
  if (clientData.livesWith !== undefined) dbData.con_quien_vive = clientData.livesWith;
  if (clientData.relationship !== undefined) dbData.relacion = clientData.relationship;
  if (clientData.phone !== undefined) dbData.telefono = clientData.phone;
  if (clientData.email !== undefined) dbData.email = clientData.email;
  if (clientData.evaluationDate !== undefined) dbData.dateEvaluation = clientData.evaluationDate;
  if (clientData.ipress !== undefined) dbData.ipress = clientData.ipress;
  if (clientData.doctorName !== undefined) dbData.nameDoctor = clientData.doctorName;
  if (clientData.licensedName !== undefined) dbData.nameLicensed = clientData.licensedName;
  if (clientData.economicActivity !== undefined) dbData.economic_activity = clientData.economicActivity;
  if (clientData.birthDay !== undefined) dbData.birth_day = clientData.birthDay;
  if (clientData.birthMonth !== undefined) dbData.birth_month = clientData.birthMonth;
  if (clientData.birthYear !== undefined) dbData.birth_year = clientData.birthYear;
  if (clientData.department !== undefined) dbData.department = clientData.department;
  if (clientData.province !== undefined) dbData.province = clientData.province;
  if (clientData.district !== undefined) dbData.district = clientData.district;
  return dbData;
};

export const mapDbResultToClient = (dbData: any): Result => {
  if (!dbData) return dbData;
  const clientData: any = { ...dbData };
  if (dbData.fecha !== undefined) clientData.date = dbData.fecha;
  if (dbData.completado !== undefined) clientData.completed = dbData.completado;
  if (dbData.caida !== undefined) clientData.falls = dbData.caida;
  if (dbData.deterioro !== undefined) clientData.deterioration = dbData.deterioro;
  if (dbData.incontinencia !== undefined) clientData.incontinence = dbData.incontinencia;
  if (dbData.depresion !== undefined) clientData.depression = dbData.depresion;
  if (dbData.sensorial !== undefined) clientData.sensory = dbData.sensorial;
  if (dbData.adherencia !== undefined) clientData.adherence = dbData.adherencia;
  if (dbData.dimension_fisica !== undefined) clientData.physicalDimension = dbData.dimension_fisica;
  if (dbData.dimension_mental !== undefined) clientData.mentalDimension = dbData.dimension_mental;
  if (dbData.puntaje_total !== undefined) clientData.totalScore = dbData.puntaje_total;
  if (dbData.cognitivo_total !== undefined) clientData.totalCognitive = dbData.cognitivo_total;
  if (dbData.afectiva !== undefined) clientData.affective = dbData.afectiva;
  if (dbData.nutricional !== undefined) clientData.nutritional = dbData.nutricional;
  return clientData;
};

export const mapClientResultToDb = (clientData: any): any => {
  if (!clientData) return clientData;
  const dbData: any = { ...clientData };
  if (clientData.date !== undefined) { dbData.fecha = clientData.date; delete dbData.date; }
  if (clientData.completed !== undefined) { dbData.completado = clientData.completed; delete dbData.completed; }
  if (clientData.falls !== undefined) { dbData.caida = clientData.falls; delete dbData.falls; }
  if (clientData.deterioration !== undefined) { dbData.deterioro = clientData.deterioration; delete dbData.deterioration; }
  if (clientData.incontinence !== undefined) { dbData.incontinencia = clientData.incontinence; delete dbData.incontinence; }
  if (clientData.depression !== undefined) { dbData.depresion = clientData.depression; delete dbData.depression; }
  if (clientData.sensory !== undefined) { dbData.sensorial = clientData.sensory; delete dbData.sensory; }
  if (clientData.adherence !== undefined) { dbData.adherencia = clientData.adherence; delete dbData.adherence; }
  if (clientData.physicalDimension !== undefined) { dbData.dimension_fisica = clientData.physicalDimension; delete dbData.physicalDimension; }
  if (clientData.mentalDimension !== undefined) { dbData.dimension_mental = clientData.mentalDimension; delete dbData.mentalDimension; }
  if (clientData.totalScore !== undefined) { dbData.puntaje_total = clientData.totalScore; delete dbData.totalScore; }
  if (clientData.totalCognitive !== undefined) { dbData.cognitivo_total = clientData.totalCognitive; delete dbData.totalCognitive; }
  if (clientData.affective !== undefined) { dbData.afectiva = clientData.affective; delete dbData.affective; }
  if (clientData.nutritional !== undefined) { dbData.nutricional = clientData.nutritional; delete dbData.nutritional; }
  return dbData;
};

// --- Firebase Service Functions ---

export const getPatientsWithRecentResults = async (): Promise<Patient[]> => {
  const querySnapshot = await getDocs(collection(db, "pacientes"));
  const patientPromises = querySnapshot.docs.map(async (docSnap) => {
    const rawData = docSnap.data();
    const resultsRef = collection(db, "pacientes", docSnap.id, "resultados");
    const q = query(resultsRef, orderBy("fecha", "desc"), limit(1));
    const resultsSnapshot = await getDocs(q);
    let recentResult = {};
    if (!resultsSnapshot.empty) {
      recentResult = resultsSnapshot.docs[0].data();
    }

    const mergedData = {
      id: docSnap.id,
      ...rawData,
      ...recentResult,
    };

    // First map from DB schemas to English client schemas
    const patient = mapDbPatientToClient(mergedData);
    const result = mapDbResultToClient(mergedData);
    return {
      ...patient,
      ...result,
    } as any;
  });
  return Promise.all(patientPromises);
};

export const createPatient = async (id: string, data: Patient) => {
  const dbData = mapClientPatientToDb(data);
  await setDoc(doc(db, "pacientes", id), dbData);
};

export const getPatients = async (): Promise<Patient[]> => {
  const querySnapshot = await getDocs(collection(db, "pacientes"));
  return querySnapshot.docs.map(docSnap => {
    const rawData = docSnap.data();
    return mapDbPatientToClient({ id: docSnap.id, ...rawData });
  });
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  const docSnap = await getDoc(doc(db, "pacientes", id));
  if (docSnap.exists()) {
    return mapDbPatientToClient({ id: docSnap.id, ...docSnap.data() });
  }
  return null;
};

export async function updatePatient(dni: string, data: Partial<Patient>) {
  const patientRef = doc(db, 'pacientes', dni);
  const docSnap = await getDoc(patientRef);

  if (!docSnap.exists()) {
    throw new Error(`Patient with DNI ${dni} does not exist`);
  }

  const dbData = mapClientPatientToDb(data);
  await updateDoc(patientRef, dbData);
}

export async function deletePatient(dni: string) {
  const resultsRef = collection(db, `pacientes/${dni}/resultados`);
  const resultsSnap = await getDocs(resultsRef);
  for (const docSnap of resultsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }
  await deleteDoc(doc(db, "pacientes", dni));
}

export const createResultsRecord = async (patientId: string, initialData?: any) => {
  if (!patientId) throw new Error("patientId cannot be empty");
  try {
    const resultsRef = collection(db, "pacientes", patientId, "resultados");
    const newDocRef = doc(resultsRef);

    const dbInitialData = mapClientResultToDb(initialData || {});

    await setDoc(newDocRef, {
      fecha: serverTimestamp(),
      completado: false,
      ...dbInitialData
    });

    return newDocRef.id;
  } catch (error) {
    console.error("Error in createResultsRecord:", error);
    throw error;
  }
};

export const updateResult = async (
  patientId: string,
  resultId: string,
  field: string,
  value: any
) => {
  const pId = String(patientId).trim();
  const rId = String(resultId).trim();
  const resultRef = doc(db, "pacientes", pId, "resultados", rId);

  // Map the single client field to DB field if necessary
  const clientObj = { [field]: value };
  const dbObj = mapClientResultToDb(clientObj);

  try {
    await setDoc(resultRef, {
      ...dbObj,
      ultimaModificacion: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error updating/creating result:", error);
    throw error;
  }
};

export const saveOrUpdateMultipleResults = async (
  patientId: string,
  resultId: string | null,
  data: Record<string, any>
): Promise<string> => {
  const pId = String(patientId).trim();
  const dbData = mapClientResultToDb(data);

  try {
    if (!resultId) {
      const resultsRef = collection(db, "pacientes", pId, "resultados");
      const newDocRef = doc(resultsRef);
      await setDoc(newDocRef, {
        fecha: serverTimestamp(),
        completado: false,
        ...dbData
      });
      return newDocRef.id;
    } else {
      const rId = String(resultId).trim();
      const resultRef = doc(db, "pacientes", pId, "resultados", rId);
      await setDoc(resultRef, {
        ...dbData,
        ultimaModificacion: serverTimestamp()
      }, { merge: true });
      return rId;
    }
  } catch (error) {
    console.error("Error in saveOrUpdateMultipleResults:", error);
    throw error;
  }
};

export const markResultAsCompleted = async (patientId: string, resultId: string) => {
  const resultRef = doc(db, "pacientes", patientId, "resultados", resultId);
  await updateDoc(resultRef, {
    completado: true,
    fecha_finalizacion: serverTimestamp()
  });
};

export const verifyResultCompletion = async (patientId: string, resultId: string) => {
  const resultRef = doc(db, "pacientes", patientId, "resultados", resultId);
  const docSnap = await getDoc(resultRef);

  if (docSnap.exists()) {
    const rawData = docSnap.data();
    const requiredFields = [
      'gijon', 'abvdScore', 'aivdScore', 'sarcopenia',
      'caida', 'deterioro', 'incontinencia', 'depresion',
      'sensorial', 'bristol', 'adherencia', 'dynamometry',
      'balance', 'dimension_fisica', 'dimension_mental',
      'puntaje_total', 'cognitivo_total', 'mmse30', 'moca',
      'afectiva', 'nutricional'
    ];

    const isComplete = requiredFields.every(field => rawData[field] !== undefined);

    if (isComplete && !rawData.completado) {
      await markResultAsCompleted(patientId, resultId);
    }

    return isComplete;
  }

  return false;
};

export const getPatientResults = async (patientId: string): Promise<Result[]> => {
  const resultsRef = collection(db, "pacientes", patientId, "resultados");
  const querySnapshot = await getDocs(resultsRef);

  return querySnapshot.docs.map(docSnap => {
    const rawData = docSnap.data();
    return mapDbResultToClient({ id: docSnap.id, ...rawData });
  });
};

export const deleteResult = async (patientId: string, resultId: string) => {
  const resultRef = doc(db, "pacientes", patientId, "resultados", resultId);
  await deleteDoc(resultRef);
};

export const getResultById = async (patientId: string, resultId: string) => {
  try {
    const pId = String(patientId).trim();
    const rId = String(resultId).trim();
    
    if (!pId || !rId) return null;

    const ref = doc(db, "pacientes", pId, "resultados", rId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return { id: rId, inexistente: true }; 
    }

    return mapDbResultToClient({ id: snap.id, ...snap.data() });
  } catch (error) {
    console.error("Critical error in Service getting result:", error);
    return null;
  }
};

// --- Backward Compatibility Aliases ---
export const obtenerPacientesConResultadosRecientes = getPatientsWithRecentResults;
export const crearPaciente = createPatient;
export const obtenerPacientes = getPatients;
export const obtenerPacientePorId = getPatientById;
export const actualizarPaciente = updatePatient;
export const eliminarPaciente = deletePatient;
export const crearRegistroResultados = createResultsRecord;
export const actualizarResultado = updateResult;
export const guardarActualizarMultiplesResultados = saveOrUpdateMultipleResults;
export const marcarResultadoCompleto = markResultAsCompleted;
export const verificarResultadoCompleto = verifyResultCompletion;
export const obtenerResultadosPaciente = getPatientResults;
export const eliminarResultado = deleteResult;
export const obtenerResultadoPorId = getResultById;