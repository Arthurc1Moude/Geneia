import React, { useState } from 'react'
import { BookIcon, CodeIcon, WindowIcon, ModuleIcon, TerminalIcon, SpeedIcon } from '../components/Icons'
import './Docs.css'

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('installation')

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="docs-page">
      <div className="container">
        <div className="docs-layout">
          <aside className="docs-sidebar glass-card">
            <div className="sidebar-header">
              <BookIcon size={24} />
              <span>Documentation</span>
            </div>
            <nav className="docs-nav">
              <div className="nav-section">
                <h4>Getting Started</h4>
                <a href="#installation" className={activeSection === 'installation' ? 'active' : ''} onClick={() => scrollToSection('installation')}>Installation</a>
                <a href="#first-program" className={activeSection === 'first-program' ? 'active' : ''} onClick={() => scrollToSection('first-program')}>First Program</a>
                <a href="#syntax-basics" className={activeSection === 'syntax-basics' ? 'active' : ''} onClick={() => scrollToSection('syntax-basics')}>Syntax Basics</a>
              </div>
              <div className="nav-section">
                <h4>Language Guide</h4>
                <a href="#variables" onClick={() => scrollToSection('variables')}>Variables</a>
                <a href="#output" onClick={() => scrollToSection('output')}>Output (peat)</a>
                <a href="#loops" onClick={() => scrollToSection('loops')}>Loops</a>
                <a href="#time-units" onClick={() => scrollToSection('time-units')}>Time Units</a>
                <a href="#operators" onClick={() => scrollToSection('operators')}>Operators</a>
                <a href="#functions" onClick={() => scrollToSection('functions')}>Functions</a>
                <a href="#conditionals" onClick={() => scrollToSection('conditionals')}>Conditionals</a>
              </div>
              <div className="nav-section">
                <h4>Modules</h4>
                <a href="#import-export" onClick={() => scrollToSection('import-export')}>Import & Export</a>
                <a href="#built-in" onClick={() => scrollToSection('built-in')}>Built-in Modules</a>
                <a href="#module-functions" onClick={() => scrollToSection('module-functions')}>Module Functions</a>
                <a href="#geneiaui" onClick={() => scrollToSection('geneiaui')}>GeneiaUI</a>
                <a href="#opengsl" onClick={() => scrollToSection('opengsl')}>OpenGSL</a>
                <a href="#extensions" onClick={() => scrollToSection('extensions')}>Extensions</a>
              </div>
              <div className="nav-section">
                <h4>GUI Development</h4>
                <a href="#ui-basics" onClick={() => scrollToSection('ui-basics')}>UI Basics</a>
                <a href="#components" onClick={() => scrollToSection('components')}>Components</a>
                <a href="#ui-script" onClick={() => scrollToSection('ui-script')}>UI Script Format</a>
                <a href="#events" onClick={() => scrollToSection('events')}>Events</a>
              </div>
              <div className="nav-section">
                <h4>Reference</h4>
                <a href="#keywords" onClick={() => scrollToSection('keywords')}>All Keywords</a>
                <a href="#examples" onClick={() => scrollToSection('examples')}>Examples</a>
              </div>
            </nav>
          </aside>

          <main className="docs-content">
            <h1 className="docs-title">Geneia Documentation</h1>
            <p className="docs-intro">Complete guide to the Geneia programming language - unique syntax, powerful features, and real GUI support.</p>
            
            {/* INSTALLATION */}
            <section id="installation" className="doc-section">
              <div className="section-header">
                <TerminalIcon size={32} />
                <h2>Installation</h2>
              </div>
              <p>Get started with Geneia in minutes on any platform.</p>
              
              <h3>Prerequisites</h3>
              <ul className="doc-list">
                <li>C++17 compatible compiler (g++, clang++)</li>
                <li>Make build system</li>
                <li>.NET 8.0 Runtime (for GUI, optional)</li>
              </ul>

              <h3>Build from Source</h3>
              <pre className="code-block">{`# Clone the repository
git clone https://github.com/geneia/geneia.git
cd geneia

# Build the compiler
cd compiler
make

# Verify installation
./geneia --version

# Run a test program
./geneia ../examples/hello.gn`}</pre>

              <h3>Windows Installation</h3>
              <pre className="code-block">{`# Download the installer from the website
# Or use the portable .zip version

# Add to PATH (optional)
set PATH=%PATH%;C:\\geneia\\bin`}</pre>

              <h3>Linux Installation</h3>
              <pre className="code-block">{`# Using apt (Debian/Ubuntu)
sudo apt install geneia

# Or build from source
git clone https://github.com/geneia/geneia.git
cd geneia/compiler && make
sudo cp geneia /usr/local/bin/`}</pre>
            </section>

            {/* FIRST PROGRAM */}
            <section id="first-program" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Your First Program</h2>
              </div>
              <p>Create your first Geneia program in seconds.</p>
              
              <h3>Hello World</h3>
              <p>Create a file called <code>hello.gn</code>:</p>
              <pre className="code-block">
<span className="comment">! My first Geneia program !</span>

<span className="tip">"Welcome to Geneia!"</span>

<span className="keyword">peat</span> <span className="string">'Hello, World!'</span>

<span className="keyword">exit</span> <span className="number">(0)</span></pre>

              <h3>Run Your Program</h3>
              <pre className="code-block">{`./geneia hello.gn`}</pre>

              <h3>Output</h3>
              <pre className="code-block output">{`[TIP] Welcome to Geneia!
Hello, World!`}</pre>

              <h3>With Variables</h3>
              <pre className="code-block">
<span className="comment">! Using variables !</span>

<span className="keyword">var</span> <span className="variable">{'{'}name{'}'}</span> = <span className="string">'Geneia'</span>
<span className="keyword">var</span> <span className="variable">{'{'}version{'}'}</span> = <span className="string">'1.0.0'</span>

<span className="keyword">peat</span> <span className="string">'Language: '</span>
<span className="keyword">peat</span> <span className="variable">{'{'}name{'}'}</span>
<span className="keyword">peat</span> <span className="string">'Version: '</span>
<span className="keyword">peat</span> <span className="variable">{'{'}version{'}'}</span>

