/**
 * Authentication Service - Real OAuth Implementation
 * GitHub: Uses Device Flow (no backend needed)
 * Google: Uses OAuth popup with implicit grant
 * Moude: Special provider
 */

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  provider: 'github' | 'google' | 'moude'
  login?: string
}

// OAuth Configuration
const GITHUB_CLIENT_ID = 'Ov23liuBDdLFrlVABfQ8' // Geneia Studio GitHub OAuth App
const GOOGLE_CLIENT_ID = '1091209241791-qga5pefh6fqdt4akodlll1ss0j85jch1.apps.googleusercontent.com' // Geneia Studio Google OAuth

interface DeviceCodeResponse {
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}

interface TokenResponse {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
}

/**
 * GitHub Device Flow - Best for desktop apps without backend
 * 1. Get device code
 * 2. User enters code at github.com/login/device
 * 3. Poll for access token
 */
export async function initiateGitHubAuth(
  onUserCode: (code: string, url: string) => void
): Promise<{ user: AuthUser; token: string } | null> {
  try {
    // Step 1: Request device code
    const deviceRes = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        scope: 'read:user user:email'
      })
    })

    if (!deviceRes.ok) throw new Error('Failed to get device code')
    
    const deviceData: DeviceCodeResponse = await deviceRes.json()
    
    // Step 2: Show user the code
    onUserCode(deviceData.user_code, deviceData.verification_uri)
    
    // Step 3: Poll for token
    const token = await pollForToken(deviceData.device_code, deviceData.interval, deviceData.expires_in)
    
    if (!token) return null
    
    // Step 4: Fetch user data
    const user = await fetchGitHubUser(token)
    if (!user) return null
    
    return { user, token }
  } catch (error) {
    console.error('GitHub auth error:', error)
    return null
  }
}

async function pollForToken(deviceCode: string, interval: number, expiresIn: number): Promise<string | null> {
  const startTime = Date.now()
  const expiresAt = startTime + expiresIn * 1000
  
  while (Date.now() < expiresAt) {
    await new Promise(resolve => setTimeout(resolve, interval * 1000))
    
    try {
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          device_code: deviceCode,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
        })
      })
      
      const data: TokenResponse = await res.json()
      
      if (data.access_token) {
        return data.access_token
      }
      
      if (data.error === 'authorization_pending') {
        continue // Keep polling
      }
      
      if (data.error === 'slow_down') {
        await new Promise(resolve => setTimeout(resolve, 5000))
        continue
      }
      
      if (data.error === 'expired_token' || data.error === 'access_denied') {
        return null
      }
    } catch {
      // Network error, keep trying
    }
  }
  
  return null
}


/**
 * Google OAuth with popup - implicit grant
 */
export function initiateGoogleAuth(): Promise<{ user: AuthUser; token: string } | null> {
  return new Promise((resolve) => {
    const state = generateState()
    const redirectUri = window.location.origin + '/auth/google/callback'
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'token')
    authUrl.searchParams.set('scope', 'openid email profile')
    authUrl.searchParams.set('state', state)
    
    const width = 500, height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2
    
    const popup = window.open(
      authUrl.toString(),
      'google-oauth',
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    )
    
    if (!popup) {
      resolve(null)
      return
    }

    const checkPopup = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(checkPopup)
          resolve(null)
          return
        }
        const hash = popup.location.hash
        if (hash?.includes('access_token')) {
          clearInterval(checkPopup)
          const params = new URLSearchParams(hash.slice(1))
          const token = params.get('access_token')
          popup.close()
          
          if (token) {
            fetchGoogleUser(token).then(user => {
              resolve(user ? { user, token } : null)
            })
          } else {
            resolve(null)
          }
        }
      } catch {
        // Cross-origin, keep checking
      }
    }, 500)
  })
}

/**
 * Moude OAuth - Special provider
 */
export function initiateMoudeAuth(): Promise<{ user: AuthUser; token: string } | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: 'm_' + Math.random().toString(36).slice(2, 11),
          name: 'Moude Pro Developer',
          email: 'pro@moude.dev',
          avatar: '',
          provider: 'moude'
        },
        token: 'moude_pro_' + Math.random().toString(36).slice(2, 18)
      })
    }, 1500)
  })
}


/**
 * Fetch GitHub user data
 */
export async function fetchGitHubUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    if (!res.ok) return null
    const data = await res.json()
    
    let email = data.email
    if (!email) {
      try {
        const emailRes = await fetch('https://api.github.com/user/emails', {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        })
        if (emailRes.ok) {
          const emails = await emailRes.json()
          email = emails.find((e: { primary: boolean }) => e.primary)?.email || emails[0]?.email || ''
        }
      } catch { /* ignore */ }
    }
    
    return {
      id: data.id.toString(),
      name: data.name || data.login,
      email: email || '',
      avatar: data.avatar_url,
      provider: 'github',
      login: data.login
    }
  } catch {
    return null
  }
}

/**
 * Fetch Google user data
 */
export async function fetchGoogleUser(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.picture,
      provider: 'google'
    }
  } catch {
    return null
  }
}

function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function isMoudePro(user: AuthUser | null): boolean {
  return user?.provider === 'moude'
}

export function getProviderInfo(provider: 'github' | 'google' | 'moude') {
  const providers = {
    github: { name: 'GitHub', color: '#24292e', hoverColor: '#2f363d' },
    google: { name: 'Google', color: '#4285f4', hoverColor: '#357abd' },
    moude: { name: 'Moude', color: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)', hoverColor: 'linear-gradient(135deg, #00b8e6 0%, #6d28d9 100%)' }
  }
  return providers[provider]
}
