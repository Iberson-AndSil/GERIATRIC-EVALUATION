import { CalculationItems, ResponseItem, CorrectCoins, CorrectBills, Intrusions, Recall, ResultInterpretation } from './types';

export const calculatePart1Score = (coins: CorrectCoins, bills: CorrectBills, intrusions: Intrusions) => {
  const coinsCount = Object.keys(coins).filter(key => key !== 'otherCoins' && coins[key as keyof CorrectCoins] === true).length;
  const billsCount = Object.keys(bills).filter(key => key !== 'otherBills' && bills[key as keyof CorrectBills] === true).length;

  const totalCorrectCoins = Math.max(0, coinsCount - intrusions.coins);
  const totalCorrectBills = Math.max(0, billsCount - intrusions.bills);

  return totalCorrectCoins + totalCorrectBills;
};

export const calculatePart2Score = (calculations: Record<CalculationItems, ResponseItem>) => {
  return Object.values(calculations).reduce((total, item) => {
    if (item.status === 'correcto') return total + 2;
    if (item.status === 'correcto_segundo') return total + 1;
    return total;
  }, 0);
};

export const calculatePart3Score = (recall: Recall, intrusions: Intrusions) => {
  let score = 0;
  if (recall.coinQuantity === 'correcto') score += 1;
  if (recall.totalMoney === 'correcto') score += 1;
  
  if (recall.recalledCoins.cents20?.includes('tipo')) score += 1;
  if (recall.recalledCoins.cents20?.includes('cantidad')) score += 1;
  
  if (recall.recalledCoins.cents50?.includes('tipo')) score += 1;
  if (recall.recalledCoins.cents50?.includes('cantidad')) score += 1;
  
  if (recall.recalledCoins.sol1?.includes('tipo')) score += 1;
  if (recall.recalledCoins.sol1?.includes('cantidad')) score += 1;
  
  if (recall.recalledCoins.soles2?.includes('tipo')) score += 1;
  if (recall.recalledCoins.soles2?.includes('cantidad')) score += 1;

  return Math.max(0, score - intrusions.recall);
};

export const interpretResult = (totalScore: number): ResultInterpretation => {
  if (totalScore <= 24) {
    return {
      diagnosis: "Posible trastorno cognitivo",
      color: "red",
      description: "El puntaje sugiere la presencia de deterioro cognitivo (sensibilidad del 90.5%). Se recomienda una evaluación más completa.",
      recommendation: "Derivar a evaluación neuropsicológica completa y valoración geriátrica integral."
    };
  } else {
    return {
      diagnosis: "Función cognitiva probablemente preservada",
      color: "green",
      description: "El puntaje sugiere que no hay evidencia de deterioro cognitivo significativo (especificidad del 83.3%).",
      recommendation: "Continuar con seguimiento según protocolo de evaluación geriátrica."
    };
  }
};