<span className="keyword">exit</span> <span className="number">(0)</span></pre>
            </section>

            {/* SYNTAX BASICS */}
            <section id="syntax-basics" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Syntax Basics</h2>
              </div>
              <p>Geneia uses a unique syntax with 5 different quote types, each with a specific purpose.</p>
              
              <h3>Quote Types</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Quote</th>
                    <th>Purpose</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="variable">{'{'}...{'}'}</code></td>
                    <td>Variable names (string variables)</td>
                    <td><code>var {'{'}name{'}'} = 'value'</code></td>
                  </tr>
                  <tr>
                    <td><code className="string">'...'</code></td>
                    <td>Echo messages and string values</td>
                    <td><code>peat 'Hello World'</code></td>
                  </tr>
                  <tr>
                    <td><code className="tip">"..."</code></td>
                    <td>Running tips (displayed with [TIP] prefix)</td>
                    <td><code>"This is a helpful tip"</code></td>
                  </tr>
                  <tr>
                    <td><code className="comment">!...!</code></td>
                    <td>Comments (ignored by compiler)</td>
                    <td><code>! This is a comment !</code></td>
                  </tr>
                  <tr>
                    <td><code className="number">(...)</code></td>
                    <td>Numbers (for numeric variables)</td>
                    <td><code>hold (count) = (5)</code></td>
                  </tr>
                </tbody>
              </table>

              <h3>Keywords</h3>
              <p>Geneia uses short 2-4 letter keywords for readability:</p>
              <div className="keyword-grid">
                <div className="keyword-item"><code>var</code> - String variable</div>
                <div className="keyword-item"><code>str(U+)</code> - Unicode string function</div>
                <div className="keyword-item"><code>hold</code> - Number variable</div>
                <div className="keyword-item"><code>peat</code> - Print/echo output</div>
                <div className="keyword-item"><code>msg</code> - Message output</div>
                <div className="keyword-item"><code>turn</code> - Loop block</div>
                <div className="keyword-item"><code>repeat</code> - Quick repeat</div>
                <div className="keyword-item"><code>func</code> - Function definition</div>
                <div className="keyword-item"><code>check</code> - Conditional</div>
                <div className="keyword-item"><code>import</code> - Import module</div>
                <div className="keyword-item"><code>export</code> - Export symbol</div>
                <div className="keyword-item"><code>exit</code> - Exit program</div>
              </div>
            </section>

            {/* VARIABLES */}
            <section id="variables" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Variables</h2>
              </div>
              <p>Geneia has two types of variables: strings and numbers, plus special strings.</p>
              
              <h3>String Variables (var)</h3>
              <p>Use <code>var</code> keyword with curly braces for variable names:</p>
              <pre className="code-block">
<span className="keyword">var</span> <span className="variable">{'{'}name{'}'}</span> = <span className="string">'Geneia'</span>
<span className="keyword">var</span> <span className="variable">{'{'}greeting{'}'}</span> = <span className="string">'Hello World'</span>
<span className="keyword">var</span> <span className="variable">{'{'}empty{'}'}</span> = <span className="string">''</span>

<span className="comment">! Print the variable !</span>
<span className="keyword">peat</span> <span className="variable">{'{'}name{'}'}</span></pre>

              <h3>Unicode Strings (str)</h3>
              <p>Use <code>str(U+XXXX)</code> function for Unicode characters:</p>
              <pre className="code-block">
<span className="comment">! str(U+XXXX) for Unicode characters !</span>
<span className="keyword">str</span><span className="number">(U+0041)</span>   <span className="comment">! A !</span>
<span className="keyword">str</span><span className="number">(U+00A9)</span>   <span className="comment">! © !</span>
<span className="keyword">str</span><span className="number">(U+2764)</span>   <span className="comment">! ❤ !</span>
<span className="keyword">str</span><span className="number">(U+1F600)</span>  <span className="comment">! 😀 !</span>

<span className="comment">! Use for special/unknown Unicode characters !</span></pre>

              <h3>Number Variables (hold)</h3>
              <p>Use <code>hold</code> keyword with parentheses for numbers:</p>
              <pre className="code-block">
<span className="keyword">hold</span> <span className="number">(count)</span> = <span className="number">(10)</span>
<span className="keyword">hold</span> <span className="number">(age)</span> = <span className="number">(25)</span>
<span className="keyword">hold</span> <span className="number">(price)</span> = <span className="number">(99)</span>

<span className="comment">! Use in loops !</span>
<span className="keyword">turn</span> <span className="number">(count)</span> {'{'}
    <span className="keyword">peat</span> <span className="string">'Iteration'</span>
{'}'}</pre>

              <h3>Variable Naming Rules</h3>
              <ul className="doc-list">
                <li>String variables: Use curly braces <code>{'{'}varname{'}'}</code></li>
                <li>Number variables: Use parentheses <code>(varname)</code></li>
                <li>Names can contain letters, numbers, underscores</li>
                <li>Names are case-sensitive</li>
              </ul>
            </section>

            {/* OUTPUT */}
            <section id="output" className="doc-section">
              <div className="section-header">
                <TerminalIcon size={32} />
                <h2>Output (peat & msg)</h2>
              </div>
              <p>Geneia provides multiple ways to output text.</p>
              
              <h3>peat - Print/Echo</h3>
              <p>The primary output command:</p>
              <pre className="code-block">
<span className="keyword">peat</span> <span className="string">'Hello, World!'</span>
<span className="keyword">peat</span> <span className="string">'Multiple lines'</span>
<span className="keyword">peat</span> <span className="variable">{'{'}variable{'}'}</span></pre>

              <h3>msg - Message Output</h3>
              <p>Alternative output with message formatting:</p>
              <pre className="code-block">
<span className="keyword">msg</span> <span className="string">'This is a message'</span></pre>

              <h3>Running Tips</h3>
              <p>Tips are displayed with [TIP] prefix:</p>
              <pre className="code-block">
<span className="tip">"This tip will show as [TIP] This tip..."</span>
<span className="tip">"Helpful information for the user"</span></pre>

              <h3>Output Examples</h3>
              <pre className="code-block">
<span className="comment">! Complete output example !</span>

<span className="tip">"Starting program..."</span>

<span className="keyword">var</span> <span className="variable">{'{'}name{'}'}</span> = <span className="string">'User'</span>

<span className="keyword">peat</span> <span className="string">'Welcome, '</span>
<span className="keyword">peat</span> <span className="variable">{'{'}name{'}'}</span>
<span className="keyword">peat</span> <span className="string">'!'</span>

<span className="keyword">msg</span> <span className="string">'Program complete'</span></pre>
            </section>

            {/* LOOPS */}
            <section id="loops" className="doc-section">
              <div className="section-header">
                <SpeedIcon size={32} />
                <h2>Loops</h2>
              </div>
              <p>Geneia provides two loop constructs: <code>repeat</code> and <code>turn</code>.</p>
              
              <h3>repeat - Quick Repeat with Time</h3>
              <p>Repeat a message with a time delay:</p>
              <pre className="code-block">
