export const preguntas = [
  { key: "cheques", texto: "Manejar su propio dinero" },
  { key: "preparacion_comidas", texto: "Calentar agua para café o té y apagar la cocina" },
  { key: "medicamentos", texto: "Manejar sus propios medicamentos" },
  { key: "soledad", texto: "Quedarse solo en la casa sin problemas" },
  { key: "comprension", texto: "Mantenerse al tanto de los acontecimientos y de lo que pasa en el país" },
  { key: "compras", texto: "Hacer compras" },
  { key: "pasear", texto: "Andar por el vecindario y encontrar el camino de vuelta a casa" },
];

export const opciones = [
  { label: "Si es capaz o podría hacerlo", valor: 0 },
  { label: "Con alguna dificultad", valor: 1 },
  { label: "Necesita ayuda", valor: 2 },
  { label: "No es capaz", valor: 3 },
];

export const actividades = [
    {
      nombre: "Comer",
      key: "comer",
      opciones: [
        { descripcion: "Incapaz", valor: 0 },
        { descripcion: "Necesita ayuda para contar, extender mantequilla, usar condimentos, etc.", valor: 5 },
        { descripcion: "Independiente (la comida está al alcance de la mano)", valor: 10 }
      ]
    },
    {
      nombre: "Trasladarse entre la silla y la cama",
      key: "trasladarse",
      opciones: [
        { descripcion: "Incapaz, no se mantiene sentado", valor: 0 },
        { descripcion: "Necesita ayuda importante (1 persona entrenada o dos)", valor: 5 },
        { descripcion: "Necesita algo de ayuda (pequeña ayuda física o verbal)", valor: 10 },
        { descripcion: "Independiente", valor: 15 }
      ]
    },
    {
      nombre: "Aseo personal",
      key: "aseo",
      opciones: [
        { descripcion: "Necesita ayuda con el aseo personal", valor: 0 },
        { descripcion: "Independiente para lavarse la cara, las manos, dientes, peinarse y afeitarse", valor: 5 }
      ]
    },
    {
      nombre: "Uso del retrete",
      key: "retrete",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita alguna ayuda, pero puede hacer algo solo", valor: 5 },
        { descripcion: "Independiente (entrar, salir, limpiarse y vestirse)", valor: 10 }
      ]
    },
    {
      nombre: "Bañarse o Ducharse",
      key: "banarse",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Independiente para bañarse o ducharse", valor: 5 }
      ]
    },
    {
      nombre: "Desplazarse",
      key: "desplazarse",
      opciones: [
        { descripcion: "Inmóvil", valor: 0 },
        { descripcion: "Independiente en silla de ruedas en 50 m", valor: 5 },
        { descripcion: "Anda con pequeña ayuda de una persona (física o verbal)", valor: 10 },
        { descripcion: "Independiente al menos 50 m, con cualquier tipo de muleta (excepto andador)", valor: 15 }
      ]
    },
    {
      nombre: "Subir y bajar escaleras",
      key: "escaleras",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita ayuda, pero puede hacer la mitad aproximadamente sin ayuda", valor: 5 },
        { descripcion: "Independiente para subir y bajar", valor: 10 }
      ]
    },
    {
      nombre: "Vestirse y desvestirse",
      key: "vestirse",
      opciones: [
        { descripcion: "Dependiente", valor: 0 },
        { descripcion: "Necesita ayuda, pero puede hacer la mitad aproximadamente sin ayuda", valor: 5 },
        { descripcion: "Independiente (incluyendo botones, cremalleras, cordones, etc.)", valor: 10 }
      ]
    },
    {
      nombre: "Control de heces",
      key: "heces",
      opciones: [
        { descripcion: "Incontinente (o necesita que le suministren enema)", valor: 0 },
        { descripcion: "Accidente excepcional (uno/semana)", valor: 5 },
        { descripcion: "Continente", valor: 10 }
      ]
    },
    {
      nombre: "Control de orina",
      key: "orina",
      opciones: [
        { descripcion: "Incontinente, o sondado incapaz de cambiarse la bolsa", valor: 0 },
        { descripcion: "Accidente excepcional (máximo uno/24 horas)", valor: 5 },
        { descripcion: "Continente, durante al menos 7 días", valor: 10 }
      ]
    }
  ] as const;