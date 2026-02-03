/**
 * External Themes Service
 * Manages themes from installed extensions
 */

import { InstalledExtension } from '../store/useStore'

export interface ExternalTheme {
  id: string
  name: string
  type: 'dark' | 'light'
  extensionId: string
  extensionName: string
  colors: ThemeColors
}

export interface ThemeColors {
  bgPrimary: string
  bgSecondary: string
  bgEditor: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accentPrimary: string
  accentSecondary: string
  border: string
}

// Built-in theme definitions from popular extensions
const extensionThemes: Record<string, ExternalTheme[]> = {
  'dracula-theme.theme-dracula': [
    {
      id: 'dracula',
      name: 'Dracula',
      type: 'dark',
      extensionId: 'dracula-theme.theme-dracula',
      extensionName: 'Dracula Official',
      colors: {
        bgPrimary: '#282a36',
        bgSecondary: '#21222c',
        bgEditor: '#1e1f29',
        textPrimary: '#f8f8f2',
        textSecondary: '#bd93f9',
        textMuted: '#6272a4',
        accentPrimary: '#bd93f9',
        accentSecondary: '#ff79c6',
        border: '#44475a'
      }
    },
    {
      id: 'dracula-soft',
      name: 'Dracula Soft',
      type: 'dark',
      extensionId: 'dracula-theme.theme-dracula',
      extensionName: 'Dracula Official',
      colors: {
        bgPrimary: '#282a36',
        bgSecondary: '#2d2f3d',
        bgEditor: '#22232e',
        textPrimary: '#f8f8f2',
        textSecondary: '#9580ff',
        textMuted: '#7970a9',
        accentPrimary: '#9580ff',
        accentSecondary: '#ff80bf',
        border: '#454758'
      }
    }
  ],

  'github.github-vscode-theme': [
    {
      id: 'github-dark',
      name: 'GitHub Dark',
      type: 'dark',
      extensionId: 'github.github-vscode-theme',
      extensionName: 'GitHub Theme',
      colors: {
        bgPrimary: '#0d1117',
        bgSecondary: '#161b22',
        bgEditor: '#0d1117',
        textPrimary: '#c9d1d9',
        textSecondary: '#58a6ff',
        textMuted: '#8b949e',
        accentPrimary: '#58a6ff',
        accentSecondary: '#1f6feb',
        border: '#30363d'
      }
    },
    {
      id: 'github-dark-dimmed',
      name: 'GitHub Dark Dimmed',
      type: 'dark',
      extensionId: 'github.github-vscode-theme',
      extensionName: 'GitHub Theme',
      colors: {
        bgPrimary: '#22272e',
        bgSecondary: '#2d333b',
        bgEditor: '#22272e',
        textPrimary: '#adbac7',
        textSecondary: '#539bf5',
        textMuted: '#768390',
        accentPrimary: '#539bf5',
        accentSecondary: '#316dca',
        border: '#444c56'
      }
    },
    {
      id: 'github-light',
      name: 'GitHub Light',
      type: 'light',
      extensionId: 'github.github-vscode-theme',
      extensionName: 'GitHub Theme',
      colors: {
        bgPrimary: '#ffffff',
        bgSecondary: '#f6f8fa',
        bgEditor: '#ffffff',
        textPrimary: '#24292f',
        textSecondary: '#0969da',
        textMuted: '#57606a',
        accentPrimary: '#0969da',
        accentSecondary: '#218bff',
        border: '#d0d7de'
      }
    }
  ],

  'zhuangtongfa.material-theme': [
    {
      id: 'one-dark-pro',
      name: 'One Dark Pro',
      type: 'dark',
      extensionId: 'zhuangtongfa.material-theme',
      extensionName: 'One Dark Pro',
      colors: {
        bgPrimary: '#282c34',
        bgSecondary: '#21252b',
        bgEditor: '#282c34',
        textPrimary: '#abb2bf',
        textSecondary: '#61afef',
        textMuted: '#5c6370',
        accentPrimary: '#61afef',
        accentSecondary: '#c678dd',
        border: '#3e4451'
      }
    }
  ],

  'sdras.night-owl': [
    {
      id: 'night-owl',
      name: 'Night Owl',
      type: 'dark',
      extensionId: 'sdras.night-owl',
      extensionName: 'Night Owl',
      colors: {
        bgPrimary: '#011627',
        bgSecondary: '#0b2942',
        bgEditor: '#011627',
        textPrimary: '#d6deeb',
        textSecondary: '#82aaff',
        textMuted: '#637777',
        accentPrimary: '#82aaff',
        accentSecondary: '#c792ea',
        border: '#1d3b53'
      }
    },
    {
      id: 'light-owl',
      name: 'Light Owl',
      type: 'light',
      extensionId: 'sdras.night-owl',
      extensionName: 'Night Owl',
      colors: {
        bgPrimary: '#fbfbfb',
        bgSecondary: '#f0f0f0',
        bgEditor: '#fbfbfb',
        textPrimary: '#403f53',
        textSecondary: '#4876d6',
        textMuted: '#90a7b2',
        accentPrimary: '#4876d6',
        accentSecondary: '#994cc3',
        border: '#d9d9d9'
      }
    }
  ],

  'monokai.theme-monokai-pro-vscode': [
    {
      id: 'monokai-pro',
      name: 'Monokai Pro',
      type: 'dark',
      extensionId: 'monokai.theme-monokai-pro-vscode',
      extensionName: 'Monokai Pro',
      colors: {
        bgPrimary: '#2d2a2e',
        bgSecondary: '#221f22',
        bgEditor: '#2d2a2e',
        textPrimary: '#fcfcfa',
        textSecondary: '#78dce8',
        textMuted: '#727072',
        accentPrimary: '#78dce8',
        accentSecondary: '#ff6188',
        border: '#403e41'
      }
    }
  ],

  'arcticicestudio.nord-visual-studio-code': [
    {
      id: 'nord-ext',
      name: 'Nord',
      type: 'dark',
      extensionId: 'arcticicestudio.nord-visual-studio-code',
      extensionName: 'Nord',
      colors: {
        bgPrimary: '#2e3440',
        bgSecondary: '#3b4252',
        bgEditor: '#2e3440',
        textPrimary: '#eceff4',
        textSecondary: '#88c0d0',
        textMuted: '#4c566a',
        accentPrimary: '#88c0d0',
        accentSecondary: '#81a1c1',
        border: '#4c566a'
      }
    }
  ],

  'catppuccin.catppuccin-vsc': [
    {
      id: 'catppuccin-mocha',
      name: 'Catppuccin Mocha',
      type: 'dark',
      extensionId: 'catppuccin.catppuccin-vsc',
      extensionName: 'Catppuccin',
      colors: {
        bgPrimary: '#1e1e2e',
        bgSecondary: '#181825',
        bgEditor: '#1e1e2e',
        textPrimary: '#cdd6f4',
        textSecondary: '#89b4fa',
        textMuted: '#6c7086',
        accentPrimary: '#89b4fa',
        accentSecondary: '#cba6f7',
        border: '#313244'
      }
    },
    {
      id: 'catppuccin-latte',
      name: 'Catppuccin Latte',
      type: 'light',
      extensionId: 'catppuccin.catppuccin-vsc',
      extensionName: 'Catppuccin',
      colors: {
        bgPrimary: '#eff1f5',
        bgSecondary: '#e6e9ef',
        bgEditor: '#eff1f5',
        textPrimary: '#4c4f69',
        textSecondary: '#1e66f5',
        textMuted: '#9ca0b0',
        accentPrimary: '#1e66f5',
        accentSecondary: '#8839ef',
        border: '#ccd0da'
      }
    },
    {
      id: 'catppuccin-frappe',
      name: 'Catppuccin Frappé',
      type: 'dark',
      extensionId: 'catppuccin.catppuccin-vsc',
      extensionName: 'Catppuccin',
      colors: {
        bgPrimary: '#303446',
        bgSecondary: '#292c3c',
        bgEditor: '#303446',
        textPrimary: '#c6d0f5',
        textSecondary: '#8caaee',
        textMuted: '#626880',
        accentPrimary: '#8caaee',
        accentSecondary: '#ca9ee6',
        border: '#414559'
      }
    },
    {
      id: 'catppuccin-macchiato',
      name: 'Catppuccin Macchiato',
      type: 'dark',
      extensionId: 'catppuccin.catppuccin-vsc',
      extensionName: 'Catppuccin',
      colors: {
        bgPrimary: '#24273a',
        bgSecondary: '#1e2030',
        bgEditor: '#24273a',
        textPrimary: '#cad3f5',
        textSecondary: '#8aadf4',
        textMuted: '#5b6078',
        accentPrimary: '#8aadf4',
        accentSecondary: '#c6a0f6',
        border: '#363a4f'
      }
    }
  ],

  'teabyii.ayu': [
    {
      id: 'ayu-dark',
      name: 'Ayu Dark',
      type: 'dark',
      extensionId: 'teabyii.ayu',
      extensionName: 'Ayu',
      colors: {
        bgPrimary: '#0a0e14',
        bgSecondary: '#0d1016',
        bgEditor: '#0a0e14',
        textPrimary: '#b3b1ad',
        textSecondary: '#39bae6',
        textMuted: '#626a73',
        accentPrimary: '#39bae6',
        accentSecondary: '#ffb454',
        border: '#1d252c'
      }
    },
    {
      id: 'ayu-mirage',
      name: 'Ayu Mirage',
      type: 'dark',
      extensionId: 'teabyii.ayu',
      extensionName: 'Ayu',
      colors: {
        bgPrimary: '#1f2430',
        bgSecondary: '#191e2a',
        bgEditor: '#1f2430',
        textPrimary: '#cbccc6',
        textSecondary: '#73d0ff',
        textMuted: '#5c6773',
        accentPrimary: '#73d0ff',
        accentSecondary: '#ffd580',
        border: '#33415e'
      }
    },
    {
      id: 'ayu-light',
      name: 'Ayu Light',
      type: 'light',
      extensionId: 'teabyii.ayu',
      extensionName: 'Ayu',
      colors: {
        bgPrimary: '#fafafa',
        bgSecondary: '#f3f4f5',
        bgEditor: '#fafafa',
        textPrimary: '#575f66',
        textSecondary: '#399ee6',
        textMuted: '#8a9199',
        accentPrimary: '#399ee6',
        accentSecondary: '#fa8d3e',
        border: '#dcdcdc'
      }
    }
  ],

  'enkia.tokyo-night': [
    {
      id: 'tokyo-night',
      name: 'Tokyo Night',
      type: 'dark',
      extensionId: 'enkia.tokyo-night',
      extensionName: 'Tokyo Night',
      colors: {
        bgPrimary: '#1a1b26',
        bgSecondary: '#16161e',
        bgEditor: '#1a1b26',
        textPrimary: '#a9b1d6',
        textSecondary: '#7aa2f7',
        textMuted: '#565f89',
        accentPrimary: '#7aa2f7',
        accentSecondary: '#bb9af7',
        border: '#292e42'
      }
    },
    {
      id: 'tokyo-night-storm',
      name: 'Tokyo Night Storm',
      type: 'dark',
      extensionId: 'enkia.tokyo-night',
      extensionName: 'Tokyo Night',
      colors: {
        bgPrimary: '#24283b',
        bgSecondary: '#1f2335',
        bgEditor: '#24283b',
        textPrimary: '#c0caf5',
        textSecondary: '#7aa2f7',
        textMuted: '#565f89',
        accentPrimary: '#7aa2f7',
        accentSecondary: '#bb9af7',
        border: '#3b4261'
      }
    },
    {
      id: 'tokyo-night-light',
      name: 'Tokyo Night Light',
      type: 'light',
      extensionId: 'enkia.tokyo-night',
      extensionName: 'Tokyo Night',
      colors: {
        bgPrimary: '#d5d6db',
        bgSecondary: '#cbccd1',
        bgEditor: '#d5d6db',
        textPrimary: '#343b58',
        textSecondary: '#34548a',
        textMuted: '#9699a3',
        accentPrimary: '#34548a',
        accentSecondary: '#5a4a78',
        border: '#b4b5b9'
      }
    }
  ],

  'whizkydee.material-palenight-theme': [
    {
      id: 'material-palenight',
      name: 'Material Palenight',
      type: 'dark',
      extensionId: 'whizkydee.material-palenight-theme',
      extensionName: 'Material Palenight',
      colors: {
        bgPrimary: '#292d3e',
        bgSecondary: '#1b1e2b',
        bgEditor: '#292d3e',
        textPrimary: '#a6accd',
        textSecondary: '#82aaff',
        textMuted: '#676e95',
        accentPrimary: '#82aaff',
        accentSecondary: '#c792ea',
        border: '#3a3f58'
      }
    }
  ],

  'equinusocio.vsc-material-theme': [
    {
      id: 'material-ocean',
      name: 'Material Ocean',
      type: 'dark',
      extensionId: 'equinusocio.vsc-material-theme',
      extensionName: 'Material Theme',
      colors: {
        bgPrimary: '#0f111a',
        bgSecondary: '#090b10',
        bgEditor: '#0f111a',
        textPrimary: '#8f93a2',
        textSecondary: '#82aaff',
        textMuted: '#464b5d',
        accentPrimary: '#82aaff',
        accentSecondary: '#c792ea',
        border: '#1a1c25'
      }
    },
    {
      id: 'material-darker',
      name: 'Material Darker',
      type: 'dark',
      extensionId: 'equinusocio.vsc-material-theme',
      extensionName: 'Material Theme',
      colors: {
        bgPrimary: '#212121',
        bgSecondary: '#1a1a1a',
        bgEditor: '#212121',
        textPrimary: '#eeffff',
        textSecondary: '#82aaff',
        textMuted: '#545454',
        accentPrimary: '#82aaff',
        accentSecondary: '#c792ea',
        border: '#2c2c2c'
      }
    },
    {
      id: 'material-lighter',
      name: 'Material Lighter',
      type: 'light',
      extensionId: 'equinusocio.vsc-material-theme',
      extensionName: 'Material Theme',
      colors: {
        bgPrimary: '#fafafa',
        bgSecondary: '#f5f5f5',
        bgEditor: '#fafafa',
        textPrimary: '#546e7a',
        textSecondary: '#6182b8',
        textMuted: '#aabfc9',
        accentPrimary: '#6182b8',
        accentSecondary: '#7c4dff',
        border: '#e7e7e8'
      }
    }
  ],

  'johnpapa.winteriscoming': [
    {
      id: 'winter-is-coming-dark',
      name: 'Winter is Coming (Dark)',
      type: 'dark',
      extensionId: 'johnpapa.winteriscoming',
      extensionName: 'Winter is Coming',
      colors: {
        bgPrimary: '#011627',
        bgSecondary: '#001122',
        bgEditor: '#011627',
        textPrimary: '#d6deeb',
        textSecondary: '#87ceeb',
        textMuted: '#5f7e97',
        accentPrimary: '#87ceeb',
        accentSecondary: '#c792ea',
        border: '#122d42'
      }
    },
    {
      id: 'winter-is-coming-light',
      name: 'Winter is Coming (Light)',
      type: 'light',
      extensionId: 'johnpapa.winteriscoming',
      extensionName: 'Winter is Coming',
      colors: {
        bgPrimary: '#ffffff',
        bgSecondary: '#f0f0f0',
        bgEditor: '#ffffff',
        textPrimary: '#236ebf',
        textSecondary: '#0000ff',
        textMuted: '#999999',
        accentPrimary: '#0000ff',
        accentSecondary: '#a626a4',
        border: '#e0e0e0'
      }
    }
  ],

  'akamud.vscode-theme-onedark': [
    {
      id: 'atom-one-dark',
      name: 'Atom One Dark',
      type: 'dark',
      extensionId: 'akamud.vscode-theme-onedark',
      extensionName: 'Atom One Dark Theme',
      colors: {
        bgPrimary: '#282c34',
        bgSecondary: '#21252b',
        bgEditor: '#282c34',
        textPrimary: '#abb2bf',
        textSecondary: '#61afef',
        textMuted: '#5c6370',
        accentPrimary: '#61afef',
        accentSecondary: '#c678dd',
        border: '#3e4451'
      }
    }
  ],

  'akamud.vscode-theme-onelight': [
    {
      id: 'atom-one-light',
      name: 'Atom One Light',
      type: 'light',
      extensionId: 'akamud.vscode-theme-onelight',
      extensionName: 'Atom One Light Theme',
      colors: {
        bgPrimary: '#fafafa',
        bgSecondary: '#f0f0f0',
        bgEditor: '#fafafa',
        textPrimary: '#383a42',
        textSecondary: '#4078f2',
        textMuted: '#a0a1a7',
        accentPrimary: '#4078f2',
        accentSecondary: '#a626a4',
        border: '#dbdbdc'
      }
    }
  ],

  'liviuschera.noctis': [
    {
      id: 'noctis',
      name: 'Noctis',
      type: 'dark',
      extensionId: 'liviuschera.noctis',
      extensionName: 'Noctis',
      colors: {
        bgPrimary: '#1b2932',
        bgSecondary: '#16242d',
        bgEditor: '#1b2932',
        textPrimary: '#c5cdd3',
        textSecondary: '#49e9a6',
        textMuted: '#5b858b',
        accentPrimary: '#49e9a6',
        accentSecondary: '#16a3b6',
        border: '#2b3e50'
      }
    },
    {
      id: 'noctis-azureus',
      name: 'Noctis Azureus',
      type: 'dark',
      extensionId: 'liviuschera.noctis',
      extensionName: 'Noctis',
      colors: {
        bgPrimary: '#14232d',
        bgSecondary: '#0f1c25',
        bgEditor: '#14232d',
        textPrimary: '#b2cacd',
        textSecondary: '#6be5fd',
        textMuted: '#507b95',
        accentPrimary: '#6be5fd',
        accentSecondary: '#df769b',
        border: '#1e3a4c'
      }
    }
  ],

  'wesbos.theme-cobalt2': [
    {
      id: 'cobalt2',
      name: 'Cobalt2',
      type: 'dark',
      extensionId: 'wesbos.theme-cobalt2',
      extensionName: 'Cobalt2 Theme',
      colors: {
        bgPrimary: '#193549',
        bgSecondary: '#122738',
        bgEditor: '#193549',
        textPrimary: '#ffffff',
        textSecondary: '#ffc600',
        textMuted: '#0d3a58',
        accentPrimary: '#ffc600',
        accentSecondary: '#ff9d00',
        border: '#1f4662'
      }
    }
  ],

  'ahmadawais.shades-of-purple': [
    {
      id: 'shades-of-purple',
      name: 'Shades of Purple',
      type: 'dark',
      extensionId: 'ahmadawais.shades-of-purple',
      extensionName: 'Shades of Purple',
      colors: {
        bgPrimary: '#2d2b55',
        bgSecondary: '#1e1e3f',
        bgEditor: '#2d2b55',
        textPrimary: '#e7e7e7',
        textSecondary: '#fad000',
        textMuted: '#a599e9',
        accentPrimary: '#fad000',
        accentSecondary: '#ff628c',
        border: '#4d21fc'
      }
    }
  ],

  'RobbOwen.synthwave-vscode': [
    {
      id: 'synthwave-84',
      name: 'SynthWave \'84',
      type: 'dark',
      extensionId: 'RobbOwen.synthwave-vscode',
      extensionName: 'SynthWave \'84',
      colors: {
        bgPrimary: '#262335',
        bgSecondary: '#1e1a2e',
        bgEditor: '#262335',
        textPrimary: '#ffffff',
        textSecondary: '#ff7edb',
        textMuted: '#848bbd',
        accentPrimary: '#ff7edb',
        accentSecondary: '#36f9f6',
        border: '#34294f'
      }
    }
  ],

  'daltonmenezes.aura-theme': [
    {
      id: 'aura-dark',
      name: 'Aura Dark',
      type: 'dark',
      extensionId: 'daltonmenezes.aura-theme',
      extensionName: 'Aura Theme',
      colors: {
        bgPrimary: '#15141b',
        bgSecondary: '#110f18',
        bgEditor: '#15141b',
        textPrimary: '#edecee',
        textSecondary: '#a277ff',
        textMuted: '#6d6d6d',
        accentPrimary: '#a277ff',
        accentSecondary: '#61ffca',
        border: '#29263c'
      }
    },
    {
      id: 'aura-soft-dark',
      name: 'Aura Soft Dark',
      type: 'dark',
      extensionId: 'daltonmenezes.aura-theme',
      extensionName: 'Aura Theme',
      colors: {
        bgPrimary: '#21202e',
        bgSecondary: '#1c1b27',
        bgEditor: '#21202e',
        textPrimary: '#edecee',
        textSecondary: '#a277ff',
        textMuted: '#6d6d6d',
        accentPrimary: '#a277ff',
        accentSecondary: '#61ffca',
        border: '#2e2d3d'
      }
    }
  ],

  'antfu.theme-vitesse': [
    {
      id: 'vitesse-dark',
      name: 'Vitesse Dark',
      type: 'dark',
      extensionId: 'antfu.theme-vitesse',
      extensionName: 'Vitesse Theme',
      colors: {
        bgPrimary: '#121212',
        bgSecondary: '#0e0e0e',
        bgEditor: '#121212',
        textPrimary: '#dbd7ca',
        textSecondary: '#4d9375',
        textMuted: '#758575',
        accentPrimary: '#4d9375',
        accentSecondary: '#cb7676',
        border: '#2c2c2c'
      }
    },
    {
      id: 'vitesse-light',
      name: 'Vitesse Light',
      type: 'light',
      extensionId: 'antfu.theme-vitesse',
      extensionName: 'Vitesse Theme',
      colors: {
        bgPrimary: '#ffffff',
        bgSecondary: '#f7f7f7',
        bgEditor: '#ffffff',
        textPrimary: '#393a34',
        textSecondary: '#1e754f',
        textMuted: '#999999',
        accentPrimary: '#1e754f',
        accentSecondary: '#ab5959',
        border: '#e5e5e5'
      }
    }
  ],

  'PKief.material-icon-theme': [],
  'vscode-icons-team.vscode-icons': [],
  'ms-python.python': [],
  'dbaeumer.vscode-eslint': [],
  'esbenp.prettier-vscode': [],
  'golang.go': [],
  'rust-lang.rust-analyzer': [],
  'ms-vscode.cpptools': [],
  'redhat.java': []
}

