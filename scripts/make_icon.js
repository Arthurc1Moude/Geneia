const fs = require('fs');
const zlib = require('zlib');

const width = 128;
const height = 128;
const pixels = Buffer.alloc(width * height * 4);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const cx = 64, cy = 64;
    
    // Diamond shape (rotated square with rounded tips)
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    const diamondDist = dx + dy;
    const inside = diamondDist <= 58;
    
    // Diamond facets - different colors for each face
    const isTopFacet = y < cy && dy > dx * 0.3;
    const isLeftFacet = x < cx && dx > dy * 0.3;
    const isRightFacet = x >= cx && dx > dy * 0.3;
    const isBottomFacet = y >= cy && dy > dx * 0.3;
    
    // Gem colors - blue diamond with facet shading
    let r, g, b;
    
    if (isTopFacet) {
      // Top - brightest (light hits here)
      const t = (cy - y) / cy;
      r = Math.floor(140 + t * 80);
      g = Math.floor(200 + t * 55);
      b = 255;
    } else if (isLeftFacet) {
      // Left - medium bright
      const t = (cx - x) / cx;
      r = Math.floor(80 + t * 60);
      g = Math.floor(140 + t * 60);
      b = Math.floor(220 + t * 35);
    } else if (isRightFacet) {
      // Right - slightly darker
      const t = (x - cx) / cx;
      r = Math.floor(60 + t * 40);
      g = Math.floor(100 + t * 50);
      b = Math.floor(200 + t * 30);
    } else if (isBottomFacet) {
      // Bottom - darkest
      const t = (y - cy) / cy;
      r = Math.floor(40 + t * 30);
      g = Math.floor(70 + t * 40);
      b = Math.floor(160 + t * 40);
    } else {
      // Center blend
      r = 100;
      g = 160;
      b = 230;
    }
    
    // Inner sparkle/shine lines
    const sparkle1 = Math.abs(dx - dy) < 3 && diamondDist > 20 && diamondDist < 50;
    const sparkle2 = Math.abs(dx * 0.7 - dy) < 2 && diamondDist > 25;
    const sparkle3 = Math.abs(dx - dy * 0.7) < 2 && diamondDist > 25;
    
    // Center highlight
    const centerDist = Math.sqrt(Math.pow(x - cx + 10, 2) + Math.pow(y - cy - 15, 2));
    const centerHighlight = centerDist < 20 ? (20 - centerDist) / 20 : 0;
    
    // G letter
    const gcx = 64, gcy = 68;
    const gdist = Math.sqrt(Math.pow(x-gcx, 2) + Math.pow(y-gcy, 2));
    const gangle = Math.atan2(y-gcy, x-gcx);
    
    const outerR = 28, innerR = 16;
    const ringGap = gangle > -0.25 && gangle < 0.6;
    const isRing = gdist > innerR && gdist < outerR && !ringGap;
    const isBar = x >= gcx && x <= gcx + 18 && y >= gcy - 6 && y <= gcy + 6;
    const isG = isRing || isBar;
    
    if (!inside) {
      pixels[idx] = 0;
      pixels[idx+1] = 0;
      pixels[idx+2] = 0;
      pixels[idx+3] = 0;
    } else if (isG) {
      // White G with diamond shine
      pixels[idx] = 255;
      pixels[idx+1] = 255;
      pixels[idx+2] = 255;
      pixels[idx+3] = 255;
    } else if (sparkle1 || sparkle2 || sparkle3) {
      // Sparkle lines
      pixels[idx] = Math.min(255, r + 80);
      pixels[idx+1] = Math.min(255, g + 60);
      pixels[idx+2] = 255;
      pixels[idx+3] = 255;
    } else {
      // Diamond facets with highlight
      pixels[idx] = Math.min(255, r + centerHighlight * 100);
      pixels[idx+1] = Math.min(255, g + centerHighlight * 80);
      pixels[idx+2] = Math.min(255, b + centerHighlight * 40);
      pixels[idx+3] = 255;
    }
  }
}

// PNG encoding
const filtered = Buffer.alloc(height * (1 + width * 4));
for (let y = 0; y < height; y++) {
  filtered[y * (1 + width * 4)] = 0;
  pixels.copy(filtered, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
}

const compressed = zlib.deflateSync(filtered, { level: 9 });

function crc32(buf) {
  let crc = 0xffffffff;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crc]);
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;

const png = Buffer.concat([
  signature,
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0))
]);

fs.writeFileSync('packages/vscode-geneia/images/geneia-icon.png', png);
console.log('Diamond icon created:', png.length, 'bytes');
