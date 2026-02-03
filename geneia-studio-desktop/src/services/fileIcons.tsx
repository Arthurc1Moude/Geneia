/**
 * File Icons Service - Using official icons from programming-languages-logos
 */

import { 
  FileText, File, FileImage, FileVideo, FileAudio,
  Archive, Terminal, Binary
} from 'lucide-react'

// ============== ICON COMPONENTS ==============

// Create icon component from public path
function createIconComponent(path: string, alt: string) {
  return function IconComponent({ className }: { className?: string }) {
    return <img src={path} alt={alt} className={className} style={{ objectFit: 'contain' }} />
  }
}

// Official icons from programming-languages-logos package (copied to public)
const JavaScriptIcon = createIconComponent('/icons/languages/javascript.svg', 'JavaScript')
const TypeScriptIcon = createIconComponent('/icons/languages/typescript.svg', 'TypeScript')
const PythonIcon = createIconComponent('/icons/languages/python.svg', 'Python')
const GoIcon = createIconComponent('/icons/languages/go.svg', 'Go')
const JavaIcon = createIconComponent('/icons/languages/java.svg', 'Java')
const CIcon = createIconComponent('/icons/languages/c.svg', 'C')
const CppIcon = createIconComponent('/icons/languages/cpp.svg', 'C++')
const CSharpIcon = createIconComponent('/icons/languages/csharp.svg', 'C#')
const HtmlIcon = createIconComponent('/icons/languages/html.svg', 'HTML')
const CssIcon = createIconComponent('/icons/languages/css.svg', 'CSS')
const PhpIcon = createIconComponent('/icons/languages/php.svg', 'PHP')
const RubyIcon = createIconComponent('/icons/languages/ruby.svg', 'Ruby')
const SwiftIcon = createIconComponent('/icons/languages/swift.svg', 'Swift')
const KotlinIcon = createIconComponent('/icons/languages/kotlin.svg', 'Kotlin')
const RIcon = createIconComponent('/icons/languages/r.svg', 'R')
const HaskellIcon = createIconComponent('/icons/languages/haskell.svg', 'Haskell')
const LuaIcon = createIconComponent('/icons/languages/lua.svg', 'Lua')

// Custom icons for languages not in the package

// React - Official atom logo
function ReactIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-11.5 -10.232 23 20.463" xmlns="http://www.w3.org/2000/svg">
      <circle r="2.05" fill="#61DAFB"/>
      <g stroke="#61DAFB" fill="none" strokeWidth="1">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  )
}


// Vue.js - Official logo
function VueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 221" xmlns="http://www.w3.org/2000/svg">
      <path fill="#41B883" d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z"/>
      <path fill="#41B883" d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0z"/>
      <path fill="#35495E" d="M50.56 0L128 133.12 204.8 0h-47.36L128 51.2 97.92 0H50.56z"/>
    </svg>
  )
}

