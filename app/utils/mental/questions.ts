import { QuestionGroup } from '../../type';

export const questionGroups: QuestionGroup[] = [
  {
    title: "Estado de salud general",
    description: "Esta sección evalúa su percepción general sobre su salud.",
    questions: [
      {
        question: "1. En general, usted diría que su salud es:",
        options: ["Excelente", "Muy buena", "Buena", "Regular", "Mala"],
        type: "radio",
        scores: [5, 4, 3, 2, 1]
      }
    ]
  },
  {
    title: "Limitaciones físicas",
    description: "Las siguientes preguntas se refieren a actividades o cosas que usted podría hacer en un día normal. Su salud actual, ¿Le limita para hacer esas actividades o cosas? Si es así, ¿Cuánto?",
    questions: [
      {
        question: "2. Esfuerzos moderados, como mover una mesa, pasar la aspiradora, jugar a los bolos o caminar más de una hora.",
        options: ["Sí, me limita mucho", "Sí, me limita un poco", "No, no me limita nada"],
        type: "radio",
        scores: [1, 2, 3]
      },
      {
        question: "3. Subir varios pisos por la escalera.",
        options: ["Sí, me limita mucho", "Sí, me limita un poco", "No, no me limita nada"],
        type: "radio",
        scores: [1, 2, 3]
      }
    ]
  },
  {
    title: "Impacto en actividades (salud física)",
    description: "Durante las 4 últimas semanas, ¿Ha tenido alguno de los siguientes problemas en su trabajo o en sus actividades cotidianas, a causa de su salud física?",
    questions: [
      {
        question: "4. ¿Hizo menos de lo que hubiera querido hacer?",
        options: ["Sí", "No"],
        type: "radio",
        scores: [1, 2]
      },
      {
        question: "5. ¿Tuvo que dejar de hacer algunas tareas en su trabajo o en sus actividades cotidianas?",
        options: ["Sí", "No"],
        type: "radio",
        scores: [1, 2]
      }
    ]
  },
  {
    title: "Impacto emocional",
    description: "Durante las 4 últimas semanas, ¿Ha tenido algunos de los siguientes problemas en su trabajo o en sus actividades cotidianas, a causa de algún problema emocional (como estar triste, deprimido o nervioso)?",
    questions: [
      {
        question: "6. ¿Hizo menos de lo que hubiera querido hacer, a causa de algún problema emocional?",
        options: ["Sí", "No"],
        type: "radio",
        scores: [1, 2]
      },
      {
        question: "7. ¿No hizo su trabajo o sus actividades cotidianas tan cuidadosamente como de costumbre, a causa de algún problema emocional?",
        options: ["Sí", "No"],
        type: "radio",
        scores: [1, 2]
      },
      {
        question: "8. ¿Hasta qué punto el dolor le ha dificultado su trabajo habitual (incluido el trabajo fuera de casa y las tareas domésticas)?",
        options: ["Nada", "Un poco", "Regular", "Bastante", "Mucho"],
        type: "radio",
        scores: [5, 4, 3, 2, 1]
      }
    ]
  },
  {
    title: "Bienestar emocional",
    description: "Las preguntas que siguen se refieren a cómo se ha sentido y cómo le han ido las cosas durante las 4 últimas semanas. En cada pregunta responda lo que se parezca más a cómo se ha sentido usted. Durante las 4 últimas semanas ¿Cuánto tiempo...?",
    questions: [
      {
        question: "9. ¿Cuánto tiempo se sintió calmado y tranquilo?",
        options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
        type: "radio",
        scores: [6, 5, 4, 3, 2, 1]
      },
      {
        question: "10. ¿Cuánto tiempo tuvo mucha energía?",
        options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
        type: "radio",
        scores: [6, 5, 4, 3, 2, 1]
      },
      {
        question: "11. ¿Cuánto tiempo se sintió desanimado y triste?",
        options: ["Siempre", "Casi siempre", "Muchas veces", "Algunas veces", "Sólo alguna vez", "Nunca"],
        type: "radio",
        scores: [1, 2, 3, 4, 5, 6]
      }
    ]
  },
  {
    title: "Vida social",
    description: "Indique cómo su salud ha afectado sus relaciones sociales.",
    questions: [
      {
        question: "12. Durante las 4 últimas semanas, ¿con qué frecuencia la salud física o los problemas emocionales le han dificultado sus actividades sociales (como visitar a los amigos o familiares)?",
        options: ["Siempre", "Casi siempre", "Algunas veces", "Sólo alguna vez", "Nunca"],
        type: "radio",
        scores: [1, 2, 3, 4, 5]
      }
    ]
  }
];