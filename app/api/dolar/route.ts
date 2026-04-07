import { NextResponse } from 'next/server'

const CACHE_DURATION = 60 * 60 // 1 hour in seconds

let cache: {
  data: unknown
  timestamp: number
} | null = null

export async function GET() {
  const now = Date.now()

  if (cache && now - cache.timestamp < CACHE_DURATION * 1000) {
    return NextResponse.json(cache.data, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'X-Cache': 'HIT',
      },
    })
  }

  try {
    const response = await fetch('https://dolarapi.com/v1/dolares', {
      next: { revalidate: CACHE_DURATION },
    })

    if (!response.ok) {
      throw new Error(`DolarAPI responded with ${response.status}`)
    }

    const dolares = await response.json()

    const data = {
      dolares,
      lastUpdate: new Date().toISOString(),
    }

    cache = { data, timestamp: now }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    console.error('Error fetching dolar data:', error)

    // Return stale cache if available
    if (cache) {
      return NextResponse.json(
        { ...(cache.data as Record<string, unknown>), stale: true },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'No se pudo obtener los datos del dólar' },
      { status: 503 }
    )
  }
}
