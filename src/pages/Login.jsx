// src/pages/Login.jsx
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [useFallback, setUseFallback] = useState(false)
  const { signIn, signUp } = useUser()
  const navigate = useNavigate()

  // Fallback form state
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if Supabase is properly configured
    try {
      const url = import.meta.env.VITE_SUPABASE_URL
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!url || !key) {
        setError('Missing Supabase environment variables. Please check your .env file.')
      } else {
        setError(null)
      }
    } catch (err) {
      setError('Failed to load Supabase configuration: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleFallbackSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setAuthError('')

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password)
        if (error) throw error
        setAuthError('Check your email for the confirmation link!')
      } else {
        const { data, error } = await signIn(email, password)
        if (error) throw error
        navigate('/client')
      }
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Configuration Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="text-sm text-red-600">
              <p>Please ensure your .env file contains:</p>
              <pre className="mt-2 bg-red-100 p-2 rounded text-xs">
                VITE_SUPABASE_URL=your_supabase_project_url<br/>
                VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (useFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="QiAlly" className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <form onSubmit={handleFallbackSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {authError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-700">{authError}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Loading...' : (isSignUp ? 'Create account' : 'Sign in')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setAuthError('')
                }}
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="QiAlly" className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Sign in to QiAlly</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Auth 
            supabaseClient={supabase} 
            appearance={{ 
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#1d4ed8',
                  }
                }
              }
            }}
            providers={[]}
            redirectTo={window.location.origin + '/client'}
            showLinks={true}
            view="sign_in"
            onError={(error) => {
              console.error('Auth UI Error:', error)
              setAuthError(error.message)
            }}
          />
          
          {authError && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700 mb-2">{authError}</div>
              <button
                onClick={() => setUseFallback(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Use alternative login form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