// Svelte - Official logo
function SvelteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 308" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FF3E00" d="M239.682 40.707C211.113-.182 154.69-12.301 113.895 13.69L42.247 59.356a82.198 82.198 0 0 0-37.135 55.056 86.566 86.566 0 0 0 8.536 55.576 82.425 82.425 0 0 0-12.296 30.719 87.596 87.596 0 0 0 14.964 66.244c28.574 40.893 84.997 53.007 125.787 27.016l71.648-45.664a82.182 82.182 0 0 0 37.135-55.057 86.601 86.601 0 0 0-8.53-55.577 82.397 82.397 0 0 0 12.29-30.718 87.573 87.573 0 0 0-14.963-66.244"/>
      <path fill="#fff" d="M106.889 270.841c-23.102 6.007-47.497-3.036-61.103-22.648a52.685 52.685 0 0 1-9.003-39.85 49.978 49.978 0 0 1 1.713-6.693l1.35-4.115 3.671 2.697a92.447 92.447 0 0 0 28.036 14.007l2.663.808-.245 2.659a16.067 16.067 0 0 0 2.89 10.656 17.143 17.143 0 0 0 18.397 6.828 15.786 15.786 0 0 0 4.403-1.935l71.67-45.672a14.922 14.922 0 0 0 6.734-9.977 15.923 15.923 0 0 0-2.713-12.011 17.156 17.156 0 0 0-18.404-6.832 15.78 15.78 0 0 0-4.396 1.933l-27.35 17.434a52.298 52.298 0 0 1-14.553 6.391c-23.101 6.007-47.497-3.036-61.101-22.649a52.681 52.681 0 0 1-9.004-39.849 49.428 49.428 0 0 1 22.34-33.114l71.664-45.677a52.218 52.218 0 0 1 14.563-6.398c23.101-6.007 47.497 3.036 61.101 22.648a52.685 52.685 0 0 1 9.004 39.85 50.559 50.559 0 0 1-1.713 6.692l-1.35 4.116-3.67-2.693a92.373 92.373 0 0 0-28.037-14.013l-2.664-.809.246-2.658a16.099 16.099 0 0 0-2.89-10.656 17.143 17.143 0 0 0-18.398-6.828 15.786 15.786 0 0 0-4.402 1.935l-71.67 45.674a14.898 14.898 0 0 0-6.73 9.975 15.9 15.9 0 0 0 2.709 12.012 17.156 17.156 0 0 0 18.404 6.832 15.841 15.841 0 0 0 4.402-1.935l27.345-17.427a52.147 52.147 0 0 1 14.552-6.397c23.101-6.006 47.497 3.037 61.102 22.65a52.681 52.681 0 0 1 9.003 39.848 49.453 49.453 0 0 1-22.34 33.12l-71.664 45.673a52.218 52.218 0 0 1-14.563 6.398"/>
    </svg>
  )
}

// Rust - Official logo
function RustIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#000" width="256" height="256" rx="16"/>
      <circle cx="128" cy="128" r="80" fill="none" stroke="#F74C00" strokeWidth="12"/>
      <circle cx="128" cy="128" r="8" fill="#F74C00"/>
      <g fill="#F74C00">
        <rect x="124" y="56" width="8" height="24"/>
        <rect x="124" y="176" width="8" height="24"/>
        <rect x="56" y="124" width="24" height="8"/>
        <rect x="176" y="124" width="24" height="8"/>
      </g>
    </svg>
  )
}

// Dart - Official logo
function DartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#01579B" width="256" height="256" rx="16"/>
      <path fill="#40C4FF" d="M64 64l128 64-128 64V64z"/>
      <path fill="#fff" d="M64 64l64 64-64 64V64z" opacity=".5"/>
    </svg>
  )
}

// Docker - Official logo
function DockerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 185" xmlns="http://www.w3.org/2000/svg">
      <path fill="#2496ED" d="M250.7 70.5c-5-3.3-16.6-4.6-25.5-2.9-1.2-8.9-6.2-16.5-15.2-23.5l-5.2-3.5-3.5 5.2c-4.4 6.9-6.7 16.3-5.9 25.4.3 3.3 1.5 9.3 5 14.6-3.5 2-10.5 4.6-19.7 4.4H.5l-.5 1.7c-1.8 10.5-1.8 43.2 19.4 68.4 16.2 19.2 40.3 28.9 71.9 28.9 68.5 0 119.2-31.5 143.1-88.8 9.3.2 29.5.2 39.8-19.7.3-.5 2.6-5.3 3.3-6.9l1.2-2.6-4.1-2.7zM141 50.5h-24.8v24.8H141V50.5zm0-28.9h-24.8v24.8H141V21.6zm-28.9 28.9H87.2v24.8h24.8V50.5zm0-28.9H87.2v24.8h24.8V21.6zM83.2 50.5H58.3v24.8h24.8V50.5zm-28.9 0H29.4v24.8h24.8V50.5zm28.9-28.9H58.3v24.8h24.8V21.6zm57.9 28.9h-24.8v24.8h24.8V50.5z"/>
    </svg>
  )
}

