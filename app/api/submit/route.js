import { Resend } from 'resend';

function safe(value) {
  return String(value || '').replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function previewAttachment(previewDataUrl) {
  if (!previewDataUrl || !previewDataUrl.startsWith('data:image')) return null;
  const match = previewDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  const contentType = match[1];
  const base64 = match[2];
  const extension = contentType.includes('png') ? 'png' : 'jpg';
  return {
    filename: `framed-sports-card.${extension}`,
    content: base64,
    content_type: contentType
  };
}

function originalUploadButton(url) {
  if (!url) return '<p><b>Uploaded Photo:</b> No UploadThing file URL received.</p>';
  return `<p><b>Uploaded Photo:</b> <a href="${safe(url)}" style="color:#2563eb;font-weight:700;">Open original uploaded photo</a></p>`;
}

function framedImageBlock(previewDataUrl) {
  if (!previewDataUrl) return '<p><b>Framed Image:</b> Not received. Please make sure the card preview finished loading before submitting.</p>';
  return `
    <div style="margin:24px 0;padding:18px;border-radius:22px;background:#fff7ed;border:2px solid #ff7a00;">
      <h3 style="margin:0 0 12px;color:#111827;">Framed Sports Card Preview</h3>
      <p style="margin:0 0 14px;color:#374151;">The finished card is shown below and also attached to this email.</p>
      <img src="${previewDataUrl}" alt="Framed sports card preview" style="display:block;width:320px;max-width:100%;height:auto;border-radius:18px;border:5px solid #ff7a00;box-shadow:0 12px 30px rgba(0,0,0,.25);" />
    </div>
  `;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'photodrop.qrpay.upload@gmail.com';

    if (!resendApiKey) {
      return Response.json({ ok: false, error: 'Missing RESEND_API_KEY environment variable.' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const playerName = safe(body.playerName || 'Customer');
    const subject = `New Sports Card Upload - ${playerName}`;
    const attachment = previewAttachment(body.previewDataUrl);

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;background:#f8fafc;padding:22px;">
        <div style="max-width:720px;margin:auto;background:#ffffff;border-radius:24px;padding:26px;border:1px solid #e5e7eb;">
          <h2 style="margin:0 0 8px;color:#111827;">🏆 New PhotoDrop Sports Card Upload</h2>
          <p style="margin:0 0 20px;color:#4b5563;">A customer completed the sports card upload flow. Their framed preview is included below and attached.</p>

          <div style="background:#111827;color:#fff;border-radius:18px;padding:20px;margin:18px 0;">
            <h3 style="margin:0 0 12px;color:#ffcf6b;">Customer Details</h3>
            <p><b>Customer Name:</b> ${safe(body.customerName)}</p>
            <p><b>Customer Email:</b> ${safe(body.customerEmail)}</p>
            <p><b>Payment Confirmation:</b> ${safe(body.paymentConfirmation)}</p>
          </div>

          <div style="background:#fff;border-radius:18px;padding:20px;border:1px solid #e5e7eb;margin:18px 0;">
            <h3 style="margin:0 0 12px;color:#111827;">Player Card Details</h3>
            <p><b>Sport:</b> ${safe(body.sport)}</p>
            <p><b>Frame:</b> ${safe(body.frame)}</p>
            <p><b>Player Name:</b> ${safe(body.playerName)}</p>
            <p><b>Number:</b> ${safe(body.playerNumber)}</p>
            <p><b>Team:</b> ${safe(body.teamName)}</p>
            <p><b>Position:</b> ${safe(body.position)}</p>
            <p><b>Message/Stats:</b> ${safe(body.statLine)}</p>
          </div>

          ${framedImageBlock(body.previewDataUrl)}
          ${originalUploadButton(body.uploadedFileUrl)}

          <p style="color:#6b7280;font-size:13px;margin-top:24px;">Tip: If Gmail does not show the preview image automatically, open the attached framed-sports-card image.</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'PhotoDrop Sports Cards <onboarding@resend.dev>',
      to: notificationEmail,
      subject,
      html,
      attachments: attachment ? [attachment] : []
    });

    if (body.customerEmail) {
      await resend.emails.send({
        from: 'PhotoDrop Sports Cards <onboarding@resend.dev>',
        to: body.customerEmail,
        subject: `Your PhotoDrop Sports Card Upload Was Received`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;padding:22px;">
            <h2>🏆 Your Sports Card Upload Was Received</h2>
            <p>Thank you! Your custom sports card details were submitted successfully.</p>
            <p><b>Player:</b> ${safe(body.playerName)}</p>
            <p><b>Team:</b> ${safe(body.teamName)}</p>
            <p><b>Frame:</b> ${safe(body.frame)}</p>
            ${framedImageBlock(body.previewDataUrl)}
            <p>If Gmail does not show the preview image, check the attached framed sports card image.</p>
          </div>
        `,
        attachments: attachment ? [attachment] : []
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
}
