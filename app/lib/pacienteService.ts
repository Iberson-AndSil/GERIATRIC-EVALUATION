import { Paciente } from "../interfaces";
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

export const obtenerPacientesConResultadosRecientes = async (): Promise<Paciente[]> => {
  const pacientesSnapshot = await getDocs(collection(db, "pacientes"));
  const pacientesPromises = pacientesSnapshot.docs.map(async (pacienteDoc) => {
    const pacienteData = pacienteDoc.data();
    const resultadosRef = collection(db, "pacientes", pacienteDoc.id, "resultados");
    const q = query(resultadosRef, orderBy("fecha", "desc"), limit(1));
    const resultadosSnapshot = await getDocs(q);
    let resultadoReciente = {};
    if (!resultadosSnapshot.empty) {
      resultadoReciente = resultadosSnapshot.docs[0].data();
    }
    
    return {
      id: pacienteDoc.id,
      ...pacienteData,
      ...resultadoReciente
    } as Paciente;
  });
  return Promise.all(pacientesPromises);
};

export const crearPaciente = async (id: string, data: Paciente) => {
  await setDoc(doc(db, "pacientes", id), data);
};

// export const obtenerPacientes = async (): Promise<Paciente[]> => {
//   const querySnapshot = await getDocs(collection(db, "pacientes"));
//   return querySnapshot.docs.map(doc => {
//     const { id, ...data } = doc.data() as Paciente;
//     return {
//       id: doc.id,
//       ...data
//     };
//   });
// };

export const obtenerPacientes = async (): Promise<Paciente[]> => {
  const querySnapshot = await getDocs(collection(db, "pacientes"));
  return querySnapshot.docs.map(doc => {
    const { ...data } = doc.data() as Paciente;
    return {
      ...data
    };
  });
};

export const obtenerPacientePorId = async (id: string) => {
  const docSnap = await getDoc(doc(db, "pacientes", id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export async function actualizarPaciente(dni: string, datos: any) {
  const pacienteRef = doc(db, 'pacientes', dni);
  const pacienteSnapshot = await getDoc(pacienteRef);

  if (!pacienteSnapshot.exists()) {
    throw new Error(`No existe un paciente con DNI ${dni}`);
  }

  await updateDoc(pacienteRef, datos);
}

export async function eliminarPaciente(dni: string) {
  const resultadosRef = collection(db, `pacientes/${dni}/resultados`);
  const resultadosSnap = await getDocs(resultadosRef);
  for (const resultadoDoc of resultadosSnap.docs) {
    await deleteDoc(resultadoDoc.ref);
  }
  await deleteDoc(doc(db, "pacientes", dni));
}

export const agregarModuloAArray = async (
  pacienteId: string,
  evaluacionId: string,
  moduloData: any
) => {
  await updateDoc(
    doc(db, "pacientes", pacienteId, "evaluaciones", evaluacionId),
    { modulos: arrayUnion(moduloData) }
  );
};

export const crearRegistroResultados = async (pacienteId: string, gijon:number) => {
    if (!pacienteId) {
    throw new Error("pacienteId no puede estar vacío");
  }
  
  try {
    const resultadosRef = collection(db, "pacientes", pacienteId, "resultados");
    const nuevoResultadoRef = doc(resultadosRef);
    
    await setDoc(nuevoResultadoRef, {
      fecha: serverTimestamp(),
      completado: false,
      gijon: gijon
    });
    
    return nuevoResultadoRef.id;
  } catch (error) {
    console.error("Error en crearRegistroResultados:", error);
    throw error;
  }
};

export const actualizarResultado = async (
  pacienteId: string,
  resultadoId: string,
  campo: string,
  valor: any
) => {
  const resultadoRef = doc(db, "pacientes", pacienteId, "resultados", resultadoId);

  await updateDoc(resultadoRef, {
    [campo]: valor
  });
};

export const marcarResultadoCompleto = async (pacienteId: string, resultadoId: string) => {
  const resultadoRef = doc(db, "pacientes", pacienteId, "resultados", resultadoId);

  await updateDoc(resultadoRef, {
    completado: true,
    fecha_finalizacion: serverTimestamp()
  });
};

export const verificarResultadoCompleto = async (pacienteId: string, resultadoId: string) => {
  const resultadoRef = doc(db, "pacientes", pacienteId, "resultados", resultadoId);
  const docSnap = await getDoc(resultadoRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const camposRequeridos = [
      'gijon', 'abvdScore', 'aivdScore', 'sarcopenia',
      'caida', 'deterioro', 'incontinencia', 'depresion',
      'sensorial', 'bristol', 'adherencia', 'dynamometry',
      'balance', 'dimension_fisica', 'dimension_mental',
      'puntaje_total', 'cognitivo_total', 'mmse30', 'moca',
      'afectiva', 'nutricional'
    ];

    const estaCompleto = camposRequeridos.every(campo => data[campo] !== undefined);

    if (estaCompleto && !data.completado) {
      await marcarResultadoCompleto(pacienteId, resultadoId);
    }

    return estaCompleto;
  }

  return false;
};

export const obtenerResultadosPaciente = async (pacienteId: string) => {
  const resultadosRef = collection(db, "pacientes", pacienteId, "resultados");
  const querySnapshot = await getDocs(resultadosRef);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const eliminarResultado = async (pacienteId: string, resultadoId: string) => {
  const resultadoRef = doc(db, "pacientes", pacienteId, "resultados", resultadoId)
  await deleteDoc(resultadoRef)
}