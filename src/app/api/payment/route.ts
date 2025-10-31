import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// DUMMY/MOCK STRIPE - No real Stripe needed!
export async function GET() {
  console.log('💳 Payment API hit - DUMMY MODE (no real Stripe)')

  const user = await currentUser()
  if (!user) return NextResponse.json({ status: 404 })

  // Generate fake session ID
  const fakeSessionId = `cs_demo_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Generate fake customer ID
  const fakeCustomerId = `cus_demo_${user.id}`

  // SKIP fake checkout page - go directly to payment success page
  const successUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/payment?session_id=${fakeSessionId}`

  console.log('✅ Fake session created:', fakeSessionId)
  console.log('✅ Redirecting directly to success page (no fake checkout)')

  return NextResponse.json({
    status: 200,
    session_url: successUrl, // Direct to payment success page
    customer_id: fakeCustomerId,
    session_id: fakeSessionId,
  })
}
