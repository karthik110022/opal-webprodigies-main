'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FakeCheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      // No session ID, redirect to error
      router.push('/payment?cancel=true')
      return
    }

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Redirect to payment success page
          const host = process.env.NEXT_PUBLIC_HOST_URL || window.location.origin
          window.location.href = `${host}/payment?session_id=${sessionId}`
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Stripe-like Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
            DEMO CHECKOUT
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Processing Payment</h1>
          <p className="text-gray-600 mt-2">Please wait while we process your upgrade...</p>
        </div>

        {/* Animated Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">{countdown}</span>
            </div>
          </div>
        </div>

        {/* Fake Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Plan</span>
            <span className="font-semibold text-gray-800">Opal PRO</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Billing</span>
            <span className="font-semibold text-gray-800">Monthly</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total</span>
            <span className="font-bold text-gray-900 text-lg">$99.00</span>
          </div>
        </div>

        {/* Payment Method (Fake) */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300">Payment Method</p>
              <p className="font-mono text-sm mt-1">•••• •••• •••• 4242</p>
            </div>
            <div className="text-xl">💳</div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Payment verification in progress...
          </div>
          <div className="flex items-center text-sm text-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Securing transaction...
          </div>
          <div className="flex items-center text-sm text-green-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Upgrading your account...
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800 text-center">
            <strong>🎭 Demo Mode:</strong> This is a simulated payment. No real transaction is being processed.
          </p>
        </div>

        {/* Redirecting message */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
      </div>
    </div>
  )
}
