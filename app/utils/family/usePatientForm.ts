import { useState } from "react";
import dayjs from "dayjs";
import { GijonScores, GijonCategory } from "../../interfaces";

export const usePatientForm = () => {
  const [scores, setScores] = useState<GijonScores>({
    family: 0,
    economic: 0,
    housing: 0,
    social: 0,
    support: 0,
  });

  const handleScoreChange = (category: keyof GijonScores, value: number) => {
    setScores((prev: any) => ({
      ...prev,
      [category]: value,
    }));
  };

  const getTotalScore = (): number => {
    return Object.values(scores).reduce((acc, curr) => acc + curr, 0);
  };

  const updateBirthDate = (form: any) => {
    const day = form.getFieldValue('birthDay');
    const month = form.getFieldValue('birthMonth');
    const year = form.getFieldValue('birthYear');

    if (day && month && year) {
      try {
        const formattedDate = `${day.toString().padStart(2, '0')}/${month}/${year}`;
        const birthDate = dayjs(formattedDate, 'DD/MM/YYYY');
        const today = dayjs();
        const calculatedAge = today.diff(birthDate, 'year');
        form.setFieldsValue({
          birthDate: formattedDate,
          age: calculatedAge
        });
      } catch (error) {
        console.error("Invalid birth date:", error);
      }
    }
  };

  const gijonCategories: GijonCategory[] = [
    {
      key: "family",
      title: "Situación Familiar",
      options: [
        "1 - Vive con familia, sin conflicto familiar",
        "2 - Vive con familia y presenta algún tipo de dependencia física/psíquica",
        "3 - Vive con cónyuge de similar edad",
        "4 - Vive solo y tiene hijos próximos",
        "5 - Vive solo y carece de hijos o viven alejados",
      ],
    },
    {
      key: "economic",
      title: "Situación Económica",
      options: [
        "1 - Dos veces el salario mínimo vital",
        "2 - 1 + 1/2 veces el salario mínimo vital",
        "3 - Un salario mínimo vital",
        "4 - Sin pensión",
        "5 - Sin otros ingresos"
      ],
    },
    {
      key: "housing",
      title: "Vivienda",
      options: [
        "1 - Adecuada a necesidades",
        "2 - Barreras arquitectónicas: peldaños, puertas estrechas, daños",
        "3 - Mala higiene, baño incompleto, ausencia de agua caliente, calefacción",
        "4 - Ausencia de ascensor, teléfono",
        "5 - Vivienda inadecuada (esteras, ruinas, no equipos mínimos)"
      ],
    },
    {
      key: "social",
      title: "Relaciones Sociales",
      options: [
        "1 - Buenas relaciones sociales",
        "2 - Relación social solo con familia y vecinos",
        "3 - Relación social solo con familia",
        "4 - No sale del domicilio, recibe familia",
        "5 - No sale y no recibe visitas"
      ],
    },
    {
      key: "support",
      title: "Apoyo a la Red Social",
      options: [
        "1 - No necesita apoyo",
        "2 - Con apoyo familiar o vecinal",
        "3 - Voluntariado social, ayuda domiciliaria",
        "4 - Pendiente de ingreso a residencia geriátrica",
        "5 - Necesita cuidados permanentes"
      ],
    },
  ];

  return {
    scores,
    handleScoreChange,
    getTotalScore,
    updateBirthDate,
    gijonCategories,
    // Aliases for backward compatibility during refactoring
    puntajes: scores,
    obtenerPuntajeTotal: getTotalScore,
  };
};