import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://free.e-api.net.pe/ubigeos.json', {
    cache: 'no-store'
  })
  const data = await res.json()
  const departments = Object.keys(data)

  return NextResponse.json(departments)
}
