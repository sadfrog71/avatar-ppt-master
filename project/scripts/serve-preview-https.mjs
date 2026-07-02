#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync, realpathSync, createReadStream } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import tls from 'node:tls';
import { getChromeExecutablePath } from './chrome-path.mjs';
import { getOpenSslExecutablePath } from './openssl-path.mjs';
import { ensureThemePreviewFresh } from './preview-freshness.mjs';
import { safePathname } from './preview-path.mjs';
import { isExportRequestAllowed, isLoopbackHost } from './preview-export-auth.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SERVE_ROOT = path.resolve(ROOT, process.argv[2] || 'output/theme-preview/ppt');
const PORT = Number(process.env.PORT || process.argv[3] || 4178);
const HOST = process.env.HOST || '0.0.0.0';
const LOCAL_HOSTNAME = getLocalHostname();
const LAN_IPS = getLanIps();
const CERT_DIR = path.join(ROOT, 'output/https-preview');
const CERT_META = path.join(CERT_DIR, 'cert-meta.json');
const CERT_KEY = path.join(CERT_DIR, 'localhost-key.pem');
const CERT_FILE = path.join(CERT_DIR, 'localhost-cert.pem');
const EXPORT_DIR = path.join(ROOT, 'output/exports');
const EXPORT_PROGRESS = new Map();
const INTERNAL_PREVIEW_FILES = new Set(['.preview-server.json', '.preview-server.log']);
const LEXICAL_SERVE_ROOT = path.resolve(SERVE_ROOT);
const LEXICAL_EXPORT_DIR = path.resolve(EXPORT_DIR);

ensureThemePreviewFresh({ serveRoot: SERVE_ROOT });

if (!existsSync(path.join(SERVE_ROOT, 'index.html'))) {
  console.error(`Preview index.html not found: ${displayPath(path.join(SERVE_ROOT, 'index.html'))}`);
  process.exit(1);
}
const REAL_SERVE_ROOT = realpathSync(SERVE_ROOT);
mkdirSync(EXPORT_DIR, { recursive: true });
const REAL_EXPORT_DIR = realpathSync(EXPORT_DIR);

ensureCertificate();

