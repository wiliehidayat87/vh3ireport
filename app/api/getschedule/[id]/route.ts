import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { id: any } }
) {
console.log(`cek data : ` + params.id)
  const res = await fetch(`http://localhost:8899/get-schedule/${params.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': '*',
    },
  })

  const data = await res.json()

  const filters = JSON.stringify(data);
  
  console.info(`result : ` + filters)
  return NextResponse.json(data)
}