import { useState } from 'react';
import ShapePreview from '../components/ShapePreview';
import { SearchIcon, DownloadIcon, HeartIcon, CopyIcon, CheckIcon, CloseIcon, UploadIcon } from '../components/Icons';
import './OpenGSL.css';

interface ShapePreset {
  id: string;
  name: string;
  author: string;
  category: string;
  downloads: number;
  likes: number;
  shapeType: string;
  code: string;
  description: string;
  featured?: boolean;
}

const shapePresets: ShapePreset[] = [
  {
    id: '1',
    name: '3D Apple',
    author: 'GeneiaTeam',
    category: 'Food',
    downloads: 1250,
    likes: 89,
    shapeType: 'apple',
    featured: true,
    description: 'A realistic 3D apple with stem and leaf',
    code: `! 3D Apple Shape !
.OpenGSL.shape.d3 (400) (300) (0) & shape.n = appleBody
.OpenGSL.shape.sphere -u (80) '#FF2020'

.OpenGSL.shape.d3 (400) (230) (0) & shape.n = appleStem
.OpenGSL.shape.cylinder -u (5) (25) '#8B4513'

.OpenGSL.shape.d3 (420) (220) (0) & shape.n = appleLeaf
.OpenGSL.shape.sphere -u (15) '#228B22'`
  },
  {
    id: '2',
    name: '3D Pizza',
    author: 'GeneiaTeam',
    category: 'Food',
    downloads: 980,
    likes: 72,
    shapeType: 'pizza',
    featured: true,
    description: 'Pizza with crust, sauce, cheese and toppings',
    code: `! 3D Pizza Shape !
.OpenGSL.shape.d3 (400) (320) (0) & shape.n = crustBase
.OpenGSL.shape.cylinder -u (150) (15) '#D4A574'

.OpenGSL.shape.d3 (400) (320) (5) & shape.n = sauceLayer
.OpenGSL.shape.cylinder -u (135) (8) '#CC2200'

.OpenGSL.shape.d3 (400) (320) (10) & shape.n = cheeseLayer
.OpenGSL.shape.cylinder -u (130) (6) '#FFD700'

.OpenGSL.shape.d3 (350) (280) (15) & shape.n = pepperoni1
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (450) (280) (15) & shape.n = pepperoni2
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (400) (360) (15) & shape.n = pepperoni3
.OpenGSL.shape.sphere -u (18) '#8B0000'`
  },
  {
    id: '3',
    name: '3D Strawberry',
    author: 'GeneiaTeam',
    category: 'Food',
    downloads: 756,
    likes: 65,
    shapeType: 'strawberry',
    description: 'Strawberry with seeds and green leaves',
    code: `! 3D Strawberry Shape !
.OpenGSL.shape.d3 (400) (300) (0) & shape.n = berryBody
.OpenGSL.shape.sphere -u (80) '#DC143C'

.OpenGSL.shape.d3 (400) (240) (0) & shape.n = berryTop
.OpenGSL.shape.sphere -u (40) '#DC143C'

.OpenGSL.shape.d3 (370) (210) (0) & shape.n = leaf1
.OpenGSL.shape.sphere -u (15) '#228B22'

.OpenGSL.shape.d3 (400) (200) (0) & shape.n = leaf2
.OpenGSL.shape.sphere -u (15) '#228B22'

.OpenGSL.shape.d3 (430) (210) (0) & shape.n = leaf3
.OpenGSL.shape.sphere -u (15) '#228B22'

.OpenGSL.shape.d3 (380) (290) (0) & shape.n = seed1
.OpenGSL.shape.sphere -u (5) '#FFD700'

.OpenGSL.shape.d3 (420) (290) (0) & shape.n = seed2
.OpenGSL.shape.sphere -u (5) '#FFD700'`
  },
  {
    id: '4',
    name: '3D House',
    author: 'BuilderPro',
    category: 'Buildings',
    downloads: 1420,
    likes: 112,
    shapeType: 'house',
    featured: true,
    description: 'Simple house with roof and door',
    code: `! 3D House Shape !
.OpenGSL.shape.d3 (400) (350) (0) & shape.n = houseBase
.OpenGSL.shape.cube -u (120) '#E8D4B8'

.OpenGSL.shape.d3 (400) (250) (0) & shape.n = roof
.OpenGSL.shape.pyramid -u (140) (80) '#8B4513'

.OpenGSL.shape.d3 (400) (380) (0) & shape.n = door
.OpenGSL.shape.rect -u (30) (50) '#654321'

.OpenGSL.shape.d3 (360) (320) (0) & shape.n = window1
.OpenGSL.shape.rect -u (25) (25) '#87CEEB'

.OpenGSL.shape.d3 (440) (320) (0) & shape.n = window2
.OpenGSL.shape.rect -u (25) (25) '#87CEEB'`
  },
  {
    id: '5',
    name: '3D Tree',
    author: 'NatureLover',
    category: 'Nature',
    downloads: 890,
    likes: 78,
    shapeType: 'tree',
    description: 'Tree with trunk and leafy top',
    code: `! 3D Tree Shape !
.OpenGSL.shape.d3 (400) (400) (0) & shape.n = trunk
.OpenGSL.shape.cylinder -u (25) (100) '#8B4513'

.OpenGSL.shape.d3 (400) (280) (0) & shape.n = leaves1
.OpenGSL.shape.sphere -u (70) '#228B22'

.OpenGSL.shape.d3 (360) (320) (0) & shape.n = leaves2
.OpenGSL.shape.sphere -u (50) '#2E8B2E'

.OpenGSL.shape.d3 (440) (320) (0) & shape.n = leaves3
.OpenGSL.shape.sphere -u (50) '#2E8B2E'

.OpenGSL.shape.d3 (400) (240) (0) & shape.n = leaves4
.OpenGSL.shape.sphere -u (45) '#32CD32'`
  },
  {
    id: '6',
    name: '3D Car',
    author: 'SpeedRacer',
    category: 'Vehicles',
    downloads: 1680,
    likes: 134,
    shapeType: 'car',
    featured: true,
    description: 'Simple car with wheels',
    code: `! 3D Car Shape !
.OpenGSL.shape.d3 (400) (320) (0) & shape.n = carBody
.OpenGSL.shape.rect -u (160) (50) '#FF4444'

.OpenGSL.shape.d3 (400) (290) (0) & shape.n = carTop
.OpenGSL.shape.rect -u (100) (40) '#FF4444'

.OpenGSL.shape.d3 (340) (360) (0) & shape.n = wheel1
.OpenGSL.shape.circle -u (25) '#333333'

.OpenGSL.shape.d3 (460) (360) (0) & shape.n = wheel2
.OpenGSL.shape.circle -u (25) '#333333'

.OpenGSL.shape.d3 (420) (290) (0) & shape.n = window1
.OpenGSL.shape.rect -u (35) (25) '#87CEEB'

.OpenGSL.shape.d3 (380) (290) (0) & shape.n = window2
.OpenGSL.shape.rect -u (35) (25) '#87CEEB'`
  },
  {
    id: '7',
    name: '3D Snowman',
    author: 'WinterFun',
    category: 'Characters',
    downloads: 620,
    likes: 55,
    shapeType: 'snowman',
    description: 'Snowman with hat and buttons',
    code: `! 3D Snowman Shape !
.OpenGSL.shape.d3 (400) (380) (0) & shape.n = bottom
.OpenGSL.shape.sphere -u (70) '#FFFFFF'

.OpenGSL.shape.d3 (400) (300) (0) & shape.n = middle
.OpenGSL.shape.sphere -u (50) '#FFFFFF'

.OpenGSL.shape.d3 (400) (240) (0) & shape.n = head
.OpenGSL.shape.sphere -u (35) '#FFFFFF'

.OpenGSL.shape.d3 (400) (200) (0) & shape.n = hat
.OpenGSL.shape.cylinder -u (30) (40) '#333333'

.OpenGSL.shape.d3 (390) (235) (0) & shape.n = eye1
.OpenGSL.shape.sphere -u (5) '#000000'

.OpenGSL.shape.d3 (410) (235) (0) & shape.n = eye2
.OpenGSL.shape.sphere -u (5) '#000000'

.OpenGSL.shape.d3 (400) (250) (0) & shape.n = nose
.OpenGSL.shape.sphere -u (8) '#FF6600'`
  },
  {
    id: '8',
    name: '3D Rocket',
    author: 'SpaceExplorer',
    category: 'Vehicles',
    downloads: 945,
    likes: 88,
    shapeType: 'rocket',
    description: 'Rocket ship ready for launch',
    code: `! 3D Rocket Shape !
.OpenGSL.shape.d3 (400) (300) (0) & shape.n = body
.OpenGSL.shape.cylinder -u (40) (150) '#CCCCCC'

.OpenGSL.shape.d3 (400) (200) (0) & shape.n = nose
.OpenGSL.shape.sphere -u (40) '#FF4444'

.OpenGSL.shape.d3 (360) (400) (0) & shape.n = fin1
.OpenGSL.shape.pyramid -u (30) (50) '#FF4444'

.OpenGSL.shape.d3 (440) (400) (0) & shape.n = fin2
.OpenGSL.shape.pyramid -u (30) (50) '#FF4444'

.OpenGSL.shape.d3 (400) (420) (0) & shape.n = flame
.OpenGSL.shape.sphere -u (25) '#FF6600'`
  }
];