// Git - Official logo
function GitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <path fill="#F05032" d="M251.2 116.6L139.4 4.8c-6.4-6.4-16.9-6.4-23.3 0l-23.2 23.2 29.4 29.4c6.8-2.3 14.7-.8 20.1 4.7 5.5 5.5 7 13.4 4.7 20.3l28.4 28.4c6.9-2.4 14.8-.8 20.3 4.7 7.7 7.7 7.7 20.1 0 27.7-7.7 7.7-20.1 7.7-27.7 0-5.8-5.8-7.2-14.2-4.3-21.3l-26.5-26.5v69.6c1.9.9 3.6 2.1 5.2 3.7 7.7 7.7 7.7 20.1 0 27.7-7.7 7.7-20.1 7.7-27.7 0-7.7-7.7-7.7-20.1 0-27.7 2-2 4.2-3.5 6.7-4.6V91.8c-2.4-1.1-4.7-2.6-6.7-4.6-5.8-5.8-7.2-14.4-4.2-21.5L80.2 35.2 4.8 110.5c-6.4 6.4-6.4 16.9 0 23.3l111.8 111.8c6.4 6.4 16.9 6.4 23.3 0l111.3-111.3c6.4-6.4 6.4-16.9 0-23.8"/>
    </svg>
  )
}

// JSON icon
function JsonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#292929" width="256" height="256" rx="16"/>
      <text x="128" y="160" textAnchor="middle" fill="#F5D742" fontSize="80" fontFamily="monospace" fontWeight="bold">&#123;&#125;</text>
    </svg>
  )
}

// Markdown icon
function MarkdownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 158" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#083FA1" width="256" height="158" rx="16"/>
      <path fill="#fff" d="M30 98V60h20l20 25 20-25h20v38h-20V78l-20 25-20-25v20H30zm125 0l-30-33h20V60h20v5l20-5h20v38h-20V78l-20 20-10-10v10h-20z"/>
    </svg>
  )
}

// YAML icon
function YamlIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#CB171E" width="256" height="256" rx="16"/>
      <text x="128" y="155" textAnchor="middle" fill="#fff" fontSize="72" fontFamily="Arial, sans-serif" fontWeight="bold">YAML</text>
    </svg>
  )
}

// SQL icon
function SqlIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#00758F" width="256" height="256" rx="16"/>
      <ellipse fill="#F29111" cx="128" cy="64" rx="80" ry="32"/>
      <path fill="#F29111" d="M48 64v128c0 17.7 35.8 32 80 32s80-14.3 80-32V64c0 17.7-35.8 32-80 32S48 81.7 48 64z" opacity=".8"/>
    </svg>
  )
}

// Geneia - Official icon
function GeneiaIcon({ className }: { className?: string }) {
  return (
    <img 
      className={className} 
      src="data:image/png;base64,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"
      alt="Geneia"
      style={{ objectFit: 'contain' }}
    />
  )
}

// INT Icon
function IntIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#7C3AED" width="256" height="256" rx="16"/>
      <text x="128" y="155" textAnchor="middle" fill="#fff" fontSize="72" fontFamily="Arial, sans-serif" fontWeight="bold">INT</text>
    </svg>
  )
}

// Scala icon
function ScalaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#DC322F" width="256" height="256" rx="16"/>
      <path fill="#fff" d="M48 48v40c0 0 80 10 160 0v-40c0 0-80 10-160 0zm0 60v40c0 0 80 10 160 0v-40c0 0-80 10-160 0zm0 60v40c0 0 80 10 160 0v-40c0 0-80 10-160 0z"/>
    </svg>
  )
}

// Perl icon
function PerlIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#39457E" width="256" height="256" rx="16"/>
      <text x="128" y="155" textAnchor="middle" fill="#fff" fontSize="72" fontFamily="Arial, sans-serif" fontWeight="bold">Perl</text>
    </svg>
  )
}

// Shell/Bash icon
function ShellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#4EAA25" width="256" height="256" rx="16"/>
      <text x="128" y="140" textAnchor="middle" fill="#fff" fontSize="48" fontFamily="monospace" fontWeight="bold">$_</text>
      <text x="128" y="190" textAnchor="middle" fill="#fff" fontSize="32" fontFamily="Arial, sans-serif">bash</text>
    </svg>
  )
}

