export const preguntas = [
  { key: "finances", texto: "Manejar su propio dinero" },
  { key: "mealPreparation", texto: "Calentar agua para café o té y apagar la cocina" },
  { key: "medications", texto: "Manejar sus propios medicamentos" },
  { key: "stayingAlone", texto: "Quedarse solo en la casa sin problemas" },
  { key: "currentEvents", texto: "Mantenerse al tanto de los acontecimientos y de lo que pasa en el país" },
  { key: "shopping", texto: "Hacer compras" },
  { key: "neighborhood", texto: "Andar por el vecindario y encontrar el camino de vuelta a casa" },
] as const;

export const opciones = [
  { label: "Si es capaz o podría hacerlo", valor: 0 },
  { label: "Con alguna dificultad", valor: 1 },
  { label: "Necesita ayuda", valor: 2 },
  { label: "No es capaz", valor: 3 },
] as const;

export const actividades = [
    {
      nombre: "Comer",
      key: "eat",
      opciones: [
        { descripcion: "Incapaz", valor: 0 },
        { descripcion: "Necesita ayuda para contar, extender mantequilla, usar condimentos, etc.", valor: 5 },
        { descripcion: "Independiente (la comida está al alcance de la mano)", valor: 10 }
      ]
    },
    {
      nombre: "Trasladarse entre la silla y la cama",
      key: "transfer",
      opciones: [
        { descripcion: "Incapaz, no se mantiene sentado", valor: 0 },
        { descripcion: "Necesita ayuda importante (1 persona entrenada o dos)", valor: 5 },
        { descripcion: "Necesita algo de ayuda (pequeña ayuda física o verbal)", valor: 10 },
        { descripcion: "Independiente", valor: 15 }
      ]
    },
    {
      nombre: "Aseo personal",
      key: "grooming",
      opciones: [
        { descripcion: "Necesita ayuda con el aseo personal", valor: 0 },
        { descripcion: "Independiente para lavarse la cara, las manos, dientes, peinarse y afeitarse", valor: 5 }
      ]
    },
    {
      nombre: "Uso del retrete",
      key: "toilet",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita alguna ayuda, pero puede hacer algo solo", valor: 5 },
        { descripcion: "Independiente (entrar, salir, limpiarse y vestirse)", valor: 10 }
      ]
    },
    {
      nombre: "Bañarse o Ducharse",
      key: "bathing",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Independiente para bañarse o ducharse", valor: 5 }
      ]
    },
    {
      nombre: "Desplazarse",
      key: "walking",
      opciones: [
        { descripcion: "Inmóvil", valor: 0 },
        { descripcion: "Independiente en silla de ruedas en 50 m", valor: 5 },
        { descripcion: "Anda con pequeña ayuda de una persona (física o verbal)", valor: 10 },
        { descripcion: "Independiente al menos 50 m, con cualquier tipo de muleta (excepto andador)", valor: 15 }
      ]
    },
    {
      nombre: "Subir y bajar escaleras",
      key: "stairs",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita ayuda, pero puede hacer la mitad aproximadamente sin ayuda", valor: 5 },
        { descripcion: "Independiente para subir y bajar", valor: 10 }
      ]
    },
    {
      nombre: "Vestirse y desvestirse",
      key: "dressing",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita ayuda, pero puede hacer la mitad aproximadamente sin ayuda", valor: 5 },
        { descripcion: "Independiente (incluyendo botones, cremalleras, cordones, etc.)", valor: 10 }
      ]
    },
    {
      nombre: "Control de heces",
      key: "bowels",
      opciones: [
        { descripcion: "Incontinente (o necesita que le suministren enema)", valor: 0 },
        { descripcion: "Accidente excepcional (uno/semana)", valor: 5 },
        { descripcion: "Continente", valor: 10 }
      ]
    },
    {
      nombre: "Control de orina",
      key: "bladder",
      opciones: [
        { descripcion: "Incontinente, o sondado incapaz de cambiarse la bolsa", valor: 0 },
        { descripcion: "Accidente excepcional (máximo uno/24 horas)", valor: 5 },
        { descripcion: "Continente, durante al menos 7 días", valor: 10 }
      ]
    }
  ] as const;