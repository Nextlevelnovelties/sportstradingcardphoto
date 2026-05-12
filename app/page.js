'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useUploadThing } from './utils/uploadthing';

const palettes = [
  ['Orange Slam', '#ff6a00', '#111827'], ['Blue Ice', '#00a6ff', '#081226'],
  ['Gold Legend', '#ffd000', '#050505'], ['Red Zone', '#ef233c', '#07111f'],
  ['Green Field', '#00b050', '#06140a'], ['Purple Elite', '#7b2cff', '#10051f'],
  ['Teal Speed', '#00e5d4', '#071a22'], ['Black Chrome', '#c7c7c7', '#050505']
];

const frames = [{ name: 'No Frame', style: 'none' }, ...Array.from({ length: 40 }, (_, i) => {
  const p = palettes[i % palettes.length];
  return { name: `${String(i + 1).padStart(2, '0')} - ${p[0]} Card`, style: i + 1, accent: p[1], dark: p[2] };
})];

export default function Page() {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', paymentConfirmation: '', sport: 'Basketball', frame: 1,
    playerName: 'JORDAN CARTER', playerNumber: '23', teamName: 'NYC ALL STARS', position: 'MVP',
    statLine: 'ROOKIE • ELITE • GAME READY'
  });

  const { startUpload, isUploading } = useUploadThing('sportsCardUploader', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url || res?.[0]?.ufsUrl || '';
      setUploadedFileUrl(url);
      setStatus('Photo uploaded. Sending email notification...');
    },
    onUploadError: (error) => setStatus(`Upload error: ${error.message}`)
  });

  const selectedFrame = useMemo(() => frames[Number(form.frame)] || frames[0], [form.frame]);

  function update(key, value) { setForm((prev) => ({ ...prev, [key]: value })); }

  function rounded(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function fillRound(ctx, x, y, w, h, r, fill) { ctx.fillStyle = fill; rounded(ctx, x, y, w, h, r); ctx.fill(); }
  function strokeRound(ctx, x, y, w, h, r, color, line) { ctx.strokeStyle = color; ctx.lineWidth = line; rounded(ctx, x, y, w, h, r); ctx.stroke(); }
  function drawCover(ctx, img, x, y, w, h) {
    const s = Math.max(w / img.width, h / img.height); const iw = img.width * s; const ih = img.height * s;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  }
  function fit(ctx, text, max, size) {
    let s = size; ctx.font = `1000 ${s}px Arial`; while (ctx.measureText(text).width > max && s > 22) { s -= 2; ctx.font = `1000 ${s}px Arial`; } return s;
  }
  function ball(ctx, sport, x, y, size) {
    ctx.save(); ctx.translate(x, y); ctx.lineWidth = size * .055; ctx.strokeStyle = '#111';
    if (sport === 'Football') { ctx.fillStyle = '#8b4513'; ctx.beginPath(); ctx.ellipse(0, 0, size * .58, size * .32, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = size * .04; ctx.beginPath(); ctx.moveTo(-size * .18, 0); ctx.lineTo(size * .18, 0); ctx.stroke(); }
    else if (sport === 'Soccer') { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(0, 0, size * .12, 0, Math.PI * 2); ctx.fill(); }
    else if (sport === 'Hockey') { fillRound(ctx, -size * .45, size * .18, size * .52, size * .16, size * .04, '#111'); ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-size * .08, size * .22); ctx.lineTo(size * .33, -size * .42); ctx.lineWidth = size * .09; ctx.stroke(); }
    else if (sport === 'Baseball') { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#d90429'; ctx.beginPath(); ctx.arc(-size * .35, 0, size * .34, -1.2, 1.2); ctx.arc(size * .35, 0, size * .34, 1.94, 4.34); ctx.stroke(); }
    else { ctx.fillStyle = '#ff7a00'; ctx.beginPath(); ctx.arc(0, 0, size / 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-size / 2, 0); ctx.lineTo(size / 2, 0); ctx.moveTo(0, -size / 2); ctx.lineTo(0, size / 2); ctx.stroke(); }
    ctx.restore();
  }

  function renderCard() {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1080, 1500); grad.addColorStop(0, '#0c1324'); grad.addColorStop(1, '#05070d'); ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1500);
    if (selectedFrame.style !== 'none') {
      const a = selectedFrame.accent, d = selectedFrame.dark; fillRound(ctx, 35, 35, 1010, 1430, 44, d); strokeRound(ctx, 35, 35, 1010, 1430, 44, a, 18); strokeRound(ctx, 72, 72, 936, 1356, 28, 'rgba(255,255,255,.75)', 5);
      fillRound(ctx, 105, 85, 650, 88, 18, a); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; let sz = fit(ctx, form.teamName.toUpperCase(), 560, 42); ctx.font = `1000 ${sz}px Arial`; ctx.fillText(form.teamName.toUpperCase(), 130, 143);
      fillRound(ctx, 790, 72, 150, 118, 22, '#fff'); ctx.fillStyle = d; ctx.font = '1000 58px Arial'; ctx.textAlign = 'center'; ctx.fillText('#' + form.playerNumber, 865, 147);
      const px = 135, py = 225, pw = 810, ph = 780; fillRound(ctx, px, py, pw, ph, 28, 'rgba(255,255,255,.9)'); strokeRound(ctx, px, py, pw, ph, 28, a, 10);
      if (uploadedImage) { ctx.save(); rounded(ctx, px + 16, py + 16, pw - 32, ph - 32, 20); ctx.clip(); drawCover(ctx, uploadedImage, px + 16, py + 16, pw - 32, ph - 32); ctx.restore(); }
      else { ctx.fillStyle = '#d9dde5'; ctx.font = '900 54px Arial'; ctx.textAlign = 'center'; ctx.fillText('UPLOAD PLAYER PHOTO', 540, 610); }
      ball(ctx, form.sport, 130, 196, 105); ball(ctx, form.sport, 936, 1030, 118); ball(ctx, form.sport, 930, 220, 80); ball(ctx, form.sport, 150, 1040, 75);
      fillRound(ctx, 105, 1060, 870, 285, 26, 'rgba(0,0,0,.72)'); strokeRound(ctx, 105, 1060, 870, 285, 26, a, 8);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; sz = fit(ctx, form.playerName.toUpperCase(), 790, 72); ctx.font = `1000 ${sz}px Arial`; ctx.fillText(form.playerName.toUpperCase(), 540, 1142);
      fillRound(ctx, 175, 1178, 245, 62, 16, a); ctx.fillStyle = '#ffffff'; sz = fit(ctx, form.position.toUpperCase(), 200, 34); ctx.font = `1000 ${sz}px Arial`; ctx.fillText(form.position.toUpperCase(), 297, 1221);
      ctx.fillStyle = '#ffd000'; ctx.font = '900 36px Arial'; ctx.fillText('★★★★★', 540, 1223);
      fillRound(ctx, 660, 1178, 245, 62, 16, '#fff'); ctx.fillStyle = d; sz = fit(ctx, form.sport.toUpperCase(), 205, 30); ctx.font = `1000 ${sz}px Arial`; ctx.fillText(form.sport.toUpperCase(), 782, 1221); ctx.fillStyle = '#dfe5ef'; sz = fit(ctx, form.statLine.toUpperCase(), 760, 34); ctx.font = `900 ${sz}px Arial`; ctx.fillText(form.statLine.toUpperCase(), 540, 1298);
    } else if (uploadedImage) drawCover(ctx, uploadedImage, 0, 0, 1080, 1500);
    else { ctx.fillStyle = '#ffcf6b'; ctx.font = '1000 64px Arial'; ctx.textAlign = 'center'; ctx.fillText('NO FRAME PREVIEW', 540, 700); }
  }

  useEffect(renderCard, [form, selectedFrame, uploadedImage]);

  async function handleFile(e) {
    const file = e.target.files?.[0]; if (!file) return;
    const img = new Image(); img.onload = () => { imageRef.current = img; setUploadedImage(img); };
    img.src = URL.createObjectURL(file);
  }

  function downloadPreview() {
    const link = document.createElement('a'); link.download = 'photodrop-sports-card.png'; link.href = canvasRef.current.toDataURL('image/png'); link.click();
  }

  async function submitOrder(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return setStatus('Please upload a player photo first.');
    setIsSending(true); setStatus('Uploading photo to UploadThing...');
    try {
      let fileUrl = uploadedFileUrl;
      if (!fileUrl) {
        const uploaded = await startUpload([file]);
        fileUrl = uploaded?.[0]?.url || uploaded?.[0]?.ufsUrl || '';
        setUploadedFileUrl(fileUrl);
      }
      setStatus('Sending email notification with Resend...');
      const previewDataUrl = canvasRef.current.toDataURL('image/jpeg', .72);
      const res = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, frame: selectedFrame.name, uploadedFileUrl: fileUrl, previewDataUrl }) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Email failed.');
      setStatus('Done! Your upload details and framed card image were emailed successfully.');
    } catch (err) { setStatus(`Error: ${err.message}`); }
    finally { setIsSending(false); }
  }

  return <main>
    <header className="top"><a className="brand" href="#home">🏆 PhotoDrop Sports Cards</a><nav><a href="#how">How</a><a href="#pricing">Pricing</a><a href="#create">Create</a></nav><a className="navBtn" href="#create">Upload</a></header>
    <section id="home" className="hero"><div><span className="pill">FAST EVENT PHOTO EXPERIENCE • QR READY</span><h1>Turn Their Photo Into a Custom Sports Card.</h1><p>Give customers a fun, personalized keepsake they will be excited to buy and share. They scan, pay, upload their favorite player photo, choose a premium sports frame, and download a clean trading-card style image in minutes.</p><div className="actions"><a className="primary" href="#create">Start My Sports Card</a><a className="secondary" href="#pricing">See $5 Access</a></div><div className="stats"><b>40 Pro Frames</b><b>Basketball • Football • Soccer • Hockey • Baseball</b><b>Instant Preview + Email Alerts</b></div></div><div className="qr"><img src="/qr-code.jpg" alt="QR code"/><h3>Scan. Pay. Play.</h3><p>Perfect for Times Square, parties, school games, tournaments, pop-ups, and photo booth events.</p></div></section>
    <section id="how" className="section"><span className="pill">SIMPLE CUSTOMER FLOW</span><h2>A smooth upload experience that feels premium, fun, and easy.</h2><div className="steps">{[
      ['Scan the QR Code','Open the card builder instantly from your phone — fast, simple, and no app needed.'],
      ['Secure Your Spot for Only $5','Pay easily with PayPal or Cash App and start creating your custom sports card in seconds.'],
      ['Enter Your Player Details','Add your name, team, number, and payment info so we can personalize your card perfectly.'],
      ['Upload Your Favorite Photo','Safely upload your player photo with our secure modern upload system.'],
      ['Preview Your Custom Card Instantly','See your personalized sports card come to life before downloading or submitting.'],
      ['Download + Receive Confirmation Email','Get your finished card instantly and receive an email confirmation with your upload details sent directly to your inbox.']
    ].map((step,i)=><article key={step[0]}><span>{i+1}</span><h3>{step[0]}</h3><p>{step[1]}</p></article>)}</div></section>
    <section id="pricing" className="section priceBox"><span className="pill">LIMITED EVENT ACCESS</span><h2>Create a Custom Sports Card for Only $5</h2><p>Your $5 access includes one secure photo upload, 40 premium frame choices, editable player name, number, team, sport, position, instant preview, download, and email confirmation.</p><div className="payRow"><a className="paypal" href="https://www.paypal.com/ncp/payment/DNMH42WU5BN6E" target="_blank">Pay $5 with PayPal</a><a className="cashapp" href="https://cash.app/$Nextlevelnovelties" target="_blank">Pay $5 with Cash App</a></div><p className="smallNote">PayPal: socialsuiteorg@gmail.com • Cash App: $Nextlevelnovelties</p></section>
    <section id="create" className="section"><span className="pill">BUILD YOUR CARD</span><h2>Create a Game-Day Keepsake in Minutes</h2><p>Choose your sport, add the player details, upload the photo, then download the finished card.</p><div className="builder"><form onSubmit={submitOrder} className="panel">
      <label>Customer Name<input value={form.customerName} onChange={e=>update('customerName', e.target.value)} required /></label>
      <label>Customer Email<input type="email" value={form.customerEmail} onChange={e=>update('customerEmail', e.target.value)} required /></label>
      <label>Payment Confirmation<input value={form.paymentConfirmation} onChange={e=>update('paymentConfirmation', e.target.value)} placeholder="PayPal/Cash App name or note" required /></label>
      <div className="two"><label>Sport<select value={form.sport} onChange={e=>update('sport', e.target.value)}>{['Basketball','Football','Soccer','Hockey','Baseball'].map(s=><option key={s}>{s}</option>)}</select></label><label>Frame<select value={form.frame} onChange={e=>update('frame', e.target.value)}>{frames.map((f,i)=><option key={f.name} value={i}>{i===0?'00 - ':''}{f.name}</option>)}</select></label></div>
      <div className="two"><label>Player Name<input value={form.playerName} onChange={e=>update('playerName', e.target.value)} /></label><label>Number<input value={form.playerNumber} onChange={e=>update('playerNumber', e.target.value)} /></label></div>
      <div className="two"><label>Team<input value={form.teamName} onChange={e=>update('teamName', e.target.value)} /></label><label>Position<input value={form.position} onChange={e=>update('position', e.target.value)} /></label></div>
      <label>Stat Line / Message<input value={form.statLine} onChange={e=>update('statLine', e.target.value)} /></label>
      <label className="upload">Upload Player Photo<input ref={fileRef} type="file" accept="image/*" onChange={handleFile} required /></label>
      <button className="primary full" type="button" disabled={!uploadedImage} onClick={downloadPreview}>Download Finished Card</button>
      <button className="submit full" disabled={isSending || isUploading}>{isSending || isUploading ? 'Processing Your Card...' : 'Payment / Submit Sports Card'}</button>
      {status && <p className="status">{status}</p>}
    </form><div className="preview"><canvas ref={canvasRef} width="1080" height="1500" /></div></div></section>
    <footer>© 2026 PhotoDrop Sports Cards • Scan • Pay • Upload • Download</footer>
  </main>;
}