// PowerShell icon
function PowerShellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect fill="#012456" width="256" height="256" rx="16"/>
      <path fill="#fff" d="M60 80l60 48-60 48v-20l40-28-40-28V80zm80 76h56v20h-56v-20z"/>
    </svg>
  )
}

// ============== FILE ICON CONFIGURATION ==============

interface FileIconConfig {
  icon: React.ComponentType<{ className?: string }>
  color: string
  label: string
}

// Binary file extensions
export const BINARY_EXTENSIONS = new Set([
  'exe', 'dll', 'so', 'dylib', 'bin', 'dat', 'o', 'obj', 'class',
  'pyc', 'pyo', 'wasm', 'a', 'lib'
])

// Image file extensions
export const IMAGE_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'svg', 'webp', 'tiff', 'tif'
])

// Video file extensions
export const VIDEO_EXTENSIONS = new Set([
  'mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v'
])

// Audio file extensions
export const AUDIO_EXTENSIONS = new Set([
  'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'
])

// Archive file extensions
export const ARCHIVE_EXTENSIONS = new Set([
  'zip', 'tar', 'gz', 'rar', '7z', 'bz2', 'xz', 'tgz'
])

// File extension to icon mapping
const fileIconMap: Record<string, FileIconConfig> = {
  // Geneia
  'gn': { icon: GeneiaIcon, color: '#8B5CF6', label: 'Geneia' },
  'intcnf': { icon: IntIcon, color: '#7C3AED', label: 'INT Config' },
  'intpkf': { icon: IntIcon, color: '#7C3AED', label: 'INT Package' },
  
  // JavaScript/TypeScript
  'js': { icon: JavaScriptIcon, color: '#F7DF1E', label: 'JavaScript' },
  'mjs': { icon: JavaScriptIcon, color: '#F7DF1E', label: 'JavaScript Module' },
  'cjs': { icon: JavaScriptIcon, color: '#F7DF1E', label: 'CommonJS' },
  'jsx': { icon: ReactIcon, color: '#61DAFB', label: 'React JSX' },
  'ts': { icon: TypeScriptIcon, color: '#3178C6', label: 'TypeScript' },
  'tsx': { icon: ReactIcon, color: '#61DAFB', label: 'React TSX' },
  
  // Web
  'html': { icon: HtmlIcon, color: '#E34F26', label: 'HTML' },
  'htm': { icon: HtmlIcon, color: '#E34F26', label: 'HTML' },
  'css': { icon: CssIcon, color: '#1572B6', label: 'CSS' },
  'scss': { icon: CssIcon, color: '#CC6699', label: 'SCSS' },
  'sass': { icon: CssIcon, color: '#CC6699', label: 'Sass' },
  'less': { icon: CssIcon, color: '#1D365D', label: 'Less' },
  'vue': { icon: VueIcon, color: '#4FC08D', label: 'Vue' },
  'svelte': { icon: SvelteIcon, color: '#FF3E00', label: 'Svelte' },
  
  // Python
  'py': { icon: PythonIcon, color: '#3776AB', label: 'Python' },
  'pyw': { icon: PythonIcon, color: '#3776AB', label: 'Python' },
  'pyx': { icon: PythonIcon, color: '#3776AB', label: 'Cython' },
  'pyi': { icon: PythonIcon, color: '#3776AB', label: 'Python Stub' },
  
  // Java/JVM
  'java': { icon: JavaIcon, color: '#007396', label: 'Java' },
  'kt': { icon: KotlinIcon, color: '#7F52FF', label: 'Kotlin' },
  'kts': { icon: KotlinIcon, color: '#7F52FF', label: 'Kotlin Script' },
  'scala': { icon: ScalaIcon, color: '#DC322F', label: 'Scala' },
  'groovy': { icon: JavaIcon, color: '#4298B8', label: 'Groovy' },
  
  // C/C++/C#
  'c': { icon: CIcon, color: '#A8B9CC', label: 'C' },
  'h': { icon: CIcon, color: '#A8B9CC', label: 'C Header' },
  'cpp': { icon: CppIcon, color: '#00599C', label: 'C++' },
  'cc': { icon: CppIcon, color: '#00599C', label: 'C++' },
  'cxx': { icon: CppIcon, color: '#00599C', label: 'C++' },
  'hpp': { icon: CppIcon, color: '#00599C', label: 'C++ Header' },
  'hxx': { icon: CppIcon, color: '#00599C', label: 'C++ Header' },
  'cs': { icon: CSharpIcon, color: '#239120', label: 'C#' },
  
  // Go
  'go': { icon: GoIcon, color: '#00ADD8', label: 'Go' },
  
  // Rust
  'rs': { icon: RustIcon, color: '#F74C00', label: 'Rust' },
  
  // Ruby
  'rb': { icon: RubyIcon, color: '#CC342D', label: 'Ruby' },
  'erb': { icon: RubyIcon, color: '#CC342D', label: 'ERB Template' },
  'rake': { icon: RubyIcon, color: '#CC342D', label: 'Rakefile' },
  
  // PHP
  'php': { icon: PhpIcon, color: '#777BB4', label: 'PHP' },
  
  // Swift
  'swift': { icon: SwiftIcon, color: '#F05138', label: 'Swift' },
  
  // Dart/Flutter
  'dart': { icon: DartIcon, color: '#0175C2', label: 'Dart' },
  
  // R
  'r': { icon: RIcon, color: '#276DC3', label: 'R' },
  'rmd': { icon: RIcon, color: '#276DC3', label: 'R Markdown' },
  
  // Haskell
  'hs': { icon: HaskellIcon, color: '#5D4F85', label: 'Haskell' },
  'lhs': { icon: HaskellIcon, color: '#5D4F85', label: 'Literate Haskell' },
  
  // Lua
  'lua': { icon: LuaIcon, color: '#000080', label: 'Lua' },
  
  // Perl
  'pl': { icon: PerlIcon, color: '#39457E', label: 'Perl' },
  'pm': { icon: PerlIcon, color: '#39457E', label: 'Perl Module' },
  
  // Shell
  'sh': { icon: ShellIcon, color: '#4EAA25', label: 'Shell Script' },
  'bash': { icon: ShellIcon, color: '#4EAA25', label: 'Bash Script' },
  'zsh': { icon: ShellIcon, color: '#4EAA25', label: 'Zsh Script' },
  'fish': { icon: ShellIcon, color: '#4EAA25', label: 'Fish Script' },
  'ps1': { icon: PowerShellIcon, color: '#012456', label: 'PowerShell' },
  'psm1': { icon: PowerShellIcon, color: '#012456', label: 'PowerShell Module' },
  
  // Data formats
  'json': { icon: JsonIcon, color: '#F5D742', label: 'JSON' },
  'yaml': { icon: YamlIcon, color: '#CB171E', label: 'YAML' },
  'yml': { icon: YamlIcon, color: '#CB171E', label: 'YAML' },
  'xml': { icon: HtmlIcon, color: '#E34F26', label: 'XML' },
  'toml': { icon: YamlIcon, color: '#9C4121', label: 'TOML' },
  
  // Markdown
  'md': { icon: MarkdownIcon, color: '#083FA1', label: 'Markdown' },
  'mdx': { icon: MarkdownIcon, color: '#083FA1', label: 'MDX' },
  'markdown': { icon: MarkdownIcon, color: '#083FA1', label: 'Markdown' },
  
  // Database
  'sql': { icon: SqlIcon, color: '#00758F', label: 'SQL' },
  'sqlite': { icon: SqlIcon, color: '#003B57', label: 'SQLite' },
  'db': { icon: SqlIcon, color: '#00758F', label: 'Database' },
  
  // Docker
  'dockerfile': { icon: DockerIcon, color: '#2496ED', label: 'Dockerfile' },
  
  // Git
  'gitignore': { icon: GitIcon, color: '#F05032', label: 'Git Ignore' },
  'gitattributes': { icon: GitIcon, color: '#F05032', label: 'Git Attributes' },
}