<span className="comment">! Syntax: repeat 'message' & time_unit = (count) !</span>

<span className="keyword">repeat</span> <span className="string">'Processing...'</span> & t.s = <span className="number">(3)</span>
<span className="comment">! Prints "Processing..." 3 times, 1 second apart !</span>

<span className="keyword">repeat</span> <span className="string">'Loading'</span> & t.ms = <span className="number">(5)</span>
<span className="comment">! Prints "Loading" 5 times, 1 millisecond apart !</span></pre>

              <h3>turn - Loop Block</h3>
              <p>Execute multiple statements in a loop:</p>
              <pre className="code-block">
<span className="keyword">turn</span> <span className="number">(5)</span> {'{'}
    <span className="keyword">peat</span> <span className="string">'Iteration start'</span>
    <span className="keyword">peat</span> <span className="string">'Processing...'</span>
    <span className="keyword">peat</span> <span className="string">'Iteration end'</span>
{'}'}

<span className="comment">! Using a variable for count !</span>
<span className="keyword">hold</span> <span className="number">(loops)</span> = <span className="number">(10)</span>
<span className="keyword">turn</span> <span className="number">(loops)</span> {'{'}
    <span className="keyword">peat</span> <span className="string">'Loop iteration'</span>
{'}'}</pre>

              <h3>Nested Loops</h3>
              <pre className="code-block">
<span className="keyword">turn</span> <span className="number">(3)</span> {'{'}
    <span className="keyword">peat</span> <span className="string">'Outer loop'</span>
    <span className="keyword">turn</span> <span className="number">(2)</span> {'{'}
        <span className="keyword">peat</span> <span className="string">'  Inner loop'</span>
    {'}'}
{'}'}</pre>
            </section>

            {/* TIME UNITS */}
            <section id="time-units" className="doc-section">
              <div className="section-header">
                <SpeedIcon size={32} />
                <h2>Time Units</h2>
              </div>
              <p>Geneia uses the <code>t.</code> prefix for time units.</p>
              
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Unit</th>
                    <th>Meaning</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>t.ms</code></td><td>Milliseconds</td><td><code>repeat 'Fast' & t.ms = (100)</code></td></tr>
                  <tr><td><code>t.s</code></td><td>Seconds</td><td><code>repeat 'Normal' & t.s = (5)</code></td></tr>
                  <tr><td><code>t.m</code></td><td>Minutes</td><td><code>repeat 'Slow' & t.m = (2)</code></td></tr>
                  <tr><td><code>t.h</code></td><td>Hours</td><td><code>repeat 'Very slow' & t.h = (1)</code></td></tr>
                  <tr><td><code>t.d</code></td><td>Days</td><td><code>repeat 'Daily' & t.d = (7)</code></td></tr>
                </tbody>
              </table>

              <h3>Usage with repeat</h3>
              <pre className="code-block">
<span className="comment">! Different time units !</span>

<span className="keyword">repeat</span> <span className="string">'Every millisecond'</span> & t.ms = <span className="number">(10)</span>
<span className="keyword">repeat</span> <span className="string">'Every second'</span> & t.s = <span className="number">(5)</span>
<span className="keyword">repeat</span> <span className="string">'Every minute'</span> & t.m = <span className="number">(3)</span></pre>
            </section>

            {/* OPERATORS */}
            <section id="operators" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Operators</h2>
              </div>
              <p>Geneia uses special operators for connecting functions and operations.</p>
              
              <h3>& - Inner Connection</h3>
              <p>Connects a function with a time unit (requires time unit):</p>
              <pre className="code-block">
<span className="comment">! & connects repeat with time unit !</span>
<span className="keyword">repeat</span> <span className="string">'Message'</span> & t.s = <span className="number">(3)</span>

<span className="comment">! The & operator binds the time unit to the repeat !</span></pre>

              <h3>&& - Outer Connection</h3>
              <p>Separates independent functions/operations:</p>
              <pre className="code-block">
<span className="comment">! && separates independent operations !</span>
<span className="keyword">peat</span> <span className="string">'First'</span> && <span className="keyword">peat</span> <span className="string">'Second'</span>

<span className="comment">! Each operation runs independently !</span></pre>

              <h3>= - Assignment</h3>
              <p>Assigns values to variables:</p>
              <pre className="code-block">
<span className="keyword">var</span> <span className="variable">{'{'}name{'}'}</span> = <span className="string">'value'</span>
<span className="keyword">hold</span> <span className="number">(count)</span> = <span className="number">(10)</span></pre>

              <h3>Operator Summary</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Name</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>&</code></td><td>Inner Connection</td><td>Binds time unit to function</td></tr>
                  <tr><td><code>&&</code></td><td>Outer Connection</td><td>Separates independent operations</td></tr>
                  <tr><td><code>=</code></td><td>Assignment</td><td>Assigns value to variable</td></tr>
                </tbody>
              </table>
            </section>

            {/* FUNCTIONS */}
            <section id="functions" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Functions</h2>
              </div>
              <p>Define reusable code blocks with the <code>func</code> keyword.</p>
              
              <h3>Function Definition</h3>
              <pre className="code-block">
<span className="keyword">func</span> greet {'{'}
    <span className="keyword">peat</span> <span className="string">'Hello!'</span>
    <span className="keyword">peat</span> <span className="string">'Welcome to Geneia'</span>
{'}'}

<span className="comment">! Call the function !</span>
greet</pre>

              <h3>Functions with Variables</h3>
              <pre className="code-block">
<span className="keyword">var</span> <span className="variable">{'{'}user{'}'}</span> = <span className="string">'Developer'</span>

<span className="keyword">func</span> welcome {'{'}
    <span className="keyword">peat</span> <span className="string">'Welcome, '</span>
    <span className="keyword">peat</span> <span className="variable">{'{'}user{'}'}</span>
    <span className="keyword">peat</span> <span className="string">'!'</span>
{'}'}

welcome</pre>
            </section>

            {/* CONDITIONALS */}
            <section id="conditionals" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Conditionals</h2>
              </div>
              <p>Use <code>check</code> for conditional execution.</p>
              
              <h3>Basic Check</h3>
              <pre className="code-block">
<span className="keyword">hold</span> <span className="number">(value)</span> = <span className="number">(10)</span>

