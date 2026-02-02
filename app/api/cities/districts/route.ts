import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const department = searchParams.get('department')
  const province = searchParams.get('province')

  if (!department || !province) {
    return NextResponse.json(
      { error: 'department and province are required' },
      { status: 400 }
    )
  }

  const res = await fetch('https://free.e-api.net.pe/ubigeos.json', {
    cache: 'no-store'
  })

  const data = await res.json()

  const districts = Object.keys(
    data[department]?.[province] || {}
  )

  return NextResponse.json(districts)
}
