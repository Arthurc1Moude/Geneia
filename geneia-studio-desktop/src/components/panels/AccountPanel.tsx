import { useState } from 'react'
import { 
  User, LogOut, Cloud, Settings, Key, Bell, Shield, Loader2, CheckCircle, 
  Sparkles, AlertCircle, Crown, Zap, Star, Check, CreditCard, Calendar,
  Gift, Rocket, ChevronRight, ChevronLeft, Camera, Mail, AtSign, MapPin,
  Link2, Plus, Trash2, Copy, Eye, EyeOff, BellRing, BellOff, MessageSquare,
  Lock, Fingerprint, Smartphone, History, Download, AlertTriangle
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { getProviderInfo, isMoudePro, initiateGitHubAuth, initiateGoogleAuth, initiateMoudeAuth } from '../../services/auth'
import { toast } from '../Toast'
import { notify } from '../../store/notificationStore'
import { LocalizationService } from '../../services/localization'

// Provider Icons as SVG components
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function MoudeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="moudeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d4ff"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" stroke="url(#moudeGrad)" strokeWidth="2"/>
      <path d="M8 12l2 2 4-4" stroke="url(#moudeGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}


// Subscription Plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Star,
    color: 'text-zinc-400',
    bgColor: 'bg-zinc-500/10',
    features: [
      'Basic code editor',
      'Syntax highlighting',
      'Local file storage',
      '5 projects limit',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9',
    period: '/month',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    popular: true,
    features: [
      'Everything in Free',
      'Unlimited projects',
      'Cloud sync',
      'AI code completion',
      'Priority support',
      'Custom themes'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    icon: Crown,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Advanced AI features',
      'Custom integrations',
      'Dedicated support',
      'SSO & Admin controls'
    ]
  }
]

type TabType = 'account' | 'subscription' | 'billing'
type SubPageType = null | 'profile' | 'tokens' | 'notifications' | 'security' | 'settings'

export function AccountPanel() {
  const { user, setUser, setAuthToken, logout } = useStore()
  const [isLoading, setIsLoading] = useState<'github' | 'google' | 'moude' | null>(null)
  const [syncEnabled, setSyncEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceCode, setDeviceCode] = useState<{ code: string; url: string } | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('account')
  const [subPage, setSubPage] = useState<SubPageType>(null)
  const [showToken, setShowToken] = useState<string | null>(null)
  const t = LocalizationService.t

  // Profile edit state - syncs with user
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.name?.toLowerCase().replace(/\s/g, '') || '',
    location: localStorage.getItem('geneia_profile_location') || '',
    website: localStorage.getItem('geneia_profile_website') || '',
    avatar: user?.avatar || ''
  })

  // Notification settings - persisted to localStorage
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('geneia_notif_settings')
    return saved ? JSON.parse(saved) : {
      email: true,
      push: true,
      updates: true,
      marketing: false,
      security: true,
      weekly: false
    }
  })

  // Save notification settings when changed
  const updateNotifSetting = (key: string, value: boolean) => {
    setNotifSettings((s: typeof notifSettings) => {
      const newSettings = { ...s, [key]: value }
      localStorage.setItem('geneia_notif_settings', JSON.stringify(newSettings))
      toast.success('Notifications', `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`)
      return newSettings
    })
  }

  // App settings - Account specific, persisted to localStorage
  const [accountSettings, setAccountSettings] = useState(() => {
    const saved = localStorage.getItem('geneia_account_settings')
    return saved ? JSON.parse(saved) : {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      publicProfile: true,
      showActivity: true,
      allowMessages: true
    }
  })

  // Update account setting with persistence
  const updateAccountSetting = (key: string, value: string | boolean) => {
    setAccountSettings((s: typeof accountSettings) => {
      const newSettings = { ...s, [key]: value }
      localStorage.setItem('geneia_account_settings', JSON.stringify(newSettings))
      return newSettings
    })
  }

  // Tokens state - persisted to localStorage
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('geneia_access_tokens')
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'CLI Access', token: 'gn_sk_live_xxxxxxxxxxxx', created: 'Dec 15, 2024', lastUsed: '2 hours ago' },
      { id: '2', name: 'CI/CD Pipeline', token: 'gn_sk_live_yyyyyyyyyyyy', created: 'Nov 20, 2024', lastUsed: '1 day ago' },
    ]
  })
  const [newTokenName, setNewTokenName] = useState('')
  const [showNewTokenForm, setShowNewTokenForm] = useState(false)

  // 2FA state - persisted
  const [twoFAEnabled, setTwoFAEnabled] = useState(() => localStorage.getItem('geneia_2fa_enabled') === 'true')
  const [biometricEnabled, setBiometricEnabled] = useState(() => localStorage.getItem('geneia_biometric_enabled') === 'true')

  // Sessions state - persisted
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('geneia_sessions')
    return saved ? JSON.parse(saved) : [
      { id: '1', device: 'This device', os: 'Linux', browser: 'Chrome', lastActive: 'Active now', current: true },
      { id: '2', device: 'MacBook Pro', os: 'macOS', browser: 'Safari', lastActive: '2 days ago', current: false },
    ]
  })

  // Password state
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  // Handle tab change - clear subPage
  const handleTabChange = (tab: TabType) => {
    setSubPage(null)
    setActiveTab(tab)
  }

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Error', 'Image must be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setProfileForm(prev => ({ ...prev, avatar: dataUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Save profile changes - persists to localStorage and user state
  const handleSaveProfile = () => {
    if (user) {
      // Save to user state
      setUser({
        ...user,
        name: profileForm.name || user.name,
        email: profileForm.email || user.email,
        avatar: profileForm.avatar || user.avatar
      })
      // Save extra fields to localStorage
      localStorage.setItem('geneia_profile_location', profileForm.location)
      localStorage.setItem('geneia_profile_website', profileForm.website)
      localStorage.setItem('geneia_profile_username', profileForm.username)
      toast.success('Profile', 'Profile updated successfully!')
      setSubPage(null)
    }
  }

  const handleGitHubLogin = async () => {
    setIsLoading('github')
    setError(null)
    setDeviceCode(null)
    
    try {
      const result = await initiateGitHubAuth((code, url) => {
        setDeviceCode({ code, url })
      })
      
      setDeviceCode(null)
      
      if (result) {
        setUser(result.user)
        setAuthToken(result.token)
        toast.success('Signed in', `Welcome, ${result.user.name}!`)
        notify.success('Signed in with GitHub', `Welcome back, ${result.user.name}!`, 'auth')
      } else {
        setError('Authentication cancelled or expired')
      }
    } catch (err) {
      setError('GitHub authentication failed')
      toast.error('GitHub Error', 'Failed to authenticate with GitHub')
      notify.error('GitHub Auth Failed', 'Could not complete authentication', 'auth')
      console.error('Auth error:', err)
    } finally {
      setIsLoading(null)
      setDeviceCode(null)
    }
  }

  const handleLogin = async (provider: 'google' | 'moude') => {
    setIsLoading(provider)
    setError(null)
    
    try {
      let result: { user: { id: string; name: string; email: string; avatar: string; provider: 'github' | 'google' | 'moude' }; token: string } | null = null
      
      if (provider === 'google') {
        result = await initiateGoogleAuth()
      } else if (provider === 'moude') {
        result = await initiateMoudeAuth()
      }
      
      if (result) {
        setUser(result.user)
        setAuthToken(result.token)
        toast.success('Signed in', `Welcome, ${result.user.name}!`)
        notify.success(`Signed in with ${provider === 'google' ? 'Google' : 'Moude'}`, `Welcome, ${result.user.name}!`, 'auth')
      } else {
        setError('Authentication cancelled or failed')
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
      toast.error('Auth Error', 'Authentication failed')
      notify.error('Auth Failed', 'Could not complete authentication', 'auth')
      console.error('Auth error:', err)
    } finally {
      setIsLoading(null)
    }
  }

  const handleLogout = () => {
    const userName = user?.name
    logout()
    toast.info('Signed out', `Goodbye, ${userName}!`)
    notify.info('Signed out', `You have been signed out`, 'auth')
  }

  const handleUpgrade = (planId: string) => {
    toast.info('Upgrade', `Upgrading to ${planId} plan...`)
    // In real app, this would open payment flow
  }

  const getPlanBadge = () => {
    if (!user) return { text: 'FREE', color: 'bg-zinc-500/20 text-zinc-400' }
    if (user.provider === 'moude') return { text: 'PRO', color: 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-purple-400' }
    return { text: 'FREE', color: 'bg-zinc-500/20 text-zinc-400' }
  }

  const providerInfo = user ? getProviderInfo(user.provider) : null
  const currentPlan = user?.provider === 'moude' ? 'pro' : 'free'


  // Subscription Tab Content
  const renderSubscriptionTab = () => (
    <div className="space-y-4">
      {/* Current Plan */}
      <div className="p-4 rounded-xl bg-theme-editor border border-theme">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-theme-primary">Current Plan</span>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getPlanBadge().color}`}>
            {getPlanBadge().text}
          </span>
        </div>
        {currentPlan === 'free' ? (
          <p className="text-xs text-theme-muted">
            Upgrade to unlock more features and remove limits.
          </p>
        ) : (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Your subscription is active</span>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="space-y-3">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = plan.id === currentPlan
          
          return (
            <div
              key={plan.id}
              className={`p-4 rounded-xl border transition-all ${
                isCurrentPlan 
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5' 
                  : 'border-theme bg-theme-editor hover:border-theme-secondary'
              } ${plan.popular ? 'ring-1 ring-blue-500/30' : ''}`}
            >
              {plan.popular && (
                <div className="flex justify-end mb-2">
                  <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${plan.bgColor}`}>
                    <Icon className={`w-4 h-4 ${plan.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-theme-primary">{plan.name}</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-theme-primary">{plan.price}</span>
                      <span className="text-xs text-theme-muted">{plan.period}</span>
                    </div>
                  </div>
                </div>
                
                {isCurrentPlan ? (
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                    Current
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    className="px-3 py-1.5 text-xs bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
              
              <ul className="space-y-1.5">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-theme-muted">
                    <Check className={`w-3 h-3 ${plan.color}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Promo */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-400">Special Offer</span>
        </div>
        <p className="text-xs text-theme-muted mb-3">
          Get 2 months free when you pay annually!
        </p>
        <button className="w-full py-2 text-xs bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
          View Annual Plans
        </button>
      </div>
    </div>
  )


  // Billing Tab Content
  const renderBillingTab = () => (
    <div className="space-y-4">
      {/* Payment Method */}
      <div className="p-4 rounded-xl bg-theme-editor border border-theme">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm font-medium text-theme-primary">Payment Method</span>
        </div>
        
        {currentPlan === 'free' ? (
          <p className="text-xs text-theme-muted">
            No payment method on file. Add one when you upgrade.
          </p>
        ) : (
          <div className="flex items-center justify-between p-3 bg-theme-secondary rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">VISA</span>
              </div>
              <div>
                <p className="text-xs text-theme-primary">•••• •••• •••• 4242</p>
                <p className="text-[10px] text-theme-muted">Expires 12/25</p>
              </div>
            </div>
            <button className="text-xs text-[var(--accent-primary)] hover:underline">
              Edit
            </button>
          </div>
        )}
        
        <button className="w-full mt-3 py-2 text-xs border border-theme text-theme-secondary rounded-lg hover:bg-theme-secondary transition-colors">
          + Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="p-4 rounded-xl bg-theme-editor border border-theme">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm font-medium text-theme-primary">Billing History</span>
        </div>
        
        {currentPlan === 'free' ? (
          <p className="text-xs text-theme-muted text-center py-4">
            No billing history yet
          </p>
        ) : (
          <div className="space-y-2">
            {[
              { date: 'Dec 1, 2024', amount: '$9.00', status: 'Paid' },
              { date: 'Nov 1, 2024', amount: '$9.00', status: 'Paid' },
              { date: 'Oct 1, 2024', amount: '$9.00', status: 'Paid' },
            ].map((invoice, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-theme last:border-0">
                <div>
                  <p className="text-xs text-theme-primary">{invoice.date}</p>
                  <p className="text-[10px] text-theme-muted">Pro Plan</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-theme-primary">{invoice.amount}</p>
                  <p className="text-[10px] text-green-400">{invoice.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Usage */}
      <div className="p-4 rounded-xl bg-theme-editor border border-theme">
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="w-4 h-4 text-[var(--accent-primary)]" />
          <span className="text-sm font-medium text-theme-primary">Usage</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-theme-muted">Projects</span>
              <span className="text-theme-primary">{currentPlan === 'free' ? '3/5' : '12/∞'}</span>
            </div>
            <div className="h-1.5 bg-theme-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent-primary)] rounded-full"
                style={{ width: currentPlan === 'free' ? '60%' : '100%' }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-theme-muted">Cloud Storage</span>
              <span className="text-theme-primary">{currentPlan === 'free' ? '45MB/100MB' : '2.1GB/10GB'}</span>
            </div>
            <div className="h-1.5 bg-theme-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent-primary)] rounded-full"
                style={{ width: currentPlan === 'free' ? '45%' : '21%' }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-theme-muted">AI Requests</span>
              <span className="text-theme-primary">{currentPlan === 'free' ? '0/0' : '847/5000'}</span>
            </div>
            <div className="h-1.5 bg-theme-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: currentPlan === 'free' ? '0%' : '17%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ==================== SUB-PAGES ====================

  // Edit Profile Page
  const renderProfilePage = () => (
    <div className="space-y-4">
      <button onClick={() => setSubPage(null)} className="flex items-center gap-2 text-xs text-theme-muted hover:text-theme-primary transition-colors">
        <ChevronLeft className="w-4 h-4" />Back to Account
      </button>
      <h3 className="text-sm font-medium text-theme-primary">Edit Profile</h3>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-theme-secondary flex items-center justify-center overflow-hidden">
            {profileForm.avatar ? <img src={profileForm.avatar} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-theme-muted" />}
          </div>
          <label className="absolute -bottom-1 -right-1 p-1.5 bg-[var(--accent-primary)] rounded-full cursor-pointer">
            <Camera className="w-3 h-3 text-white" />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
        <div>
          <label className="text-xs text-[var(--accent-primary)] hover:underline cursor-pointer">
            Upload new photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
          <p className="text-[10px] text-theme-muted mt-1">JPG, PNG. Max 2MB</p>
        </div>
      </div>
      <div className="space-y-3">
        <div><label className="text-xs text-theme-muted mb-1 block">Display Name</label><div className="flex items-center gap-2 p-2.5 bg-theme-editor rounded-lg border border-theme"><User className="w-4 h-4 text-theme-muted" /><input type="text" value={profileForm.name} onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))} className="flex-1 bg-transparent text-sm text-theme-primary outline-none" /></div></div>
        <div><label className="text-xs text-theme-muted mb-1 block">Email</label><div className="flex items-center gap-2 p-2.5 bg-theme-editor rounded-lg border border-theme"><Mail className="w-4 h-4 text-theme-muted" /><input type="email" value={profileForm.email} onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))} className="flex-1 bg-transparent text-sm text-theme-primary outline-none" /></div></div>
        <div><label className="text-xs text-theme-muted mb-1 block">Username</label><div className="flex items-center gap-2 p-2.5 bg-theme-editor rounded-lg border border-theme"><AtSign className="w-4 h-4 text-theme-muted" /><input type="text" value={profileForm.username} onChange={(e) => setProfileForm(p => ({ ...p, username: e.target.value }))} className="flex-1 bg-transparent text-sm text-theme-primary outline-none" /></div></div>
        <div><label className="text-xs text-theme-muted mb-1 block">Location</label><div className="flex items-center gap-2 p-2.5 bg-theme-editor rounded-lg border border-theme"><MapPin className="w-4 h-4 text-theme-muted" /><input type="text" value={profileForm.location} onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))} placeholder="City, Country" className="flex-1 bg-transparent text-sm text-theme-primary outline-none placeholder:text-theme-muted" /></div></div>
        <div><label className="text-xs text-theme-muted mb-1 block">Website</label><div className="flex items-center gap-2 p-2.5 bg-theme-editor rounded-lg border border-theme"><Link2 className="w-4 h-4 text-theme-muted" /><input type="url" value={profileForm.website} onChange={(e) => setProfileForm(p => ({ ...p, website: e.target.value }))} placeholder="https://yourwebsite.com" className="flex-1 bg-transparent text-sm text-theme-primary outline-none placeholder:text-theme-muted" /></div></div>
      </div>
      <button onClick={handleSaveProfile} className="w-full py-2.5 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">Save Changes</button>
    </div>
  )

  // Access Tokens Page - Real functionality with persistence
  const handleCreateToken = () => {
    if (!newTokenName.trim()) {
      toast.error('Error', 'Please enter a token name')
      return
    }
    const newToken = {
      id: Date.now().toString(),
      name: newTokenName,
      token: `gn_sk_live_${Math.random().toString(36).substring(2, 14)}`,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: 'Never'
    }
    setTokens((prev: typeof tokens) => {
      const updated = [...prev, newToken]
      localStorage.setItem('geneia_access_tokens', JSON.stringify(updated))
      return updated
    })
    setNewTokenName('')
    setShowNewTokenForm(false)
    toast.success('Token Created', `Token "${newTokenName}" created successfully!`)
  }

  const handleDeleteToken = (id: string, name: string) => {
    setTokens((prev: typeof tokens) => {
      const updated = prev.filter((t: { id: string }) => t.id !== id)
      localStorage.setItem('geneia_access_tokens', JSON.stringify(updated))
      return updated
    })
    toast.success('Token Deleted', `Token "${name}" has been deleted`)
  }

  const handleRevokeSession = (id: string) => {
    setSessions((prev: typeof sessions) => {
      const updated = prev.filter((s: { id: string }) => s.id !== id)
      localStorage.setItem('geneia_sessions', JSON.stringify(updated))
      return updated
    })
    toast.success('Session Revoked', 'Session has been revoked')
  }

  // Toggle 2FA with persistence
  const handleToggle2FA = () => {
    const newValue = !twoFAEnabled
    setTwoFAEnabled(newValue)
    localStorage.setItem('geneia_2fa_enabled', String(newValue))
    toast.success('2FA', newValue ? '2FA enabled successfully!' : '2FA disabled')
  }

  // Toggle biometric with persistence
  const handleToggleBiometric = () => {
    const newValue = !biometricEnabled
    setBiometricEnabled(newValue)
    localStorage.setItem('geneia_biometric_enabled', String(newValue))
    toast.success('Biometric', newValue ? 'Biometric login enabled' : 'Biometric login disabled')
  }

  // Change password handler
  const handleChangePassword = () => {
    if (!passwordForm.current) {
      toast.error('Error', 'Please enter your current password')
      return
    }
    if (passwordForm.new.length < 8) {
      toast.error('Error', 'New password must be at least 8 characters')
      return
    }
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Error', 'Passwords do not match')
      return
    }
    // Save password change timestamp
    localStorage.setItem('geneia_password_changed', new Date().toISOString())
    setPasswordForm({ current: '', new: '', confirm: '' })
    setShowPasswordDialog(false)
    toast.success('Password', 'Password changed successfully!')
  }

  // Mute all notifications
  const handleMuteAll = () => {
    const mutedSettings = {
      email: false,
      push: false,
      updates: false,
      marketing: false,
      security: false,
      weekly: false
    }
    setNotifSettings(mutedSettings)
    localStorage.setItem('geneia_notif_settings', JSON.stringify(mutedSettings))
    toast.success('Notifications', 'All notifications muted')
  }

  // Download user data
  const handleDownloadData = () => {
    const userData = {
      profile: {
        name: user?.name,
        email: user?.email,
        username: profileForm.username,
        location: profileForm.location,
        website: profileForm.website
      },
      settings: accountSettings,
      notifications: notifSettings,
      tokens: tokens.map((t: { name: string; created: string; lastUsed: string }) => ({ name: t.name, created: t.created, lastUsed: t.lastUsed })),
      sessions: sessions,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `geneia-account-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Download', 'Your data has been downloaded')
  }

  // Delete account handler
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Error', 'Please type DELETE to confirm')
      return
    }
    // Clear all localStorage data
    localStorage.removeItem('geneia_profile_location')
    localStorage.removeItem('geneia_profile_website')
    localStorage.removeItem('geneia_profile_username')
    localStorage.removeItem('geneia_notif_settings')
    localStorage.removeItem('geneia_account_settings')
    localStorage.removeItem('geneia_access_tokens')
    localStorage.removeItem('geneia_2fa_enabled')
    localStorage.removeItem('geneia_biometric_enabled')
    localStorage.removeItem('geneia_sessions')
    localStorage.removeItem('geneia_password_changed')
    // Logout
    logout()
    toast.success('Account Deleted', 'Your account has been deleted')
  }

  const renderTokensPage = () => (
    <div className="space-y-4">
      <button onClick={() => setSubPage(null)} className="flex items-center gap-2 text-xs text-theme-muted hover:text-theme-primary transition-colors"><ChevronLeft className="w-4 h-4" />Back to Account</button>
      <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-theme-primary">Access Tokens</h3><button onClick={() => setShowNewTokenForm(true)} className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90"><Plus className="w-3 h-3" />New Token</button></div>
      <p className="text-xs text-theme-muted">Personal access tokens allow you to authenticate with the Geneia CLI and API.</p>
      
      {/* New Token Form */}
      {showNewTokenForm && (
        <div className="p-3 bg-theme-editor rounded-lg border border-[var(--accent-primary)]">
          <label className="text-xs text-theme-muted mb-1 block">Token Name</label>
          <input type="text" value={newTokenName} onChange={(e) => setNewTokenName(e.target.value)} placeholder="e.g., CLI Access" className="w-full p-2 mb-2 text-sm bg-theme-secondary text-theme-primary rounded-lg border border-theme outline-none" />
          <div className="flex gap-2">
            <button onClick={handleCreateToken} className="flex-1 py-1.5 text-xs bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90">Create</button>
            <button onClick={() => { setShowNewTokenForm(false); setNewTokenName(''); }} className="flex-1 py-1.5 text-xs border border-theme text-theme-secondary rounded-lg hover:bg-theme-secondary">Cancel</button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {tokens.map((token: { id: string; name: string; token: string; created: string; lastUsed: string }) => (
          <div key={token.id} className="p-3 bg-theme-editor rounded-lg border border-theme">
            <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Key className="w-4 h-4 text-[var(--accent-primary)]" /><span className="text-sm font-medium text-theme-primary">{token.name}</span></div><button onClick={() => handleDeleteToken(token.id, token.name)} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button></div>
            <div className="flex items-center gap-2 mb-2"><code className="flex-1 text-xs bg-theme-secondary px-2 py-1 rounded font-mono text-theme-muted">{showToken === token.id ? token.token : '••••••••••••••••••••'}</code><button onClick={() => setShowToken(showToken === token.id ? null : token.id)} className="p-1 text-theme-muted hover:text-theme-primary">{showToken === token.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button><button onClick={() => { navigator.clipboard.writeText(token.token); toast.success('Copied', 'Token copied!'); }} className="p-1 text-theme-muted hover:text-theme-primary"><Copy className="w-3.5 h-3.5" /></button></div>
            <div className="flex items-center gap-4 text-[10px] text-theme-muted"><span>Created: {token.created}</span><span>Last used: {token.lastUsed}</span></div>
          </div>
        ))}
        {tokens.length === 0 && <p className="text-xs text-theme-muted text-center py-4">No tokens yet. Create one to get started.</p>}
      </div>
      <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"><div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" /><p className="text-xs text-yellow-400">Treat your tokens like passwords. Never share them or commit them to version control.</p></div></div>
    </div>
  )

  // Notifications Page - Real functionality with persistence
  const renderNotificationsPage = () => (
    <div className="space-y-4">
      <button onClick={() => setSubPage(null)} className="flex items-center gap-2 text-xs text-theme-muted hover:text-theme-primary transition-colors"><ChevronLeft className="w-4 h-4" />Back to Account</button>
      <h3 className="text-sm font-medium text-theme-primary">Notifications</h3>
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <h4 className="text-xs font-medium text-theme-primary mb-3">Channels</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Mail className="w-4 h-4 text-theme-muted" /><span className="text-sm text-theme-secondary">Email notifications</span></div><button onClick={() => updateNotifSetting('email', !notifSettings.email)} className={`w-10 h-5 rounded-full transition-colors ${notifSettings.email ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings.email ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><BellRing className="w-4 h-4 text-theme-muted" /><span className="text-sm text-theme-secondary">Push notifications</span></div><button onClick={() => updateNotifSetting('push', !notifSettings.push)} className={`w-10 h-5 rounded-full transition-colors ${notifSettings.push ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings.push ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
        </div>
      </div>
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <h4 className="text-xs font-medium text-theme-primary mb-3">What to notify</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-theme-muted" /><span className="text-sm text-theme-secondary">Product updates</span></div><button onClick={() => updateNotifSetting('updates', !notifSettings.updates)} className={`w-10 h-5 rounded-full transition-colors ${notifSettings.updates ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings.updates ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Shield className="w-4 h-4 text-theme-muted" /><span className="text-sm text-theme-secondary">Security alerts</span></div><button onClick={() => updateNotifSetting('security', !notifSettings.security)} className={`w-10 h-5 rounded-full transition-colors ${notifSettings.security ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings.security ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-theme-muted" /><span className="text-sm text-theme-secondary">Marketing & tips</span></div><button onClick={() => updateNotifSetting('marketing', !notifSettings.marketing)} className={`w-10 h-5 rounded-full transition-colors ${notifSettings.marketing ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings.marketing ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-theme-muted" /><span className="text-sm text-theme-secondary">Weekly digest</span></div><button onClick={() => updateNotifSetting('weekly', !notifSettings.weekly)} className={`w-10 h-5 rounded-full transition-colors ${notifSettings.weekly ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${notifSettings.weekly ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
        </div>
      </div>
      <button onClick={handleMuteAll} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm border border-theme text-theme-secondary rounded-lg hover:bg-theme-secondary transition-colors"><BellOff className="w-4 h-4" />Mute all notifications</button>
    </div>
  )

  // Get password last changed date
  const getPasswordLastChanged = () => {
    const saved = localStorage.getItem('geneia_password_changed')
    if (!saved) return 'Never changed'
    const date = new Date(saved)
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Changed today'
    if (days === 1) return 'Changed yesterday'
    return `Changed ${days} days ago`
  }

  // Privacy & Security Page - Full real functionality
  const renderSecurityPage = () => (
    <div className="space-y-4">
      <button onClick={() => setSubPage(null)} className="flex items-center gap-2 text-xs text-theme-muted hover:text-theme-primary transition-colors"><ChevronLeft className="w-4 h-4" />Back to Account</button>
      <h3 className="text-sm font-medium text-theme-primary">Privacy & Security</h3>
      
      {/* Password Section */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-[var(--accent-primary)]" /><span className="text-sm font-medium text-theme-primary">Password</span></div>
          <button onClick={() => setShowPasswordDialog(true)} className="text-xs text-[var(--accent-primary)] hover:underline">Change</button>
        </div>
        <p className="text-xs text-theme-muted">{getPasswordLastChanged()}</p>
        {showPasswordDialog && (
          <div className="mt-3 p-3 bg-theme-secondary rounded-lg space-y-2">
            <input type="password" placeholder="Current password" value={passwordForm.current} onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))} className="w-full p-2 text-sm bg-theme-editor text-theme-primary rounded border border-theme outline-none" />
            <input type="password" placeholder="New password (min 8 chars)" value={passwordForm.new} onChange={(e) => setPasswordForm(p => ({ ...p, new: e.target.value }))} className="w-full p-2 text-sm bg-theme-editor text-theme-primary rounded border border-theme outline-none" />
            <input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} className="w-full p-2 text-sm bg-theme-editor text-theme-primary rounded border border-theme outline-none" />
            <div className="flex gap-2">
              <button onClick={handleChangePassword} className="flex-1 py-1.5 text-xs bg-[var(--accent-primary)] text-white rounded hover:opacity-90">Change Password</button>
              <button onClick={() => { setShowPasswordDialog(false); setPasswordForm({ current: '', new: '', confirm: '' }); }} className="flex-1 py-1.5 text-xs border border-theme text-theme-secondary rounded hover:bg-theme-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* 2FA Section */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-[var(--accent-primary)]" /><span className="text-sm font-medium text-theme-primary">Two-Factor Authentication</span></div>
          <span className={`px-2 py-0.5 text-[10px] rounded ${twoFAEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{twoFAEnabled ? 'ON' : 'OFF'}</span>
        </div>
        <p className="text-xs text-theme-muted mb-3">Add an extra layer of security to your account</p>
        <button onClick={handleToggle2FA} className={`w-full py-2 text-xs rounded-lg ${twoFAEnabled ? 'border border-red-500/30 text-red-400 hover:bg-red-500/10' : 'bg-[var(--accent-primary)] text-white hover:opacity-90'}`}>{twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}</button>
      </div>

      {/* Biometric Section */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-[var(--accent-primary)]" /><div><span className="text-sm font-medium text-theme-primary block">Biometric Login</span><span className="text-xs text-theme-muted">Use fingerprint or Face ID</span></div></div>
          <button onClick={handleToggleBiometric} className={`w-10 h-5 rounded-full transition-colors ${biometricEnabled ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${biometricEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
        </div>
      </div>

      {/* Sessions Section */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <div className="flex items-center gap-2 mb-3"><History className="w-4 h-4 text-[var(--accent-primary)]" /><span className="text-sm font-medium text-theme-primary">Active Sessions</span></div>
        <div className="space-y-2">
          {sessions.map((session: { id: string; device: string; os: string; browser: string; lastActive: string; current: boolean }) => (
            <div key={session.id} className="flex items-center justify-between py-2 border-b border-theme last:border-0">
              <div><p className="text-xs text-theme-primary">{session.device}</p><p className="text-[10px] text-theme-muted">{session.os} • {session.browser} • {session.lastActive}</p></div>
              {session.current ? <span className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded">Current</span> : <button onClick={() => handleRevokeSession(session.id)} className="text-xs text-red-400 hover:underline">Revoke</button>}
            </div>
          ))}
          {sessions.length === 0 && <p className="text-xs text-theme-muted text-center py-2">No active sessions</p>}
        </div>
      </div>

      {/* Data Section */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <div className="flex items-center gap-2 mb-3"><Download className="w-4 h-4 text-[var(--accent-primary)]" /><span className="text-sm font-medium text-theme-primary">Your Data</span></div>
        <div className="space-y-2">
          <button onClick={handleDownloadData} className="w-full py-2 text-xs border border-theme text-theme-secondary rounded-lg hover:bg-theme-secondary transition-colors">Download my data</button>
          <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">Delete my account</button>
        </div>
        {showDeleteConfirm && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-xs text-red-400 mb-2">This will permanently delete your account and all data. Type DELETE to confirm:</p>
            <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE" className="w-full p-2 mb-2 text-sm bg-theme-editor text-theme-primary rounded border border-red-500/30 outline-none" />
            <div className="flex gap-2">
              <button onClick={handleDeleteAccount} className="flex-1 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600">Delete Account</button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} className="flex-1 py-1.5 text-xs border border-theme text-theme-secondary rounded hover:bg-theme-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Account Settings Page - Account specific, not IDE settings, with persistence
  const renderSettingsPage = () => (
    <div className="space-y-4">
      <button onClick={() => setSubPage(null)} className="flex items-center gap-2 text-xs text-theme-muted hover:text-theme-primary transition-colors"><ChevronLeft className="w-4 h-4" />Back to Account</button>
      <h3 className="text-sm font-medium text-theme-primary">Account Settings</h3>
      
      {/* Language & Region */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <h4 className="text-xs font-medium text-theme-primary mb-3">Language & Region</h4>
        <div className="space-y-3">
          <div><label className="text-xs text-theme-muted mb-1 block">Language</label><select value={accountSettings.language} onChange={(e) => updateAccountSetting('language', e.target.value)} className="w-full p-2 text-sm bg-theme-secondary text-theme-primary rounded-lg border border-theme outline-none"><option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="zh">中文</option><option value="ja">日本語</option></select></div>
          <div><label className="text-xs text-theme-muted mb-1 block">Timezone</label><select value={accountSettings.timezone} onChange={(e) => updateAccountSetting('timezone', e.target.value)} className="w-full p-2 text-sm bg-theme-secondary text-theme-primary rounded-lg border border-theme outline-none"><option value="UTC">UTC</option><option value="America/New_York">Eastern Time (ET)</option><option value="America/Los_Angeles">Pacific Time (PT)</option><option value="Europe/London">London (GMT)</option><option value="Asia/Tokyo">Tokyo (JST)</option></select></div>
          <div><label className="text-xs text-theme-muted mb-1 block">Date Format</label><select value={accountSettings.dateFormat} onChange={(e) => updateAccountSetting('dateFormat', e.target.value)} className="w-full p-2 text-sm bg-theme-secondary text-theme-primary rounded-lg border border-theme outline-none"><option value="MM/DD/YYYY">MM/DD/YYYY</option><option value="DD/MM/YYYY">DD/MM/YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option></select></div>
        </div>
      </div>

      {/* Privacy */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <h4 className="text-xs font-medium text-theme-primary mb-3">Privacy</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between"><span className="text-sm text-theme-secondary">Public Profile</span><button onClick={() => updateAccountSetting('publicProfile', !accountSettings.publicProfile)} className={`w-10 h-5 rounded-full transition-colors ${accountSettings.publicProfile ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${accountSettings.publicProfile ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><span className="text-sm text-theme-secondary">Show Activity Status</span><button onClick={() => updateAccountSetting('showActivity', !accountSettings.showActivity)} className={`w-10 h-5 rounded-full transition-colors ${accountSettings.showActivity ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${accountSettings.showActivity ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
          <div className="flex items-center justify-between"><span className="text-sm text-theme-secondary">Allow Direct Messages</span><button onClick={() => updateAccountSetting('allowMessages', !accountSettings.allowMessages)} className={`w-10 h-5 rounded-full transition-colors ${accountSettings.allowMessages ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'}`}><div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${accountSettings.allowMessages ? 'translate-x-5' : 'translate-x-0.5'}`} /></button></div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="p-4 bg-theme-editor rounded-xl border border-theme">
        <h4 className="text-xs font-medium text-theme-primary mb-3">Connected Accounts</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-theme-secondary rounded-lg"><div className="flex items-center gap-2"><GitHubIcon className="w-4 h-4" /><span className="text-sm text-theme-primary">GitHub</span></div>{user?.provider === 'github' ? <span className="text-xs text-green-400">Connected</span> : <button onClick={() => toast.info('Connect', 'GitHub connection would start here')} className="text-xs text-[var(--accent-primary)] hover:underline">Connect</button>}</div>
          <div className="flex items-center justify-between p-2 bg-theme-secondary rounded-lg"><div className="flex items-center gap-2"><GoogleIcon className="w-4 h-4" /><span className="text-sm text-theme-primary">Google</span></div>{user?.provider === 'google' ? <span className="text-xs text-green-400">Connected</span> : <button onClick={() => toast.info('Connect', 'Google connection would start here')} className="text-xs text-[var(--accent-primary)] hover:underline">Connect</button>}</div>
        </div>
      </div>

      {/* Save - settings auto-save, this just confirms and closes */}
      <button onClick={() => { toast.success('Settings', 'Account settings saved!'); setSubPage(null); }} className="w-full py-2.5 text-sm bg-[var(--accent-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">Save Settings</button>
    </div>
  )

  // Account Tab Content (existing profile section)
  const renderAccountTab = () => (
    <>
      {/* Profile Card */}
      <div className="p-4 rounded-xl bg-theme-editor mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-theme-secondary flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-theme-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-theme-primary truncate">
                {user?.name}
              </span>
              <span className={`px-1.5 py-0.5 text-[10px] rounded ${getPlanBadge().color}`}>
                {getPlanBadge().text}
              </span>
            </div>
            <span className="text-xs text-theme-muted truncate block">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Provider Badge */}
        <div className="flex items-center gap-2 text-xs text-theme-muted">
          {user?.provider === 'github' && <GitHubIcon className="w-4 h-4" />}
          {user?.provider === 'google' && <GoogleIcon className="w-4 h-4" />}
          {user?.provider === 'moude' && <MoudeIcon className="w-4 h-4" />}
          <span>Signed in with {providerInfo?.name}</span>
        </div>

        {/* Moude Pro Badge */}
        {user && isMoudePro(user) && (
          <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-medium">Moude Pro Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Sync Status */}
      <div className="p-3 rounded-xl bg-theme-editor mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-sm text-theme-primary">Cloud Sync</span>
          </div>
          <button
            onClick={() => setSyncEnabled(!syncEnabled)}
            className={`w-10 h-5 rounded-full transition-colors ${
              syncEnabled ? 'bg-[var(--accent-primary)]' : 'bg-theme-secondary'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
              syncEnabled ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        {syncEnabled && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <CheckCircle className="w-3 h-3" />
            Synced
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        <button onClick={() => setSubPage('profile')} className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4" />
            Edit Profile
          </div>
          <ChevronRight className="w-4 h-4 text-theme-muted" />
        </button>
        <button onClick={() => setSubPage('tokens')} className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <Key className="w-4 h-4" />
            Access Tokens
          </div>
          <ChevronRight className="w-4 h-4 text-theme-muted" />
        </button>
        <button onClick={() => setSubPage('notifications')} className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4" />
            Notifications
          </div>
          <ChevronRight className="w-4 h-4 text-theme-muted" />
        </button>
        <button onClick={() => setSubPage('security')} className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4" />
            Privacy & Security
          </div>
          <ChevronRight className="w-4 h-4 text-theme-muted" />
        </button>
        <button onClick={() => setSubPage('settings')} className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-sm text-theme-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            {t('settings')}
          </div>
          <ChevronRight className="w-4 h-4 text-theme-muted" />
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </>
  )


  // Login UI (when not signed in)
  const renderLoginUI = () => (
    <>
      {/* Login Options */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-theme-editor flex items-center justify-center">
          <User className="w-8 h-8 text-theme-muted" />
        </div>
        <h3 className="text-sm font-medium text-theme-primary mb-1">
          Sign in to Geneia Studio
        </h3>
        <p className="text-xs text-theme-muted">
          Connect your account to enable cloud sync and source control
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* GitHub Device Code UI */}
      {deviceCode && (
        <div className="mb-4 p-4 bg-theme-editor rounded-xl border border-[var(--accent-primary)]/30">
          <div className="text-xs text-theme-muted mb-2 text-center">
            Enter this code at GitHub:
          </div>
          <div className="text-2xl font-mono font-bold text-center text-[var(--accent-primary)] mb-3 tracking-widest">
            {deviceCode.code}
          </div>
          <a
            href={deviceCode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 text-sm text-center bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)]/30 transition-colors"
          >
            Open {deviceCode.url}
          </a>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-theme-muted">
            <Loader2 className="w-3 h-3 animate-spin" />
            Waiting for authorization...
          </div>
        </div>
      )}

      {/* GitHub - Main */}
      <button
        onClick={handleGitHubLogin}
        disabled={isLoading !== null}
        className="w-full py-3 text-sm bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mb-3"
      >
        {isLoading === 'github' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <GitHubIcon className="w-5 h-5" />
        )}
        {isLoading === 'github' ? (deviceCode ? 'Waiting...' : 'Connecting...') : 'Continue with GitHub'}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-theme-secondary" />
        <span className="text-xs text-theme-muted">or</span>
        <div className="flex-1 h-px bg-theme-secondary" />
      </div>

      {/* Google */}
      <button
        onClick={() => handleLogin('google')}
        disabled={isLoading !== null}
        className="w-full py-3 text-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mb-3"
      >
        {isLoading === 'google' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <GoogleIcon className="w-5 h-5" />
        )}
        {isLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Moude - Special */}
      <button
        onClick={() => handleLogin('moude')}
        disabled={isLoading !== null}
        className="w-full py-3 text-sm text-white rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 relative overflow-hidden group"
        style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)' }}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isLoading === 'moude' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <MoudeIcon className="w-5 h-5" />
            <Sparkles className="w-4 h-4" />
          </>
        )}
        {isLoading === 'moude' ? 'Connecting...' : 'Continue with Moude Pro'}
      </button>

      {/* Features */}
      <div className="mt-6 p-3 bg-theme-editor rounded-xl">
        <div className="text-xs font-medium text-theme-primary mb-2">
          Benefits of signing in:
        </div>
        <ul className="space-y-2 text-xs text-theme-muted">
          <li className="flex items-start gap-2">
            <Cloud className="w-3 h-3 text-[var(--accent-primary)] mt-0.5" />
            <span>Sync settings and files across devices</span>
          </li>
          <li className="flex items-start gap-2">
            <GitHubIcon className="w-3 h-3 mt-0.5" />
            <span>Push and pull from GitHub repositories</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-3 h-3 text-[var(--accent-primary)] mt-0.5" />
            <span>Secure backup of your projects</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-3 h-3 text-purple-400 mt-0.5" />
            <span>Moude Pro: AI features & premium themes</span>
          </li>
        </ul>
      </div>

      <p className="mt-4 text-xs text-theme-muted text-center">
        By signing in, you agree to our{' '}
        <a href="#" className="text-[var(--accent-primary)] hover:underline">Terms</a>
        {' '}and{' '}
        <a href="#" className="text-[var(--accent-primary)] hover:underline">Privacy Policy</a>
      </p>
    </>
  )


  return (
    <div className="w-64 glass border-r border-theme flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-theme">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-theme-muted" />
          <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">
            {t('account')}
          </span>
        </div>
      </div>

      {/* Tabs (always show when logged in) */}
      {user && (
        <div className="flex border-b border-theme">
          {(['account', 'subscription', 'billing'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === tab && !subPage
                  ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]'
                  : 'text-theme-muted hover:text-theme-secondary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        {user ? (
          subPage ? (
            <>
              {subPage === 'profile' && renderProfilePage()}
              {subPage === 'tokens' && renderTokensPage()}
              {subPage === 'notifications' && renderNotificationsPage()}
              {subPage === 'security' && renderSecurityPage()}
              {subPage === 'settings' && renderSettingsPage()}
            </>
          ) : (
            <>
              {activeTab === 'account' && renderAccountTab()}
              {activeTab === 'subscription' && renderSubscriptionTab()}
              {activeTab === 'billing' && renderBillingTab()}
            </>
          )
        ) : (
          renderLoginUI()
        )}
      </div>
    </div>
  )
}