// Store for active external themes
let activeExternalThemes: ExternalTheme[] = []

export const ExternalThemeService = {
  // Get themes from installed extensions
  getAvailableThemes(installedExtensions: InstalledExtension[]): ExternalTheme[] {
    const themes: ExternalTheme[] = []
    
    installedExtensions.forEach(ext => {
      if (ext.enabled && extensionThemes[ext.id]) {
        themes.push(...extensionThemes[ext.id])
      }
    })
    
    activeExternalThemes = themes
    return themes
  },

  // Get a specific theme by ID
  getTheme(themeId: string): ExternalTheme | undefined {
    for (const themes of Object.values(extensionThemes)) {
      const found = themes.find(t => t.id === themeId)
      if (found) return found
    }
    return undefined
  },

  // Apply external theme to document - WHOLE APP
  applyTheme(theme: ExternalTheme): void {
    const root = document.documentElement
    const body = document.body
    
    // Set all CSS variables used by the app - apply to both root and body
    const setVar = (name: string, value: string) => {
      root.style.setProperty(name, value)
      body.style.setProperty(name, value)
    }
    
    setVar('--bg-primary', theme.colors.bgPrimary)
    setVar('--bg-secondary', theme.colors.bgSecondary)
    setVar('--bg-tertiary', theme.colors.bgSecondary)
    setVar('--glass-bg', `${theme.colors.bgSecondary}e6`)
    setVar('--glass-border', theme.colors.border)
    setVar('--text-primary', theme.colors.textPrimary)
    setVar('--text-secondary', theme.colors.textSecondary)
    setVar('--text-muted', theme.colors.textMuted)
    setVar('--accent-primary', theme.colors.accentPrimary)
    setVar('--accent-secondary', theme.colors.accentSecondary)
    setVar('--editor-bg', `${theme.colors.bgEditor}cc`)
    setVar('--scrollbar', theme.type === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)')
    setVar('--glow-1', `${theme.colors.accentPrimary}20`)
    setVar('--glow-2', `${theme.colors.accentSecondary}20`)
    
    // Force background color on body and html
    root.style.backgroundColor = theme.colors.bgPrimary
    body.style.backgroundColor = theme.colors.bgPrimary
    root.style.color = theme.colors.textPrimary
    body.style.color = theme.colors.textPrimary
    
    // Remove any existing theme class and add the type
    const themeClasses = ['dark', 'light', 'midnight', 'forest', 'sunset', 'aurora', 'rose', 'cyber', 'ocean', 'lavender', 'mocha', 'nord']
    themeClasses.forEach(cls => {
      body.classList.remove(cls)
      root.classList.remove(cls)
    })
    
    // Add external theme marker and type
    body.classList.add(theme.type, 'external-theme')
    root.classList.add(theme.type, 'external-theme')
    
    // Store active theme ID
    localStorage.setItem('external-theme-id', theme.id)
    
    console.log(`[Theme] Applied external theme to WHOLE APP: ${theme.name}`, theme.colors)
  },

  // Reset to built-in theme
  resetTheme(): void {
    const root = document.documentElement
    const body = document.body
    
    const removeVar = (name: string) => {
      root.style.removeProperty(name)
      body.style.removeProperty(name)
    }
    
    // Remove inline styles
    removeVar('--bg-primary')
    removeVar('--bg-secondary')
    removeVar('--bg-tertiary')
    removeVar('--glass-bg')
    removeVar('--glass-border')
    removeVar('--text-primary')
    removeVar('--text-secondary')
    removeVar('--text-muted')
    removeVar('--accent-primary')
    removeVar('--accent-secondary')
    removeVar('--editor-bg')
    removeVar('--scrollbar')
    removeVar('--glow-1')
    removeVar('--glow-2')
    
    // Remove forced background
    root.style.removeProperty('background-color')
    body.style.removeProperty('background-color')
    root.style.removeProperty('color')
    body.style.removeProperty('color')
    
    body.classList.remove('external-theme')
    root.classList.remove('external-theme')
    
    localStorage.removeItem('external-theme-id')
    
    console.log('[Theme] Reset to built-in theme')
  },

  // Check if extension provides themes
  hasThemes(extensionId: string): boolean {
    return extensionId in extensionThemes
  },

  // Get theme count for extension
  getThemeCount(extensionId: string): number {
    return extensionThemes[extensionId]?.length || 0
  },

  // Get all active themes
  getActiveThemes(): ExternalTheme[] {
    return activeExternalThemes
  }
}