<span className="keyword">check</span> <span className="number">(value)</span> {'{'}
    <span className="keyword">peat</span> <span className="string">'Value exists'</span>
{'}'}</pre>
            </section>

            {/* IMPORT EXPORT */}
            <section id="import-export" className="doc-section">
              <div className="section-header">
                <ModuleIcon size={32} />
                <h2>Import & Export</h2>
              </div>
              <p>Geneia supports a powerful module system for code organization.</p>
              
              <h3>Importing Built-in Modules</h3>
              <pre className="code-block">
<span className="keyword">import</span> UI
<span className="keyword">import</span> Math
<span className="keyword">import</span> Graphics
<span className="keyword">import</span> Network
<span className="keyword">import</span> File</pre>

              <h3>Importing Extensions</h3>
              <pre className="code-block">
<span className="comment">! Import .gne (Regular Extension) !</span>
<span className="keyword">import</span> math_utils.gne

<span className="comment">! Import .gns (System Extension) !</span>
<span className="keyword">import</span> ui_helpers.gns</pre>

              <h3>Exporting Symbols</h3>
              <p>Make variables and functions available to other modules:</p>
              <pre className="code-block">
<span className="comment">! In my_module.gne !</span>

<span className="keyword">var</span> <span className="variable">{'{'}module_name{'}'}</span> = <span className="string">'MyModule'</span>
<span className="keyword">hold</span> <span className="number">(version)</span> = <span className="number">(1)</span>

<span className="keyword">func</span> helper {'{'}
    <span className="keyword">peat</span> <span className="string">'Helper function'</span>
{'}'}

<span className="keyword">export</span> module_name
<span className="keyword">export</span> version
<span className="keyword">export</span> helper</pre>
            </section>

            {/* BUILT-IN MODULES */}
            <section id="built-in" className="doc-section">
              <div className="section-header">
                <ModuleIcon size={32} />
                <h2>Built-in Modules</h2>
              </div>
              <p>Geneia comes with 5 built-in modules.</p>
              
              <div className="module-grid">
                <div className="module-card glass-card">
                  <h4>UI</h4>
                  <p>Create graphical user interfaces with windows, buttons, labels, and more.</p>
                  <code>import UI</code>
                </div>
                <div className="module-card glass-card">
                  <h4>Math</h4>
                  <p>Mathematical functions: sin, cos, sqrt, pow, abs, random, etc.</p>
                  <code>import Math</code>
                </div>
                <div className="module-card glass-card">
                  <h4>Graphics</h4>
                  <p>2D graphics rendering: shapes, colors, images, animations.</p>
                  <code>import Graphics</code>
                </div>
                <div className="module-card glass-card">
                  <h4>Network</h4>
                  <p>Network operations: HTTP requests, sockets, APIs.</p>
                  <code>import Network</code>
                </div>
                <div className="module-card glass-card">
                  <h4>File</h4>
                  <p>File system operations: read, write, delete, list files.</p>
                  <code>import File</code>
                </div>
                <div className="module-card glass-card">
                  <h4>GeneiaUI</h4>
                  <p>Full GUI module: windows, panels, buttons, menus, themes, customized UI.</p>
                  <code>import GeneiaUI</code>
                </div>
                <div className="module-card glass-card">
                  <h4>OpenGSL</h4>
                  <p>Graphics library: 2D, 2.5D, 3D shapes, colors, canvas rendering.</p>
                  <code>import OpenGSL</code>
                </div>
              </div>

              <h3>Using Module Functions</h3>
              <p>After importing a module, use its functions with <code>.Module.function</code> syntax (note the leading dot):</p>
              <pre className="code-block">
<span className="keyword">import</span> Math
<span className="keyword">import</span> UI
<span className="keyword">import</span> String
<span className="keyword">import</span> GeneiaUI
<span className="keyword">import</span> OpenGSL

<span className="comment">! Math module functions (use .Module.function) !</span>
.Math.sqrt <span className="number">(16)</span>        <span className="comment">! Output: 4 !</span>
.Math.pow <span className="number">(2)</span> <span className="number">(8)</span>      <span className="comment">! Output: 256 !</span>
.Math.pi                <span className="comment">! Output: 3.14159... !</span>
.Math.rand <span className="number">(100)</span>       <span className="comment">! Random 0-99 !</span>
.Math.sin <span className="number">(0)</span>          <span className="comment">! Output: 0 !</span>
.Math.abs <span className="number">(-5)</span>         <span className="comment">! Output: 5 !</span>
.Math.floor <span className="number">(3.7)</span>      <span className="comment">! Output: 3 !</span>
.Math.ceil <span className="number">(3.2)</span>       <span className="comment">! Output: 4 !</span>
.Math.round <span className="number">(3.5)</span>      <span className="comment">! Output: 4 !</span>

<span className="comment">! String module functions !</span>
.String.upper <span className="string">'hello'</span>   <span className="comment">! Output: HELLO !</span>
.String.lower <span className="string">'HELLO'</span>   <span className="comment">! Output: hello !</span>
.String.len <span className="string">'hello'</span>     <span className="comment">! Output: 5 !</span>

<span className="comment">! UI module functions !</span>
.UI.window <span className="string">'My App'</span>
.UI.button <span className="string">'Click Me'</span>
.UI.label <span className="string">'Hello'</span>
.UI.message <span className="string">'Done!'</span>

<span className="comment">! GeneiaUI - Full GUI module !</span>
.GeneiaUI.window <span className="string">'Custom App'</span>
.GeneiaUI.theme <span className="string">'dark'</span>
.GeneiaUI.button <span className="string">'Submit'</span>
.GeneiaUI.run</pre>

              <h3>Module Function Reference</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Functions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>.Math</code></td><td>sqrt, pow, sin, cos, abs, floor, ceil, round, rand, pi</td></tr>
                  <tr><td><code>.String</code></td><td>upper, lower, len</td></tr>
                  <tr><td><code>.UI</code></td><td>window, button, label, textbox, show, message</td></tr>
                  <tr><td><code>.GeneiaUI</code></td><td>window, panel, button, label, input, text, list, menu, toolbar, status, dialog, style, theme, color, font, size, pos, show, hide, close, run</td></tr>
                  <tr><td><code>.OpenGSL</code></td><td>canvas, bg, color, rect, circle, ellipse, line, text, iso, cube, sphere, pyramid, cylinder, render</td></tr>
                  <tr><td><code>.File</code></td><td>read, write</td></tr>
                  <tr><td><code>.Network</code></td><td>http, connect</td></tr>
                  <tr><td><code>.Graphics</code></td><td>draw, circle, rect, line</td></tr>
                  <tr><td><code>.Console</code></td><td>clear, color</td></tr>
                </tbody>
              </table>
            </section>

            {/* GeneiaUI Module */}
            <section id="geneiaui" className="doc-section">
              <div className="section-header">
                <WindowIcon size={32} />
                <h2>GeneiaUI Module</h2>
              </div>
              <p>GeneiaUI is the built-in module for creating full window GUI applications with customized UI.</p>
              
              <h3>Import GeneiaUI</h3>
              <pre className="code-block">
