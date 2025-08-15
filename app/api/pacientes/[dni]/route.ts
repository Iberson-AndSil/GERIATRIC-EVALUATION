import { NextResponse } from 'next/server';
import { eliminarPaciente, obtenerPacientePorId, actualizarPaciente } from '@/app/lib/pacienteService';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: { dni: string } }) {
  const { dni } = context.params;
  try {
    const paciente = await obtenerPacientePorId(dni);
    return NextResponse.json(paciente);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener paciente' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: { params: { dni: string } }) {
  try {
    const { dni } = context.params;
    const body = await request.json();
    
    await actualizarPaciente(dni, body);
    return NextResponse.json({ message: 'Paciente actualizado' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar paciente' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: { dni: string } }) {
  const { dni } = context.params;
  try {
    await eliminarPaciente(dni);
    return NextResponse.json({ message: 'Paciente eliminado' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar paciente' },
      { status: 500 }
    );
  }
}