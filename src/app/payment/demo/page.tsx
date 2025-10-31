'use client'

import { demoUpgradeToPro, demoDowngradeToFree, getPaymentInfo } from '@/actions/user'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DemoPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [currentPlan, setCurrentPlan] = useState<'FREE' | 'PRO' | null>(null)

  useEffect(() => {
    // Load current subscription status
    const loadPlan = async () => {
      const result = await getPaymentInfo()
      if (result.status === 200 && result.data) {
        setCurrentPlan(result.data.subscription?.plan || 'FREE')
      }
    }
    loadPlan()
  }, [])

  const handleUpgrade = async () => {
    setLoading(true)
    setMessage('')

    try {
      const result = await demoUpgradeToPro()

      if (result.status === 200) {
        setMessage('✅ Successfully upgraded to PRO! (Demo Mode)')
        setCurrentPlan('PRO')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      } else {
        setMessage('❌ Upgrade failed: ' + result.message)
      }
    } catch (error) {
      setMessage('❌ Error occurred during upgrade')
    } finally {
      setLoading(false)
    }
  }

  const handleDowngrade = async () => {
    setLoading(true)
    setMessage('')

    try {
      const result = await demoDowngradeToFree()

      if (result.status === 200) {
        setMessage('✅ Successfully downgraded to FREE! (Demo Mode)')
        setCurrentPlan('FREE')
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 2000)
      } else {
        setMessage('❌ Downgrade failed: ' + result.message)
      }
    } catch (error) {
      setMessage('❌ Error occurred during downgrade')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Demo Payment System
          </h1>
          <p className="text-gray-300">
            Test PRO features without real payment
          </p>
        </div>

        {/* Current Plan Badge */}
        <div className="flex justify-center mb-8">
          <div className={`px-6 py-2 rounded-full font-semibold text-sm ${
            currentPlan === 'PRO'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
              : 'bg-gray-700 text-white'
          }`}>
            Current Plan: {currentPlan || 'Loading...'}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            message.includes('✅')
              ? 'bg-green-500/20 text-green-300 border border-green-500/50'
              : 'bg-red-500/20 text-red-300 border border-red-500/50'
          }`}>
            {message}
          </div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* FREE Plan */}
          <div className="bg-gray-800/50 rounded-xl p-6 border-2 border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-2">FREE</h3>
            <p className="text-gray-400 mb-4">Basic features</p>
            <ul className="space-y-2 mb-6 text-gray-300">
              <li>✓ 5 videos per month</li>
              <li>✓ Basic workspaces</li>
              <li>✓ Standard support</li>
            </ul>
            {currentPlan === 'FREE' ? (
              <button
                disabled
                className="w-full py-3 px-4 bg-gray-600 text-gray-300 rounded-lg font-semibold cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={handleDowngrade}
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Switch to FREE'}
              </button>
            )}
          </div>

          {/* PRO Plan */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border-2 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-white">PRO</h3>
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                POPULAR
              </span>
            </div>
            <p className="text-gray-300 mb-4">All features unlocked</p>
            <ul className="space-y-2 mb-6 text-gray-200">
              <li>✓ Unlimited videos</li>
              <li>✓ AI transcription</li>
              <li>✓ Advanced workspaces</li>
              <li>✓ Priority support</li>
              <li>✓ Custom branding</li>
            </ul>
            {currentPlan === 'PRO' ? (
              <button
                disabled
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-semibold cursor-not-allowed"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Processing...' : 'Upgrade to PRO (Demo)'}
              </button>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
          <p className="text-blue-300 text-sm">
            <strong>Demo Mode:</strong> This is a simulated payment system. No real payment is processed.
            Switch between plans instantly for testing!
          </p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full py-2 px-4 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}
