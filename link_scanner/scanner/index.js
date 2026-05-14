import { checkHeuristics } from './heuristics.js';
import { checkSafeBrowsing } from './safeBrowsing.js';
import { checkDomainAge } from './domainAge.js';
import { checkVirusTotal } from './virusTotal.js';
import { checkRedirects } from './redirects.js';
import { checkLocation } from './location.js';

const scanCache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function normalizeInputUrl(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return { ok: false, error: 'URL is required' };

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, error: 'Only HTTP/HTTPS URLs are supported' };
    }
    if (!parsed.hostname) return { ok: false, error: 'Invalid URL' };
    return { ok: true, url: parsed.href };
  } catch {
    return { ok: false, error: 'Invalid URL format' };
  }
}

export async function scanUrl(url) {
  const normalized = normalizeInputUrl(url);
  if (!normalized.ok) {
    return {
      url: String(url ?? ''),
      finalUrl: null,
      redirectCount: 0,
      verdict: 'suspicious',
      score: 100,
      flags: [normalized.error],
      individualScores: { heuristics: 100, safeBrowsing: 0, whois: 0, virusTotal: 0 },
      details: {
        domainAgeDays: null,
        domainCreatedOn: null,
        registrar: 'Unknown',
        vtPositives: 0,
        vtTotal: 0,
        googleThreats: [],
        location: { success: false },
        redirectChain: []
      }
    };
  }

  const normalizedUrl = normalized.url;

  const cached = scanCache.get(normalizedUrl);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return { ...cached.data, cached: true };
  }

  const [redirs, heuristicsOrig] = await Promise.all([
    checkRedirects(normalizedUrl),
    checkHeuristics(normalizedUrl)
  ]);

  const targetUrl = redirs.finalUrl;
  let targetHostname;
  try { targetHostname = new URL(targetUrl).hostname; } catch { targetHostname = targetUrl; }

  const [heuristicsTarget, safeBrowsing, domainAge, vt, location] = await Promise.all([
    checkHeuristics(targetUrl),
    checkSafeBrowsing(targetUrl).catch(() => ({ flagged: false, score: 0, threats: [], unavailable: true })),
    checkDomainAge(targetUrl).catch(() => ({ score: 0, flags: [], ageDays: null })),
    checkVirusTotal(targetUrl).catch(() => ({ flagged: false, score: 0, positives: 0, total: 0, unavailable: true })),
    checkLocation(targetHostname).catch(() => ({ success: false }))
  ]);

  const googleScore = safeBrowsing.flagged ? 90 : 0;
  const vtScore = vt.score;
  const hScore = Math.max(heuristicsOrig.score, heuristicsTarget.score);
  const wScore = domainAge.score;

  const weightedScore = Math.round(hScore * 0.15 + googleScore * 0.3 + vtScore * 0.3 + wScore * 0.25);

  const finalScore = Math.min(Math.max(hScore >= 80 ? hScore : 0, googleScore, vtScore, wScore >= 75 ? wScore : 0, weightedScore), 100);

  const verdict = finalScore >= 70 ? 'malicious' : finalScore >= 35 ? 'suspicious' : 'safe';

  const flags = [...new Set([
    ...heuristicsOrig.flags,
    ...heuristicsTarget.flags,
    ...safeBrowsing.threats.map((t) => `Google flagged as: ${t}`),
    ...domainAge.flags
  ])];

  if (vt.positives > 0) flags.push(`VirusTotal: ${vt.positives}/${vt.total} engines flagged this URL`);
  if (redirs.redirectCount > 0) flags.push(`Redirect Chain: ${redirs.redirectCount} hop(s) detected`);
  if (safeBrowsing.unavailable) flags.push('Google Safe Browsing unavailable (missing key or API issue)');
  if (vt.unavailable) flags.push('VirusTotal unavailable (missing key or API issue)');

  const result = {
    url: normalizedUrl,
    finalUrl: targetUrl,
    redirectCount: redirs.redirectCount,
    verdict,
    score: finalScore,
    flags,
    individualScores: {
      heuristics: hScore,
      safeBrowsing: googleScore,
      whois: wScore,
      virusTotal: vtScore
    },
    details: {
      domainAgeDays: domainAge.ageDays,
      domainCreatedOn: domainAge.createdOn ?? null,
      registrar: domainAge.registrar ?? 'Unknown',
      vtPositives: vt.positives,
      vtTotal: vt.total,
      googleThreats: safeBrowsing.threats,
      location,
      redirectChain: redirs.chain
    }
  };

  scanCache.set(normalizedUrl, { data: result, timestamp: Date.now() });
  return result;
}
