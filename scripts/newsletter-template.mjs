const SITE_URL = 'https://trasigmenhel.se';
const CONTACT_EMAIL = 'mail@trasigmenhel.se';
const COVER_URL = `${SITE_URL}/lovable-uploads/podcast-cover-og.jpg`;

const HIDDEN_TITLE_PATTERNS = [/^\s*test\b/i, /testavsnitt/i];

export const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const safeHttpUrl = (value, fallback = SITE_URL) => {
  try {
    const url = new URL(value || fallback);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : fallback;
  } catch {
    return fallback;
  }
};

const stripTrailingHashtags = (text) => text.replace(/(\s*#[^\s#]+){2,}\s*$/u, '').trim();

const excerpt = (value, maxLength = 260) => {
  const text = stripTrailingHashtags(String(value || '').replace(/\s+/g, ' ').trim());
  if (text.length <= maxLength) return text;
  const shortened = text.slice(0, maxLength + 1).replace(/\s+\S*$/, '').trim();
  return `${shortened || text.slice(0, maxLength).trim()}…`;
};

const formatDate = (value) => {
  const timestamp = Date.parse(value || '');
  if (Number.isNaN(timestamp)) return '';
  return new Intl.DateTimeFormat('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Stockholm',
  }).format(new Date(timestamp));
};

const formatDuration = (seconds) => {
  const value = Number(seconds);
  return Number.isFinite(value) && value > 0 ? `${Math.round(value / 60)} min` : '';
};

export const visibleEpisodes = (episodes, limit = 3) => {
  const candidates = Array.isArray(episodes) ? episodes : [];
  const visible = candidates.filter(
    (episode) =>
      episode &&
      episode.title &&
      !HIDDEN_TITLE_PATTERNS.some((pattern) => pattern.test(String(episode.title)))
  );
  const selected = visible.length > 0 ? visible : candidates.filter((episode) => episode?.title);

  return selected
    .slice()
    .sort((a, b) => {
      const aTime = Date.parse(a.publishedAt || a.pubDateRaw || a.pubDate || '');
      const bTime = Date.parse(b.publishedAt || b.pubDateRaw || b.pubDate || '');
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;
      return bTime - aTime;
    })
    .slice(0, limit);
};

const episodeCard = (episode) => {
  const title = escapeHtml(episode.title);
  const description = escapeHtml(excerpt(episode.description));
  const link = escapeHtml(safeHttpUrl(episode.link, `${SITE_URL}/#avsnitt`));
  const image = escapeHtml(safeHttpUrl(episode.image, COVER_URL));
  const details = [
    formatDate(episode.publishedAt || episode.pubDateRaw || episode.pubDate),
    formatDuration(episode.durationSeconds),
  ]
    .filter(Boolean)
    .join(' · ');

  return `
    <tr>
      <td style="padding:0 0 28px;">
        <a href="${link}" style="text-decoration:none;color:#ffffff;">
          <img src="${image}" width="552" alt="" style="display:block;width:100%;max-width:552px;height:auto;border:0;border-radius:6px;" />
        </a>
        <p style="margin:16px 0 6px;color:#ffffff;font-size:22px;line-height:1.25;font-weight:700;">${title}</p>
        ${details ? `<p style="margin:0 0 10px;color:#a6a6aa;font-size:13px;line-height:1.5;">${escapeHtml(details)}</p>` : ''}
        ${description ? `<p style="margin:0 0 18px;color:#d0d0d2;font-size:15px;line-height:1.6;">${description}</p>` : ''}
        <a href="${link}" style="display:inline-block;background:#f4f1e9;color:#111113;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:4px;">Lyssna på avsnittet</a>
      </td>
    </tr>`;
};

const shell = ({ preheader, kicker, title, intro, content }) => `<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#111113;color:#ffffff;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#111113;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#19191c;border:1px solid #303034;border-radius:8px;">
            <tr>
              <td style="padding:32px 24px 12px;font-family:Helvetica,Arial,sans-serif;">
                <p style="margin:0 0 10px;color:#a6a6aa;font-size:11px;line-height:1.4;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(kicker)}</p>
                <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.15;font-weight:700;">${escapeHtml(title)}</h1>
                <p style="margin:16px 0 0;color:#d0d0d2;font-size:16px;line-height:1.65;">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 4px;font-family:Helvetica,Arial,sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  ${content}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font-family:Helvetica,Arial,sans-serif;border-top:1px solid #303034;">
                <p style="margin:0 0 8px;color:#a6a6aa;font-size:12px;line-height:1.6;">Trasig men Hel · En Ncom-produktion</p>
                <p style="margin:0;color:#a6a6aa;font-size:12px;line-height:1.6;">
                  <a href="mailto:${CONTACT_EMAIL}" style="color:#d0d0d2;">${CONTACT_EMAIL}</a>
                  &nbsp;·&nbsp;
                  <a href="{{ unsubscribe }}" style="color:#d0d0d2;">Avsluta prenumerationen</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export const buildWelcomeEmailHtml = (episodes) => {
  const latest = visibleEpisodes(episodes, 3);
  const content = latest.length
    ? latest.map(episodeCard).join('')
    : `<tr><td style="padding:0 0 28px;color:#d0d0d2;font-size:15px;line-height:1.6;">
         <p style="margin:0 0 18px;">De senaste avsnitten hittar du alltid på vår webbplats.</p>
         <a href="${SITE_URL}/#avsnitt" style="display:inline-block;background:#f4f1e9;color:#111113;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:4px;">Se alla avsnitt</a>
       </td></tr>`;

  return shell({
    preheader: 'Välkommen – här är de senaste avsnitten av Trasig men Hel.',
    kicker: 'Välkommen till Trasig men Hel',
    title: 'Tack för att du följer med',
    intro: 'Här är de senaste avsnitten. Från och med nu får du också ett mejl när ett nytt avsnitt släpps.',
    content,
  });
};

export const buildNewEpisodeEmailHtml = (episode) =>
  shell({
    preheader: `Nytt avsnitt: ${episode.title}`,
    kicker: 'Nytt avsnitt av Trasig men Hel',
    title: episode.title,
    intro: 'Ett nytt avsnitt finns ute nu.',
    content: episodeCard(episode),
  });

