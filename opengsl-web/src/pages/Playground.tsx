import { useState, useEffect } from 'react';
import { PlayIcon } from '../components/Icons';
import './Playground.css';

interface ParsedShape {
  type: string;
  name: string;
  x: number;
  y: number;
  z: number;
  size: number;
  size2?: number;
  color: string;
}

const defaultCode = `! OpenGSL Playground !
"Try creating shapes here"

import OpenGSL

.OpenGSL.canvas 'My Creation' (800) (600)
.OpenGSL.bg '#1a1a2e'

! Create your shapes here !
.OpenGSL.shape.d3 (400) (300) (0) & shape.n = myShape
.OpenGSL.shape.sphere -u (80) '#FF6B6B'

.OpenGSL.render

exit (0)`;

export default function Playground() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('Click "Run" to see output...');
  const [shapes, setShapes] = useState<ParsedShape[]>([]);
  const [canvasTitle, setCanvasTitle] = useState('Preview');
  const [bgColor, setBgColor] = useState('#1a1a2e');

  const parseCode = (codeStr: string) => {
    const lines = codeStr.split('\n');
    const parsedShapes: ParsedShape[] = [];
    let outputLines: string[] = [];
    let currentShape: Partial<ParsedShape> = {};
    let title = 'Preview';
    let bg = '#1a1a2e';

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Canvas
      if (trimmed.includes('.OpenGSL.canvas')) {
        const titleMatch = trimmed.match(/'([^']+)'/);
        if (titleMatch) title = titleMatch[1];
        outputLines.push(`[OpenGSL] Canvas: ${title}`);
      }
      // Background
      else if (trimmed.includes('.OpenGSL.bg')) {
        const colorMatch = trimmed.match(/'([^']+)'/);
        if (colorMatch) bg = colorMatch[1];
        outputLines.push(`[OpenGSL] Background: ${bg}`);
      }
      // Shape position d3
      else if (trimmed.includes('shape.d3') || trimmed.includes('shape.d2')) {
        const posMatch = trimmed.match(/\((\d+)\)\s*\((\d+)\)(?:\s*\((\d+)\))?/);
        const nameMatch = trimmed.match(/shape\.n\s*=\s*(\w+)/);
        if (posMatch) {
          currentShape = {
            x: parseInt(posMatch[1]),
            y: parseInt(posMatch[2]),
            z: posMatch[3] ? parseInt(posMatch[3]) : 0,
            name: nameMatch ? nameMatch[1] : 'shape'
          };
          outputLines.push(`[OpenGSL] Shape.${trimmed.includes('d3') ? '3d' : '2d'}: ${currentShape.name} at ${currentShape.x},${currentShape.y}`);
        }
      }
      // Shape types
      else if (trimmed.includes('.OpenGSL.shape.sphere') || trimmed.includes('.shape.sphere')) {
        const sizeMatch = trimmed.match(/\((\d+)\)/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'sphere',
            size: sizeMatch ? parseInt(sizeMatch[1]) : 50,
            color: colorMatch ? colorMatch[1] : '#FF6B6B'
          });
          outputLines.push(`[OpenGSL] Sphere: r=${sizeMatch ? sizeMatch[1] : 50}`);
        }
      }
      else if (trimmed.includes('.OpenGSL.shape.cube') || trimmed.includes('.shape.cube')) {
        const sizeMatch = trimmed.match(/\((\d+)\)/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'cube',
            size: sizeMatch ? parseInt(sizeMatch[1]) : 80,
            color: colorMatch ? colorMatch[1] : '#4ECDC4'
          });
          outputLines.push(`[OpenGSL] Cube: size=${sizeMatch ? sizeMatch[1] : 80}`);
        }
      }
      else if (trimmed.includes('.OpenGSL.shape.cylinder') || trimmed.includes('.shape.cylinder')) {
        const matches = trimmed.match(/\((\d+)\)\s*\((\d+)\)/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'cylinder',
            size: matches ? parseInt(matches[1]) : 50,
            size2: matches ? parseInt(matches[2]) : 30,
            color: colorMatch ? colorMatch[1] : '#FFD93D'
          });
          outputLines.push(`[OpenGSL] Cylinder: r=${matches ? matches[1] : 50} h=${matches ? matches[2] : 30}`);
        }
      }
      else if (trimmed.includes('.OpenGSL.shape.circle') || trimmed.includes('.shape.circle')) {
        const sizeMatch = trimmed.match(/\((\d+)\)/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'circle',
            size: sizeMatch ? parseInt(sizeMatch[1]) : 50,
            color: colorMatch ? colorMatch[1] : '#FF6B6B'
          });
          outputLines.push(`[OpenGSL] Circle: r=${sizeMatch ? sizeMatch[1] : 50}`);
        }
      }
      else if (trimmed.includes('.OpenGSL.shape.rect') || trimmed.includes('.shape.rect')) {
        const matches = trimmed.match(/\((\d+)\)\s*\((\d+)\)/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'rect',
            size: matches ? parseInt(matches[1]) : 100,
            size2: matches ? parseInt(matches[2]) : 80,
            color: colorMatch ? colorMatch[1] : '#6BCB77'
          });
          outputLines.push(`[OpenGSL] Rect: ${matches ? matches[1] : 100}x${matches ? matches[2] : 80}`);
        }
      }
      else if (trimmed.includes('.OpenGSL.shape.pyramid') || trimmed.includes('.shape.pyramid')) {
        const matches = trimmed.match(/\((\d+)\)\s*\((\d+)\)/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'pyramid',
            size: matches ? parseInt(matches[1]) : 80,
            size2: matches ? parseInt(matches[2]) : 60,
            color: colorMatch ? colorMatch[1] : '#8B4513'
          });
          outputLines.push(`[OpenGSL] Pyramid: base=${matches ? matches[1] : 80} h=${matches ? matches[2] : 60}`);
        }
      }
      else if (trimmed.includes('.OpenGSL.shape.text') || trimmed.includes('.shape.text')) {
        const textMatch = trimmed.match(/'([^#][^']*)'/);
        const colorMatch = trimmed.match(/'(#[^']+)'/);
        if (currentShape.x !== undefined) {
          parsedShapes.push({
            ...currentShape as ParsedShape,
            type: 'text',
            size: 20,
            color: colorMatch ? colorMatch[1] : '#FFFFFF',
            name: textMatch ? textMatch[1] : 'Text'
          });
          outputLines.push(`[OpenGSL] Text: "${textMatch ? textMatch[1] : 'Text'}"`);
        }
      }
      else if (trimmed === '.OpenGSL.render') {
        outputLines.push(`[OpenGSL] Rendering...`);
        outputLines.push(`[OpenGSL] ✓ ${parsedShapes.length} shapes rendered!`);
      }
    });

    setCanvasTitle(title);
    setBgColor(bg);
    setShapes(parsedShapes);
    setOutput(outputLines.length > 0 ? outputLines.join('\n') : 'No OpenGSL commands found.');
  };

  const runCode = () => {
    parseCode(code);
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
    setShapes([]);
  };

  const loadExample = (example: string) => {
    const examples: Record<string, string> = {
      apple: `! 3D Apple !
import OpenGSL

.OpenGSL.canvas '3D Apple' (800) (600)
.OpenGSL.bg '#1a1a2e'

.OpenGSL.shape.d3 (400) (320) (0) & shape.n = appleBody
.OpenGSL.shape.sphere -u (80) '#FF2020'

.OpenGSL.shape.d3 (400) (250) (0) & shape.n = appleTop
.OpenGSL.shape.sphere -u (40) '#FF2020'

.OpenGSL.shape.d3 (400) (210) (0) & shape.n = stem
.OpenGSL.shape.cylinder -u (8) (30) '#8B4513'

.OpenGSL.shape.d3 (430) (200) (0) & shape.n = leaf
.OpenGSL.shape.sphere -u (18) '#228B22'

.OpenGSL.render
exit (0)`,
      pizza: `! 3D Pizza !
import OpenGSL

.OpenGSL.canvas '3D Pizza' (800) (600)
.OpenGSL.bg '#1a1a2e'

.OpenGSL.shape.d3 (400) (300) (0) & shape.n = crust
.OpenGSL.shape.circle -u (140) '#D4A574'

.OpenGSL.shape.d3 (400) (300) (5) & shape.n = sauce
.OpenGSL.shape.circle -u (125) '#CC2200'

.OpenGSL.shape.d3 (400) (300) (10) & shape.n = cheese
.OpenGSL.shape.circle -u (120) '#FFD700'

.OpenGSL.shape.d3 (340) (260) (15) & shape.n = pep1
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (460) (260) (15) & shape.n = pep2
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (400) (340) (15) & shape.n = pep3
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (340) (340) (15) & shape.n = pep4
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.shape.d3 (460) (340) (15) & shape.n = pep5
.OpenGSL.shape.sphere -u (18) '#8B0000'

.OpenGSL.render
exit (0)`,
      house: `! 3D House !
import OpenGSL

.OpenGSL.canvas '3D House' (800) (600)
.OpenGSL.bg '#87CEEB'

.OpenGSL.shape.d3 (400) (350) (0) & shape.n = base
.OpenGSL.shape.rect -u (180) (120) '#E8D4B8'

.OpenGSL.shape.d3 (400) (240) (0) & shape.n = roof
.OpenGSL.shape.pyramid -u (200) (80) '#8B4513'

.OpenGSL.shape.d3 (400) (380) (0) & shape.n = door
.OpenGSL.shape.rect -u (40) (60) '#654321'

.OpenGSL.shape.d3 (340) (320) (0) & shape.n = win1
.OpenGSL.shape.rect -u (35) (35) '#87CEEB'

.OpenGSL.shape.d3 (460) (320) (0) & shape.n = win2
.OpenGSL.shape.rect -u (35) (35) '#87CEEB'

.OpenGSL.shape.d3 (480) (200) (0) & shape.n = chimney
.OpenGSL.shape.rect -u (25) (50) '#8B4513'

.OpenGSL.render
exit (0)`,
      snowman: `! 3D Snowman !
import OpenGSL

.OpenGSL.canvas '3D Snowman' (800) (600)
.OpenGSL.bg '#1a3a5c'

.OpenGSL.shape.d3 (400) (400) (0) & shape.n = bottom
.OpenGSL.shape.sphere -u (70) '#FFFFFF'

.OpenGSL.shape.d3 (400) (310) (0) & shape.n = middle
.OpenGSL.shape.sphere -u (50) '#FFFFFF'

.OpenGSL.shape.d3 (400) (245) (0) & shape.n = head
.OpenGSL.shape.sphere -u (35) '#FFFFFF'

.OpenGSL.shape.d3 (400) (200) (0) & shape.n = hat
.OpenGSL.shape.cylinder -u (30) (45) '#333333'

.OpenGSL.shape.d3 (388) (240) (0) & shape.n = eye1
.OpenGSL.shape.sphere -u (5) '#000000'

.OpenGSL.shape.d3 (412) (240) (0) & shape.n = eye2
.OpenGSL.shape.sphere -u (5) '#000000'

.OpenGSL.shape.d3 (400) (255) (0) & shape.n = nose
.OpenGSL.shape.sphere -u (8) '#FF6600'

.OpenGSL.render
exit (0)`
    };
    
    const newCode = examples[example] || defaultCode;
    setCode(newCode);
    parseCode(newCode);
  };

  // Auto-run on mount
  useEffect(() => {
    parseCode(defaultCode);
  }, []);

  const renderShape = (shape: ParsedShape, index: number) => {
    const scale = 0.5; // Scale down for preview
    const x = shape.x * scale;
    const y = shape.y * scale;
    const size = shape.size * scale;
    const size2 = (shape.size2 || shape.size) * scale;

    switch (shape.type) {
      case 'sphere':
        return (
          <g key={index}>
            <defs>
              <radialGradient id={`sphereGrad${index}`} cx="30%" cy="30%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                <stop offset="100%" stopColor={shape.color} />
              </radialGradient>
            </defs>
            <circle cx={x} cy={y} r={size} fill={`url(#sphereGrad${index})`} />
          </g>
        );
      case 'circle':
        return (
          <g key={index}>
            <defs>
              <radialGradient id={`circleGrad${index}`} cx="40%" cy="40%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                <stop offset="100%" stopColor={shape.color} />
              </radialGradient>
            </defs>
            <circle cx={x} cy={y} r={size} fill={`url(#circleGrad${index})`} />
          </g>
        );
      case 'rect':
        return (
          <g key={index}>
            <defs>
              <linearGradient id={`rectGrad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                <stop offset="100%" stopColor={shape.color} />
              </linearGradient>
            </defs>
            <rect x={x - size/2} y={y - size2/2} width={size} height={size2} fill={`url(#rectGrad${index})`} rx="3" />
          </g>
        );
      case 'cube':
        return (
          <g key={index}>
            <defs>
              <linearGradient id={`cubeGrad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={shape.color} />
                <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <rect x={x - size/2} y={y - size/2} width={size} height={size} fill={`url(#cubeGrad${index})`} />
            <polygon points={`${x - size/2},${y - size/2} ${x - size/2 + size*0.3},${y - size/2 - size*0.3} ${x + size/2 + size*0.3},${y - size/2 - size*0.3} ${x + size/2},${y - size/2}`} fill={shape.color} opacity="0.7" />
            <polygon points={`${x + size/2},${y - size/2} ${x + size/2 + size*0.3},${y - size/2 - size*0.3} ${x + size/2 + size*0.3},${y + size/2 - size*0.3} ${x + size/2},${y + size/2}`} fill={shape.color} opacity="0.5" />
          </g>
        );
      case 'cylinder':
        return (
          <g key={index}>
            <defs>
              <linearGradient id={`cylGrad${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
                <stop offset="50%" stopColor={shape.color} />
                <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <ellipse cx={x} cy={y + size2/2} rx={size} ry={size*0.3} fill={shape.color} opacity="0.6" />
            <rect x={x - size} y={y - size2/2} width={size*2} height={size2} fill={`url(#cylGrad${index})`} />
            <ellipse cx={x} cy={y - size2/2} rx={size} ry={size*0.3} fill={shape.color} />
          </g>
        );
      case 'pyramid':
        return (
          <g key={index}>
            <polygon points={`${x},${y - size2/2} ${x - size/2},${y + size2/2} ${x + size/2},${y + size2/2}`} fill={shape.color} />
            <polygon points={`${x},${y - size2/2} ${x + size/2},${y + size2/2} ${x + size*0.3},${y + size2/2 - size*0.2}`} fill={shape.color} opacity="0.6" />
          </g>
        );
      case 'text':
        return (
          <text key={index} x={x} y={y} fill={shape.color} fontSize="14" textAnchor="middle" fontFamily="Arial">{shape.name}</text>
        );
      default:
        return null;
    }
  };

  return (
    <div className="playground-page">
      <div className="playground-header">
        <h1>🎨 OpenGSL Playground</h1>
        <div className="example-buttons">
          <span>Load Example:</span>
          <button onClick={() => loadExample('apple')}>🍎 Apple</button>
          <button onClick={() => loadExample('pizza')}>🍕 Pizza</button>
          <button onClick={() => loadExample('house')}>🏠 House</button>
          <button onClick={() => loadExample('snowman')}>⛄ Snowman</button>
        </div>
      </div>
      
      <div className="playground-content">
        <div className="editor-panel liquid-glass">
          <div className="panel-header">
            <span>Code Editor</span>
            <div className="editor-actions">
              <button onClick={clearCode}>Clear</button>
              <button className="run-btn" onClick={runCode}>
                <PlayIcon /> Run
              </button>
            </div>
          </div>
          <textarea
            className="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        
        <div className="preview-output-container">
          <div className="preview-panel liquid-glass">
            <div className="panel-header">
              <span>Preview: {canvasTitle}</span>
            </div>
            <div className="preview-canvas" style={{ background: bgColor }}>
              <svg viewBox="0 0 400 300" width="100%" height="100%">
                {shapes.map((shape, i) => renderShape(shape, i))}
              </svg>
            </div>
          </div>
          
          <div className="output-panel liquid-glass">
            <div className="panel-header">
              <span>Console Output</span>
            </div>
            <pre className="output-area">{output}</pre>
          </div>
        </div>
      </div>
      
      <div className="playground-tips liquid-glass">
        <h3>Quick Reference</h3>
        <div className="tips-grid">
          <div className="tip-item">
            <code>.OpenGSL.shape.d3 (x) (y) (z) & shape.n = name</code>
            <span>Define 3D position</span>
          </div>
          <div className="tip-item">
            <code>.OpenGSL.shape.sphere -u (radius) '#color'</code>
            <span>Create sphere</span>
          </div>
          <div className="tip-item">
            <code>.OpenGSL.shape.cylinder -u (r) (h) '#color'</code>
            <span>Create cylinder</span>
          </div>
          <div className="tip-item">
            <code>.OpenGSL.shape.cube -u (size) '#color'</code>
            <span>Create cube</span>
          </div>
          <div className="tip-item">
            <code>.OpenGSL.shape.rect -u (w) (h) '#color'</code>
            <span>Create rectangle</span>
          </div>
          <div className="tip-item">
            <code>.OpenGSL.render</code>
            <span>Render scene</span>
          </div>
        </div>
      </div>
    </div>
  );
}