const categories = ['All', 'Food', 'Buildings', 'Nature', 'Vehicles', 'Characters'];

export default function OpenGSL() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShape, setSelectedShape] = useState<ShapePreset | null>(null);
  const [copied, setCopied] = useState(false);
  const [likedShapes, setLikedShapes] = useState<Set<string>>(new Set());

  const filteredShapes = shapePresets.filter(shape => {
    const matchesCategory = selectedCategory === 'All' || shape.category === selectedCategory;
    const matchesSearch = shape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shape.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredShapes = shapePresets.filter(s => s.featured);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = (shape: ShapePreset) => {
    const fullCode = `! ${shape.name} - OpenGSL Community !
"Created by ${shape.author}"

import OpenGSL

.OpenGSL.canvas '${shape.name}' (800) (600)
.OpenGSL.bg '#1a1a2e'

${shape.code}

.OpenGSL.render

exit (0)`;
    
    const blob = new Blob([fullCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shape.name.toLowerCase().replace(/ /g, '_')}.gn`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleLike = (id: string) => {
    setLikedShapes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="opengsl-page">
      {/* Hero Section */}
      <div className="opengsl-hero">
        <div className="hero-content">
          <h1>OpenGSL Community</h1>
          <p>Open Public Geneia Styling Library</p>
          <p className="hero-subtitle">Share and discover 3D shapes built with Geneia</p>
        </div>
        <div className="hero-stats">
          <div className="stat-item glass-card">
            <span className="stat-number">{shapePresets.length}</span>
            <span className="stat-label">Shapes</span>
          </div>
          <div className="stat-item glass-card">
            <span className="stat-number">{shapePresets.reduce((a, b) => a + b.downloads, 0).toLocaleString()}</span>
            <span className="stat-label">Downloads</span>
          </div>
          <div className="stat-item glass-card">
            <span className="stat-number">{new Set(shapePresets.map(s => s.author)).size}</span>
            <span className="stat-label">Creators</span>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="featured-section">
        <h2>Featured Shapes</h2>
        <div className="featured-grid">
          {featuredShapes.map(shape => (
            <div 
              key={shape.id} 
              className="featured-card glass-card"
              onClick={() => setSelectedShape(shape)}
            >
              <div className="featured-preview">
                <ShapePreview type={shape.shapeType} size={100} />
              </div>
              <div className="featured-info">
                <h3>{shape.name}</h3>
                <p>by {shape.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="opengsl-content">
        {/* Sidebar */}
        <div className="opengsl-sidebar glass-panel">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search shapes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="categories">
            <h3>Categories</h3>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span className="category-count">
                  {cat === 'All' ? shapePresets.length : shapePresets.filter(s => s.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          <div className="upload-section glass-card">
            <UploadIcon />
            <h3>Share Your Shape</h3>
            <p>Create amazing shapes and share with the community!</p>
            <button className="upload-btn">Upload Shape</button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="shapes-section">
          <div className="shapes-header">
            <h2>{selectedCategory === 'All' ? 'All Shapes' : selectedCategory}</h2>
            <span className="shapes-count">{filteredShapes.length} shapes</span>
          </div>
          
          <div className="shapes-grid">
            {filteredShapes.map(shape => (
              <div 
                key={shape.id} 
                className="shape-card glass-card"
                onClick={() => setSelectedShape(shape)}
              >
                <div className="shape-preview">
                  <ShapePreview type={shape.shapeType} size={120} />
                </div>
                <div className="shape-info">
                  <h3>{shape.name}</h3>
                  <p className="author">by {shape.author}</p>
                  <p className="description">{shape.description}</p>
                  <div className="shape-footer">
                    <div className="shape-stats">
                      <span><DownloadIcon /> {shape.downloads}</span>
                      <span 
                        className={`like-btn ${likedShapes.has(shape.id) ? 'liked' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleLike(shape.id); }}
                      >
                        <HeartIcon filled={likedShapes.has(shape.id)} /> 
                        {shape.likes + (likedShapes.has(shape.id) ? 1 : 0)}
                      </span>
                    </div>
                    <span className="category-tag">{shape.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedShape && (
        <div className="modal-overlay" onClick={() => setSelectedShape(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedShape(null)}>
              <CloseIcon />
            </button>
            
            <div className="modal-header">
              <div className="modal-preview">
                <ShapePreview type={selectedShape.shapeType} size={150} />
              </div>
              <div className="modal-title">
                <h2>{selectedShape.name}</h2>
                <p className="modal-author">by {selectedShape.author}</p>
                <div className="modal-stats">
                  <span><DownloadIcon /> {selectedShape.downloads} downloads</span>
                  <span><HeartIcon /> {selectedShape.likes} likes</span>
                </div>
              </div>
            </div>

            <p className="modal-description">{selectedShape.description}</p>

            <div className="code-section glass-card">
              <div className="code-header">
                <h3>OpenGSL Code</h3>
                <div className="code-actions">
                  <button className="action-btn" onClick={() => copyCode(selectedShape.code)}>
                    {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
                  </button>
                  <button className="action-btn primary" onClick={() => downloadCode(selectedShape)}>
                    <DownloadIcon /> Download .gn
                  </button>
                </div>
              </div>
              <pre className="code-block">{selectedShape.code}</pre>
            </div>

            <div className="usage-section">
              <h3>How to Use</h3>
              <ol>
                <li>Copy the code or download the .gn file</li>
                <li>Paste into your project after <code>import OpenGSL</code></li>
                <li>Adjust positions <code>(x) (y) (z)</code> as needed</li>
                <li>Run with <code>./compiler/geneia yourfile.gn</code></li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
