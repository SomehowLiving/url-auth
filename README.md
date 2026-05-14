# 🛡️ Security Toolkit - Unified Dashboard

A comprehensive, all-in-one security suite combining password strength checking, cryptographic hashing, and advanced URL security analysis.

## 🎯 Features

### 🔐 Password Strength Checker

- Real-time password strength analysis (0-100 scoring)
- Advanced algorithm detecting:
  - Character composition (upper, lower, numbers, symbols)
  - Password entropy and complexity
  - Common dictionary words detection
  - Consecutive character patterns
- Built-in password generator with:
  - Customizable length (8-64 characters)
  - Selectable character types (uppercase, numbers, symbols)
  - Automatic shuffling for randomness
- Best practices guide
- Copy-to-clipboard functionality

### #️⃣ Hash Generator

- Multiple cryptographic algorithms:
  - **MD5** (32 hex characters)
  - **SHA-1** (40 hex characters)
  - **SHA-256** (64 hex characters)
- Real-time hash generation as you type
- One-click copy to clipboard
- Client-side processing (no data sent to server)

### 🔗 Link Scanner

Industrial-grade URL security analysis with multiple engines:

#### Multi-Engine Intelligence

- **VirusTotal Integration**: Aggregated results from 70+ antivirus engines
- **Google Safe Browsing**: Real-time threat database protecting billions of users
- **Domain WHOIS Analysis**: Domain age, registrar, creation date
- **IP Geolocation**: Detect suspicious hosting locations
- **Redirect Tracing**: Follow up to 10 redirect hops to find true destination
- **Heuristic Detection**: Recognize suspicious patterns:
  - Raw IP addresses
  - Missing HTTPS
  - Suspicious TLDs (.xyz, .tk, .ml)
  - URL shorteners
  - Lookalike domains
  - Dangerous file extensions

#### Risk Scoring

- Combined score from multiple security sources (0-100)
- Weighted scoring algorithm:
  - Heuristics: 15%
  - Google Safe Browsing: 30%
  - VirusTotal: 30%
  - WHOIS/Domain Age: 25%
