import fs from 'node:fs';
import zlib from 'node:zlib';

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function writeRGBA_PNG(width, height, rgbaBuffer) {
  const scanlineLen = 1 + width * 4;
  const rawData = Buffer.alloc(height * scanlineLen);
  for (let y = 0; y < height; y++) {
    rawData[y * scanlineLen] = 0;
    rgbaBuffer.copy(rawData, y * scanlineLen + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(rawData);

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

export function decodePNG(buf) {
  let pos = 8;
  let width, height, bitDepth, colorType;
  const idatChunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString('ascii');
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
      bitDepth = buf[pos + 16];
      colorType = buf[pos + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  let bpp = 4;
  if (colorType === 2) bpp = 3;
  else if (colorType === 6) bpp = 4;

  const stride = 1 + width * bpp;
  const uncompressed = Buffer.alloc(height * width * bpp);
  const prevRow = Buffer.alloc(width * bpp);
  const curRow = Buffer.alloc(width * bpp);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * stride];
    const rowRaw = raw.slice(y * stride + 1, (y + 1) * stride);

    for (let x = 0; x < width * bpp; x++) {
      const xByte = rowRaw[x];
      const a = x >= bpp ? curRow[x - bpp] : 0;
      const b = prevRow[x];
      const c = x >= bpp ? prevRow[x - bpp] : 0;

      let val = 0;
      if (filter === 0) val = xByte;
      else if (filter === 1) val = (xByte + a) & 0xff;
      else if (filter === 2) val = (xByte + b) & 0xff;
      else if (filter === 3) val = (xByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) val = (xByte + paeth(a, b, c)) & 0xff;

      curRow[x] = val;
    }

    curRow.copy(uncompressed, y * width * bpp);
    curRow.copy(prevRow);
  }

  const rgba = Buffer.alloc(width * height * 4);
  if (colorType === 6) {
    uncompressed.copy(rgba);
  } else if (colorType === 2) {
    for (let i = 0; i < width * height; i++) {
      rgba[i * 4] = uncompressed[i * 3];
      rgba[i * 4 + 1] = uncompressed[i * 3 + 1];
      rgba[i * 4 + 2] = uncompressed[i * 3 + 2];
      rgba[i * 4 + 3] = 255;
    }
  }

  return { width, height, rgba };
}

// 1. Process cciaas.png (trim padding)
{
  const { width, height, rgba } = decodePNG(fs.readFileSync('public/clients-color/cciaas.png'));
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = rgba[(y * width + x) * 4 + 3];
      if (a > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 12;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const newW = maxX - minX + 1;
  const newH = maxY - minY + 1;
  const cropped = Buffer.alloc(newW * newH * 4);
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const srcIdx = ((minY + y) * width + (minX + x)) * 4;
      const dstIdx = (y * newW + x) * 4;
      rgba.copy(cropped, dstIdx, srcIdx, srcIdx + 4);
    }
  }
  fs.writeFileSync('public/clients-color/cciaas.png', writeRGBA_PNG(newW, newH, cropped));
  console.log('cciaas.png cropped from', width, 'x', height, 'to', newW, 'x', newH);
}

// 2. Process undp.png (trim padding)
{
  const { width, height, rgba } = decodePNG(fs.readFileSync('public/clients-color/undp.png'));
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = rgba[(y * width + x) * 4 + 3];
      if (a > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 8;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const newW = maxX - minX + 1;
  const newH = maxY - minY + 1;
  const cropped = Buffer.alloc(newW * newH * 4);
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const srcIdx = ((minY + y) * width + (minX + x)) * 4;
      const dstIdx = (y * newW + x) * 4;
      rgba.copy(cropped, dstIdx, srcIdx, srcIdx + 4);
    }
  }
  fs.writeFileSync('public/clients-color/undp.png', writeRGBA_PNG(newW, newH, cropped));
  console.log('undp.png cropped from', width, 'x', height, 'to', newW, 'x', newH);
}

// 3. Process bestfly.png (make white transparent, smooth antialiasing, and trim)
{
  const { width, height, rgba } = decodePNG(fs.readFileSync('public/clients-color/bestfly.png'));
  // Make near-white transparent
  for (let i = 0; i < width * height; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    // If pixel is white or nearly white (e.g. background)
    if (r > 240 && g > 240 && b > 240) {
      rgba[i * 4 + 3] = 0;
    } else if (r > 210 && g > 210 && b > 210) {
      // Soft antialiased edge
      const whiteness = Math.min(r, g, b);
      const alpha = Math.max(0, Math.min(255, Math.round((255 - whiteness) * (255 / (255 - 210)))));
      rgba[i * 4 + 3] = alpha;
    }
  }
  // Trim bounding box
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = rgba[(y * width + x) * 4 + 3];
      if (a > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const newW = maxX - minX + 1;
  const newH = maxY - minY + 1;
  const cropped = Buffer.alloc(newW * newH * 4);
  for (let y = 0; y < newH; y++) {
    for (let x = 0; x < newW; x++) {
      const srcIdx = ((minY + y) * width + (minX + x)) * 4;
      const dstIdx = (y * newW + x) * 4;
      rgba.copy(cropped, dstIdx, srcIdx, srcIdx + 4);
    }
  }
  fs.writeFileSync('public/clients-color/bestfly.png', writeRGBA_PNG(newW, newH, cropped));
  console.log('bestfly.png processed and cropped to', newW, 'x', newH);
}