// Special file names mapping
const specialFileMap: Record<string, FileIconConfig> = {
  'dockerfile': { icon: DockerIcon, color: '#2496ED', label: 'Dockerfile' },
  'docker-compose.yml': { icon: DockerIcon, color: '#2496ED', label: 'Docker Compose' },
  'docker-compose.yaml': { icon: DockerIcon, color: '#2496ED', label: 'Docker Compose' },
  '.gitignore': { icon: GitIcon, color: '#F05032', label: 'Git Ignore' },
  '.gitattributes': { icon: GitIcon, color: '#F05032', label: 'Git Attributes' },
  'package.json': { icon: JsonIcon, color: '#CB3837', label: 'NPM Package' },
  'tsconfig.json': { icon: TypeScriptIcon, color: '#3178C6', label: 'TypeScript Config' },
  'jsconfig.json': { icon: JavaScriptIcon, color: '#F7DF1E', label: 'JavaScript Config' },
  'makefile': { icon: Terminal, color: '#6D8086', label: 'Makefile' },
  'cmakelists.txt': { icon: Terminal, color: '#064F8C', label: 'CMake' },
  'readme.md': { icon: MarkdownIcon, color: '#083FA1', label: 'README' },
  'license': { icon: FileText, color: '#D4AA00', label: 'License' },
  'license.md': { icon: FileText, color: '#D4AA00', label: 'License' },
  'license.txt': { icon: FileText, color: '#D4AA00', label: 'License' },
}

