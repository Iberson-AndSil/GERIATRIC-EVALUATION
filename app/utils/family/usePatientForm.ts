import { useState } from "react";
import dayjs from "dayjs";
import { GijonScores, GijonCategory } from "../../interfaces";

export const usePatientForm = () => {
  const [puntajes, setPuntajes] = useState<GijonScores>({
    familiar: 0,
    economica: 0,
    vivienda: 0,
    sociales: 0,
    apoyo: 0,
  });

  const handleScoreChange = (categoria: keyof GijonScores, valor: number) => {
    setPuntajes((prev:any) => ({
      ...prev,
      [categoria]: valor,
    }));
  };

  const obtenerPuntajeTotal = (): number => {
    return Object.values(puntajes).reduce((acc, curr) => acc + curr, 0);
  };

  const updateBirthDate = (form: any) => {
    const day = form.getFieldValue('birth_day');
    const month = form.getFieldValue('birth_month');
    const year = form.getFieldValue('birth_year');

    if (day && month && year) {
      try {
        const formattedDate = `${day.toString().padStart(2, '0')}/${month}/${year}`;
        const birthDate = dayjs(formattedDate, 'DD/MM/YYYY');
        const today = dayjs();
        const calculatedAge = today.diff(birthDate, 'year');
        form.setFieldsValue({
          fecha_nacimiento: formattedDate,
          edad: calculatedAge
        });
      } catch (error) {
        console.error("Fecha inválida", error);
      }
    }
  };

  const gijonCategories: GijonCategory[] = [
    {
      key: "familiar",
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
      key: "economica",
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
      key: "vivienda",
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
      key: "sociales",
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
      key: "apoyo",
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
    puntajes,
    handleScoreChange,
    obtenerPuntajeTotal,
    updateBirthDate,
    gijonCategories,
  };
};