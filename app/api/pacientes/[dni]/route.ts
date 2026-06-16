import { NextResponse } from 'next/server';
import { deletePatient, getPatientById, updatePatient } from '@/app/lib/pacienteService';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ dni: string }> }) {
  const { dni } = await context.params;
  try {
    const patient = await getPatientById(dni);
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ dni: string }> }) {
  try {
    const { dni } = await context.params;
    const body = await request.json();

    await updatePatient(dni, body);
    return NextResponse.json({ message: 'Patient updated' });
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ dni: string }> }) {
  const { dni } = await context.params;
  try {
    await deletePatient(dni);
    return NextResponse.json({ message: "Patient deleted" });
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json(
      { error: "Error deleting patient" },
      { status: 500 }
    );
  }
}
