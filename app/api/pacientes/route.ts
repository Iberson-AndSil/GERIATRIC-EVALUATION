import { NextResponse } from "next/server";
import { crearPaciente, obtenerPacientes } from "../../lib/pacienteService";

export async function GET() {
  const pacientes = await obtenerPacientes();
  return NextResponse.json(pacientes);
}

export async function POST(req: Request) {
  const { id, ...data } = await req.json();
  await crearPaciente(id, data);
  return NextResponse.json({ message: "Paciente creado" }, { status: 201 });
}