<span className="keyword">import</span> GeneiaUI</pre>

              <h3>Basic Window Application</h3>
              <pre className="code-block">
<span className="keyword">import</span> GeneiaUI

<span className="comment">! Create window !</span>
.GeneiaUI.window <span className="string">'My Application'</span>

<span className="comment">! Add UI elements !</span>
.GeneiaUI.label <span className="string">'Welcome!'</span>
.GeneiaUI.input
.GeneiaUI.button <span className="string">'Submit'</span>

<span className="comment">! Show and run !</span>
.GeneiaUI.show
.GeneiaUI.run</pre>

              <h3>Customization</h3>
              <pre className="code-block">
<span className="comment">! Theme and styling !</span>
.GeneiaUI.theme <span className="string">'dark'</span>
.GeneiaUI.color <span className="string">'#3498db'</span>
.GeneiaUI.font <span className="string">'Arial'</span>

<span className="comment">! Layout !</span>
.GeneiaUI.size <span className="number">(800)</span> <span className="number">(600)</span>
.GeneiaUI.pos <span className="number">(100)</span> <span className="number">(100)</span></pre>

              <h3>GeneiaUI Functions</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Function</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>.GeneiaUI.window</code></td><td>Create main window</td></tr>
                  <tr><td><code>.GeneiaUI.panel</code></td><td>Create panel container</td></tr>
                  <tr><td><code>.GeneiaUI.button</code></td><td>Create button</td></tr>
                  <tr><td><code>.GeneiaUI.label</code></td><td>Create text label</td></tr>
                  <tr><td><code>.GeneiaUI.input</code></td><td>Create input field</td></tr>
                  <tr><td><code>.GeneiaUI.text</code></td><td>Create text area</td></tr>
                  <tr><td><code>.GeneiaUI.list</code></td><td>Create list view</td></tr>
                  <tr><td><code>.GeneiaUI.menu</code></td><td>Create menu item</td></tr>
                  <tr><td><code>.GeneiaUI.toolbar</code></td><td>Create toolbar</td></tr>
                  <tr><td><code>.GeneiaUI.status</code></td><td>Set status bar text</td></tr>
                  <tr><td><code>.GeneiaUI.dialog</code></td><td>Show dialog box</td></tr>
                  <tr><td><code>.GeneiaUI.theme</code></td><td>Set UI theme</td></tr>
                  <tr><td><code>.GeneiaUI.color</code></td><td>Set color</td></tr>
                  <tr><td><code>.GeneiaUI.font</code></td><td>Set font</td></tr>
                  <tr><td><code>.GeneiaUI.show</code></td><td>Show window</td></tr>
                  <tr><td><code>.GeneiaUI.hide</code></td><td>Hide window</td></tr>
                  <tr><td><code>.GeneiaUI.close</code></td><td>Close window</td></tr>
                  <tr><td><code>.GeneiaUI.run</code></td><td>Run application</td></tr>
                </tbody>
              </table>
            </section>

            {/* OpenGSL Module */}
            <section id="opengsl" className="doc-section">
              <div className="section-header">
                <WindowIcon size={32} />
                <h2>OpenGSL - Graphics Library</h2>
              </div>
              <p>OpenGSL (Open Public Geneia Styling Library) provides 2D, 2.5D, and 3D graphics for Geneia.</p>
              
              <h3>Import OpenGSL</h3>
              <pre className="code-block">
<span className="keyword">import</span> OpenGSL</pre>

              <h3>Canvas Setup</h3>
              <pre className="code-block">
<span className="keyword">import</span> OpenGSL

<span className="comment">! Create canvas !</span>
.OpenGSL.canvas <span className="string">'My Graphics'</span> <span className="number">(800)</span> <span className="number">(600)</span>
.OpenGSL.bg <span className="string">'#1a1a2e'</span></pre>

              <h3>2D Shapes</h3>
              <pre className="code-block">
<span className="comment">! Set color and draw shapes !</span>
.OpenGSL.color <span className="string">'#FF0000'</span>
.OpenGSL.rect <span className="number">(50)</span> <span className="number">(50)</span> <span className="number">(100)</span> <span className="number">(80)</span>

.OpenGSL.color <span className="string">'#00FF00'</span>
.OpenGSL.circle <span className="number">(200)</span> <span className="number">(100)</span> <span className="number">(50)</span>

.OpenGSL.color <span className="string">'#0000FF'</span>
.OpenGSL.ellipse <span className="number">(350)</span> <span className="number">(100)</span> <span className="number">(60)</span> <span className="number">(40)</span>

.OpenGSL.color <span className="string">'#FFFF00'</span>
.OpenGSL.line <span className="number">(400)</span> <span className="number">(50)</span> <span className="number">(500)</span> <span className="number">(150)</span>

.OpenGSL.color <span className="string">'#FFFFFF'</span>
.OpenGSL.text <span className="number">(100)</span> <span className="number">(200)</span> <span className="string">'Hello OpenGSL!'</span></pre>

              <h3>2.5D Isometric Shapes</h3>
              <pre className="code-block">
<span className="comment">! Isometric box (x, y, width, height, depth) !</span>
.OpenGSL.color <span className="string">'#FF7F00'</span>
.OpenGSL.iso <span className="number">(100)</span> <span className="number">(300)</span> <span className="number">(80)</span> <span className="number">(60)</span> <span className="number">(40)</span></pre>

              <h3>3D Shapes</h3>
              <pre className="code-block">
<span className="comment">! 3D Cube (x, y, z, size) !</span>
.OpenGSL.color <span className="string">'#00FFFF'</span>
.OpenGSL.cube <span className="number">(300)</span> <span className="number">(350)</span> <span className="number">(0)</span> <span className="number">(80)</span>

<span className="comment">! 3D Sphere (x, y, z, radius) !</span>
.OpenGSL.color <span className="string">'#FF00FF'</span>
.OpenGSL.sphere <span className="number">(450)</span> <span className="number">(350)</span> <span className="number">(0)</span> <span className="number">(50)</span>

