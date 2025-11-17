'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }

  console.log('Signup attempt with email:', data.email)

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message)
    redirect('/auth/signup?error=' + encodeURIComponent(error.message))
  }

  console.log('Signup successful - check your email for confirmation')
  redirect('/auth/signup?success=true')
}
