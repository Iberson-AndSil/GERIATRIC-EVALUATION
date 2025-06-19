import { useState } from 'react';
import { DepressionData } from '../../type';

export const useDepression = () => {
    const [depresionData, setDepresionData] = useState<DepressionData>({
        vidaSatisfecha: null,
        impotente: null,
        problemasMemoria: null,
        aburrido: null,
    });
    const [depresionResult, setDepresionResult] = useState<string | null>(null);

    const handleDepresionChange = (field: keyof DepressionData, value: string) => {
        const newData = { ...depresionData, [field]: value };
        setDepresionData(newData);
        evaluateDepresion(newData);
    };

    const evaluateDepresion = (data: DepressionData) => {
        const respuestasPositivas = Object.values(data).filter(v => v === 'si').length;
        
        if (Object.values(data).some(v => v === null)) {
            setDepresionResult(null);
            return;
        }
        if (respuestasPositivas >= 2) {
            setDepresionResult('Resultado: Posible depresión (recomendable evaluación adicional)');
            console.log('las respuestas positivas son: ', respuestasPositivas);
        } else {
            setDepresionResult('Resultado: Sin indicios significativos de depresión');
            console.log('las respuestas positivas son: ', respuestasPositivas);
        }
    };

    return {
        depresionData,
        depresionResult,
        handleDepresionChange
    };
};