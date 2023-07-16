import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('http://localhost:8899/get-schedule', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return NextResponse.json(data)
}