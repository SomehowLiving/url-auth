import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { scanUrl } from './link_scanner/scanner/index.js';
import 'dotenv/config';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dashboardDir = path.join(__dirname, 'public');
const hashGeneratorDir = path.join(__dirname, 'hash-generator');
const linkScannerPublicDir = path.join(__dirname, 'link_scanner', 'public');
const passwordCheckerDir = path.join(__dirname, 'Password_Strength_Checker');

app.use(express.json());
app.use(express.static(dashboardDir));
app.use('/tools/hash-generator', express.static(hashGeneratorDir));
app.use('/tools/link-scanner', express.static(linkScannerPublicDir));
app.use('/tools/password-strength-checker', express.static(passwordCheckerDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(dashboardDir, 'index.html'));
});

app.get('/tools/hash-generator', (_req, res) => {
  res.sendFile(path.join(hashGeneratorDir, 'index.html'));
});

app.get('/tools/link-scanner', (_req, res) => {
  res.sendFile(path.join(linkScannerPublicDir, 'index.html'));
});

app.get('/tools/password-strength-checker', (_req, res) => {
  res.sendFile(path.join(passwordCheckerDir, 'index.html'));
});

app.post('/api/scan', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const result = await scanUrl(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Scan failed', message: err.message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
