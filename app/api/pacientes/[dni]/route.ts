import { NextResponse } from 'next/server';
import { eliminarPaciente, obtenerPacientePorId, actualizarPaciente } from '@/app/lib/pacienteService';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ dni: string }> }) {
  const { dni } = await context.params;
  try {
    const paciente = await obtenerPacientePorId(dni);
    return NextResponse.json(paciente);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ dni: string }> }) {
  try {
    const { dni } = await context.params;
    const body = await request.json();

    await actualizarPaciente(dni, body);
    return NextResponse.json({ message: 'Paciente actualizado' });
  } catch (error) {
    console.error("Error en PUT:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ dni: string }> }) {
  const { dni } = await context.params;
  try {
    await eliminarPaciente(dni);
    return NextResponse.json({ message: "Paciente eliminado" });
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error eliminando paciente" },
      { status: 500 }
    );
  }
}