<span className="comment">! 3D Pyramid (x, y, z, base, height) !</span>
.OpenGSL.color <span className="string">'#FFD700'</span>
.OpenGSL.pyramid <span className="number">(600)</span> <span className="number">(400)</span> <span className="number">(0)</span> <span className="number">(80)</span> <span className="number">(100)</span>

<span className="comment">! 3D Cylinder (x, y, z, radius, height) !</span>
.OpenGSL.color <span className="string">'#32CD32'</span>
.OpenGSL.cylinder <span className="number">(150)</span> <span className="number">(500)</span> <span className="number">(0)</span> <span className="number">(40)</span> <span className="number">(80)</span></pre>

              <h3>Render</h3>
              <pre className="code-block">
<span className="comment">! Show the graphics window !</span>
.OpenGSL.render</pre>

              <h3>OpenGSL Functions</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Function</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>.OpenGSL.canvas</code></td><td>Create canvas (title, width, height)</td></tr>
                  <tr><td><code>.OpenGSL.bg</code></td><td>Set background color</td></tr>
                  <tr><td><code>.OpenGSL.color</code></td><td>Set current drawing color</td></tr>
                  <tr><td><code>.OpenGSL.rect</code></td><td>Draw rectangle (x, y, w, h)</td></tr>
                  <tr><td><code>.OpenGSL.circle</code></td><td>Draw circle (x, y, radius)</td></tr>
                  <tr><td><code>.OpenGSL.ellipse</code></td><td>Draw ellipse (x, y, rx, ry)</td></tr>
                  <tr><td><code>.OpenGSL.line</code></td><td>Draw line (x1, y1, x2, y2)</td></tr>
                  <tr><td><code>.OpenGSL.text</code></td><td>Draw text (x, y, text)</td></tr>
                  <tr><td><code>.OpenGSL.iso</code></td><td>Draw 2.5D isometric box</td></tr>
                  <tr><td><code>.OpenGSL.cube</code></td><td>Draw 3D cube</td></tr>
                  <tr><td><code>.OpenGSL.sphere</code></td><td>Draw 3D sphere</td></tr>
                  <tr><td><code>.OpenGSL.pyramid</code></td><td>Draw 3D pyramid</td></tr>
                  <tr><td><code>.OpenGSL.cylinder</code></td><td>Draw 3D cylinder</td></tr>
                  <tr><td><code>.OpenGSL.render</code></td><td>Render and show window</td></tr>
                </tbody>
              </table>
            </section>

            {/* EXTENSIONS */}
            <section id="extensions" className="doc-section">
              <div className="section-header">
                <ModuleIcon size={32} />
                <h2>Extensions (.gne/.gns)</h2>
              </div>
              <p>Extend Geneia with custom modules.</p>
              
              <h3>Extension Types</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Extension</th>
                    <th>Name</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>.gne</code></td><td>Geneia Regular Extension</td><td>Standard user extensions</td></tr>
                  <tr><td><code>.gns</code></td><td>Geneia System Extension</td><td>System-level extensions with special privileges</td></tr>
                </tbody>
              </table>

              <h3>Creating an Extension</h3>
              <pre className="code-block">
<span className="comment">! File: string_utils.gne !</span>

<span className="keyword">func</span> greet_user {'{'}
    <span className="keyword">peat</span> <span className="string">'Hello from extension!'</span>
{'}'}

<span className="keyword">var</span> <span className="variable">{'{'}ext_version{'}'}</span> = <span className="string">'1.0.0'</span>

<span className="keyword">export</span> greet_user
<span className="keyword">export</span> ext_version</pre>

              <h3>Using an Extension</h3>
              <pre className="code-block">
<span className="comment">! In your main.gn file !</span>

<span className="keyword">import</span> string_utils.gne

<span className="comment">! Now you can use exported functions !</span>
greet_user</pre>
            </section>

            {/* UI BASICS */}
            <section id="ui-basics" className="doc-section">
              <div className="section-header">
                <WindowIcon size={32} />
                <h2>UI Basics</h2>
              </div>
              <p>Create real graphical user interfaces with Geneia.</p>
              
              <h3>Import UI Module</h3>
              <pre className="code-block">
<span className="keyword">import</span> UI

<span className="tip">"UI module loaded - ready to create windows!"</span></pre>

              <h3>Supported Platforms</h3>
              <ul className="doc-list">
                <li><strong>Windows</strong> - Windows Forms (.NET)</li>
                <li><strong>Linux</strong> - GTK# (Mono/GTK)</li>
                <li><strong>Terminal</strong> - Terminal UI (fallback)</li>
              </ul>

              <h3>Basic Window</h3>
              <pre className="code-block">
<span className="keyword">import</span> UI

