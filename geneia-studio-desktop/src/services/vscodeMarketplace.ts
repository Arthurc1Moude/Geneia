/**
 * VS Code Marketplace API Service
 * Fetches real extension data from the Visual Studio Marketplace
 */

export interface VSCodeExtension {
  extensionId: string
  extensionName: string
  displayName: string
  shortDescription: string
  publisher: {
    publisherId: string
    publisherName: string
    displayName: string
  }
  versions: Array<{
    version: string
    lastUpdated: string
    properties?: Array<{
      key: string
      value: string
    }>
  }>
  statistics: Array<{
    statisticName: string
    value: number
  }>
  categories: string[]
  tags: string[]
  lastUpdated?: string
}

export interface MarketplaceResponse {
  results: Array<{
    extensions: VSCodeExtension[]
    resultMetadata: Array<{
      metadataType: string
      metadataItems: Array<{ name: string; count: number }>
    }>
  }>
}

const MARKETPLACE_API = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery'

// Search extensions from VS Code Marketplace
export async function searchExtensions(query: string, pageSize = 20): Promise<VSCodeExtension[]> {
  try {
    const response = await fetch(MARKETPLACE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=7.1-preview.1'
      },
      body: JSON.stringify({
        filters: [{
          criteria: [
            { filterType: 8, value: 'Microsoft.VisualStudio.Code' },
            { filterType: 10, value: query },
            { filterType: 12, value: '37888' }
          ],
          pageNumber: 1,
          pageSize,
          sortBy: 0,
          sortOrder: 0
        }],
        assetTypes: [],
        flags: 914
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from marketplace')
    }

    const data: MarketplaceResponse = await response.json()
    return data.results[0]?.extensions || []
  } catch (error) {
    console.error('Marketplace API error:', error)
    return []
  }
}

// Get popular extensions
export async function getPopularExtensions(pageSize = 20): Promise<VSCodeExtension[]> {
  try {
    const response = await fetch(MARKETPLACE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=7.1-preview.1'
      },
      body: JSON.stringify({
        filters: [{
          criteria: [
            { filterType: 8, value: 'Microsoft.VisualStudio.Code' },
            { filterType: 12, value: '37888' }
          ],
          pageNumber: 1,
          pageSize,
          sortBy: 4, // Sort by install count
          sortOrder: 0
        }],
        assetTypes: [],
        flags: 914
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch from marketplace')
    }

    const data: MarketplaceResponse = await response.json()
    return data.results[0]?.extensions || []
  } catch (error) {
    console.error('Marketplace API error:', error)
    return []
  }
}

// Get extension details
export async function getExtensionDetails(publisherName: string, extensionName: string): Promise<VSCodeExtension | null> {
  try {
    const response = await fetch(MARKETPLACE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json;api-version=7.1-preview.1'
      },
      body: JSON.stringify({
        filters: [{
          criteria: [
            { filterType: 7, value: `${publisherName}.${extensionName}` }
          ],
          pageNumber: 1,
          pageSize: 1,
          sortBy: 0,
          sortOrder: 0
        }],
        assetTypes: [],
        flags: 914
      })
    })

    if (!response.ok) {
      throw new Error('Failed to fetch extension details')
    }

    const data: MarketplaceResponse = await response.json()
    return data.results[0]?.extensions[0] || null
  } catch (error) {
    console.error('Marketplace API error:', error)
    return null
  }
}

// Helper to get install count from statistics
export function getInstallCount(ext: VSCodeExtension): number {
  const stat = ext.statistics?.find(s => s.statisticName === 'install')
  return stat?.value || 0
}

// Helper to get rating from statistics
export function getRating(ext: VSCodeExtension): number {
  const stat = ext.statistics?.find(s => s.statisticName === 'averagerating')
  return stat?.value || 0
}

// Helper to get rating count
export function getRatingCount(ext: VSCodeExtension): number {
  const stat = ext.statistics?.find(s => s.statisticName === 'ratingcount')
  return stat?.value || 0
}

// Get extension icon URL
export function getExtensionIcon(ext: VSCodeExtension): string {
  return `https://${ext.publisher.publisherName}.gallerycdn.vsassets.io/extensions/${ext.publisher.publisherName}/${ext.extensionName}/${ext.versions[0]?.version}/assetbyname/Microsoft.VisualStudio.Services.Icons.Default`
}
