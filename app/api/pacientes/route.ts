import { NextResponse } from "next/server";
import { createPatient, getPatients } from "../../lib/pacienteService";

export async function GET() {
  const patients = await getPatients();
  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  const { id, ...data } = await req.json();
  await createPatient(id, data);
  return NextResponse.json({ message: "Patient created" }, { status: 201 });
}