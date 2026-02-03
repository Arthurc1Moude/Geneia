import React, { useState, useEffect } from 'react'
import { ExtensionIcon, ModuleIcon, SearchIcon, UserIcon, DownloadIcon, PackageIcon } from '../components/Icons'
import './Extensions.css'

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
}

const Extensions: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  // Sample extensions data
  useEffect(() => {
    const sampleExtensions: Extension[] = [
      {
        id: '1',
        name: 'math_utils',
        description: 'Advanced mathematical functions including trigonometry, statistics, and more.',
        version: '1.2.0',
        author: 'Geneia Team',
        downloads: 15420,
        type: 'gne',
        category: 'Math',
        tags: ['math', 'calculations', 'statistics']
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
        tags: ['ui', 'interface', 'components']
      },
      {
        id: '3',
        name: 'file_tools',
        description: 'Extended file operations including CSV, JSON, and XML parsing.',
        version: '1.5.0',
        author: 'Community',
        downloads: 8920,
        type: 'gne',
        category: 'File I/O',
        tags: ['file', 'csv', 'json', 'xml']
      },
      {
        id: '4',
        name: 'network_pro',
        description: 'Advanced networking with HTTP/2, WebSocket, and REST API support.',
        version: '1.0.0',
        author: 'Community',
        downloads: 6540,
        type: 'gns',
        category: 'Network',
        tags: ['network', 'http', 'websocket', 'api']
      },
      {
        id: '5',
        name: 'graphics_2d',
        description: '2D graphics rendering with shapes, images, and animations.',
        version: '1.3.2',
        author: 'Geneia Team',
        downloads: 9870,
        type: 'gne',
        category: 'Graphics',
        tags: ['graphics', '2d', 'drawing', 'animation']
      },
      {
        id: '6',
        name: 'database_lite',
        description: 'Lightweight database operations with SQLite support.',
        version: '1.1.0',
        author: 'Community',
        downloads: 5430,
        type: 'gne',
        category: 'Database',
        tags: ['database', 'sqlite', 'sql']
      },
      {
        id: '7',
        name: 'string_tools',
        description: 'String manipulation utilities including regex, formatting, and encoding.',
        version: '2.1.0',
        author: 'Geneia Team',
        downloads: 11200,
        type: 'gne',
        category: 'Utilities',
        tags: ['string', 'regex', 'text']
      },
      {
        id: '8',
        name: 'datetime_pro',
        description: 'Advanced date and time handling with timezone support.',
        version: '1.0.5',
        author: 'Community',
        downloads: 4320,
        type: 'gne',
        category: 'Utilities',
        tags: ['date', 'time', 'timezone']
      }
    ]
    setExtensions(sampleExtensions)
  }, [])

  const filteredExtensions = extensions.filter(ext => {
    const matchesFilter = filter === 'all' || ext.type === filter || ext.category === filter
    const matchesSearch = ext.name.toLowerCase().includes(search.toLowerCase()) ||
                         ext.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const categories = ['all', 'gne', 'gns', 'Math', 'UI', 'File I/O', 'Network', 'Graphics', 'Database', 'Utilities']

  return (
    <div className="extensions-page">
      <div className="container">
        <div className="extensions-header">
          <h1 className="section-title">Geneia Extensions</h1>
          <p className="section-subtitle">
            Extend Geneia with powerful modules from the community
          </p>
        </div>

        <div className="extensions-toolbar">
          <div className="search-box">
            <span className="search-icon"><SearchIcon size={18} /></span>
            <input
              type="text"
              placeholder="Search extensions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-tab ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'gne' ? '.gne' : cat === 'gns' ? '.gns' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="extensions-grid">
          {filteredExtensions.map(ext => (
            <div key={ext.id} className="card extension-card glass-card">
              <div className="extension-header">
                <div className="extension-type-icon">
                  <ExtensionIcon type={ext.type} size={36} />
                </div>
                <span className="extension-version">v{ext.version}</span>
              </div>

              <h3 className="extension-name">{ext.name}</h3>
              <p className="extension-desc">{ext.description}</p>

              <div className="extension-tags">
                {ext.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="extension-footer">
                <div className="extension-meta">
                  <span className="meta-item"><UserIcon size={14} /> {ext.author}</span>
                  <span className="meta-item"><DownloadIcon size={14} /> {ext.downloads.toLocaleString()}</span>
                </div>
                <button className="btn btn-primary btn-sm glass-btn">
                  Install
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="publish-cta glass-card">
          <div className="publish-icon">
            <ModuleIcon size={64} />
          </div>
          <h3>Create Your Own Extension</h3>
          <p>Share your modules with the Geneia community</p>
          <button className="btn btn-secondary glass-btn">
            <PackageIcon size={18} /> Publish Extension
          </button>
        </div>
      </div>
    </div>
  )
}

export default Extensions
