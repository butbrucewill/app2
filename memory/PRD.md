# One Stock Academy — PRD

## Original problem statement
Build a 2-page website for One Stock Academy, a trading education company (online + offline classes).
- Page 1: Home/landing — hero (headline, subhead, Enroll Now CTA, candlestick chart visual + live-style ticker tape), Why OSA (4 value props: structured curriculum, two formats, practitioner mentors, no signals/tips), courses overview, mentor profile, FAQ, final CTA, risk disclosure footer.
- Page 2: Buy Course — course selection → hosted checkout payment flow (one-time, INR; backend order creation, gateway redirect, server-side payment verification before enrollment).
- Pricing: Online ₹49,000 one-time · Offline ₹99,000 one-time.
- Design: editorial/restrained (mesaschool.co / Master Union vibe), warm off-white paper bg, deep ink/navy text, green CTA accent, gold pricing highlights, red only in chart motifs; display serif + clean sans + monospace for prices/tickers.
- Payment vendor: Apex IT Solutions (gateway TBC — Razorpay assumed; sandbox keys pending).
- Compliance: no profit guarantees; risk disclosure required.

## User personas
- Beginner who wants to learn trading from scratch, wary of tip-selling scams.
- Early-stage trader who dabbled without a process and wants structure + mentorship.

## Architecture
- React (CRA/craco) frontend on :3000, FastAPI backend on :8001 (/api prefix), MongoDB via MONGO_URL.
- Backend endpoints: GET /api/courses, POST /api/orders, POST /api/payments/verify, GET /api/orders/{ref}.
- Payments: Razorpay hosted checkout (checkout.js) with HMAC-SHA256 signature verification server-side. When RAZORPAY_KEY_ID/SECRET are empty in backend/.env, the API runs in DEMO mode (simulated hosted checkout; same verify code path).
- Enrollments stored in `enrollments` collection with status created → paid / failed.

## Implemented (2026-08-19)
- Redesign v4 (2026-08-19): full scroll-driven 3D experience per user request. Fixed WebGL canvas behind native document scroll; camera flies through five trading zones: red/green candlestick forest (hero) → wireframe market-grid terrain (why) → two glass price pillars with glow rings (courses) → rotating candlestick data ring (mentor) → pulled-back glowing icosahedron finale (FAQ/CTA). Global mouse parallax. Typography switched to Bodoni Moda display + JetBrains Mono body. Whole site is now dark (#050505) monochrome with glassmorphic panels; red/green reserved for market motifs. Checkout + result pages restyled dark; payment flow, tilt cards, magnetic buttons, page wipes, confetti, confirmation emails all verified intact.
- Official brand + content update (2026-08-19): real logos wired (white wordmark in navbar/footer/page-wipe via invert, blue arrow icon as favicon, files in /app/frontend/public). Official copy from the company PDF now powers the site: About Us hero subhead, Founder's Vision (Viksit Bharat @ 2047) + Mission section with track record strip (1.9M+ community, SEBI-registered mentorship, 3 verticals), Buniyaad Foundation Mentorship Program with its 5 phases, three real mentors (Aman Singh Negi CAO 750k+ IG, Rajat Sharma Founding Director 150k+ IG, Rishabh Mishra Founding Director SEBI-registered), and four verbatim student reviews. Mentor photos not supplied — monogram avatars used; contact number/email/socials were blank in the PDF, still needed.
- Engagement layer (2026-08-20): animated full-screen mobile menu (numbered staggered links), rebuilt 4-column footer (brand + socials, Explore, Program with prices, Reach Us placeholders, risk disclosure strip, giant watermark wordmark), floating AI chatbot (POST /api/chat, GPT-5.4 via EMERGENT_LLM_KEY, SSE streaming, OSA knowledge system prompt, 10 msg/min rate limit, transcripts saved to chat_sessions collection), floating WhatsApp button (number pending from user — shows a notice until added). Chat model: gpt-5.4 default per playbook.
- Institute photos (2026-08-20): 4 real classroom photos added (public/class-1..4.jpg). Feature banner now crossfades through them every 5s behind the stat cards; new "Inside the Academy" slow photo marquee strip with caption chips between Reviews and FAQ. Background later simplified per user: 3D removed, replaced by a procedurally generated flat candlestick chart in brand blues (#3D9BFF / #0070F0) over a dotted grid that slides on scroll AND live-prints a new candle every 2.6s (components/ChartBackdrop.jsx). ScrollExperience/HeroScene/CandlestickChart now unused.
- Interactive elements (2026-08-20): "Can you read this chart?" quiz (components/ChartQuiz.jsx) — 3 chart scenarios with setup candles, Breakout/Breakdown guess, animated outcome reveal + one-line lesson, score + Enroll CTA. Results wall (components/ResultsWall.jsx) — sliding frames ready for real student P&L screenshots; currently clearly-labelled empty slots awaiting uploads. Broking partners tile marquee (Zerodha, Angel One, Groww, Upstox, Dhan, ICICI Direct, Kotak, 5paisa) with brand favicons stored in public/partners/.
- Confirmation emails via Emergent managed email (Resend proxy) on verified payment — online/offline variants, branded, risk-disclosure footer.
- Redesign v2 (2026-08-19): black-and-white monochrome theme per user feedback, then v3 3D hero per user feedback — full-viewport dark hero with a live React Three Fiber scene: 3D candlestick chart rising from a glowing grid floor, star particle field, fog depth, staggered candle grow-in animation, cursor parallax. Dark navbar + ticker. Rest of page stays light monochrome editorial.
- Home page: hero with animated Framer Motion candlestick chart, react-fast-marquee ticker tape, Why OSA bento grid, pricing cards (mono prices, gold offline highlight), mentor section (PLACEHOLDER name/photo/bio — founder details not provided), FAQ accordion, final CTA banner, ink footer with monospace risk disclosure.
- Buy Course page (/enroll, ?course=online|offline): format selector, student details form, order summary, pay button → Razorpay checkout (live) or demo modal (keys absent).
- Payment result page (/payment/result): verifies enrollment server-side; success panel (reference, course, amount, next steps) and failure panel with retry.
- Backend: order creation, signature verification (never trusts redirect), idempotent verify, order status lookup.
- Verified: curl order→verify→status chain; screenshot walkthrough of enroll → demo pay → success page.

## Pending / backlog
- P0: Razorpay sandbox + live keys from Apex IT Solutions (set RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET in /app/backend/.env) — flips payment from DEMO to live automatically.
- P0: Founder/mentor real name, photo, and bio (currently labelled placeholder).
- P1: Confirmation email on verified payment (portal access for online, batch details for offline) — Resend managed integration.
- P1: Razorpay webhook endpoint for payment.captured events (belt-and-braces alongside redirect verification).
- P2: Contact details (address, phone, WhatsApp) in footer; classroom location for offline batch; batch dates; Google/Meta tags; SEO meta + OG images.