- Verdicts: 🟢 SAFE | 🟡 SUSPICIOUS | 🔴 MALICIOUS

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn**
- **API Keys** (optional, for full Link Scanner functionality):
  - [VirusTotal API Key](https://www.virustotal.com/) (free tier available)
  - [Google Safe Browsing API Key](https://console.cloud.google.com/)

### 1. Installation

#### Option A: Using the Setup Script (Windows)

```bash
cd d:\dev\backend
setup.bat
npm install
npm start
```

#### Option B: Manual Setup (All Platforms)

```bash
# Navigate to project directory
cd /path/to/backend

# Create necessary directories
mkdir -p public/{css,js}
mkdir scanner

# Copy scanner modules
cp -r link_scanner/scanner/* scanner/

# Install dependencies
npm install

# Start the server
npm start
```

### 2. Configuration

Create or update `.env` file in the root directory:

```env
# Link Scanner APIs (Optional - toolkit works without these)
GOOGLE_SAFE_BROWSING_KEY=your_google_api_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Launch

```bash
npm start
```

The toolkit will be available at: **http://localhost:3000**

---

## 📁 Project Structure

```
security-toolkit/
├── server.js                    # Main Express server
├── package.json                 # Dependencies & scripts
├── .env                         # Environment configuration
├── setup.bat                    # Windows setup script
├── README.md                    # This file
│
├── scanner/                     # Link scanning backend
│   ├── index.js                # Main scanner orchestrator
│   ├── heuristics.js           # URL pattern analysis
│   ├── safeBrowsing.js         # Google Safe Browsing API
│   ├── virusTotal.js           # VirusTotal API integration
│   ├── redirects.js            # Redirect chain follower
│   ├── location.js             # IP geolocation
│   └── domainAge.js            # WHOIS & domain age analysis
│
└── public/                      # Frontend SPA
    ├── index.html              # Main dashboard
    ├── css/
    │   └── style.css           # Global styles
    └── js/
        ├── app.js              # SPA controller & routing
        ├── utils.js            # Shared utilities
        ├── passwordChecker.js  # Password strength module
        ├── hashGenerator.js    # Hash generation module
        └── linkScanner.js      # Link scanning UI
```

---

## 🛠️ API Reference

### POST /api/scan

Analyze a URL for security threats.

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "url": "https://example.com",
  "finalUrl": "https://example.com/",
  "verdict": "safe",
  "score": 15,
  "redirectCount": 1,
  "flags": ["Not using HTTPS"],
  "individualScores": {
    "heuristics": 15,
    "safeBrowsing": 0,
    "whois": 0,
    "virusTotal": 0
  },
  "details": {
    "domainAgeDays": 8000,
    "domainCreatedOn": "2002-10-10T00:00:00.000Z",
    "registrar": "VeriSign Global Registry Services",
    "vtPositives": 0,
    "vtTotal": 84,
    "googleThreats": [],
    "location": {
      "ip": "93.184.216.34",
      "country": "United States",
      "city": "Los Angeles",
      "isp": "Verizon Communications",
      "success": true
    },
    "redirectChain": ["https://example.com"]
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-05-14T09:33:33.556Z"
}
```

---

## 🔒 Security & Privacy

### Password & Hash Tools

✅ **100% Client-Side Processing**

- All computations happen in your browser
- No data is sent to any server
- Safe to use with sensitive information
- Works offline

### Link Scanner

⚠️ **API-Based Analysis**

- URLs are sent to:
  - **VirusTotal** (if API key configured)
  - **Google Safe Browsing** (if API key configured)
  - **IP-API** (for geolocation, free service)
  - **WHOIS** (for domain information)
- These services may log queries for security research
- See privacy policies:
  - [VirusTotal Privacy](https://www.virustotal.com/en/privacy/)
  - [Google Privacy](https://policies.google.com/)

### Recommendations

- Don't scan URLs containing sensitive information
- Use only with URLs you own or have permission to analyze
- Review third-party API privacy policies
- Store API keys securely (never commit to version control)

---

## 🧪 Testing

### Manual Testing

1. **Password Checker**: Test various password patterns to see strength scoring
2. **Hash Generator**: Compare hashes with online tools
3. **Link Scanner**: Scan known safe sites vs. detected threats

### Test URLs

```
Safe:           https://www.google.com
Suspicious:     https://example.tk/login
Known Malicious: https://www.badmalware.com (or test without APIs)
```

### No Tests Yet

This is a new integrated project. Future releases will include automated test suites.

---

## 🐛 Troubleshooting

### Server Won't Start

```
Error: EADDRINUSE: address already in use :::3000
```

**Solution**: Change PORT in `.env` or kill process on port 3000

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Link Scanner Returns No Results

- **Without API keys**: Scanner will use only heuristics
- **With API keys**: Ensure keys are correct in `.env`
- **API quota exceeded**: Check API service status
- **URL not in database**: VirusTotal may not have analyzed the URL yet

### Hash Generation Not Working

- Ensure **CryptoJS** library is loaded (check browser console)
- This is included via CDN, requires internet connection

### Password Checker Not Responding

- Check browser console for JavaScript errors
- Try refreshing the page
- Clear browser cache

---

## 📊 Scoring Methodology

### Password Strength Scoring

```
Length:           +4 points/char (max 30)
Lowercase:        +12 points
Uppercase:        +12 points
Numbers:          +18 points
Symbols:          +18 points
No repeats:       +5 points
No common words:  +5 points
High entropy:     0 or -10 points

Interpretation:
0-40:   Very Weak   🔴
40-60:  Weak        🟠
60-75:  Fair        🟡
75-90:  Good        🟢
90-100: Strong      🟢💪
```

### URL Risk Scoring

```
Component Scoring (0-100 each):
- Heuristics:     Pattern analysis, TLD check, IP detection (weight: 15%)
- Google S.B.:    90 if flagged, 0 otherwise (weight: 30%)
- VirusTotal:     Based on detection ratio (weight: 30%)
- WHOIS:          Domain age penalties (weight: 25%)

Final Verdict:
0-35:   SAFE 🟢      ✓ Likely legitimate
35-70:  SUSPICIOUS 🟡  ⚠️ Proceed with caution
70-100: MALICIOUS 🔴  ✗ Avoid this URL
```

---

## 🔄 Updates & Maintenance

### Updating Dependencies

```bash
npm update
```

### Clearing Scanner Cache

The scanner caches results for 10 minutes. Cache is in-memory and clears on restart:

```bash
npm start  # Automatically clears cache
```

### API Key Updates

1. Update `.env` file with new keys
2. Restart the server:
   ```bash
   npm start
   ```
3. New keys take effect immediately

---

## 📝 License

ISC License - See repository for details

---

## 🤝 Contributing

This is an integrated security toolkit combining three complementary tools. Contributions welcome!

### Areas for Enhancement

- Unit tests and integration tests
- Additional hash algorithms (Blake2, Argon2)
- More sophisticated heuristic rules
- Browser extension version
- Mobile app
- Dark/Light theme toggle
- Scan history & favorites
- Batch URL scanning

---

## 📞 Support

For issues or questions:

1. Check the **Troubleshooting** section
2. Review API service status pages
3. Check browser console for errors (F12)
4. Verify Node.js version: `node --version` (must be v18+)

---

## 🎉 Thank You

Built with security in mind. Use responsibly.

**Security Toolkit v1.0.0**

- Password Strength Checker
- Hash Generator
- Link Scanner

Happy scanning! 🛡️