// ============== EXPORT FUNCTIONS ==============

export function getFileIcon(filename: string): FileIconConfig {
  const lowerName = filename.toLowerCase()
  
  // Check special file names first
  if (specialFileMap[lowerName]) {
    return specialFileMap[lowerName]
  }
  
  // Get extension
  const ext = lowerName.split('.').pop() || ''
  
  // Check extension mapping
  if (fileIconMap[ext]) {
    return fileIconMap[ext]
  }
  
  // Check file categories
  if (BINARY_EXTENSIONS.has(ext)) {
    return { icon: Binary, color: '#6D8086', label: 'Binary File' }
  }
  if (IMAGE_EXTENSIONS.has(ext)) {
    return { icon: FileImage, color: '#A855F7', label: 'Image' }
  }
  if (VIDEO_EXTENSIONS.has(ext)) {
    return { icon: FileVideo, color: '#EF4444', label: 'Video' }
  }
  if (AUDIO_EXTENSIONS.has(ext)) {
    return { icon: FileAudio, color: '#22C55E', label: 'Audio' }
  }
  if (ARCHIVE_EXTENSIONS.has(ext)) {
    return { icon: Archive, color: '#F59E0B', label: 'Archive' }
  }
  
  // Default file icon
  return { icon: File, color: '#6D8086', label: 'File' }
}

export function isBinaryFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return BINARY_EXTENSIONS.has(ext)
}

export function isImageFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return IMAGE_EXTENSIONS.has(ext)
}

export function isVideoFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return VIDEO_EXTENSIONS.has(ext)
}

export function isAudioFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return AUDIO_EXTENSIONS.has(ext)
}

export function isArchiveFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return ARCHIVE_EXTENSIONS.has(ext)
}

export function getFileCategory(filename: string): string {
  const ext = filename.toLowerCase().split('.').pop() || ''
  
  if (BINARY_EXTENSIONS.has(ext)) return 'binary'
  if (IMAGE_EXTENSIONS.has(ext)) return 'image'
  if (VIDEO_EXTENSIONS.has(ext)) return 'video'
  if (AUDIO_EXTENSIONS.has(ext)) return 'audio'
  if (ARCHIVE_EXTENSIONS.has(ext)) return 'archive'
  if (fileIconMap[ext]) return 'code'
  return 'text'
}

// React component for file icons
export function FileIcon({ filename, className = 'w-4 h-4' }: { filename: string; className?: string }) {
  const { icon: IconComponent } = getFileIcon(filename)
  return <IconComponent className={className} />
}