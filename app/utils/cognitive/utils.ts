import { CalculoItems, RespuestaItem, MonedasCorrectas, BilletesCorrectos, Intrusiones, Recuerdo, InterpretacionResultado } from './types';

export const calcularPuntajeParte1 = (monedas: MonedasCorrectas, billetes: BilletesCorrectos, intrusiones: Intrusiones) => {
  const totalMonedasCorrectas = Math.max(0, 
    Object.values(monedas)
    .filter(val => val === true).length - intrusiones.monedas);
  
  const totalBilletesCorrectos = Math.max(0, 
    Object.values(billetes)
    .filter(val => val === true).length - intrusiones.billetes);

  return totalMonedasCorrectas + totalBilletesCorrectos;
};

export const calcularPuntajeParte2 = (calculos: Record<CalculoItems, RespuestaItem>) => {
  return Object.values(calculos).reduce((total, item) => {
    if (item.estado === 'correcto') return total + 2;
    if (item.estado === 'correcto_segundo') return total + 1;
    return total;
  }, 0);
};

export const calcularPuntajeParte3 = (recuerdo: Recuerdo, intrusiones: Intrusiones) => {
  let puntaje = 0;
  
  if (recuerdo.cantidadMonedas === '11') puntaje += 1;
  if (recuerdo.totalDinero === '9') puntaje += 1;
  
  if (recuerdo.monedasRecordadas.centimos20 === 5) puntaje += 2;
  else if (recuerdo.monedasRecordadas.centimos20 > 0) puntaje += 1;
  
  if (recuerdo.monedasRecordadas.centimos50 === 2) puntaje += 2;
  else if (recuerdo.monedasRecordadas.centimos50 > 0) puntaje += 1;
  
  if (recuerdo.monedasRecordadas.sol1 === 1) puntaje += 2;
  else if (recuerdo.monedasRecordadas.sol1 > 0) puntaje += 1;
  
  if (recuerdo.monedasRecordadas.soles2 === 3) puntaje += 2;
  else if (recuerdo.monedasRecordadas.soles2 > 0) puntaje += 1;
  
  return Math.max(0, puntaje - intrusiones.recuerdo);
};

export const interpretarResultado = (puntajeTotal: number): InterpretacionResultado => {
  if (puntajeTotal <= 24) {
    return {
      diagnostico: "Posible trastorno cognitivo",
      color: "red",
      descripcion: "El puntaje sugiere la presencia de deterioro cognitivo (sensibilidad del 90.5%). Se recomienda una evaluación más completa.",
      recomendacion: "Derivar a evaluación neuropsicológica completa y valoración geriátrica integral."
    };
  } else {
    return {
      diagnostico: "Función cognitiva probablemente preservada",
      color: "green",
      descripcion: "El puntaje sugiere que no hay evidencia de deterioro cognitivo significativo (especificidad del 83.3%).",
      recomendacion: "Continuar con seguimiento según protocolo de evaluación geriátrica."
    };
  }
};