# Setup Guide

## Overview
This project is an integrated security toolkit with a terminal-style dashboard and three tools:

- Hash Generator
- Link Scanner (URL + reputation scanner)
- Password Strength Checker

## Prerequisites
- Node.js 18+
- npm

## Install
```bash
npm install
```

## Configure environment (optional but recommended)
Create/update `.env`:

```env
PORT=3000
VIRUSTOTAL_API_KEY=your_key_here
GOOGLE_SAFE_BROWSING_KEY=your_key_here
```

Notes:
- Without keys, Link Scanner still works with heuristics/redirect/WHOIS/location checks.
- With keys, it also uses Google Safe Browsing and VirusTotal.

## Run
```bash
npm start
```

Expected startup log includes:
- `Dashboard: /`
- `Hash Generator: /tools/hash-generator`
- `Link Scanner: /tools/link-scanner`
- `Password Strength Checker: /tools/password-strength-checker`

## Routes
- `http://localhost:3000/`
- `http://localhost:3000/tools/hash-generator`
- `http://localhost:3000/tools/link-scanner`
- `http://localhost:3000/tools/password-strength-checker`
- `http://localhost:3000/api/health`

## Link Scanner details
- Input normalization:
  - `google.com` -> `https://google.com/`
  - Supports both `http://` and `https://`
- Invalid/malformed URL input is handled gracefully.
- Scanner returns structured results even when external APIs are unavailable.

## Common issues

### Cannot GET `/tools/...`
- Ensure you started the root server from `backend/` with `npm start`.
- Stop old node processes, then restart.

### `npm` command not found in PowerShell
- Use WSL/bash shell to run the project, or install Node/npm for Windows PATH.

### Port conflict on 3000
- Set `PORT=3001` (or another free port) in `.env` and restart.
