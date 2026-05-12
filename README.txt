PhotoDrop Sports Cards - Next.js + UploadThing + Resend

WHAT THIS VERSION INCLUDES
- Modern Next.js website
- UploadThing file upload system
- Resend email notification system
- Framed sports card image embedded in email body
- Framed sports card image also attached to email
- Customer confirmation email when customer email is entered
- 40 sports frames plus No Frame
- Basketball, football, soccer, hockey, and baseball themes
- Editable player name, number, team, position, and stats/message
- Instant image preview and download
- QR code ready homepage
- PayPal + Cash App payment flow
- Mobile-first responsive design
- Netlify hosting setup

UPDATED CUSTOMER FLOW
1 — Scan the QR Code
Open the card builder instantly from your phone — fast, simple, and no app needed.

2 — Secure Your Spot for Only $5
Pay easily with PayPal or Cash App and start creating your custom sports card in seconds.

3 — Enter Your Player Details
Add your name, team, number, and payment info so we can personalize your card perfectly.

4 — Upload Your Favorite Photo
Safely upload your player photo with our secure modern upload system.

5 — Preview Your Custom Card Instantly
See your personalized sports card come to life before downloading or submitting.

6 — Download + Receive Confirmation Email
Get your finished card instantly and receive an email confirmation with your upload details sent directly to your inbox.

ENV VARIABLES USED
UPLOADTHING_TOKEN
RESEND_API_KEY
NOTIFICATION_EMAIL

.env.local EXAMPLE
UPLOADTHING_TOKEN=eyJ_your_uploadthing_token_here
RESEND_API_KEY=re_your_resend_api_key_here
NOTIFICATION_EMAIL=photodrop.qrpay.upload@gmail.com

HOW TO RUN IN VS CODE
1. Unzip the folder.
2. Open this folder in Visual Studio Code.
3. Open Terminal.
4. Run: npm install
5. Create .env.local in the root folder, same level as package.json.
6. Add your UploadThing token, Resend API key, and notification email.
7. Run: npm run dev
8. Open: http://localhost:3000

NETLIFY DEPLOYMENT
1. Remove node_modules and .next before uploading to Netlify.
2. Go to Netlify > Add new site > Deploy manually.
3. Upload the project folder.
4. Go to Site configuration > Environment variables.
5. Add:
   UPLOADTHING_TOKEN
   RESEND_API_KEY
   NOTIFICATION_EMAIL
6. Trigger redeploy after variables are added.

COMMON FIXES
- .env.local must be in the root folder.
- UploadThing token usually starts with eyJ.
- Restart npm after changing environment variables.
- Redeploy Netlify after adding or changing variables.
- If Gmail does not show the framed preview image inline, open the attached framed-sports-card file in the email.
