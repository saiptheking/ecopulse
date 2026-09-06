// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/SignupPage.tsx — THE SIGNUP PAGE
// ═══════════════════════════════════════════════════════════════════════════
// Mirror of LoginPage: Wasp's `<SignupForm />` handles email+password,
// then the auto-generated backend creates Auth → User rows using the
// userSignupFields you configured (see src/auth/userSignupFields.ts — that's
// where isAdmin/isOfficer get set).
//
// NOTE: with SKIP_EMAIL_VERIFICATION_IN_DEV=true in .env.server, signup
// succeeds immediately in dev (no email needed). In production the user gets
// a verification link first.
//
// ECO PULSE: keep as-is. Later you can add an "I'm an officer" toggle or
// collect a display name by building a custom signup form (same approach as
// LoginPage's customization).
// ═══════════════════════════════════════════════════════════════════════════
import { login, signup } from 'wasp/client/auth'

import { useState } from 'react'
import { useNavigate } from 'react-router'

export function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    try {
      await signup({ 
        email, 
        password, 
        name,
        grade,
        username: email, // username column = the email (simplest approach)
        isAdmin: false, // power users by env var (see src/auth/userSignupFields.ts) 
      })
      navigate('/')
    } catch (error: unknown) {
      setError(error as Error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>Error: {error.message}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="number"
        value={grade}
        onChange={(e) => setGrade(parseInt(e.target.value))}
        placeholder="Grade"
        required
      />
      <input
        type="text"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      
      <button type="submit">Sign Up</button>
    </form>
  )
}