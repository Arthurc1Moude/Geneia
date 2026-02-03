/**
 * Global Problems Service
 * Checks all files for errors using the real Geneia compiler
 */

import { GeneiaFile } from '../store/useStore'
import { checkGeneiaGrammar, checkGeneiaGrammarAsync, GrammarError, getErrorCounts } from './geneiaGrammar'

export interface FileProblems {
  filename: string
  errors: GrammarError[]
  counts: { errors: number; warnings: number; info: number }
}

export interface GlobalProblemsResult {
  files: FileProblems[]
  totalErrors: number
  totalWarnings: number
  totalInfo: number
}

// Check all files for problems (async - uses real compiler)
export async function checkAllFilesAsync(files: GeneiaFile[]): Promise<GlobalProblemsResult> {
  const result: GlobalProblemsResult = {
    files: [],
    totalErrors: 0,
    totalWarnings: 0,
    totalInfo: 0
  }

  for (const file of files) {
    if (!file.name.endsWith('.gn')) continue

    const grammarResult = await checkGeneiaGrammarAsync(file.content, file.name)
    const counts = getErrorCounts(grammarResult.errors)

    if (grammarResult.errors.length > 0) {
      result.files.push({
        filename: file.name,
        errors: grammarResult.errors,
        counts
      })
    }

    result.totalErrors += counts.errors
    result.totalWarnings += counts.warnings
    result.totalInfo += counts.info
  }

  result.files.sort((a, b) => b.counts.errors - a.counts.errors)
  return result
}

// Sync version (fallback)
export function checkAllFiles(files: GeneiaFile[]): GlobalProblemsResult {
  const result: GlobalProblemsResult = {
    files: [],
    totalErrors: 0,
    totalWarnings: 0,
    totalInfo: 0
  }

  files.forEach(file => {
    if (!file.name.endsWith('.gn')) return

    const grammarResult = checkGeneiaGrammar(file.content, file.name)
    const counts = getErrorCounts(grammarResult.errors)

    if (grammarResult.errors.length > 0) {
      result.files.push({
        filename: file.name,
        errors: grammarResult.errors,
        counts
      })
    }

    result.totalErrors += counts.errors
    result.totalWarnings += counts.warnings
    result.totalInfo += counts.info
  })

  result.files.sort((a, b) => b.counts.errors - a.counts.errors)
  return result
}

// Get problems for a specific file (async - uses real compiler)
export async function getFileProblemsAsync(files: GeneiaFile[], filename: string): Promise<FileProblems | null> {
  const file = files.find(f => f.name === filename)
  if (!file) return null

  const grammarResult = await checkGeneiaGrammarAsync(file.content, filename)
  const counts = getErrorCounts(grammarResult.errors)

  return {
    filename,
    errors: grammarResult.errors,
    counts
  }
}

// Sync version (fallback)
export function getFileProblems(files: GeneiaFile[], filename: string): FileProblems | null {
  const file = files.find(f => f.name === filename)
  if (!file) return null

  const grammarResult = checkGeneiaGrammar(file.content, filename)
  const counts = getErrorCounts(grammarResult.errors)

  return {
    filename,
    errors: grammarResult.errors,
    counts
  }
}
