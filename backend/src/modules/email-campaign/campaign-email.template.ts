export interface CampaignTokens {
  first_name: string;
  full_name: string;
  ticket_code: string;
  ticket_link: string;
}

export const CAMPAIGN_TOKEN_NAMES = [
  'first_name',
  'full_name',
  'ticket_code',
  'ticket_link',
] as const;

const LINK_TARGET = '(https?:\\/\\/[^\\s)]+|\\{\\{\\s*ticket_link\\s*\\}\\})';
const MARKDOWN_LINK = new RegExp(`\\[([^\\]]+)\\]\\(${LINK_TARGET}\\)`, 'g');

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Replaces {{token}} placeholders; unknown tokens are left as written. */
export function fillTokens(text: string, tokens: CampaignTokens) {
  return text.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, name: string) => {
    const key = name.toLowerCase() as keyof CampaignTokens;
    return key in tokens ? tokens[key] : match;
  });
}

/** Inline markdown on already-escaped text: **bold**, *italic*, [text](https://url). */
function inline(escaped: string) {
  return escaped
    .replace(MARKDOWN_LINK, '<a href="$2" style="color:#1a73e8;">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

/**
 * Light markdown (paragraphs, "- " bullets, bold, italic, links) -> safe HTML.
 * Everything is escaped first; only the constructs above produce markup.
 */
export function markdownToHtml(source: string) {
  const blocks = source
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
        const items = lines
          .map(
            (l) =>
              `<li style="margin:0 0 6px;">${inline(escapeHtml(l.replace(/^\s*[-*]\s+/, '')))}</li>`,
          )
          .join('');
        return `<ul style="margin:0 0 16px;padding-left:20px;">${items}</ul>`;
      }
      const html = lines.map((l) => inline(escapeHtml(l))).join('<br />');
      return `<p style="margin:0 0 16px;line-height:1.6;">${html}</p>`;
    })
    .join('\n');
}

/** Plain-text alternative: markdown links shown as "text (url)", bold markers dropped. */
export function markdownToText(source: string) {
  return source
    .replace(MARKDOWN_LINK, '$1 ($2)')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
}

export interface RenderCampaignInput {
  subject: string;
  preheader: string;
  body: string;
  tokens: CampaignTokens;
  logoUrl: string;
  /** Full-width banner shown instead of the small logo when set. */
  headerUrl?: string;
  supportEmail: string;
}

/**
 * Wraps the admin's body in the branded email layout. Markdown is converted
 * first and tokens are filled afterwards with escaped values, so neither admin
 * text nor an attendee's name can inject markup or be read as markdown.
 */
export function renderCampaignEmail(input: RenderCampaignInput) {
  const { tokens } = input;
  const escapedTokens: CampaignTokens = {
    first_name: escapeHtml(tokens.first_name),
    full_name: escapeHtml(tokens.full_name),
    ticket_code: escapeHtml(tokens.ticket_code),
    ticket_link: escapeHtml(tokens.ticket_link),
  };

  const bodyHtml = fillTokens(markdownToHtml(input.body), escapedTokens);
  const subject = fillTokens(input.subject, tokens).replace(/[\r\n]+/g, ' ');
  const preheader = escapeHtml(
    fillTokens(input.preheader, tokens).replace(/[\r\n]+/g, ' '),
  );
  const optimizedLogoUrl = input.logoUrl.replace(
    '/upload/',
    '/upload/w_200,h_80,c_fit/',
  );
  const supportEmail = escapeHtml(input.supportEmail);

  // Banner (served at 2x for sharp rendering on phones) or, without one, the logo.
  const headerSrc = input.headerUrl
    ? input.headerUrl.replace('/upload/', '/upload/w_1200,q_auto/')
    : undefined;
  const headerRow = headerSrc
    ? `<tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <img src="${escapeHtml(headerSrc)}" alt="DevFest Ibadan 2026" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />
            </td>
          </tr>`
    : `<tr>
            <td style="padding:20px;text-align:left;">
              <img src="${escapeHtml(optimizedLogoUrl)}" alt="GDG Ibadan" style="max-height:50px;display:block;" />
            </td>
          </tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f5f7fa;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}&#8203;&zwnj;&#8203;&zwnj;&#8203;&zwnj;</div>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f7fa">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;">
          ${headerRow}
          <tr>
            <td style="padding:8px 28px 24px;font-size:15px;color:#1e1e1e;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;font-size:12px;color:#6b7280;border-top:1px solid #eef0f3;">
              You received this email because you hold a ticket to DevFest Ibadan 2026.
              Questions? Reply to <a href="mailto:${supportEmail}" style="color:#6b7280;">${supportEmail}</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${fillTokens(markdownToText(input.body), tokens)}\n\n--\nYou received this email because you hold a ticket to DevFest Ibadan 2026.`;
  return { html, text, subject };
}
