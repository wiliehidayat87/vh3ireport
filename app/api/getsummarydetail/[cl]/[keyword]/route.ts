import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { cl: any, keyword: any } }
) {
console.log(`cek data : ` + params.cl)
  const res = await fetch(`http://52.57.27.221:8899/get-summary-detail/${params.cl}/${params.keyword}`, {
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