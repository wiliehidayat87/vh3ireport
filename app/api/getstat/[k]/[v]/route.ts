import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { k: any, v: any } }
) {

  const res = await fetch(`http://52.57.27.221:8899/get-stat/${params.k}/${params.v}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return NextResponse.json(data)
}