<span className="comment">! Create a simple window !</span>
UI.Window <span className="string">'My App'</span> {'{'}
    width = <span className="number">(400)</span>
    height = <span className="number">(300)</span>
{'}'}</pre>
            </section>

            {/* COMPONENTS */}
            <section id="components" className="doc-section">
              <div className="section-header">
                <WindowIcon size={32} />
                <h2>UI Components</h2>
              </div>
              <p>Available UI components for building interfaces.</p>
              
              <div className="component-grid">
                <div className="component-item">
                  <h4>Window</h4>
                  <p>Main application window container</p>
                </div>
                <div className="component-item">
                  <h4>Button</h4>
                  <p>Clickable button with text</p>
                </div>
                <div className="component-item">
                  <h4>Label</h4>
                  <p>Static text display</p>
                </div>
                <div className="component-item">
                  <h4>TextBox</h4>
                  <p>Single-line text input</p>
                </div>
                <div className="component-item">
                  <h4>Panel</h4>
                  <p>Container for grouping components</p>
                </div>
                <div className="component-item">
                  <h4>ListBox</h4>
                  <p>Scrollable list of items</p>
                </div>
                <div className="component-item">
                  <h4>ComboBox</h4>
                  <p>Dropdown selection list</p>
                </div>
                <div className="component-item">
                  <h4>CheckBox</h4>
                  <p>Boolean checkbox input</p>
                </div>
                <div className="component-item">
                  <h4>RadioButton</h4>
                  <p>Single selection from group</p>
                </div>
                <div className="component-item">
                  <h4>ProgressBar</h4>
                  <p>Progress indicator</p>
                </div>
              </div>
            </section>

            {/* UI SCRIPT FORMAT */}
            <section id="ui-script" className="doc-section">
              <div className="section-header">
                <WindowIcon size={32} />
                <h2>UI Script Format (.ui)</h2>
              </div>
              <p>Geneia uses a special .ui file format for defining interfaces.</p>
              
              <h3>Basic Structure</h3>
              <pre className="code-block">{`WINDOW "My Application"
  WIDTH 800
  HEIGHT 600
  BGCOLOR #1e293b

  LABEL "Welcome to Geneia!"
    X 20
    Y 20
    WIDTH 200
    HEIGHT 30
    FGCOLOR #ffffff

  BUTTON "Click Me"
    X 20
    Y 60
    WIDTH 120
    HEIGHT 35
    BGCOLOR #6366f1
    FGCOLOR #ffffff

  TEXTBOX "input1"
    X 20
    Y 110
    WIDTH 200
    HEIGHT 30

END`}</pre>

              <h3>Component Properties</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>X</code></td><td>Horizontal position</td><td><code>X 20</code></td></tr>
                  <tr><td><code>Y</code></td><td>Vertical position</td><td><code>Y 50</code></td></tr>
                  <tr><td><code>WIDTH</code></td><td>Component width</td><td><code>WIDTH 200</code></td></tr>
                  <tr><td><code>HEIGHT</code></td><td>Component height</td><td><code>HEIGHT 30</code></td></tr>
                  <tr><td><code>BGCOLOR</code></td><td>Background color (hex)</td><td><code>BGCOLOR #6366f1</code></td></tr>
                  <tr><td><code>FGCOLOR</code></td><td>Foreground/text color</td><td><code>FGCOLOR #ffffff</code></td></tr>
                  <tr><td><code>FONTSIZE</code></td><td>Font size in points</td><td><code>FONTSIZE 14</code></td></tr>
                </tbody>
              </table>

              <h3>Complete UI Example</h3>
              <pre className="code-block">{`WINDOW "Geneia Calculator"
  WIDTH 300
  HEIGHT 400
  BGCOLOR #0f172a

  LABEL "Calculator"
    X 100
    Y 10
    WIDTH 100
    HEIGHT 30
    FGCOLOR #6366f1
    FONTSIZE 18

  TEXTBOX "display"
    X 20
    Y 50
    WIDTH 260
    HEIGHT 40
    BGCOLOR #1e293b
    FGCOLOR #ffffff

  BUTTON "7"
    X 20
    Y 100
    WIDTH 60
    HEIGHT 50
    BGCOLOR #334155

  BUTTON "8"
    X 90
    Y 100
    WIDTH 60
    HEIGHT 50
    BGCOLOR #334155

  BUTTON "9"
    X 160
    Y 100
    WIDTH 60
    HEIGHT 50
    BGCOLOR #334155

  BUTTON "+"
    X 230
    Y 100
    WIDTH 50
    HEIGHT 50
    BGCOLOR #6366f1

END`}</pre>
            </section>

            {/* EVENTS */}
            <section id="events" className="doc-section">
              <div className="section-header">
                <WindowIcon size={32} />
                <h2>UI Events</h2>
              </div>
              <p>Handle user interactions with event handlers.</p>
              
              <h3>Button Click Events</h3>
              <pre className="code-block">
<span className="keyword">import</span> UI

<span className="comment">! Define click handler !</span>
<span className="keyword">func</span> on_button_click {'{'}
    <span className="keyword">peat</span> <span className="string">'Button was clicked!'</span>
{'}'}

<span className="comment">! Attach to button !</span>
UI.Button <span className="string">'Click Me'</span> {'{'}
    onClick = on_button_click
{'}'}</pre>

              <h3>Available Events</h3>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Component</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code>onClick</code></td><td>Button</td><td>Triggered when button is clicked</td></tr>
                  <tr><td><code>onChange</code></td><td>TextBox, ComboBox</td><td>Triggered when value changes</td></tr>
                  <tr><td><code>onSelect</code></td><td>ListBox, ComboBox</td><td>Triggered when item is selected</td></tr>
                  <tr><td><code>onCheck</code></td><td>CheckBox, RadioButton</td><td>Triggered when checked/unchecked</td></tr>
                  <tr><td><code>onLoad</code></td><td>Window</td><td>Triggered when window loads</td></tr>
                  <tr><td><code>onClose</code></td><td>Window</td><td>Triggered when window closes</td></tr>
                </tbody>
              </table>
            </section>

            {/* ALL KEYWORDS */}
            <section id="keywords" className="doc-section">
              <div className="section-header">
                <BookIcon size={32} />
                <h2>All Keywords Reference</h2>
              </div>
              <p>Complete list of all Geneia keywords.</p>
              
              <table className="docs-table keywords-table">
                <thead>
                  <tr>
                    <th>Keyword</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>var</code></td>
                    <td>Variables</td>
                    <td>Declare string variable</td>
                    <td><code>var {'{'}name{'}'} = 'value'</code></td>
                  </tr>
                  <tr>
                    <td><code>str(U+)</code></td>
                    <td>Variables</td>
                    <td>Unicode string function</td>
                    <td><code>str(U+007F)</code></td>
                  </tr>
                  <tr>
                    <td><code>hold</code></td>
                    <td>Variables</td>
                    <td>Declare number variable</td>
                    <td><code>hold (count) = (10)</code></td>
                  </tr>
                  <tr>
                    <td><code>peat</code></td>
                    <td>Output</td>
                    <td>Print/echo text</td>
                    <td><code>peat 'Hello'</code></td>
                  </tr>
                  <tr>
                    <td><code>msg</code></td>
                    <td>Output</td>
                    <td>Message output</td>
                    <td><code>msg 'Message'</code></td>
                  </tr>
                  <tr>
                    <td><code>repeat</code></td>
                    <td>Loops</td>
                    <td>Quick repeat with time</td>
                    <td><code>repeat 'text' & t.s = (3)</code></td>
                  </tr>
                  <tr>
                    <td><code>turn</code></td>
                    <td>Loops</td>
                    <td>Loop block</td>
                    <td><code>turn (5) {'{'} ... {'}'}</code></td>
                  </tr>
                  <tr>
                    <td><code>func</code></td>
                    <td>Functions</td>
                    <td>Define function</td>
                    <td><code>func name {'{'} ... {'}'}</code></td>
                  </tr>
                  <tr>
                    <td><code>check</code></td>
                    <td>Control</td>
                    <td>Conditional check</td>
                    <td><code>check (val) {'{'} ... {'}'}</code></td>
                  </tr>
                  <tr>
                    <td><code>import</code></td>
                    <td>Modules</td>
                    <td>Import module</td>
                    <td><code>import UI</code></td>
                  </tr>
                  <tr>
                    <td><code>export</code></td>
                    <td>Modules</td>
                    <td>Export symbol</td>
                    <td><code>export varname</code></td>
                  </tr>
                  <tr>
                    <td><code>exit</code></td>
                    <td>Control</td>
                    <td>Exit program</td>
                    <td><code>exit (0)</code></td>
                  </tr>
                </tbody>
              </table>

              <h3>Time Units</h3>
              <div className="keyword-grid">
                <div className="keyword-item"><code>t.ms</code> - Milliseconds</div>
                <div className="keyword-item"><code>t.s</code> - Seconds</div>
                <div className="keyword-item"><code>t.m</code> - Minutes</div>
                <div className="keyword-item"><code>t.h</code> - Hours</div>
                <div className="keyword-item"><code>t.d</code> - Days</div>
              </div>

              <h3>Operators</h3>
              <div className="keyword-grid">
                <div className="keyword-item"><code>&</code> - Inner connection (with time)</div>
                <div className="keyword-item"><code>&&</code> - Outer connection (separate)</div>
                <div className="keyword-item"><code>=</code> - Assignment</div>
              </div>

              <h3>Quote Types</h3>
              <div className="keyword-grid">
                <div className="keyword-item"><code>{'{'}...{'}'}</code> - Variable names</div>
                <div className="keyword-item"><code>'...'</code> - String values</div>
                <div className="keyword-item"><code>"..."</code> - Running tips</div>
                <div className="keyword-item"><code>!...!</code> - Comments</div>
                <div className="keyword-item"><code>(...)</code> - Numbers</div>
              </div>
            </section>

            {/* EXAMPLES */}
            <section id="examples" className="doc-section">
              <div className="section-header">
                <CodeIcon size={32} />
                <h2>Complete Examples</h2>
              </div>
              <p>Full working examples to learn from.</p>
              
              <h3>Example 1: Hello World</h3>
              <pre className="code-block">
