import { useState } from 'react';
import ShapePreview from '../components/ShapePreview';
import './Docs.css';

const docSections = [
  { id: 'intro', title: 'Introduction', category: 'Getting Started' },
  { id: 'install', title: 'Installation', category: 'Getting Started' },
  { id: 'first', title: 'First Shape', category: 'Getting Started' },
  { id: 'canvas', title: 'Canvas & Background', category: 'Basics' },
  { id: 'positions', title: 'Positions (d2/d3)', category: 'Basics' },
  { id: 'naming', title: 'Naming Shapes', category: 'Basics' },
  { id: 'sphere', title: 'Sphere', category: '3D Shapes' },
  { id: 'cube', title: 'Cube', category: '3D Shapes' },
  { id: 'cylinder', title: 'Cylinder', category: '3D Shapes' },
  { id: 'pyramid', title: 'Pyramid', category: '3D Shapes' },
  { id: 'circle', title: 'Circle', category: '2D Shapes' },
  { id: 'rect', title: 'Rectangle', category: '2D Shapes' },
  { id: 'text', title: 'Text', category: '2D Shapes' },
  { id: 'colors', title: 'Colors', category: 'Styling' },
  { id: 'combining', title: 'Combining Shapes', category: 'Advanced' },
  { id: 'examples', title: 'Full Examples', category: 'Advanced' },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState('intro');

  const categories = [...new Set(docSections.map(s => s.category))];

  return (
    <div className="docs-page">
      <div className="docs-sidebar liquid-glass-dark">
        {categories.map(cat => (
          <div key={cat} className="sidebar-category">
            <h3>{cat}</h3>
            <ul>
              {docSections.filter(s => s.category === cat).map(section => (
                <li 
                  key={section.id}
                  className={activeSection === section.id ? 'active' : ''}
                  onClick={() => setActiveSection(section.id)}
                >
                  {section.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="docs-content">
        {activeSection === 'intro' && (
          <section>
            <h1>OpenGSL Documentation</h1>
            <p className="intro">
              Open Public Geneia Styling Library - Create stunning 2D, 2.5D, and 3D graphics 
              with simple, intuitive syntax in the Geneia programming language.
            </p>
            
            <div className="feature-cards">
              <div className="feature-card liquid-glass">
                <div className="feature-icon">🎨</div>
                <h3>Easy Syntax</h3>
                <p>Simple, readable commands to create complex shapes</p>
              </div>
              <div className="feature-card liquid-glass">
                <div className="feature-icon">🧊</div>
                <h3>3D Support</h3>
                <p>Full 3D positioning with x, y, z coordinates</p>
              </div>
              <div className="feature-card liquid-glass">
                <div className="feature-icon">🎯</div>
                <h3>Named Shapes</h3>
                <p>Reference and reuse shapes by name</p>
              </div>
              <div className="feature-card liquid-glass">
                <div className="feature-icon">🌈</div>
                <h3>Full Colors</h3>
                <p>Hex color support for all shapes</p>
              </div>
            </div>

            <h2>Quick Example</h2>
            <pre className="code-example">{`import OpenGSL

.OpenGSL.canvas 'My Art' (800) (600)
.OpenGSL.bg '#1a1a2e'

.OpenGSL.shape.d3 (400) (300) (0) & shape.n = mySphere
.OpenGSL.shape.sphere -u (80) '#FF6B6B'

.OpenGSL.render`}</pre>
          </section>
        )}

        {activeSection === 'install' && (
          <section>
            <h1>Installation</h1>
            <p className="intro">Get OpenGSL running in your Geneia project.</p>
            
            <h2>Requirements</h2>
            <ul className="req-list">
              <li>Geneia compiler (geneia)</li>
              <li>.NET runtime for GUI rendering</li>
              <li>GTK3 libraries (Linux)</li>
            </ul>

            <h2>Setup</h2>
            <pre className="code-example">{`# Clone Geneia with OpenGSL
git clone https://github.com/geneia/geneia.git
cd geneia

# Build compiler
cd compiler && make

# Build UI renderer
cd ../ui && dotnet build GeneiaUILinux.csproj -o bin/linux/`}</pre>

            <h2>Verify Installation</h2>
            <pre className="code-example">{`# Run a test
./compiler/geneia examples/apple_3d.gn`}</pre>
          </section>
        )}

        {activeSection === 'first' && (
          <section>
            <h1>Your First Shape</h1>
            <p className="intro">Create your first OpenGSL shape in 3 simple steps.</p>
            
            <div className="step-card liquid-glass">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Import OpenGSL</h3>
                <pre className="code-example">{`import OpenGSL`}</pre>
              </div>
            </div>

            <div className="step-card liquid-glass">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Create Canvas</h3>
                <pre className="code-example">{`.OpenGSL.canvas 'My Canvas' (800) (600)
.OpenGSL.bg '#1a1a2e'`}</pre>
              </div>
            </div>

            <div className="step-card liquid-glass">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Add Shape & Render</h3>
                <pre className="code-example">{`.OpenGSL.shape.d3 (400) (300) (0) & shape.n = myShape
.OpenGSL.shape.sphere -u (80) '#FF6B6B'

.OpenGSL.render`}</pre>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'canvas' && (
          <section>
            <h1>Canvas & Background</h1>
            <p className="intro">Set up your drawing canvas.</p>
            
            <h2>Create Canvas</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.canvas 'title' (width) (height)</code>
            </div>
            <pre className="code-example">{`.OpenGSL.canvas 'My Art' (800) (600)`}</pre>

            <h2>Set Background</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.bg '#hexcolor'</code>
            </div>
            <pre className="code-example">{`.OpenGSL.bg '#1a1a2e'
.OpenGSL.bg '#FFFFFF'
.OpenGSL.bg '#87CEEB'`}</pre>
          </section>
        )}

        {activeSection === 'positions' && (
          <section>
            <h1>Positions (d2/d3)</h1>
            <p className="intro">Define where shapes appear on the canvas.</p>
            
            <h2>3D Position</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.d3 (x) (y) (z) & shape.n = name</code>
            </div>
            <p>Use for 3D shapes like spheres, cubes, cylinders.</p>
            <pre className="code-example">{`.OpenGSL.shape.d3 (400) (300) (0) & shape.n = myShape`}</pre>

            <h2>2D Position</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.d2 (x) (y) & shape.n = name</code>
            </div>
            <p>Use for 2D shapes like circles, rectangles, text.</p>
            <pre className="code-example">{`.OpenGSL.shape.d2 (400) (300) & shape.n = myCircle`}</pre>

            <div className="info-box">
              <strong>Coordinate System:</strong>
              <ul>
                <li><strong>x</strong> - Horizontal position (0 = left)</li>
                <li><strong>y</strong> - Vertical position (0 = top)</li>
                <li><strong>z</strong> - Depth/layer (higher = on top)</li>
              </ul>
            </div>
          </section>
        )}

        {activeSection === 'naming' && (
          <section>
            <h1>Naming Shapes</h1>
            <p className="intro">Give shapes names to reference them later.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>& shape.n = shapeName</code>
            </div>
            
            <p>The name becomes part of the path when applying shape type:</p>
            <pre className="code-example">{`! Define position with name !
.OpenGSL.shape.d3 (400) (300) (0) & shape.n = myApple

! Apply shape type - name is in the path !
.OpenGSL.shape.myApple -u (80) '#FF0000'`}</pre>

            <div className="info-box">
              <strong>Naming Rules:</strong>
              <ul>
                <li>Use letters, numbers, underscores</li>
                <li>No spaces or special characters</li>
                <li>Names are case-sensitive</li>
              </ul>
            </div>
          </section>
        )}

        {activeSection === 'sphere' && (
          <section>
            <h1>Sphere</h1>
            <p className="intro">Create 3D spheres.</p>
            
            <div className="shape-demo">
              <ShapePreview type="apple" size={150} />
            </div>

            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.sphere -u (radius) '#color'</code>
            </div>

            <h2>Parameters</h2>
            <table className="params-table">
              <thead>
                <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>radius</td><td>number</td><td>Size of the sphere</td></tr>
                <tr><td>color</td><td>hex string</td><td>Fill color</td></tr>
              </tbody>
            </table>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d3 (400) (300) (0) & shape.n = ball
.OpenGSL.shape.sphere -u (80) '#FF6B6B'`}</pre>
          </section>
        )}

        {activeSection === 'cube' && (
          <section>
            <h1>Cube</h1>
            <p className="intro">Create 3D cubes.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.cube -u (size) '#color'</code>
            </div>

            <h2>Parameters</h2>
            <table className="params-table">
              <thead>
                <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>size</td><td>number</td><td>Size of the cube</td></tr>
                <tr><td>color</td><td>hex string</td><td>Fill color</td></tr>
              </tbody>
            </table>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d3 (400) (300) (0) & shape.n = box
.OpenGSL.shape.cube -u (100) '#4ECDC4'`}</pre>
          </section>
        )}

        {activeSection === 'cylinder' && (
          <section>
            <h1>Cylinder</h1>
            <p className="intro">Create 3D cylinders.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.cylinder -u (radius) (height) '#color'</code>
            </div>

            <h2>Parameters</h2>
            <table className="params-table">
              <thead>
                <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>radius</td><td>number</td><td>Radius of the cylinder</td></tr>
                <tr><td>height</td><td>number</td><td>Height of the cylinder</td></tr>
                <tr><td>color</td><td>hex string</td><td>Fill color</td></tr>
              </tbody>
            </table>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d3 (400) (300) (0) & shape.n = tube
.OpenGSL.shape.cylinder -u (50) (100) '#FFD93D'`}</pre>
          </section>
        )}

        {activeSection === 'pyramid' && (
          <section>
            <h1>Pyramid</h1>
            <p className="intro">Create 3D pyramids.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.pyramid -u (base) (height) '#color'</code>
            </div>

            <h2>Parameters</h2>
            <table className="params-table">
              <thead>
                <tr><th>Parameter</th><th>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr><td>base</td><td>number</td><td>Base width</td></tr>
                <tr><td>height</td><td>number</td><td>Height of pyramid</td></tr>
                <tr><td>color</td><td>hex string</td><td>Fill color</td></tr>
              </tbody>
            </table>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d3 (400) (300) (0) & shape.n = roof
.OpenGSL.shape.pyramid -u (120) (80) '#8B4513'`}</pre>
          </section>
        )}

        {activeSection === 'circle' && (
          <section>
            <h1>Circle</h1>
            <p className="intro">Create 2D circles.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.circle -u (radius) '#color'</code>
            </div>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d2 (400) (300) & shape.n = dot
.OpenGSL.shape.circle -u (50) '#FF6B6B'`}</pre>
          </section>
        )}

        {activeSection === 'rect' && (
          <section>
            <h1>Rectangle</h1>
            <p className="intro">Create 2D rectangles.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.rect -u (width) (height) '#color'</code>
            </div>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d2 (400) (300) & shape.n = box
.OpenGSL.shape.rect -u (100) (60) '#6BCB77'`}</pre>
          </section>
        )}

        {activeSection === 'text' && (
          <section>
            <h1>Text</h1>
            <p className="intro">Add text labels.</p>
            
            <h2>Syntax</h2>
            <div className="syntax-box liquid-glass">
              <code>.OpenGSL.shape.text -u 'text content' '#color'</code>
            </div>

            <h2>Example</h2>
            <pre className="code-example">{`.OpenGSL.shape.d2 (400) (50) & shape.n = title
.OpenGSL.shape.text -u 'Hello OpenGSL!' '#FFFFFF'`}</pre>
          </section>
        )}

        {activeSection === 'colors' && (
          <section>
            <h1>Colors</h1>
            <p className="intro">Use hex colors for all shapes.</p>
            
            <h2>Format</h2>
            <div className="syntax-box liquid-glass">
              <code>'#RRGGBB'</code>
            </div>

            <h2>Common Colors</h2>
            <div className="color-grid">
              <div className="color-item"><span style={{background:'#FF6B6B'}}></span><code>#FF6B6B</code> Red</div>
              <div className="color-item"><span style={{background:'#6BCB77'}}></span><code>#6BCB77</code> Green</div>
              <div className="color-item"><span style={{background:'#4ECDC4'}}></span><code>#4ECDC4</code> Cyan</div>
              <div className="color-item"><span style={{background:'#FFD93D'}}></span><code>#FFD93D</code> Yellow</div>
              <div className="color-item"><span style={{background:'#FF8E53'}}></span><code>#FF8E53</code> Orange</div>
              <div className="color-item"><span style={{background:'#A855F7'}}></span><code>#A855F7</code> Purple</div>
              <div className="color-item"><span style={{background:'#FFFFFF'}}></span><code>#FFFFFF</code> White</div>
              <div className="color-item"><span style={{background:'#1a1a2e'}}></span><code>#1a1a2e</code> Dark</div>
            </div>
          </section>
        )}

        {activeSection === 'combining' && (
          <section>
            <h1>Combining Shapes</h1>
            <p className="intro">Build complex objects from basic shapes.</p>
            
            <div className="shape-demo">
              <ShapePreview type="house" size={150} />
            </div>

            <h2>Layering with Z</h2>
            <p>Use the z coordinate to layer shapes. Higher z = on top.</p>
            <pre className="code-example">{`! Background layer (z=0) !
.OpenGSL.shape.d3 (400) (300) (0) & shape.n = back
.OpenGSL.shape.circle -u (100) '#333333'

! Middle layer (z=5) !
.OpenGSL.shape.d3 (400) (300) (5) & shape.n = mid
.OpenGSL.shape.circle -u (70) '#666666'

! Top layer (z=10) !
.OpenGSL.shape.d3 (400) (300) (10) & shape.n = top
.OpenGSL.shape.circle -u (40) '#FFFFFF'`}</pre>

            <h2>Building Objects</h2>
            <p>Combine multiple shapes to create complex objects:</p>
            <pre className="code-example">{`! House Example !
! Base !
.OpenGSL.shape.d3 (400) (350) (0) & shape.n = base
.OpenGSL.shape.rect -u (150) (100) '#E8D4B8'

! Roof !
.OpenGSL.shape.d3 (400) (270) (0) & shape.n = roof
.OpenGSL.shape.pyramid -u (180) (70) '#8B4513'

! Door !
.OpenGSL.shape.d3 (400) (380) (5) & shape.n = door
.OpenGSL.shape.rect -u (30) (50) '#654321'

! Windows !
.OpenGSL.shape.d3 (350) (330) (5) & shape.n = win1
.OpenGSL.shape.rect -u (25) (25) '#87CEEB'

.OpenGSL.shape.d3 (450) (330) (5) & shape.n = win2
.OpenGSL.shape.rect -u (25) (25) '#87CEEB'`}</pre>
          </section>
        )}

        {activeSection === 'examples' && (
          <section>
            <h1>Full Examples</h1>
            <p className="intro">Complete working examples.</p>
            
            <h2>🍎 3D Apple</h2>
            <div className="example-with-preview">
              <ShapePreview type="apple" size={120} />
              <pre className="code-example">{`import OpenGSL

.OpenGSL.canvas '3D Apple' (800) (600)
.OpenGSL.bg '#1a1a2e'

.OpenGSL.shape.d3 (400) (320) (0) & shape.n = body
.OpenGSL.shape.sphere -u (80) '#FF2020'

.OpenGSL.shape.d3 (400) (250) (0) & shape.n = top
.OpenGSL.shape.sphere -u (40) '#FF2020'

.OpenGSL.shape.d3 (400) (210) (0) & shape.n = stem
.OpenGSL.shape.cylinder -u (8) (30) '#8B4513'

.OpenGSL.shape.d3 (430) (200) (0) & shape.n = leaf
.OpenGSL.shape.sphere -u (18) '#228B22'

.OpenGSL.render
exit (0)`}</pre>
            </div>

            <h2>🍕 3D Pizza</h2>
            <div className="example-with-preview">
              <ShapePreview type="pizza" size={120} />
              <pre className="code-example">{`import OpenGSL

.OpenGSL.canvas '3D Pizza' (800) (600)
.OpenGSL.bg '#1a1a2e'

.OpenGSL.shape.d3 (400) (300) (0) & shape.n = crust
.OpenGSL.shape.cylinder -u (150) (15) '#D4A574'

.OpenGSL.shape.d3 (400) (300) (5) & shape.n = sauce
.OpenGSL.shape.cylinder -u (135) (8) '#CC2200'

.OpenGSL.shape.d3 (400) (300) (10) & shape.n = cheese
.OpenGSL.shape.cylinder -u (130) (6) '#FFD700'

! Pepperoni !
.OpenGSL.shape.d3 (340) (260) (15) & shape.n = pep1
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (460) (260) (15) & shape.n = pep2
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (400) (340) (15) & shape.n = pep3
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.render
exit (0)`}</pre>
            </div>

            <h2>🏠 3D House</h2>
            <div className="example-with-preview">
              <ShapePreview type="house" size={120} />
              <pre className="code-example">{`import OpenGSL

.OpenGSL.canvas '3D House' (800) (600)
.OpenGSL.bg '#87CEEB'

.OpenGSL.shape.d3 (400) (350) (0) & shape.n = base
.OpenGSL.shape.cube -u (120) '#E8D4B8'

.OpenGSL.shape.d3 (400) (250) (0) & shape.n = roof
.OpenGSL.shape.pyramid -u (150) (80) '#8B4513'

.OpenGSL.shape.d3 (400) (380) (5) & shape.n = door
.OpenGSL.shape.rect -u (30) (50) '#654321'

.OpenGSL.shape.d3 (360) (320) (5) & shape.n = win1
.OpenGSL.shape.rect -u (25) (25) '#87CEEB'

.OpenGSL.shape.d3 (440) (320) (5) & shape.n = win2
.OpenGSL.shape.rect -u (25) (25) '#87CEEB'

.OpenGSL.render
exit (0)`}</pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
