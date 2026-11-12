import {
  fillTokens,
  markdownToHtml,
  renderCampaignEmail,
} from './campaign-email.template';

const tokens = {
  first_name: 'Ada',
  full_name: 'Ada Obi',
  ticket_code: 'ABC123',
  ticket_link:
    'https://api.example.com/api/v1/tickets/download?token=a_b-c&x=1',
};

const render = (
  over: Partial<Parameters<typeof renderCampaignEmail>[0]> = {},
) =>
  renderCampaignEmail({
    subject: 'Hello {{first_name}}',
    preheader: 'Your ticket {{ticket_code}}',
    body: 'Hi {{first_name}},\n\nSee you there.',
    tokens,
    logoUrl: 'https://res.cloudinary.com/x/image/upload/logo.png',
    supportEmail: 'help@example.com',
    ...over,
  });

describe('campaign email template', () => {
  it('fills tokens in subject, preheader and body', () => {
    const { html, subject } = render();
    expect(subject).toBe('Hello Ada');
    expect(html).toContain('Your ticket ABC123');
    expect(html).toContain('Hi Ada,');
  });

  it('leaves unknown tokens untouched', () => {
    expect(fillTokens('{{nope}} {{ first_name }}', tokens)).toBe(
      '{{nope}} Ada',
    );
  });

  it('escapes admin-written HTML', () => {
    const { html } = render({ body: '<script>alert(1)</script> **hi**' });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>hi</strong>');
  });

  it("does not let an attendee's name inject markup or markdown", () => {
    const { html } = render({
      body: 'Hi {{full_name}}',
      tokens: {
        ...tokens,
        full_name: '<img src=x onerror=1> [x](https://evil.test)',
      },
    });
    expect(html).not.toContain('<img src=x');
    expect(html).not.toContain('href="https://evil.test"');
    expect(html).toContain('&lt;img src=x onerror=1&gt;');
  });

  it('turns [text]({{ticket_link}}) into a link with the escaped signed URL', () => {
    const { html, text } = render({
      body: '[Download your ticket]({{ticket_link}})',
    });
    expect(html).toContain(
      'href="https://api.example.com/api/v1/tickets/download?token=a_b-c&amp;x=1"',
    );
    expect(text).toContain(
      'Download your ticket (https://api.example.com/api/v1/tickets/download?token=a_b-c&x=1)',
    );
  });

  it('only links http(s) targets', () => {
    expect(markdownToHtml('[x](javascript:alert(1))')).not.toContain('<a ');
  });

  it('renders bullets and paragraphs', () => {
    const html = markdownToHtml('- one\n- two\n\nNext paragraph');
    expect(html).toContain('<ul');
    expect(html.match(/<li/g)).toHaveLength(2);
    expect(html).toContain('<p');
  });

  it('strips newlines from the subject (header injection)', () => {
    expect(render({ subject: 'A\r\nBcc: x@y.z' }).subject).toBe('A Bcc: x@y.z');
  });

  it('includes a hidden preheader', () => {
    expect(render().html).toMatch(/display:none[^>]*>Your ticket ABC123/);
  });

  it('shows the header banner (served at 2x) instead of the logo when set', () => {
    const { html } = render({
      headerUrl: 'https://res.cloudinary.com/x/image/upload/v1/header.png',
    });
    expect(html).toContain('/upload/w_1200,q_auto/v1/header.png');
    expect(html).toContain('alt="DevFest Ibadan 2026"');
    expect(html).not.toContain('alt="GDG Ibadan"');
  });

  it('falls back to the small logo without a header', () => {
    expect(render().html).toContain('alt="GDG Ibadan"');
  });
});