const serveRequest = async (req, res) => {
  const requestUrl = new URL(req.url || '/', 'https://local.invalid');
  if (req.method === 'POST' && requestUrl.pathname === '/api/export-editable-pptx') {
    await handleEditablePptxExport(req, res);
    return;
  }
  if (req.method === 'GET' && requestUrl.pathname === '/api/export-editable-pptx-progress') {
    handleEditablePptxProgress(req, res, requestUrl);
    return;
  }
  if ((req.method === 'GET' || req.method === 'HEAD') && requestUrl.pathname === '/api/export-editable-pptx-download') {
    handleEditablePptxDownload(req, res, requestUrl);
    return;
  }
  if (req.method === 'POST' && requestUrl.pathname === '/api/export-pdf') {
    await handlePdfExport(req, res);
    return;
  }
  if (req.method === 'GET' && requestUrl.pathname === '/api/export-pdf-progress') {
    handlePdfProgress(req, res, requestUrl);
    return;
  }
  if ((req.method === 'GET' || req.method === 'HEAD') && requestUrl.pathname === '/api/export-pdf-download') {
    handlePdfDownload(req, res, requestUrl);
    return;
  }

  const pathname = safePathname(req.url || '/');
  if (pathname === null) {
    res.writeHead(400, { 'content-type': 'text/plain;charset=utf-8' });
    res.end('Bad request');
    return;
  }
  if (pathname === '.image-slots.state.json') {
    const requested = path.join(SERVE_ROOT, '.image-slots.state.json');
    const file = resolveFile(requested);
    if (file) {
      res.writeHead(200, {
        'content-type': contentType(file),
        'cache-control': 'no-store',
      });
      createReadStream(file).pipe(res);
      return;
    }
    if (existsSync(requested)) {
      res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end('{}');
    return;
  }
  if (hasBlockedDotSegment(pathname)) {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  const requested = path.join(SERVE_ROOT, pathname === '/' ? 'index.html' : pathname);
  const file = resolveFile(requested);

  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8' });
    res.end('Not found');
    return;
  }

  res.writeHead(200, {
    'content-type': contentType(file),
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
};

// 顶层兜底:任何处理异常都不得让进程崩溃(请求监听器是 async,未捕获即 unhandledRejection)。
const requestHandler = async (req, res) => {
  try {
    await serveRequest(req, res);
  } catch (error) {
    console.error('[preview] request failed:', error?.message || error);
    if (res.headersSent) {
      res.destroy();
      return;
    }
    res.writeHead(400, { 'content-type': 'text/plain;charset=utf-8' });
    res.end('Bad request');
  }
};

const httpServer = http.createServer(requestHandler);
const secureContext = tls.createSecureContext({
  key: readFileSync(CERT_KEY),
  cert: readFileSync(CERT_FILE),
});
const server = createHttpHttpsMuxServer(httpServer, secureContext);

server.listen(PORT, HOST, () => {
  const httpPrimary = `http://${LOCAL_HOSTNAME}.local:${PORT}/`;
  const httpsPrimary = `https://${LOCAL_HOSTNAME}.local:${PORT}/`;
  const urls = [httpPrimary, httpsPrimary, ...LAN_IPS.flatMap((ip) => [`http://${ip}:${PORT}/`, `https://${ip}:${PORT}/`])];
  console.log(`HTTP/HTTPS preview serving ${displayPath(SERVE_ROOT)}`);
  console.log(`Open: ${urls.join(' or ')}`);
  if (!isLoopbackHost(HOST)) {
    console.warn(`[preview] 警告:绑定在 ${HOST}(非回环),预览/导出对局域网可达。导出端点要求请求带允许的 Origin。`);
  }
});

function createHttpHttpsMuxServer(plainServer, context) {
  return net.createServer(socket => {
    socket.once('data', chunk => {
      socket.pause();
      socket.unshift(chunk);
      if (isTlsClientHello(chunk)) {
        const tlsSocket = new tls.TLSSocket(socket, { isServer: true, secureContext: context });
        tlsSocket.on('error', () => {});
        tlsSocket.once('secure', () => {
          plainServer.emit('connection', tlsSocket);
        });
        tlsSocket.resume();
        return;
      }
      plainServer.emit('connection', socket);
      socket.resume();
    });
  });
}

function isTlsClientHello(chunk) {
  return chunk?.[0] === 0x16;
}

function ensureCertificate() {
  mkdirSync(CERT_DIR, { recursive: true });
  const names = ['localhost', `${LOCAL_HOSTNAME}.local`, ...LAN_IPS];
  const meta = renderCertificateMeta(names);
  const current = existsSync(CERT_META) ? readFileSync(CERT_META, 'utf8') : '';
  if (existsSync(CERT_KEY) && existsSync(CERT_FILE) && certificateMetaMatches(current, meta)) return;

  const config = path.join(CERT_DIR, 'openssl.cnf');
  writeFileSync(config, renderOpenSslConfig(names));
  execFileSync(getOpenSslExecutablePath(), [
    'req',
    '-x509',
    '-newkey',
    'rsa:2048',
    '-nodes',
    '-sha256',
    '-days',
    '365',
    '-keyout',
    CERT_KEY,
    '-out',
    CERT_FILE,
    '-config',
    config,
    '-extensions',
    'v3_req',
  ], { stdio: 'ignore' });
  writeFileSync(CERT_META, meta + '\n');
}

function renderCertificateMeta(names) {
  return JSON.stringify({ names }, null, 2);
}

function certificateMetaMatches(current, expected) {
  return current.trim() === expected;
}

function renderOpenSslConfig(names) {
  const altNames = [];
  let dns = 1;
  let ip = 1;
  for (const name of names) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(name)) altNames.push(`IP.${ip++} = ${name}`);
    else altNames.push(`DNS.${dns++} = ${name}`);
  }
  return `[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
CN = ${LOCAL_HOSTNAME}.local

[v3_req]
subjectAltName = @alt_names
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth

[alt_names]
${altNames.join('\n')}
`;
}

function resolveFile(file) {
  const resolved = path.resolve(file);
  if (!isPathInside(LEXICAL_SERVE_ROOT, resolved) && !isPathInside(REAL_SERVE_ROOT, resolved)) return null;
  try {
    const real = realpathSync(resolved);
    if (!isPathInside(REAL_SERVE_ROOT, real)) return null;
    const stat = statSync(real);
    if (stat.isDirectory()) return resolveFile(path.join(real, 'index.html'));
    if (stat.isFile()) return real;
  } catch {}
  return null;
}

function hasBlockedDotSegment(pathname) {
  return String(pathname || '')
    .split(/[\\/]+/)
    .filter(Boolean)
    .some(segment => segment.startsWith('.') || INTERNAL_PREVIEW_FILES.has(segment.toLowerCase()));
}

function isPathInside(root, file) {
  const relative = path.relative(root, file);
  return !relative || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function contentType(file) {
  const ext = path.extname(file).toLowerCase();
  return {
    '.html': 'text/html;charset=utf-8',
    '.js': 'text/javascript;charset=utf-8',
    '.mjs': 'text/javascript;charset=utf-8',
    '.css': 'text/css;charset=utf-8',
    '.json': 'application/json;charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }[ext] || 'application/octet-stream';
}

async function handleEditablePptxExport(req, res) {
  let progressId = null;
  try {
    if (!isAllowedExportRequest(req)) {
      res.writeHead(403, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ error: 'Forbidden export origin' }));
      return;
    }
    const payload = await readJsonBody(req);
    progressId = safeProgressId(payload.progressId);
    updateExportProgress(progressId, { stage: 'queued', detail: '服务端接收导出请求', percent: 4 });
    const [{ chromium }, { exportEditablePptxFromUrl }] = await Promise.all([
      import('playwright-core'),
      import('../packages/html-deck-to-pptx/src/editable.mjs'),
    ]);
    updateExportProgress(progressId, { stage: 'launching', detail: '启动导出浏览器', percent: 6 });
    const browser = await chromium.launch({ headless: true, executablePath: getChromePath() });
    const baseName = `${timestampForFile()}-${safeDownloadName(payload.fileName || 'presentation')}`;
    const outFile = path.join(EXPORT_DIR, `${baseName}.pptx`);
    const reportFile = path.join(EXPORT_DIR, `${baseName}.json`);
    try {
      const url = buildInternalPreviewUrl(req, payload.sourcePath);
      await exportEditablePptxFromUrl(browser, url, {
        outFile,
        reportFile,
        title: payload.title || 'Editable Deck Export',
        snapshot: payload.snapshot || null,
        onProgress: update => updateExportProgress(progressId, update),
      });
    } finally {
      await closeBrowser(browser);
    }
    updateExportProgress(progressId, { stage: 'download-ready', detail: '准备浏览器下载', percent: 100, done: true });

    res.writeHead(200, {
      'content-type': 'application/json;charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(JSON.stringify({
      ok: true,
      relativePath: path.relative(ROOT, outFile),
      reportRelativePath: path.relative(ROOT, reportFile),
      downloadUrl: `/api/export-editable-pptx-download?file=${encodeURIComponent(path.basename(outFile))}`,
      downloadName: path.basename(outFile),
    }));
  } catch (error) {
    const message = publicErrorMessage(error, 'Editable PPTX export failed');
    updateExportProgress(progressId, { stage: 'failed', detail: message, percent: 100, done: true, error: true });
    console.error('[editable pptx export]', error);
    res.writeHead(500, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: message }));
  }
}

