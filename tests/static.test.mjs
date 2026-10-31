import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const html = fs.readFileSync(path.resolve('mobile.html'), 'utf8');
const scripts = [...html.matchAll(/<script\s+type="module">([\s\S]*?)<\/script>/g)];

test('contains exactly one module script', () => {
  assert.equal(scripts.length, 1);
});

test('module is syntactically valid JavaScript', () => {
  const result = spawnSync(process.execPath, ['--check', '--input-type=module'], {
    input: scripts[0][1], encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr);
});

test('uses installed noVNC and the current origin', () => {
  assert.match(scripts[0][1], /import\s+RFB\s+from\s+['"]\.\/core\/rfb\.js['"]/);
  assert.match(scripts[0][1], /location\.host\s*\+\s*['"]\/websockify['"]/);
  assert.match(scripts[0][1], /new RFB\(screen,uri,\{shared:true\}\)/);
});

test('scale-to-fit stays on, remote resolution stays intact', () => {
  assert.match(html, /rfb\.scaleViewport=true/);
  assert.match(html, /rfb\.resizeSession=false/);
});

test('has relative touchpad, pinch-to-zoom, mouse click and scrolling', () => {
  for (const pattern of [
    /function move\(dx,dy\)/,
    /function setZoom\(value\)/,
    /function updateCursor\(send=false\)/,
    /pos\.x\+=dx\*1\.4\/zoom/,
    /pinch\.initialZoom\*distance\/pinch\.distance/,
    /zoom>1\.001 && trackpad/,
    /function mouseButton\(mask,down\)/,
    /_handleMouseButton\(pos\.x,pos\.y,down,mask\)/,
    /_handleMouseMove\(pos\.x,pos\.y\)/,
    /pinch\.mode==='scroll'/,
  ]) assert.match(html, pattern);
});

test('explicit left and right buttons are present', () => {
  assert.match(html, /id="left"/);
  assert.match(html, /id="right"/);
  assert.match(html, /addEventListener\('click',\(\)=>click\(1\)\)/);
  assert.match(html, /addEventListener\('click',\(\)=>click\(4\)\)/);
});

test('contains no private deployment hostnames or specific server identities', () => {
  for (const term of [
    'bezrabotnyi', 'roomhacker', 'server-100', 'megamen32',
    '95.165.165.65', '192.168.', 'chatgpt-chrome-profile'
  ]) assert.ok(!html.toLowerCase().includes(term), 'Unexpected identity: ' + term);
});
