export type CalculoItems = 'item3' | 'item4' | 'item5' | 'item6' | 'item7';

export type RespuestaItem = {
  estado: 'correcto' | 'correcto_segundo' | 'incorrecto' | null;
  intentos: number;
};

export type MonedasCorrectas = {
  centimos10: boolean;
  centimos20: boolean;
  centimos50: boolean;
  soles1: boolean;
  soles2: boolean;
  soles5: boolean;
  otrasMonedas: string;
};

export type BilletesCorrectos = {
  soles10: boolean;
  soles20: boolean;
  soles50: boolean;
  soles100: boolean;
  soles200: boolean;
  otrosBilletes: string;
};

export type Intrusiones = {
  monedas: number;
  billetes: number;
  recuerdo: number;
};

export type Recuerdo = {
  cantidadMonedas: string;
  totalDinero: string;
  monedasRecordadas: {
    centimos20: number;
    centimos50: number;
    sol1: number;
    soles2: number;
  };
};

export type InterpretacionResultado = {
  diagnostico: string;
  color: string;
  descripcion: string;
  recomendacion: string;
};