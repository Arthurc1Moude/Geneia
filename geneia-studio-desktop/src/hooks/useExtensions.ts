/**
 * Extension Management Hook
 * Handles activation/deactivation of extensions and provides extension features
 */

import { useEffect, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { ExtensionRuntime, detectLanguage, type LintResult, type Snippet, type Completion } from '../services/extensionRuntime'

export function useExtensions() {
  const { installedExtensions, currentFile } = useStore()

  // Activate/deactivate extensions based on enabled state
  useEffect(() => {
    installedExtensions.forEach(ext => {
      if (ext.enabled && !ExtensionRuntime.isActive(ext.id)) {
        ExtensionRuntime.activateExtension(ext)
      } else if (!ext.enabled && ExtensionRuntime.isActive(ext.id)) {
        ExtensionRuntime.deactivateExtension(ext.id)
      }
    })

    // Deactivate uninstalled extensions
    ExtensionRuntime.getActiveExtensions().forEach(extId => {
      if (!installedExtensions.find(e => e.id === extId)) {
        ExtensionRuntime.deactivateExtension(extId)
      }
    })
  }, [installedExtensions])

  // Current language based on file
  const currentLanguage = useMemo(() => {
    return currentFile ? detectLanguage(currentFile) : 'geneia'
  }, [currentFile])

  // Get active extensions for current language
  const activeLanguageExtensions = useMemo(() => {
    return ExtensionRuntime.getExtensionsForLanguage(currentLanguage)
  }, [currentLanguage, installedExtensions])

  // Format code using extensions
  const formatCode = (code: string): string => {
    return ExtensionRuntime.formatCode(code, currentLanguage)
  }

  // Lint code using extensions
  const lintCode = (code: string): LintResult[] => {
    return ExtensionRuntime.lintCode(code, currentLanguage)
  }

  // Get snippets for current language
  const getSnippets = (): Snippet[] => {
    return ExtensionRuntime.getSnippets(currentLanguage)
  }

  // Get completions
  const getCompletions = (code: string, position: number): Completion[] => {
    return ExtensionRuntime.getCompletions(code, position, currentLanguage)
  }

  // Check if any extension supports the current language
  const hasLanguageSupport = activeLanguageExtensions.length > 0

  return {
    currentLanguage,
    activeLanguageExtensions,
    hasLanguageSupport,
    formatCode,
    lintCode,
    getSnippets,
    getCompletions,
    activeCount: ExtensionRuntime.getActiveCount(),
    isExtensionActive: ExtensionRuntime.isActive,
    hasBuiltInSupport: ExtensionRuntime.hasBuiltInSupport,
  }
}
