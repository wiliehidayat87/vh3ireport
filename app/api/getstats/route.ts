import { NextResponse } from 'next/server'
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('http://52.57.27.221:8899/stats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  return NextResponse.json(data)
}