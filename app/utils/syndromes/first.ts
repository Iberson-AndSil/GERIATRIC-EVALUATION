import { OptionType, SarcopeniaQuestion, SarcopeniaResponses } from "@/app/type";

export const sarcopeniaQuestions: SarcopeniaQuestion[] = [
    {
        key: "liftingWeight",
        text: "¿Qué dificultad encuentra en levantar 4.5 kg?",
        options: [
            { label: "Ninguna", value: 0 },
            { label: "Alguna", value: 1 },
            { label: "Mucha o Incapaz", value: 2 }
        ]
    },
    {
        key: "crossingRoom",
        text: "¿Qué dificultad encuentra en cruzar una habitación?",
        options: [
            { label: "Ninguna", value: 0 },
            { label: "Alguna", value: 1 },
            { label: "Mucha o Incapaz", value: 2 }
        ]
    },
    {
        key: "transferring",
        text: "¿Qué dificultad encuentra para trasladarse desde una silla/cama?",
        options: [
            { label: "Ninguna", value: 0 },
            { label: "Alguna", value: 1 },
            { label: "Mucha o Incapaz", value: 2 }
        ]
    },
    {
        key: "climbingStairs",
        text: "¿Qué dificultad encuentra en subir un tramo de diez escalones?",
        options: [
            { label: "Ninguna", value: 0 },
            { label: "Alguna", value: 1 },
            { label: "Mucha o Incapaz", value: 2 }
        ]
    },
    {
        key: "falls",
        text: "¿Cuántas veces se ha caído en el pasado año?",
        options: [
            { label: "Ninguna", value: 0 },
            { label: "1 a 3", value: 1 },
            { label: "≥4", value: 2 }
        ]
    }
];

export const frequencyOptions: OptionType[] = [
    { label: "Nunca", value: 0 },
    { label: "Una vez a la semana", value: 1 },
    { label: "2-3 veces a la semana", value: 2 },
    { label: "Una vez al día", value: 3 },
    { label: "Varias veces al día", value: 4 },
    { label: "Continuamente", value: 5 }
];

export const amountOptions: OptionType[] = [
    { label: "No se me escapa nada", value: 0 },
    { label: "Muy poca cantidad", value: 1 },
    { label: "Una cantidad moderada", value: 2 },
    { label: "Mucha cantidad", value: 3 }
];

export const situationOptions = [
    "Antes de llegar al servicio",
    "Al toser o estornudar",
    "Mientras duerme",
    "Al realizar esfuerzos físicos/ejercicios",
    "Cuando termina de orinar y ya se ha vestido",
    "Sin motivo evidente",
    "De forma continua"
];

export const calculateSarcopeniaScore = (responses: SarcopeniaResponses): number => {
    return Object.values(responses).reduce((acc, curr) => acc + (curr || 0), 0);
};

export const interpretSarcopenia = (score: number): string => {
    return score < 4 ? "Bajo riesgo de sarcopenia" : "Alto riesgo de sarcopenia (≥4 puntos)";
};

export const interpretICIQ = (puntaje: number) => {
    if (puntaje <= 5) return "Incontinencia leve";
    if (puntaje <= 12) return "Incontinencia moderada";
    if (puntaje <= 18) return "Incontinencia severa";
    return "Incontinencia muy severa";
};