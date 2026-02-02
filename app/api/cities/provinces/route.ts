import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const department = searchParams.get('department')

  if (!department) {
    return NextResponse.json(
      { error: 'department is required' },
      { status: 400 }
    )
  }

  const res = await fetch('https://free.e-api.net.pe/ubigeos.json', {
    cache: 'no-store'
  })

  const data = await res.json()

  const provinces = Object.keys(data[department] || {})

  return NextResponse.json(provinces)
}
