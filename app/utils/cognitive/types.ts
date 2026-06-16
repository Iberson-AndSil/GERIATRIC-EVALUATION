export type CalculationItems = 'item3' | 'item4' | 'item5' | 'item6' | 'item7';

export type ResponseItem = {
  status: 'correcto' | 'correcto_segundo' | 'incorrecto' | null;
  attempts: number;
};

export type CorrectCoins = {
  cents10: boolean;
  cents20: boolean;
  cents50: boolean;
  soles1: boolean;
  soles2: boolean;
  soles5: boolean;
  otherCoins: string;
};

export type CorrectBills = {
  soles10: boolean;
  soles20: boolean;
  soles50: boolean;
  soles100: boolean;
  soles200: boolean;
  otherBills: string;
};

export type Intrusions = {
  coins: number;
  bills: number;
  recall: number;
};

export type Recall = {
  coinQuantity: string;
  totalMoney: string;
  recalledCoins: {
    cents20: string[];
    cents50: string[];
    sol1: string[];
    soles2: string[];
  };
};

export type ResultInterpretation = {
  diagnosis: string;
  color: string;
  description: string;
  recommendation: string;
};