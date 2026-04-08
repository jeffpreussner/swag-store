import { NextResponse } from 'next/server'
 
export async function POST(request: Request) {
  try {
    const vitals = await request.json()
 
    // Log to your analytics system (e.g., database, external service)
    console.log('Core Web Vitals:', vitals)
 
    // Store in database or forward to analytics service
    // await db.vitals.create({ data: vitals })
 
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record vitals' }, { status: 500 })
  }
}