async function handlePdfExport(req, res) {
  let progressId = null;
  try {
    if (!isAllowedExportRequest(req)) {
      res.writeHead(403, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ error: 'Forbidden export origin' }));
      return;
    }
    const payload = await readJsonBody(req);
    progressId = safeProgressId(payload.progressId);
    updateExportProgress(progressId, { stage: 'queued', detail: '服务端接收 PDF 导出请求', percent: 4 });
    const [{ chromium }, { exportScreenshotPdfFromUrl }] = await Promise.all([
      import('playwright-core'),
      import('../packages/html-deck-to-pptx/src/screenshot.mjs'),
    ]);
    updateExportProgress(progressId, { stage: 'launching', detail: '启动截图浏览器', percent: 6 });
    const browser = await chromium.launch({ headless: true, executablePath: getChromePath() });
    const baseName = `${timestampForFile()}-${safeDownloadName(payload.fileName || 'presentation')}`;
    const outFile = path.join(EXPORT_DIR, `${baseName}.pdf`);
    const reportFile = path.join(EXPORT_DIR, `${baseName}.pdf.json`);
    let result;
    try {
      const url = buildInternalPreviewUrl(req, payload.sourcePath);
      result = await exportScreenshotPdfFromUrl(browser, url, {
        outFile,
        reportFile,
        title: payload.title || 'Deck PDF Export',
        snapshot: payload.snapshot || null,
        batchSize: payload.batchSize,
        onProgress: update => updateExportProgress(progressId, update),
      });
    } finally {
      await closeBrowser(browser);
    }
    updateExportProgress(progressId, { stage: 'download-ready', detail: '准备浏览器下载', percent: 100, done: true });

    res.writeHead(200, {
      'content-type': 'application/json;charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(JSON.stringify({
      ok: true,
      screenshot: true,
      relativePath: path.relative(ROOT, outFile),
      reportRelativePath: path.relative(ROOT, reportFile),
      downloadUrl: `/api/export-pdf-download?file=${encodeURIComponent(path.basename(outFile))}`,
      downloadName: path.basename(outFile),
      pages: result.pages,
      generationMode: result.generationMode,
      batchSize: result.batchSize,
      slideReports: result.slideReports,
    }));
  } catch (error) {
    const message = publicErrorMessage(error, 'PDF export failed');
    updateExportProgress(progressId, { stage: 'failed', detail: message, percent: 100, done: true, error: true });
    console.error('[pdf export]', error);
    res.writeHead(500, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: message }));
  }
}

