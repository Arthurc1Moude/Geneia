import express, { Request, Response } from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Extensions storage
interface Extension {
  id: string
  name: string
  description: string
  version: string
  author: string
  downloads: number
  type: 'gne' | 'gns'
  category: string
  tags: string[]
  content: string
  createdAt: string
  updatedAt: string
}

const extensions: Extension[] = [
  {
    id: '1',
    name: 'math_utils',
    description: 'Advanced mathematical functions including trigonometry, statistics, and more.',
    version: '1.2.0',
    author: 'Geneia Team',
    downloads: 15420,
    type: 'gne',
    category: 'Math',
    tags: ['math', 'calculations', 'statistics'],
    content: `! Math Utilities Extension !
! Version: 1.2.0 !

"Advanced mathematical functions"

str {module_name} = 'Math Utils'
str {version} = '1.2.0'

hold (pi) = (3)
hold (e) = (2)

func sqrt
func pow
func sin
func cos
func tan

export module_name
export version
export sqrt
export pow

peat 'Math Utils loaded'`,
    createdAt: '2024-01-15',
    updatedAt: '2024-12-01'
  },
  {
    id: '2',
    name: 'ui_helpers',
    description: 'UI helper functions for creating beautiful interfaces quickly.',
    version: '2.0.1',
    author: 'Geneia Team',
    downloads: 12350,
    type: 'gns',
    category: 'UI',
    tags: ['ui', 'interface', 'components'],
    content: `! UI Helpers S-Extension !
! Version: 2.0.1 !

"UI helper functions"

str {module_name} = 'UI Helpers'
str {version} = '2.0.1'

func create_window
func create_button
func create_label
func show_dialog

export module_name
export create_window
export create_button

peat 'UI Helpers loaded'`,
    createdAt: '2024-02-20',
    updatedAt: '2024-11-15'
  },
  {
    id: '3',
    name: 'string_tools',
    description: 'String manipulation utilities including regex, formatting, and encoding.',
    version: '2.1.0',
    author: 'Geneia Team',
    downloads: 11200,
    type: 'gne',
    category: 'Utilities',
    tags: ['string', 'regex', 'text'],
    content: `! String Tools Extension !
! Version: 2.1.0 !

"String manipulation utilities"

str {module_name} = 'String Tools'
str {version} = '2.1.0'

func str_upper
func str_lower
func str_trim
func str_split
func str_replace

export module_name
export str_upper
export str_lower

peat 'String Tools loaded'`,
    createdAt: '2024-03-10',
    updatedAt: '2024-10-20'
  }
]

// API Routes

// Get all extensions
app.get('/api/extensions', (req: Request, res: Response) => {
  const { category, type, search } = req.query
  
  let filtered = [...extensions]
  
  if (category && category !== 'all') {
    filtered = filtered.filter(ext => ext.category === category || ext.type === category)
  }
  
  if (type) {
    filtered = filtered.filter(ext => ext.type === type)
  }
  
  if (search) {
    const searchStr = (search as string).toLowerCase()
    filtered = filtered.filter(ext => 
      ext.name.toLowerCase().includes(searchStr) ||
      ext.description.toLowerCase().includes(searchStr) ||
      ext.tags.some(tag => tag.toLowerCase().includes(searchStr))
    )
  }
  
  // Return without content for listing
  const listing = filtered.map(({ content, ...rest }) => rest)
  
  res.json({
    success: true,
    count: listing.length,
    extensions: listing
  })
})

// Get single extension
app.get('/api/extensions/:id', (req: Request, res: Response) => {
  const ext = extensions.find(e => e.id === req.params.id || e.name === req.params.id)
  
  if (!ext) {
    return res.status(404).json({
      success: false,
      error: 'Extension not found'
    })
  }
  
  res.json({
    success: true,
    extension: ext
  })
})

// Download extension
app.get('/api/extensions/:id/download', (req: Request, res: Response) => {
  const ext = extensions.find(e => e.id === req.params.id || e.name === req.params.id)
  
  if (!ext) {
    return res.status(404).json({
      success: false,
      error: 'Extension not found'
    })
  }
  
  // Increment download count
  ext.downloads++
  
  // Set headers for file download
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Disposition', `attachment; filename="${ext.name}.${ext.type}"`)
  
  res.send(ext.content)
})

// Publish new extension
app.post('/api/extensions', (req: Request, res: Response) => {
  const { name, description, version, author, type, category, tags, content } = req.body
  
  if (!name || !description || !version || !type || !content) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    })
  }
  
  // Check if extension already exists
  if (extensions.find(e => e.name === name)) {
    return res.status(409).json({
      success: false,
      error: 'Extension with this name already exists'
    })
  }
  
  const newExtension: Extension = {
    id: String(extensions.length + 1),
    name,
    description,
    version,
    author: author || 'Anonymous',
    downloads: 0,
    type,
    category: category || 'Utilities',
    tags: tags || [],
    content,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }
  
  extensions.push(newExtension)
  
  res.status(201).json({
    success: true,
    message: 'Extension published successfully',
    extension: newExtension
  })
})

// Get categories
app.get('/api/categories', (req: Request, res: Response) => {
  const categories = [...new Set(extensions.map(e => e.category))]
  
  res.json({
    success: true,
    categories
  })
})

// Get stats
app.get('/api/stats', (req: Request, res: Response) => {
  const totalExtensions = extensions.length
  const totalDownloads = extensions.reduce((sum, ext) => sum + ext.downloads, 0)
  const gneCount = extensions.filter(e => e.type === 'gne').length
  const gnsCount = extensions.filter(e => e.type === 'gns').length
  
  res.json({
    success: true,
    stats: {
      totalExtensions,
      totalDownloads,
      gneCount,
      gnsCount
    }
  })
})

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Geneia Extension Server is running',
    version: '1.0.0'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║         GENEIA EXTENSION SERVER                            ║
╠════════════════════════════════════════════════════════════╣
║  Server running on http://localhost:${PORT}                   ║
║                                                            ║
║  API Endpoints:                                            ║
║    GET  /api/extensions      - List all extensions         ║
║    GET  /api/extensions/:id  - Get extension details       ║
║    GET  /api/extensions/:id/download - Download extension  ║
║    POST /api/extensions      - Publish new extension       ║
║    GET  /api/categories      - List categories             ║
║    GET  /api/stats           - Get statistics              ║
║    GET  /api/health          - Health check                ║
╚════════════════════════════════════════════════════════════╝
  `)
})

export default app