<span className="comment">! hello.gn - Basic Hello World !</span>

<span className="tip">"Welcome to Geneia!"</span>

<span className="keyword">peat</span> <span className="string">'Hello, World!'</span>

<span className="keyword">exit</span> <span className="number">(0)</span></pre>

              <h3>Example 2: Variables and Output</h3>
              <pre className="code-block">
<span className="comment">! variables.gn - Working with variables !</span>

<span className="tip">"Demonstrating variables"</span>

<span className="keyword">var</span> <span className="variable">{'{'}language{'}'}</span> = <span className="string">'Geneia'</span>
<span className="keyword">var</span> <span className="variable">{'{'}version{'}'}</span> = <span className="string">'1.0.0'</span>
<span className="keyword">hold</span> <span className="number">(year)</span> = <span className="number">(2024)</span>

<span className="keyword">peat</span> <span className="string">'Language: '</span>
<span className="keyword">peat</span> <span className="variable">{'{'}language{'}'}</span>
<span className="keyword">peat</span> <span className="string">'Version: '</span>
<span className="keyword">peat</span> <span className="variable">{'{'}version{'}'}</span>

<span className="keyword">exit</span> <span className="number">(0)</span></pre>

              <h3>Example 3: Loops</h3>
              <pre className="code-block">
<span className="comment">! loops.gn - Loop examples !</span>

<span className="tip">"Loop demonstration"</span>

<span className="comment">! Quick repeat !</span>
<span className="keyword">repeat</span> <span className="string">'Processing...'</span> & t.s = <span className="number">(3)</span>

<span className="comment">! Turn block !</span>
<span className="keyword">turn</span> <span className="number">(5)</span> {'{'}
    <span className="keyword">peat</span> <span className="string">'Iteration'</span>
{'}'}

<span className="keyword">peat</span> <span className="string">'Done!'</span>
<span className="keyword">exit</span> <span className="number">(0)</span></pre>

              <h3>Example 4: Functions</h3>
              <pre className="code-block">
<span className="comment">! functions.gn - Function example !</span>

<span className="keyword">func</span> greet {'{'}
    <span className="keyword">peat</span> <span className="string">'Hello!'</span>
    <span className="keyword">peat</span> <span className="string">'Welcome to Geneia'</span>
{'}'}

<span className="keyword">func</span> farewell {'{'}
    <span className="keyword">peat</span> <span className="string">'Goodbye!'</span>
{'}'}

greet
<span className="keyword">peat</span> <span className="string">'---'</span>
farewell

<span className="keyword">exit</span> <span className="number">(0)</span></pre>

              <h3>Example 5: Modules</h3>
              <pre className="code-block">
<span className="comment">! modules.gn - Using modules !</span>

<span className="keyword">import</span> UI
<span className="keyword">import</span> Math
<span className="keyword">import</span> File

<span className="tip">"All modules loaded!"</span>

<span className="keyword">peat</span> <span className="string">'Modules imported successfully'</span>

<span className="keyword">exit</span> <span className="number">(0)</span></pre>

              <h3>Example 6: Complete Application</h3>
              <pre className="code-block">
<span className="comment">! app.gn - Complete application !</span>

<span className="keyword">import</span> UI

<span className="tip">"Starting Geneia Application"</span>

<span className="keyword">var</span> <span className="variable">{'{'}app_name{'}'}</span> = <span className="string">'My Geneia App'</span>
<span className="keyword">var</span> <span className="variable">{'{'}author{'}'}</span> = <span className="string">'Developer'</span>
<span className="keyword">hold</span> <span className="number">(version)</span> = <span className="number">(1)</span>

<span className="keyword">func</span> show_info {'{'}
    <span className="keyword">peat</span> <span className="string">'=== Application Info ==='</span>
    <span className="keyword">peat</span> <span className="string">'Name: '</span>
    <span className="keyword">peat</span> <span className="variable">{'{'}app_name{'}'}</span>
    <span className="keyword">peat</span> <span className="string">'Author: '</span>
    <span className="keyword">peat</span> <span className="variable">{'{'}author{'}'}</span>
    <span className="keyword">peat</span> <span className="string">'========================'</span>
{'}'}

<span className="keyword">func</span> main {'{'}
    show_info
    <span className="keyword">peat</span> <span className="string">'Application running...'</span>
    <span className="keyword">repeat</span> <span className="string">'Working'</span> & t.s = <span className="number">(3)</span>
    <span className="keyword">peat</span> <span className="string">'Done!'</span>
{'}'}

main

<span className="keyword">exit</span> <span className="number">(0)</span></pre>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}

export default Docs