function handlePdfProgress(req, res, requestUrl) {
  if (!isAllowedExportRequest(req)) {
    res.writeHead(403, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: 'Forbidden export origin' }));
    return;
  }
  const id = safeProgressId(requestUrl.searchParams.get('id'));
  const state = id ? EXPORT_PROGRESS.get(id) : null;
  res.writeHead(200, {
    'content-type': 'application/json;charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(state || { stage: 'pending', detail: '等待服务端进度', percent: 0, done: false }));
}

function handlePdfDownload(req, res, requestUrl) {
  if (!isAllowedExportRequest(req)) {
    res.writeHead(403, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: 'Forbidden export origin' }));
    return;
  }
  const name = path.basename(requestUrl.searchParams.get('file') || '');
  if (!name || !/\.pdf$/i.test(name)) {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  const file = resolveExportFile(name, '.pdf');
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  let stat;
  try {
    stat = statSync(file);
    if (!stat.isFile()) throw new Error('not-file');
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, {
    'content-type': 'application/pdf',
    'content-length': stat.size,
    'content-disposition': `attachment; filename="${asciiDownloadName(name)}"; filename*=UTF-8''${encodeRFC5987(name)}`,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(file).pipe(res);
}

function handleEditablePptxProgress(req, res, requestUrl) {
  if (!isAllowedExportRequest(req)) {
    res.writeHead(403, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: 'Forbidden export origin' }));
    return;
  }
  const id = safeProgressId(requestUrl.searchParams.get('id'));
  const state = id ? EXPORT_PROGRESS.get(id) : null;
  res.writeHead(200, {
    'content-type': 'application/json;charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(JSON.stringify(state || { stage: 'pending', detail: '等待服务端进度', percent: 0, done: false }));
}

function handleEditablePptxDownload(req, res, requestUrl) {
  if (!isAllowedExportRequest(req)) {
    res.writeHead(403, { 'content-type': 'application/json;charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ error: 'Forbidden export origin' }));
    return;
  }
  const name = path.basename(requestUrl.searchParams.get('file') || '');
  if (!name || !/\.pptx$/i.test(name)) {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  const file = resolveExportFile(name, '.pptx');
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  let stat;
  try {
    stat = statSync(file);
    if (!stat.isFile()) throw new Error('not-file');
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain;charset=utf-8', 'cache-control': 'no-store' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, {
    'content-type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'content-length': stat.size,
    'content-disposition': `attachment; filename="${asciiDownloadName(name)}"; filename*=UTF-8''${encodeRFC5987(name)}`,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  createReadStream(file).pipe(res);
}

function asciiDownloadName(value) {
  return String(value || 'presentation.pptx').replace(/[^\x20-\x7e]+/g, '_').replace(/["\\]/g, '_') || 'presentation.pptx';
}

function encodeRFC5987(value) {
  return encodeURIComponent(value).replace(/['()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function resolveExportFile(name, ext) {
  if (!name || path.basename(name) !== name || path.extname(name).toLowerCase() !== ext) return null;
  const resolved = path.resolve(EXPORT_DIR, name);
  if (!isPathInside(LEXICAL_EXPORT_DIR, resolved) && !isPathInside(REAL_EXPORT_DIR, resolved)) return null;
  try {
    const real = realpathSync(resolved);
    return isPathInside(REAL_EXPORT_DIR, real) ? real : null;
  } catch {
    return null;
  }
}

function isAllowedExportRequest(req) {
  const allowedHosts = ['localhost', '127.0.0.1', '[::1]', `${LOCAL_HOSTNAME}.local`, ...LAN_IPS];
  const allowed = new Set(allowedHosts.flatMap(host => [
    `http://${host}:${PORT}`,
    `https://${host}:${PORT}`,
  ]));
  return isExportRequestAllowed({ origin: req.headers.origin, host: HOST, allowedOrigins: allowed });
}

function buildInternalPreviewUrl(req, sourcePath, config = {}) {
  const origin = resolveInternalPreviewOrigin(req, config);
  return new URL(normalizeInternalPreviewPath(sourcePath), origin).href;
}

function normalizeInternalPreviewPath(sourcePath) {
  if (typeof sourcePath !== 'string') return '/';
  try {
    const base = 'https://preview.local';
    const url = new URL(sourcePath, base);
    if (url.origin !== base) return '/';
    return `${url.pathname}${url.search}` || '/';
  } catch {
    return '/';
  }
}

function resolveInternalPreviewOrigin(req, config = {}) {
  const port = Number(config.port || PORT);
  const boundHost = config.boundHost || HOST;
  const localHostname = config.localHostname || LOCAL_HOSTNAME;
  const lanIps = config.lanIps || LAN_IPS;
  const origin = originFromHeader(req?.headers?.origin);
  if (origin && isAllowedInternalPreviewHost(origin.host, { port, boundHost, localHostname, lanIps })) return origin.origin;

  const host = String(req?.headers?.host || '').trim();
  if (host && isAllowedInternalPreviewHost(host, { port, boundHost, localHostname, lanIps })) {
    const protocol = req?.socket?.encrypted ? 'https:' : (origin?.protocol || 'https:');
    return `${protocol}//${host}`;
  }
  throw new Error('Export request host is not reachable by the preview server.');
}

function allowedInternalPreviewHosts(config = {}) {
  const port = Number(config.port || PORT);
  const boundHost = config.boundHost || HOST;
  const localHostname = config.localHostname || LOCAL_HOSTNAME;
  const lanIps = config.lanIps || LAN_IPS;
  return new Set(['localhost', '127.0.0.1', '::1', `${localHostname}.local`, boundHost, ...lanIps]
    .filter(Boolean)
    .flatMap(host => {
      const normalized = hostWithoutPort(host);
      if (!normalized || normalized === '0.0.0.0' || normalized === '::') return [];
      return [`${normalized}:${port}`];
    }));
}

function originFromHeader(value) {
  if (!value) return null;
  try {
    const origin = new URL(value);
    return origin.protocol === 'http:' || origin.protocol === 'https:' ? origin : null;
  } catch {
    return null;
  }
}

function hostWithoutPort(value) {
  const host = String(value || '').trim().toLowerCase();
  if (!host) return '';
  if (host.startsWith('[')) return host.slice(1, host.indexOf(']'));
  const parts = host.split(':');
  return parts.length > 2 ? host : parts[0];
}

function hostWithPort(value, port) {
  const host = String(value || '').trim().toLowerCase();
  const normalized = hostWithoutPort(host);
  if (!normalized) return '';
  if (host.startsWith('[')) {
    const suffix = host.slice(host.indexOf(']') + 1);
    return `${normalized}:${suffix.startsWith(':') ? suffix.slice(1) : port}`;
  }
  const parts = host.split(':');
  return parts.length === 2 ? `${normalized}:${parts[1]}` : `${normalized}:${port}`;
}

function isAllowedInternalPreviewHost(host, config = {}) {
  const port = Number(config.port || PORT);
  const withPort = hostWithPort(host, port);
  return Boolean(withPort) && allowedInternalPreviewHosts(config).has(withPort);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > 80 * 1024 * 1024) {
        reject(new Error('Request body is too large.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function safeDownloadName(value) {
  return String(value || 'presentation')
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-')
    .trim()
    .slice(0, 80) || 'presentation';
}

function safeProgressId(value) {
  const id = String(value || '').trim();
  return /^[a-zA-Z0-9._-]{1,120}$/.test(id) ? id : null;
}

function updateExportProgress(id, update = {}) {
  if (!id) return;
  const previous = EXPORT_PROGRESS.get(id) || {};
  const next = {
    stage: update.stage || previous.stage || 'working',
    detail: scrubLocalPaths(update.detail || previous.detail || '正在生成可编辑 PPTX'),
    percent: Math.max(0, Math.min(100, Math.round(Number(update.percent ?? previous.percent ?? 0)))),
    done: Boolean(update.done || false),
    error: Boolean(update.error || false),
    updatedAt: new Date().toISOString(),
  };
  EXPORT_PROGRESS.set(id, next);
  if (next.done) {
    setTimeout(() => EXPORT_PROGRESS.delete(id), 15 * 60 * 1000).unref?.();
  }
}

function publicErrorMessage(error, fallback) {
  return scrubLocalPaths(error?.message || fallback);
}

function scrubLocalPaths(value) {
  return String(value || '')
    .replace(/file:\/\/\/?[^\s"'`<>),;]*/gi, '<local-path>')
    .replace(new RegExp(escapeRegExp(ROOT), 'g'), '<repo>')
    .replace(/\/Users\/[^/\\"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/\/Volumes\/[^/\\"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/\/home\/[^/\\"'`<>),;\r\n]+(?:\/[^/\\"'`<>),;\r\n]+)*/g, '<local-path>')
    .replace(/(?<![A-Za-z])[A-Za-z]:[\\/][^\s"'`<>),;]+(?:[\\/][^\s"'`<>),;]+)*/g, '<local-path>');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displayPath(file) {
  const relative = path.relative(process.cwd(), file);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) ? relative : path.basename(file);
}

function timestampForFile() {
  return new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, '');
}

function getChromePath() {
  return getChromeExecutablePath();
}

async function closeBrowser(browser) {
  if (!browser) return;
  const close = browser.close().catch(() => {});
  const result = await Promise.race([
    close.then(() => 'closed'),
    new Promise(resolve => setTimeout(() => resolve('timeout'), 5000)),
  ]);
  if (result === 'timeout') {
    try { browser.process?.()?.kill?.('SIGKILL'); } catch {}
  }
}

function getLocalHostname() {
  if (process.env.DASHI_PPT_PREVIEW_NAME) return process.env.DASHI_PPT_PREVIEW_NAME;
  try {
    return execFileSync('scutil', ['--get', 'LocalHostName'], { encoding: 'utf8' }).trim() || os.hostname().split('.')[0];
  } catch {
    return os.hostname().split('.')[0] || 'localhost';
  }
}

function getLanIps() {
  const ips = [];
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries || []) {
      if (entry.family === 'IPv4' && !entry.internal) ips.push(entry.address);
    }
  }
  return [...new Set(ips)];
}
