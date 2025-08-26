// src/pages/Login.jsx
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export default function Login() {
  return (
    <div className="container py-12 max-w-md mx-auto">
      <Auth 
        supabaseClient={supabase} 
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={window.location.origin + '/client'}
      />
    </div>
  )
}
