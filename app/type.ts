export type PuntajesType = {
    comer: number | null;
    trasladarse: number | null;
    aseo: number | null;
    retrete: number | null;
    banarse: number | null;
    desplazarse: number | null;
    escaleras: number | null;
    vestirse: number | null;
    heces: number | null;
    orina: number | null;
};

export type RespuestasType = {
    [key: string]: number | null;
};

export type OpcionType = {
    label: string;
    valor: number;
};

export type ActividadType = {
    nombre: string;
    key: string;
    opciones: {
        descripcion: string;
        valor: number;
    }[];
};

export type PreguntaType = {
    key: string;
    texto: string;
};